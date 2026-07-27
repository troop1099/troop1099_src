import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { ensureSpreadsheet, readSheet, appendRow, updateRow, deleteRow } from '../../shared/googleSheets.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const adminCode = body?.admin_code;
    const expectedCode = secrets.get('LEADERSHIP_EDIT_CODE');
    if (!adminCode || adminCode !== expectedCode) {
      return Response.json({ authorized: false, error: 'Invalid admin code' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const spreadsheetId = await ensureSpreadsheet(accessToken);

    const action = body?.action;
    const positionKey = body?.position_key;
    const name = body?.name;

    if (action === 'save' && positionKey) {
      const settings = await readSheet(accessToken, spreadsheetId, 'Setting');
      const existing = settings.find(s => s.key === positionKey);
      if (existing) {
        await updateRow(accessToken, spreadsheetId, 'Setting', existing.id, { value: name });
      } else {
        await appendRow(accessToken, spreadsheetId, 'Setting', { key: positionKey, value: name }, null);
      }
    } else if (action === 'delete' && positionKey) {
      const settings = await readSheet(accessToken, spreadsheetId, 'Setting');
      const matching = settings.filter(s => s.key === positionKey);
      for (const s of matching) {
        await deleteRow(accessToken, spreadsheetId, 'Setting', s.id);
      }
    }
    return Response.json({ authorized: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}