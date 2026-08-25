import { secrets } from 'base44:runtime';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureSpreadsheet, readSheetAuth } from '../../shared/googleSheets.ts';

export default async function(req) {
  try {
    const body = await req.json();
    const adminCode = body?.admin_code;
    const expectedCode = secrets.get('MASTER_ADMIN_CODE');
    if (!adminCode || adminCode !== expectedCode) {
      return Response.json({ authorized: false, error: 'Invalid admin code' }, { status: 403 });
    }

    const base44 = createClientFromRequest(req);
    const conn = await base44.asServiceRole.connectors.getConnection('googledrive');
    const accessToken = conn.accessToken;
    const spreadsheetId = await ensureSpreadsheet(accessToken);
    const rows = await readSheetAuth(accessToken, spreadsheetId, 'Reimbursement');
    rows.sort((a, b) => String(b.created_date || '').localeCompare(String(a.created_date || '')));
    return Response.json({ authorized: true, requests: rows });
  } catch (error) {
    return Response.json({ authorized: false, error: error.message }, { status: 500 });
  }
}