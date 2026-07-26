import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Loader2, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAdmin } from '@/lib/AdminContext';

export default function AdminBar({ unlocked, onUnlock }) {
  const { toast } = useToast();
  const { adminUnlocked: globalAdmin } = useAdmin();
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) return;
    setVerifying(true);
    try {
      const res = await base44.functions.invoke('verify-merit-badge-admin', { admin_code: code.trim() });
      if (res.data?.authorized) {
        onUnlock(true);
        setShowInput(false);
        setCode('');
        toast({ title: 'Admin mode enabled' });
      } else {
        toast({ title: 'Incorrect admin code', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Incorrect admin code', variant: 'destructive' });
    }
    setVerifying(false);
  };

  if (unlocked || globalAdmin) {
    return (
      <div className="flex items-center gap-1.5 text-sm bg-green-500/20 text-green-300 px-3 py-1.5 rounded font-semibold border border-green-500/30">
        <Shield className="w-4 h-4" /> Admin Mode
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="password"
          className="border border-white/20 bg-white/10 text-white rounded px-3 py-1.5 text-sm placeholder-white/40 focus:outline-none focus:border-white/40"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleVerify()}
          placeholder="Admin code"
          autoFocus
        />
        <button
          onClick={handleVerify}
          disabled={verifying || !code.trim()}
          className="bg-[#FFD700] text-[#1a2744] px-3 py-1.5 rounded text-sm font-semibold disabled:opacity-50"
        >
          {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Unlock'}
        </button>
        <button onClick={() => { setShowInput(false); setCode(''); }} className="text-white/50 hover:text-white text-sm">Cancel</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowInput(true)}
      className="flex items-center gap-1 text-sm text-white/70 hover:text-white border border-white/20 px-3 py-1.5 rounded"
    >
      <Lock className="w-4 h-4" /> Admin
    </button>
  );
}