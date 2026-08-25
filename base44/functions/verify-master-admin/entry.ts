import { getAdminCode } from '../../shared/adminCodes.ts';

export default async function(req) {
  try {
    const body = await req.json();
    const adminCode = body?.admin_code;
    const expectedCode = await getAdminCode('MASTER_ADMIN_CODE');
    if (!adminCode || adminCode !== expectedCode) {
      return Response.json({ authorized: false, error: 'Invalid admin code' }, { status: 403 });
    }
    return Response.json({ authorized: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}