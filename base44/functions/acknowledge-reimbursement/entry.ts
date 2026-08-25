import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureSpreadsheet, readSheetAuth, updateRow } from '../../shared/googleSheets.ts';

// Scout-side action: dismiss (acknowledge) a Scoutmaster decision on the
// submitter's own reimbursement. The caller must prove they own the record by
// supplying the phone number on file for it; the server verifies the match
// before updating scout_acknowledged. No admin code is required.

function normalizePhone(p) {
  if (!p) return '';
  let d = String(p).replace(/\D/g, '');
  if (d.startsWith('1') && d.length === 11) d = d.slice(1);
  return d.slice(-10);
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { id, phone } = body || {};
    if (!id || !phone) return Response.json({ error: 'id and phone required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const spreadsheetId = await ensureSpreadsheet(accessToken);
    const rows = await readSheetAuth(accessToken, spreadsheetId, 'Reimbursement');
    const row = rows.find(r => r.id === id);
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 });

    if (normalizePhone(row.phone) !== normalizePhone(phone)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await updateRow(accessToken, spreadsheetId, 'Reimbursement', id, { scout_acknowledged: true });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}