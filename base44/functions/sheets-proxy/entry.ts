import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureSpreadsheet, readSheet, appendRow, bulkAppendRows, updateRow, deleteRow } from '../../shared/googleSheets.ts';

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

    const READ_OPS = ['list', 'filter', 'get', 'count'];

    if (!entity || !operation) {
      return Response.json({ error: 'Entity and operation required' }, { status: 400 });
    }

    let accessToken = null;
    let spreadsheetId = null;
    if (!READ_OPS.includes(operation)) {
      const conn = await base44.asServiceRole.connectors.getConnection('googledrive');
      accessToken = conn.accessToken;
      spreadsheetId = await ensureSpreadsheet(accessToken);
    }

    switch (operation) {
      case 'list': {
        let rows = await readSheet(accessToken, spreadsheetId, entity);
        rows = sortRows(rows, sort);
        if (limit) rows = rows.slice(0, limit);
        return Response.json(rows);
      }
      case 'filter': {
        let rows = await readSheet(accessToken, spreadsheetId, entity);
        rows = rows.filter(row => matchesQuery(row, query));
        rows = sortRows(rows, sort);
        if (limit) rows = rows.slice(0, limit);
        return Response.json(rows);
      }
      case 'get': {
        const rows = await readSheet(accessToken, spreadsheetId, entity);
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
        await deleteRow(accessToken, spreadsheetId, entity, id);
        return Response.json({ success: true });
      }
      case 'updateMany': {
        let rows = await readSheet(accessToken, spreadsheetId, entity);
        const matching = rows.filter(row => matchesQuery(row, query));
        for (const row of matching) {
          const updatedData = applyUpdate(row, data);
          await updateRow(accessToken, spreadsheetId, entity, row.id, updatedData);
        }
        return Response.json({ updated: matching.length });
      }
      case 'deleteMany': {
        let rows = await readSheet(accessToken, spreadsheetId, entity);
        const matching = rows.filter(row => matchesQuery(row, query));
        for (const row of matching) {
          await deleteRow(accessToken, spreadsheetId, entity, row.id);
        }
        return Response.json({ deleted: matching.length });
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
        let rows = await readSheet(accessToken, spreadsheetId, entity);
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