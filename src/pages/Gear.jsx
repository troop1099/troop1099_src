import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, X, ExternalLink, Trash2 } from 'lucide-react';
import { useAdmin } from '@/lib/AdminContext';

const CATEGORIES = ['clothing', 'camping', 'cooking', 'navigation', 'tools', 'other'];

function AddGearModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', caption: '', image_url: '', buy_link: '', category: 'other' });
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, image_url: file_url }));
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-lg">Add Gear Item</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Title *</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Category</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm capitalize" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Image *</label>
            <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
            {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
            {form.image_url && <img src={form.image_url} className="h-24 rounded mt-2 object-cover" />}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Caption</label>
            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} value={form.caption} onChange={e => setForm(f => ({...f, caption: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Buy Link</label>
            <input type="url" placeholder="https://" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.buy_link} onChange={e => setForm(f => ({...f, buy_link: e.target.value}))} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded text-sm">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.title || !form.image_url} className="flex-1 py-2 bg-[#1a2744] text-white rounded text-sm font-semibold disabled:opacity-50">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Gear() {
  const [showAdd, setShowAdd] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const queryClient = useQueryClient();
  const { adminUnlocked } = useAdmin();

  const { data: gear = [] } = useQuery({
    queryKey: ['gear'],
    queryFn: () => base44.entities.GearItem.list('-created_date', 100),
  });

  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.GearItem.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['gear']); setShowAdd(false); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.GearItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['gear'])
  });

  const filtered = activeCategory === 'all' ? gear : gear.filter(g => g.category === activeCategory);

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold">Scout Gear</h1>
        <p className="text-white/70 mt-2">Community-recommended gear for scouts and families.</p>
        {adminUnlocked && (
          <button onClick={() => setShowAdd(true)} className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold text-sm">
            <Plus className="w-4 h-4" /> Add Gear
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveCategory('all')} className={`px-3 py-1 rounded-full text-sm font-medium border ${activeCategory === 'all' ? 'bg-[#1a2744] text-white border-[#1a2744]' : 'border-gray-300 text-gray-600'}`}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${activeCategory === c ? 'bg-[#1a2744] text-white border-[#1a2744]' : 'border-gray-300 text-gray-600'}`}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>No gear items yet. Add the first one!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-square overflow-hidden bg-gray-100 relative">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {adminUnlocked && (
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-red-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-[#1a2744] text-sm">{item.title}</p>
                {item.caption && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.caption}</p>}
                {item.buy_link && (
                  <a href={item.buy_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:underline">
                    Buy it here <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && <AddGearModal onClose={() => setShowAdd(false)} onSave={(d) => addMutation.mutate(d)} />}
    </div>
  );
}