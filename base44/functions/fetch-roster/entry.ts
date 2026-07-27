const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Yxgwsk124JrcXjy__httDSL89mZysYWeWvNj549-nQw/gviz/tq?tqx=out:csv';

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
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
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

export default async function (req) {
  const response = await fetch(SHEET_CSV_URL, { redirect: 'follow' });
  if (!response.ok) {
    return Response.json({ error: 'Failed to fetch roster' }, { status: 502 });
  }
  const csvText = await response.text();
  const rows = parseCSV(csvText);

  const scouts = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[0]?.trim();
    const patrol = row[2]?.trim() || '';
    const email = row[5]?.trim() || '';
    if (!name || name.toLowerCase().includes('name')) continue;
    scouts.push({ name, patrol, email });
  }

  scouts.sort((a, b) => a.name.localeCompare(b.name));
  return Response.json({ scouts });
}