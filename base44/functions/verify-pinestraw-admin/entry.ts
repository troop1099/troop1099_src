import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { getAdminCode } from '../../shared/adminCodes.ts';
import { ensureSpreadsheet, readSheet } from '../../shared/googleSheets.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const adminCode = body?.admin_code;
    const expectedCode = await getAdminCode('PINE_STRAW_ADMIN_CODE');
    if (!adminCode || adminCode !== expectedCode) {
      return Response.json({ authorized: false, error: 'Invalid admin code' }, { status: 403 });
    }
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const spreadsheetId = await ensureSpreadsheet(accessToken);
    let orders = await readSheet(accessToken, spreadsheetId, 'PinestrawOrder');
    orders.sort((a, b) => String(b.created_date || '').localeCompare(String(a.created_date || '')));
    return Response.json({ authorized: true, orders });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}