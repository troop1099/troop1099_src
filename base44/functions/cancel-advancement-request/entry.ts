import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureSpreadsheet, readSheetAuth, updateRow } from '../../shared/googleSheets.ts';

// Scout-side action: cancel the logged-in user's own reservation. Ownership
// is verified server-side against the authenticated user's email/id, so a
// caller can only cancel their own request. No admin code is required.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id } = body || {};
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const spreadsheetId = await ensureSpreadsheet(accessToken);
    const rows = await readSheetAuth(accessToken, spreadsheetId, 'AdvancementRequest');
    const row = rows.find(r => r.id === id);
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 });

    const ownsByEmail = row.scout_email && user.email &&
      String(row.scout_email).toLowerCase() === String(user.email).toLowerCase();
    const ownsById = row.created_by_id && row.created_by_id === user.id;
    if (!ownsByEmail && !ownsById) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await updateRow(accessToken, spreadsheetId, 'AdvancementRequest', id, { status: 'canceled' });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}