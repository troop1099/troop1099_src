import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MapPin, Plus, X, Trash2 } from 'lucide-react';
import { useAdmin } from '@/lib/AdminContext';
import { format } from 'date-fns';

const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';

function AddAdventureModal({ onClose }) {
  const [form, setForm] = useState({ title: '', date: '', location: '', distance: '', elevation: '', skill: '', description: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    setSaving(true);
    let image_url = '';
    if (file) {
      const res = await base44.integrations.Core.UploadFile({ file });
      image_url = res.file_url;
    }
    await base44.entities.Adventure.create({ ...form, image_url });
    queryClient.invalidateQueries(['adventures']);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-[#1a2744] text-lg">Add Adventure</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Trip Name *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Blue Ridge Backpacking Trip" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Date *</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Location</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="e.g. Amicalola Falls, GA" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Distance</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.distance} onChange={e => setForm(f => ({...f, distance: e.target.value}))} placeholder="e.g. 12 miles" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Elevation Gain</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.elevation} onChange={e => setForm(f => ({...f, elevation: e.target.value}))} placeholder="e.g. 1,400 ft" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Skill Focus</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.skill} onChange={e => setForm(f => ({...f, skill: e.target.value}))} placeholder="e.g. Navigation, Camping, First Aid" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#1a2744] transition-colors" onClick={() => document.getElementById('adv-input').click()}>
              {preview ? (
                <img src={preview} className="max-h-32 mx-auto rounded object-cover" />
              ) : (
                <p className="text-gray-400 text-sm">Click to add a photo</p>
              )}
              <input id="adv-input" type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={!form.title || !form.date || saving} className="flex-1 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50">
            {saving ? 'Saving...' : 'Add Adventure'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Adventures() {
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();
  const { adminUnlocked } = useAdmin();

  const { data: adventures = [] } = useQuery({
    queryKey: ['adventures'],
    queryFn: () => base44.entities.Adventure.list('-date', 50),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Adventure.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['adventures'])
  });

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="Troop 1099" className="w-12 h-12 rounded-full object-contain bg-white p-1 hidden sm:block" />
            <div>
              <h1 className="text-3xl font-bold">Adventure Log</h1>
              <p className="text-white/70 mt-1">Where Troop 1099 has been.</p>
            </div>
          </div>
          {adminUnlocked && (
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm">
              <Plus className="w-4 h-4" /> Add Adventure
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {adventures.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-semibold">No adventures logged yet</p>
            <p className="text-sm mt-2">Add your first troop outing to get started!</p>
            {adminUnlocked && (
              <button onClick={() => setShowAdd(true)} className="mt-6 bg-[#1a2744] text-white px-6 py-2.5 rounded font-semibold text-sm">
                Log First Adventure
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {adventures.map(adventure => (
              <div key={adventure.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row">
                  {adventure.image_url && (
                    <div className="md:w-64 shrink-0 aspect-video md:aspect-auto overflow-hidden bg-gray-100">
                      <img src={adventure.image_url} alt={adventure.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">
                          {adventure.date ? format(new Date(adventure.date), 'MMMM d, yyyy') : ''}
                        </p>
                        <h3 className="font-bold text-[#1a2744] text-xl">{adventure.title}</h3>
                        {adventure.location && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <MapPin className="w-3.5 h-3.5" /> {adventure.location}
                          </div>
                        )}
                      </div>
                      {adminUnlocked && (
                        <button onClick={() => deleteMutation.mutate(adventure.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                    {adventure.description && <p className="text-gray-600 text-sm mt-3 leading-relaxed">{adventure.description}</p>}
                    <div className="flex flex-wrap gap-4 mt-4 border-t border-gray-100 pt-4">
                      {adventure.distance && <div><p className="text-xs text-gray-400 uppercase tracking-wide">Distance</p><p className="font-semibold text-[#1a2744] text-sm">{adventure.distance}</p></div>}
                      {adventure.elevation && <div><p className="text-xs text-gray-400 uppercase tracking-wide">Elevation</p><p className="font-semibold text-[#1a2744] text-sm">{adventure.elevation}</p></div>}
                      {adventure.skill && <div><p className="text-xs text-gray-400 uppercase tracking-wide">Skill Focus</p><p className="font-semibold text-[#1a2744] text-sm">{adventure.skill}</p></div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddAdventureModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}