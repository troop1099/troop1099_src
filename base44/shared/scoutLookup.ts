const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Yxgwsk124JrcXjy__httDSL89mZysYWeWvNj549-nQw/gviz/tq?tqx=out:csv';

export function normalizePhone(phone) {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) {
    digits = digits.slice(1);
  }
  return digits.slice(-10);
}

export function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
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

export async function lookupScout(phoneNumber) {
  const normalizedInput = normalizePhone(phoneNumber);
  if (normalizedInput.length < 10) {
    return { status: 'not_found' };
  }

  const response = await fetch(SHEET_CSV_URL, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Sheet fetch failed: ${response.status} ${response.statusText}`);
  }
  const csvText = await response.text();
  const rows = parseCSV(csvText);

  const matches = [];
  for (const row of rows) {
    if (row.length < 2) continue;
    const name = row[0]?.trim();
    const phone = row[1]?.trim();
    if (!name || !phone) continue;
    if (name.toLowerCase().includes('name') && phone.toLowerCase().includes('phone')) continue;

    const normalizedSheetPhone = normalizePhone(phone);
    if (normalizedSheetPhone === normalizedInput) {
      matches.push(name);
    }
  }

  if (matches.length === 0) return { status: 'not_found' };
  if (matches.length > 1) return { status: 'duplicate' };
  return { status: 'found', scout_name: matches[0] };
}