import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureSpreadsheet, readSheetAuth, updateRow } from '../../shared/googleSheets.ts';
import { lookupScout } from '../../shared/scoutLookup.ts';

// Scout-side action: self check-in for an outing. The caller supplies their
// roster phone number; the server looks the scout up on the master roster and
// confirms the name matches the attendee row before updating attending /
// permission_slip / paid. No admin code is required.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { attendee_id, phone, checks } = body || {};
    if (!attendee_id || !phone) return Response.json({ error: 'attendee_id and phone required' }, { status: 400 });

    const lookup = await lookupScout(phone);
    if (lookup.status !== 'found' || !lookup.scout_name) {
      return Response.json({ error: 'Phone not found on roster' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const spreadsheetId = await ensureSpreadsheet(accessToken);
    const rows = await readSheetAuth(accessToken, spreadsheetId, 'OutingAttendee');
    const row = rows.find(r => r.id === attendee_id);
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 });

    if (String(row.scout_name || '').trim().toLowerCase() !== String(lookup.scout_name).trim().toLowerCase()) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const allowed = {};
    if (checks && typeof checks.attending === 'boolean') allowed.attending = checks.attending;
    if (checks && typeof checks.permission_slip === 'boolean') allowed.permission_slip = checks.permission_slip;
    if (checks && typeof checks.paid === 'boolean') allowed.paid = checks.paid;

    await updateRow(accessToken, spreadsheetId, 'OutingAttendee', attendee_id, allowed);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}