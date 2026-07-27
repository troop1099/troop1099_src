import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { lookupScout } from '../../shared/scoutLookup.ts';
import { ensureSpreadsheet, appendRow } from '../../shared/googleSheets.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const phoneNumber = body?.phone_number;
    const requestData = body?.request_data;
    if (!phoneNumber) return Response.json({ error: 'Phone number required' }, { status: 400 });
    if (!requestData) return Response.json({ error: 'Request data required' }, { status: 400 });

    const result = await lookupScout(phoneNumber);
    if (result.status !== 'found' || !result.scout_name) {
      return Response.json(
        { error: 'Scout verification failed. Please verify your phone number.' },
        { status: 403 }
      );
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const spreadsheetId = await ensureSpreadsheet(accessToken);
    const created = await appendRow(accessToken, spreadsheetId, 'AdvancementRequest', {
      ...requestData,
      scout_name: result.scout_name,
      status: requestData.status || 'pending',
    }, null);

    return Response.json({ success: true, request: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}