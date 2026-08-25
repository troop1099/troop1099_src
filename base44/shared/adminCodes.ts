// Portable admin-code lookup used by every verify-* backend function.
//
// Hosted on Base44   -> reads the code from the Base44 secret manager (base44:runtime).
// Hosted off Base44  -> reads the code from an environment variable of the same name.
//
// Moving the app to another host? Just set the same codes as environment variables
// (MASTER_ADMIN_CODE, MERIT_BADGE_ADMIN_CODE, LEADERSHIP_EDIT_CODE,
//  PINE_STRAW_ADMIN_CODE, QUARTERMASTER_RETURN_CODE, RESERVATION_ADMIN_CODE).
// No verify-* function needs to be rewritten.

type GlobalEnv = {
  process?: { env?: Record<string, string | undefined> };
  Deno?: { env?: { get(name: string): string | undefined } };
};

export async function getAdminCode(name: string): Promise<string | null> {
  const g = globalThis as unknown as GlobalEnv;

  // 1) Deno env (the Base44 runtime exposes env vars here when set)
  try {
    const v = g.Deno?.env?.get?.(name);
    if (v) return v;
  } catch { /* ignore */ }

  // 2) Node / portable env vars (Vercel, Netlify, Cloudflare, Node, etc.)
  try {
    const v = g.process?.env?.[name];
    if (v) return v;
  } catch { /* ignore */ }

  // 3) Base44 secret manager (works when hosted on Base44)
  try {
    const mod = await import('base44:runtime');
    const val = mod.secrets.get(name);
    if (val) return val;
  } catch { /* not running on Base44 */ }

  return null;
}