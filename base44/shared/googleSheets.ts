const FOLDER_ID = '1yvJLciaTLBNvx9_IMY5Z6WoGBK3ObGXm';
const SPREADSHEET_NAME = 'Troop 1099 Data';
const SPREADSHEET_ID = '1GF_hdMqij-qdL9-7IKiS4WKzm36j9MXu-LRP8kbouHA';

export const ENTITY_FIELDS = {
  Event: ['title', 'date', 'end_date', 'location', 'type', 'description'],
  Announcement: ['title', 'body', 'visibility'],
  Eagle: ['name', 'date', 'photo_url', 'project'],
  Leader: ['name', 'role', 'email', 'type', 'patrol', 'sort_order'],
  GearItem: ['title', 'caption', 'image_url', 'buy_link', 'category'],
  GearCheckout: ['scout_name', 'scout_email', 'gear_item', 'tent_number', 'checkout_date', 'checkin_date', 'status', 'notes'],
  AdvancementRequest: ['type', 'scout_name', 'scout_email', 'rank', 'merit_badge', 'notes', 'meeting_date', 'status'],
  Outing: ['title', 'month_label', 'departure_date', 'departure_time', 'return_date', 'return_time', 'price_per_scout', 'friday_shirt', 'saturday_shirt', 'sunday_shirt', 'permission_slip_url', 'grubmasters', 'active'],
  OutingAttendee: ['outing_id', 'scout_name', 'patrol', 'attending', 'permission_slip', 'paid', 'notes', 'request_to_attend'],
  Document: ['title', 'category', 'file_url', 'description', 'pinned'],
  Adventure: ['title', 'date', 'location', 'distance', 'elevation', 'skill', 'description', 'image_url'],
  MeritBadge: ['name', 'bsa_url', 'image_url', 'description', 'requirements', 'eagle_required'],
  MeritBadgeCounselor: ['badge_id', 'name', 'email'],
  TroopPhoto: ['image_url', 'caption', 'uploaded_by'],
  PinestrawOrder: ['customer_name', 'address', 'phone', 'email', 'bales', 'special_instructions', 'status'],
  Setting: ['key', 'value'],
  Reimbursement: ['name', 'phone', 'purchase_date', 'amount', 'purpose', 'description', 'receipt_file_uri', 'status', 'scout_acknowledged', 'admin_note'],
};

const BUILTIN_FIELDS = ['id', 'created_date', 'updated_date', 'created_by_id'];

const BOOLEAN_FIELDS = {
  Outing: ['active'],
  OutingAttendee: ['attending', 'permission_slip', 'paid', 'request_to_attend'],
  Document: ['pinned'],
  MeritBadge: ['eagle_required'],
  Reimbursement: ['scout_acknowledged'],
};

const NUMBER_FIELDS = {
  Leader: ['sort_order'],
  PinestrawOrder: ['bales'],
  Reimbursement: ['amount'],
};

function convertValue(entityName, field, value) {
  if (value === undefined || value === null || value === '') return '';
  const boolFields = BOOLEAN_FIELDS[entityName] || [];
  const numFields = NUMBER_FIELDS[entityName] || [];
  if (boolFields.includes(field)) {
    return value === true || value === 'true' || value === 'TRUE' || value === 1;
  }
  if (numFields.includes(field)) {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  }
  return value;
}

function serializeValue(value) {
  if (value === true) return 'true';
  if (value === false) return 'false';
  if (value === null || value === undefined) return '';
  return value;
}

export function getHeaders(entityName) {
  return [...BUILTIN_FIELDS, ...(ENTITY_FIELDS[entityName] || [])];
}

function generateId() {
  return crypto.randomUUID();
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function columnLetter(n) {
  let result = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    result = String.fromCharCode(65 + rem) + result;
    n = Math.floor((n - 1) / 26);
  }
  return result;
}

export async function ensureSpreadsheet(accessToken) {
  const headers = authHeader(accessToken);

  const q = encodeURIComponent(`name='${SPREADSHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, { headers });
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }
  }

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: SPREADSHEET_NAME,
      mimeType: 'application/vnd.google-apps.spreadsheet',
      parents: [FOLDER_ID],
    }),
  });
  const fileData = await createRes.json();
  const spreadsheetId = fileData.id;

  const entityNames = Object.keys(ENTITY_FIELDS);

  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, { headers });
  const metaData = await metaRes.json();
  const defaultSheetId = metaData.sheets[0].properties.sheetId;

  const sheetRequests = [{
    updateSheetProperties: {
      properties: { sheetId: defaultSheetId, title: entityNames[0] },
      fields: 'title',
    },
  }];
  for (let i = 1; i < entityNames.length; i++) {
    sheetRequests.push({ addSheet: { properties: { title: entityNames[i] } } });
  }
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ requests: sheetRequests }),
  });

  const dataUpdates = entityNames.map(name => ({
    range: `${name}!A1`,
    values: [getHeaders(name)],
  }));
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ valueInputOption: 'RAW', data: dataUpdates }),
  });

  return spreadsheetId;
}

async function ensureSheet(accessToken, spreadsheetId, entityName) {
  const headers = authHeader(accessToken);
  const fieldList = getHeaders(entityName);

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(entityName)}!A1:A1`, { headers });
  if (!res.ok) {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: entityName } } }] }),
    });
  }

  // Reconcile the header row to the current schema so added/renamed
  // fields stay aligned with the stored columns.
  const headerRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(entityName)}!1:1`, { headers });
  let currentHeader = [];
  if (headerRes.ok) {
    const hd = await headerRes.json();
    currentHeader = (hd.values && hd.values[0]) || [];
  }
  const matches = currentHeader.length === fieldList.length && fieldList.every((h, i) => String(currentHeader[i]) === String(h));
  if (!matches) {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(entityName)}!A1?valueInputOption=RAW`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ values: [fieldList] }),
    });
  }
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  const rows = [];
  for (const line of lines) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    rows.push(fields);
  }
  return rows;
}

