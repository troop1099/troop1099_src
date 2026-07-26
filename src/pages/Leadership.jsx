import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, Users, Plus, X, Pencil, Trash2 } from 'lucide-react';

const ADULT_ROLES = ['Scoutmaster', 'Assistant Scoutmaster', 'Committee Chair', 'Treasurer', 'Advancement Coordinator', 'Other'];
const YOUTH_ROLES = ['Senior Patrol Leader', 'Assistant Senior Patrol Leader', 'Patrol Leader', 'Troop Guide', 'Quartermaster', 'Instructor', 'Bugler', 'Historian', 'Scribe', 'Den Chief', 'Webmaster', 'Chaplains Aide', 'Outdoor Ethics Guide'];

function LeaderModal({ leader, onClose, onSave }) {
  const [form, setForm] = useState(leader || { name: '', role: 'Assistant Scoutmaster', email: '', type: 'adult', patrol: '' });
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-lg">{leader ? 'Edit' : 'Add'} Leader</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Name *</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Type</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
              <option value="adult">Adult Leader</option>
              <option value="youth">Youth Leader (PLC)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Role *</label>
            {form.type === 'adult' ? (
              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}>
                {ADULT_ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            ) : (
              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}>
                <option value="">Select position...</option>
                {YOUTH_ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            )}
          </div>
          {form.type === 'youth' && (
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Patrol (if Patrol Leader)</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.patrol} onChange={e => setForm(f => ({...f, patrol: e.target.value}))} />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded text-sm">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.name || !form.role} className="flex-1 py-2 bg-[#1a2744] text-white rounded text-sm font-semibold disabled:opacity-50">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Leadership() {
  const [modal, setModal] = useState(null); // null | 'add' | leader object
  const queryClient = useQueryClient();

  const { data: leaders = [] } = useQuery({
    queryKey: ['leaders'],
    queryFn: () => base44.entities.Leader.list('sort_order', 100),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => data.id ? base44.entities.Leader.update(data.id, data) : base44.entities.Leader.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['leaders']); setModal(null); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Leader.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['leaders'])
  });

  const adults = leaders.filter(l => l.type === 'adult');
  const youth = leaders.filter(l => l.type === 'youth');

  return (
    <div className="pt-14 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero header */}
      <div className="bg-[#1a2744] text-white relative overflow-hidden">
        <div className="absolute inset-0 topo-pattern opacity-40" />
        <div className="max-w-5xl mx-auto px-6 py-12 relative">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Users className="w-6 h-6 text-[#FFD700]" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Troop Leadership</h1>
            <p className="text-white/70 mt-3 max-w-lg">
              Troop 1099 is a boy-led troop, guided by experienced adult mentors and a dedicated Patrol Leaders Council.
            </p>
            <button
              onClick={() => setModal('add')}
              className="mt-6 inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-accent/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" /> Add Leader
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Adult Leaders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-transparent">
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="font-bold text-[#1a2744] text-lg leading-tight">Adult Leaders</h2>
                <p className="text-xs text-gray-400">Scoutmaster & committee</p>
              </div>
              <span className="ml-auto text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                {adults.length} {adults.length === 1 ? 'leader' : 'leaders'}
              </span>
            </div>
            <div className="p-5 space-y-3">
              {adults.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="w-8 h-8 text-red-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm italic">No adult leaders added yet.</p>
                </div>
              )}
              {adults.map(leader => (
                <div key={leader.id} className="group bg-gray-50 hover:bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-sm p-4 flex items-center justify-between transition-all">
                  <div>
                    <p className="font-semibold text-[#1a2744]">{leader.name}</p>
                    <p className="text-sm text-red-600 font-medium">{leader.role}</p>
                    {leader.email && <p className="text-xs text-gray-400 mt-0.5">{leader.email}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal(leader)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-500" /></button>
                    <button onClick={() => deleteMutation.mutate(leader.id)} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Youth Leaders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-transparent">
              <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#b8860b]" />
              </div>
              <div>
                <h2 className="font-bold text-[#1a2744] text-lg leading-tight">Youth Leadership (PLC)</h2>
                <p className="text-xs text-gray-400">Patrol Leaders Council</p>
              </div>
              <span className="ml-auto text-xs font-semibold text-[#b8860b] bg-yellow-50 px-2.5 py-1 rounded-full">
                {youth.length} {youth.length === 1 ? 'leader' : 'leaders'}
              </span>
            </div>
            <div className="p-5 space-y-3">
              {youth.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 text-yellow-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm italic">No youth leaders added yet.</p>
                </div>
              )}
              {youth.map(leader => (
                <div key={leader.id} className="group bg-gray-50 hover:bg-white rounded-xl border border-gray-100 hover:border-yellow-200 hover:shadow-sm p-4 flex items-center justify-between transition-all">
                  <div>
                    <p className="font-semibold text-[#1a2744]">{leader.name}</p>
                    <p className="text-sm text-[#b8860b] font-medium">{leader.role}</p>
                    {leader.patrol && <p className="text-xs text-gray-500 mt-0.5">{leader.patrol} Patrol</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal(leader)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-500" /></button>
                    <button onClick={() => deleteMutation.mutate(leader.id)} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {(modal === 'add' || (modal && modal !== 'add')) && (
        <LeaderModal
          leader={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={(data) => saveMutation.mutate(data)}
        />
      )}
    </div>
  );
}