// Shared client-side helper for the active troop admin code.
// The sheets-proxy backend requires a valid admin code for write operations.
// After a successful admin-code verification (master, pinestraw, quartermaster,
// reservation, etc.) the code is stored here so that subsequent entity writes
// (which go through the sheets-proxy) are authorized automatically. This keeps
// the credential out of the app's React state and in one place.

const KEY = 'troop_active_admin_code';

export function storeActiveAdminCode(code) {
  if (!code) return;
  try { localStorage.setItem(KEY, code); } catch {}
}

export function getActiveAdminCode() {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
}

export function clearActiveAdminCode() {
  try { localStorage.removeItem(KEY); } catch {}
}