export async function readSheet(accessToken, spreadsheetId, entityName) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(entityName)}`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const text = await res.text();
  if (!text || text.startsWith('<')) return [];

  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const headerRow = rows[0];
  return rows.slice(1)
    .filter(row => row[0])
    .map(row => {
      const obj = {};
      headerRow.forEach((key, i) => {
        obj[key] = convertValue(entityName, key, row[i] !== undefined ? row[i] : '');
      });
      return obj;
    });
}

/**
 * Authenticated read via the Google Sheets API v4.
 * Used by write operations (update, updateMany, deleteMany) to get
 * fresh data immediately after writes — the public CSV export endpoint
 * is CDN-cached and can return stale data for ~30s–2min.
 */
export async function readSheetAuth(accessToken, spreadsheetId, entityName) {
  const headers = authHeader(accessToken);
  const range = `${encodeURIComponent(entityName)}!A1:Z10000`;
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueRenderOption=UNFORMATTED_VALUE`, { headers });
  if (!res.ok) return [];

  const data = await res.json();
  if (!data.values || data.values.length < 2) return [];

  const headerRow = data.values[0];
  return data.values.slice(1)
    .filter(row => row[0])
    .map(row => {
      const obj = {};
      headerRow.forEach((key, i) => {
        obj[key] = convertValue(entityName, key, row[i] !== undefined ? row[i] : '');
      });
      return obj;
    });
}

export async function appendRow(accessToken, spreadsheetId, entityName, data, user) {
  const headers = authHeader(accessToken);
  await ensureSheet(accessToken, spreadsheetId, entityName);

  const fieldList = getHeaders(entityName);
  const now = new Date().toISOString();
  const id = generateId();

  const row = fieldList.map(field => {
    if (field === 'id') return id;
    if (field === 'created_date') return now;
    if (field === 'updated_date') return now;
    if (field === 'created_by_id') return user?.id || '';
    return serializeValue(data[field] !== undefined ? data[field] : '');
  });

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(entityName)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ values: [row] }),
  });

  const obj = {};
  fieldList.forEach((field, i) => { obj[field] = row[i]; });
  return obj;
}

export async function bulkAppendRows(accessToken, spreadsheetId, entityName, items, user) {
  const headers = authHeader(accessToken);
  await ensureSheet(accessToken, spreadsheetId, entityName);

  const fieldList = getHeaders(entityName);
  const now = new Date().toISOString();
  const rows = items.map(item => {
    const id = generateId();
    return fieldList.map(field => {
      if (field === 'id') return id;
      if (field === 'created_date') return now;
      if (field === 'updated_date') return now;
      if (field === 'created_by_id') return user?.id || '';
      return serializeValue(item[field] !== undefined ? item[field] : '');
    });
  });

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(entityName)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ values: rows }),
  });

  return rows.map(row => {
    const obj = {};
    fieldList.forEach((field, i) => { obj[field] = row[i]; });
    return obj;
  });
}

export async function updateRow(accessToken, spreadsheetId, entityName, id, data) {
  const headers = authHeader(accessToken);
  const fieldList = getHeaders(entityName);

  const rows = await readSheetAuth(accessToken, spreadsheetId, entityName);
  const rowIndex = rows.findIndex(r => r.id === id);
  if (rowIndex === -1) throw new Error('Record not found');

  const existing = rows[rowIndex];
  const updated = { ...existing, ...data, id, updated_date: new Date().toISOString() };

  const row = fieldList.map(field => serializeValue(updated[field] !== undefined ? updated[field] : ''));
  const sheetRowNumber = rowIndex + 2;
  const lastCol = columnLetter(fieldList.length);
  const range = `${encodeURIComponent(entityName)}!A${sheetRowNumber}:${lastCol}${sheetRowNumber}`;

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ values: [row] }),
  });

  return updated;
}

export async function deleteRow(accessToken, spreadsheetId, entityName, id) {
  const headers = authHeader(accessToken);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(entityName)}?valueRenderOption=UNFORMATTED_VALUE`;
  const res = await fetch(url, { headers });
  const data = await res.json();

  if (!data.values || data.values.length < 2) throw new Error('Record not found');

  const headerRow = data.values[0];
  const idColIndex = headerRow.findIndex(h => h === 'id');
  const dataRowIndex = data.values.slice(1).findIndex(row => row[idColIndex] === id);
  if (dataRowIndex === -1) throw new Error('Record not found');

  const sheetRowNumber = dataRowIndex + 1;

  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`, { headers });
  const metaData = await metaRes.json();
  const sheet = metaData.sheets.find(s => s.properties.title === entityName);
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
            startIndex: sheetRowNumber,
            endIndex: sheetRowNumber + 1,
          },
        },
      }],
    }),
  });
}