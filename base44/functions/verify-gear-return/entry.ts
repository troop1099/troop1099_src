import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { getAdminCode } from '../../shared/adminCodes.ts';
import { ensureSpreadsheet, updateRow } from '../../shared/googleSheets.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const adminCode = body?.admin_code;
    const expectedCode = await getAdminCode('QUARTERMASTER_RETURN_CODE');
    if (!adminCode || adminCode !== expectedCode) {
      return Response.json({ authorized: false, error: 'Invalid return code' }, { status: 403 });
    }
    const recordId = body?.record_id;
    const notes = body?.notes || '';
    if (recordId) {
      const today = new Date().toISOString().split('T')[0];
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
      const spreadsheetId = await ensureSpreadsheet(accessToken);
      await updateRow(accessToken, spreadsheetId, 'GearCheckout', recordId, {
        status: 'returned',
        checkin_date: today,
        notes,
      });
    }
    return Response.json({ authorized: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}