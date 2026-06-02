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
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a2744]">Troop Leadership</h1>
          <p className="text-gray-500 mt-2">Troop 1099 is a boy-led troop, guided by experienced adult mentors.</p>
          <button
            onClick={() => setModal('add')}
            className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm"
          >
            <Plus className="w-4 h-4" /> Add Leader
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Adult Leaders */}
          <div>
            <h2 className="flex items-center gap-2 font-bold text-[#1a2744] text-lg mb-4 pb-2 border-b-2 border-red-600">
              <Shield className="w-5 h-5 text-red-600" /> Adult Leaders
            </h2>
            <div className="space-y-3">
              {adults.length === 0 && (
                <p className="text-gray-400 text-sm italic">No adult leaders added yet.</p>
              )}
              {adults.map(leader => (
                <div key={leader.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1a2744]">{leader.name}</p>
                    <p className="text-sm text-red-600">{leader.role}</p>
                    {leader.email && <p className="text-xs text-gray-400 mt-0.5">{leader.email}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setModal(leader)} className="p-1.5 hover:bg-gray-100 rounded"><Pencil className="w-4 h-4 text-gray-400" /></button>
                    <button onClick={() => deleteMutation.mutate(leader.id)} className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-gray-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Youth Leaders */}
          <div>
            <h2 className="flex items-center gap-2 font-bold text-[#1a2744] text-lg mb-4 pb-2 border-b-2 border-[#FFD700]">
              <Users className="w-5 h-5 text-[#FFD700]" /> Youth Leadership (PLC)
            </h2>
            <div className="space-y-3">
              {youth.length === 0 && (
                <p className="text-gray-400 text-sm italic">No youth leaders added yet.</p>
              )}
              {youth.map(leader => (
                <div key={leader.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1a2744]">{leader.name}</p>
                    <p className="text-sm text-[#b8860b]">{leader.role}</p>
                    {leader.patrol && <p className="text-xs text-gray-500">{leader.patrol} Patrol</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setModal(leader)} className="p-1.5 hover:bg-gray-100 rounded"><Pencil className="w-4 h-4 text-gray-400" /></button>
                    <button onClick={() => deleteMutation.mutate(leader.id)} className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-gray-400" /></button>
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