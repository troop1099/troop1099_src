import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const adminCode = body?.admin_code;
    const expectedCode = secrets.get('RESERVATION_ADMIN_CODE');
    if (!adminCode || adminCode !== expectedCode) {
      return Response.json({ authorized: false, error: 'Invalid admin code' }, { status: 403 });
    }
    const requests = await base44.asServiceRole.entities.AdvancementRequest.list('-created_date', 200);
    return Response.json({ authorized: true, requests });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}