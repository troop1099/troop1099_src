import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { lookupScout } from '../../shared/scoutLookup.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const phoneNumber = body?.phone_number;
    if (!phoneNumber) return Response.json({ error: 'Phone number required' }, { status: 400 });

    const result = await lookupScout(phoneNumber);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}