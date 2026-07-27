import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureSpreadsheet, readSheet, readSheetAuth, appendRow, bulkAppendRows, updateRow, deleteRow } from '../../shared/googleSheets.ts';

function matchesQuery(row, query) {
  if (!query) return true;
  return Object.entries(query).every(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      if (value.$gte !== undefined) return new Date(row[key]) >= new Date(value.$gte);
      if (value.$lte !== undefined) return new Date(row[key]) <= new Date(value.$lte);
      if (value.$ne !== undefined) return String(row[key]) !== String(value.$ne);
      if (value.$in !== undefined) return value.$in.map(String).includes(String(row[key]));
      return true;
    }
    return String(row[key]) === String(value);
  });
}

function applyUpdate(row, updateData) {
  const result = { ...row };
  if (updateData.$set) {
    Object.assign(result, updateData.$set);
  } else {
    Object.assign(result, updateData);
  }
  result.updated_date = new Date().toISOString();
  return result;
}

function sortRows(rows, sort) {
  if (!sort) return rows;
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  return [...rows].sort((a, b) => {
    const av = a[field] || '';
    const bv = b[field] || '';
    if (desc) return String(bv).localeCompare(String(av));
    return String(av).localeCompare(String(bv));
  });
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { entity, operation } = body;
    const { data, id, query, sort, limit } = body;

    if (!entity || !operation) {
      return Response.json({ error: 'Entity and operation required' }, { status: 400 });
    }

    const conn = await base44.asServiceRole.connectors.getConnection('googledrive');
    const accessToken = conn.accessToken;
    const spreadsheetId = await ensureSpreadsheet(accessToken);

    switch (operation) {
      case 'list': {
        let rows = await readSheetAuth(accessToken, spreadsheetId, entity);
        rows = sortRows(rows, sort);
        if (limit) rows = rows.slice(0, limit);
        return Response.json(rows);
      }
      case 'filter': {
        let rows = await readSheetAuth(accessToken, spreadsheetId, entity);
        rows = rows.filter(row => matchesQuery(row, query));
        rows = sortRows(rows, sort);
        if (limit) rows = rows.slice(0, limit);
        return Response.json(rows);
      }
      case 'get': {
        const rows = await readSheetAuth(accessToken, spreadsheetId, entity);
        const row = rows.find(r => r.id === id);
        if (!row) return Response.json({ error: 'Not found' }, { status: 404 });
        return Response.json(row);
      }
      case 'create': {
        const row = await appendRow(accessToken, spreadsheetId, entity, data, null);
        return Response.json(row);
      }
      case 'bulkCreate': {
        const rows = await bulkAppendRows(accessToken, spreadsheetId, entity, data, null);
        return Response.json(rows);
      }
      case 'update': {
        const row = await updateRow(accessToken, spreadsheetId, entity, id, data);
        return Response.json(row);
      }
      case 'delete': {
        const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
        const range = `${encodeURIComponent(entity)}!A1:Z10000`;
        const readRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueRenderOption=UNFORMATTED_VALUE`, { headers });
        const readData = await readRes.json();
        if (!readData.values || readData.values.length < 2) throw new Error('Record not found');

        const headerRow = readData.values[0];
        const idColIndex = headerRow.findIndex(h => h === 'id');
        const dataRowIndex = readData.values.slice(1).findIndex(row => row[idColIndex] === id);
        if (dataRowIndex === -1) throw new Error('Record not found');

        const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`, { headers });
        const metaData = await metaRes.json();
        const sheet = metaData.sheets.find(s => s.properties.title === entity);
        if (!sheet) throw new Error('Sheet not found');

        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: sheet.properties.sheetId,
                  dimension: 'ROWS',
                  startIndex: dataRowIndex + 1,
                  endIndex: dataRowIndex + 2,
                },
              },
            }],
          }),
        });
        return Response.json({ success: true });
      }
      case 'updateMany': {
        let rows = await readSheetAuth(accessToken, spreadsheetId, entity);
        const matching = rows.filter(row => matchesQuery(row, query));
        for (const row of matching) {
          const updatedData = applyUpdate(row, data);
          await updateRow(accessToken, spreadsheetId, entity, row.id, updatedData);
        }
        return Response.json({ updated: matching.length });
      }
      case 'deleteMany': {
        const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
        const range = `${encodeURIComponent(entity)}!A1:Z10000`;
        const readRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueRenderOption=UNFORMATTED_VALUE`, { headers });
        const readData = await readRes.json();
        if (!readData.values || readData.values.length < 2) return Response.json({ deleted: 0 });

        const headerRow = readData.values[0];
        const idColIndex = headerRow.findIndex(h => h === 'id');
        const matchingIndices = [];
        readData.values.slice(1).forEach((row, i) => {
          if (row[0] && matchesQuery(
            Object.fromEntries(headerRow.map((k, j) => [k, row[j] !== undefined ? row[j] : ''])),
            query
          )) matchingIndices.push(i);
        });

        if (matchingIndices.length === 0) return Response.json({ deleted: 0 });

        const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`, { headers });
        const metaData = await metaRes.json();
        const sheet = metaData.sheets.find(s => s.properties.title === entity);
        if (!sheet) throw new Error('Sheet not found');

        // Sort descending so earlier deletions don't shift later row indices
        matchingIndices.sort((a, b) => b - a);
        const requests = matchingIndices.map(idx => ({
          deleteDimension: {
            range: {
              sheetId: sheet.properties.sheetId,
              dimension: 'ROWS',
              startIndex: idx + 1,
              endIndex: idx + 2,
            },
          },
        }));
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ requests }),
        });
        return Response.json({ deleted: matchingIndices.length });
      }
      case 'bulkUpdate': {
        const results = [];
        for (const item of data) {
          const row = await updateRow(accessToken, spreadsheetId, entity, item.id, item);
          results.push(row);
        }
        return Response.json(results);
      }
      case 'count': {
        let rows = await readSheetAuth(accessToken, spreadsheetId, entity);
        rows = rows.filter(row => matchesQuery(row, query));
        return Response.json({ count: rows.length });
      }
      default:
        return Response.json({ error: 'Unknown operation: ' + operation }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}