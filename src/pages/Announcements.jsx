import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { useToast } from '@/components/ui/use-toast';
import { Plus, X, Trash2, Loader2, Lock, Shield, Info } from 'lucide-react';

function AnnouncementForm({ onSaved }) {
  const [form, setForm] = useState({ title: '', body: '', visibility: 'members' });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Announcement.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
      setForm({ title: '', body: '', visibility: 'members' });
      toast({ title: 'Announcement posted!' });
      onSaved?.();
    }
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="font-bold text-[#1a2744] text-base mb-4 flex items-center gap-2">
        <Plus className="w-4 h-4" /> New Announcement
      </h3>
      <div className="space-y-3">
        <input
          placeholder="Title"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        />
        <textarea
          placeholder="Body text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          rows={3}
          value={form.body}
          onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
        />
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value={form.visibility}
          onChange={e => setForm(f => ({ ...f, visibility: e.target.value }))}
        >
          <option value="members">Members Only</option>
          <option value="public">Public</option>
        </select>
        <button
          onClick={() => createMutation.mutate(form)}
          disabled={!form.title || !form.body || createMutation.isPending}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50 transition-colors"
        >
          {createMutation.isPending ? 'Posting...' : 'Post Announcement'}
        </button>
      </div>
    </div>
  );
}

export default function Announcements() {
  const { adminUnlocked, unlock, lock } = useAdmin();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const queryClient = useQueryClient();

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => base44.entities.Announcement.list('-created_date', 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Announcement.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
      toast({ title: 'Announcement deleted.' });
    }
  });

  const handleUnlock = async () => {
    setVerifying(true);
    try {
      const ok = await unlock(code);
      if (!ok) toast({ title: 'Incorrect admin code', variant: 'destructive' });
      else { setCode(''); }
    } catch {
      toast({ title: 'Incorrect admin code', variant: 'destructive' });
    }
    setVerifying(false);
  };

  // Locked state
  if (!adminUnlocked) {
    return (
      <div className="pt-14 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[#1a2744]/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#1a2744]" />
          </div>
          <h1 className="font-bold text-[#1a2744] text-xl mb-2">Admin Access Required</h1>
          <p className="text-gray-500 text-sm mb-6">Enter the admin code to manage news and announcements.</p>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-[#1a2744]"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            placeholder="Admin code"
            autoFocus
          />
          <button
            onClick={handleUnlock}
            disabled={verifying || !code.trim()}
            className="w-full bg-[#1a2744] hover:bg-[#1a2744]/90 text-white px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {verifying ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Unlock'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">News & Announcements</h1>
            <p className="text-white/70 mt-1">Manage announcements shown on the homepage.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm bg-green-500/20 text-green-300 px-3 py-1.5 rounded font-semibold border border-green-500/30">
              <Shield className="w-4 h-4" /> Admin Mode
            </span>
            <button onClick={lock} className="text-sm text-white/70 hover:text-white border border-white/20 px-3 py-1.5 rounded">
              Lock
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnnouncementForm />

        <div>
          <h2 className="font-bold text-[#1a2744] text-lg mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" /> All Announcements ({announcements.length})
          </h2>
          {announcements.length === 0 && (
            <p className="text-gray-400 text-sm italic">No announcements yet.</p>
          )}
          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4 group">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#1a2744] text-sm">{a.title}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${a.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {a.visibility === 'public' ? 'Public' : 'Members'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">{a.body}</p>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(a.id)}
                    className="text-gray-300 hover:text-red-500 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}