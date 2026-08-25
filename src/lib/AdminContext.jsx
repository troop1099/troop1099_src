import React, { createContext, useContext, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { storeActiveAdminCode, clearActiveAdminCode } from '@/lib/adminCredential';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminUnlocked, setAdminUnlocked] = useState(() => {
    try { return localStorage.getItem('master_admin_unlocked') === 'true'; } catch { return false; }
  });

  const unlock = useCallback(async (code) => {
    const res = await base44.functions.invoke('verify-master-admin', { admin_code: code });
    if (res.data?.authorized) {
      storeActiveAdminCode(code);
      setAdminUnlocked(true);
      try { localStorage.setItem('master_admin_unlocked', 'true'); } catch {}
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    clearActiveAdminCode();
    setAdminUnlocked(false);
    try { localStorage.removeItem('master_admin_unlocked'); } catch {}
  }, []);

  return (
    <AdminContext.Provider value={{ adminUnlocked, unlock, lock }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}