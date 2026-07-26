import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const adminCode = body?.admin_code;
    const expectedCode = secrets.get('LEADERSHIP_EDIT_CODE');
    if (!adminCode || adminCode !== expectedCode) {
      return Response.json({ authorized: false, error: 'Invalid admin code' }, { status: 403 });
    }
    const action = body?.action;
    const positionKey = body?.position_key;
    const name = body?.name;
    if (action === 'save' && positionKey) {
      const existing = await base44.asServiceRole.entities.Setting.filter({ key: positionKey });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.Setting.update(existing[0].id, { value: name });
      } else {
        await base44.asServiceRole.entities.Setting.create({ key: positionKey, value: name });
      }
    } else if (action === 'delete' && positionKey) {
      const existing = await base44.asServiceRole.entities.Setting.filter({ key: positionKey });
      for (const s of existing) {
        await base44.asServiceRole.entities.Setting.delete(s.id);
      }
    }
    return Response.json({ authorized: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}