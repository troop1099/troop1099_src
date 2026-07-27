import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { useToast } from '@/components/ui/use-toast';
import { Plus, X, Trash2, Info, Megaphone, Globe, Users } from 'lucide-react';

function AnnouncementForm({ onClose, onSaved }) {
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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-[#1a2744] text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-red-600" /> New Announcement
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Title *</label>
            <input
              placeholder="Announcement title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Body *</label>
            <textarea
              placeholder="Write the announcement..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]"
              rows={4}
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Visibility</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]"
              value={form.visibility}
              onChange={e => setForm(f => ({ ...f, visibility: e.target.value }))}
            >
              <option value="members">Members Only</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button
            onClick={() => createMutation.mutate(form)}
            disabled={!form.title || !form.body || createMutation.isPending}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {createMutation.isPending ? 'Posting...' : 'Post Announcement'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Announcements() {
  const { adminUnlocked } = useAdmin();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

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

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">News & Announcements</h1>
            <p className="text-white/70 mt-1">Stay up to date with the latest from Troop 1099.</p>
          </div>
          {adminUnlocked && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Announcement
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {announcements.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Megaphone className="w-14 h-14 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No announcements yet.</p>
            <p className="text-sm mt-1">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-[#1a2744] text-base">{a.title}</h2>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${a.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {a.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        {a.visibility === 'public' ? 'Public' : 'Members'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed whitespace-pre-wrap">{a.body}</p>
                    {a.created_date && (
                      <p className="text-xs text-gray-400 mt-3">
                        {new Date(a.created_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  {adminUnlocked && (
                    <button
                      onClick={() => deleteMutation.mutate(a.id)}
                      className="text-gray-300 hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <AnnouncementForm onClose={() => setShowForm(false)} onSaved={() => setShowForm(false)} />}
    </div>
  );
}