import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Plus, X } from 'lucide-react';
import { useAdmin } from '@/lib/AdminContext';

function groupByYear(eagles) {
  const grouped = {};
  eagles.forEach(e => {
    const year = new Date(e.date + 'T12:00:00').getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(e);
  });
  Object.keys(grouped).forEach(year => {
    grouped[year].sort((a, b) => new Date(a.date + 'T12:00:00') - new Date(b.date + 'T12:00:00'));
  });
  return grouped;
}

function AddEagleModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', date: '', photo_url: '', project: '' });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, photo_url: file_url }));
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-lg">Add Eagle Scout</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Date Earned *</label>
            <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
            {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
            {form.photo_url && <img src={form.photo_url} alt="Eagle Scout preview" className="w-16 h-16 rounded-full object-cover mt-2" />}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Project (optional)</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.project} onChange={e => setForm(f => ({...f, project: e.target.value}))} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded text-sm">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.name || !form.date} className="flex-1 py-2 bg-[#1a2744] text-white rounded text-sm font-semibold disabled:opacity-50">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function EaglesNest() {
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();
  const { adminUnlocked } = useAdmin();

  const { data: allEagles = [] } = useQuery({
    queryKey: ['eagles'],
    queryFn: () => base44.entities.Eagle.list('-date', 200),
  });

  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.Eagle.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['eagles']); setShowAdd(false); }
  });

  const grouped = groupByYear(allEagles);
  const years = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold">Eagle Scouts of Troop 1099</h1>
        <p className="text-white/70 mt-2 max-w-xl mx-auto">The highest rank in Scouting. These young men have demonstrated exceptional leadership and service.</p>
        <p className="text-[#FFD700] font-bold text-xl mt-3">{allEagles.length} Eagle Scouts</p>
        {adminUnlocked && (
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold text-sm"
          >
            <Plus className="w-4 h-4" /> Add Eagle Scout
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#1a2744]/20 -translate-x-1/2" />

          {years.map(year => (
            <div key={year} className="mb-10">
              {/* Year badge */}
              <div className="relative flex justify-center mb-6">
                <span className="relative z-10 bg-[#FFD700] text-[#1a2744] font-bold text-sm px-4 py-1 rounded-full shadow">
                  {year}
                </span>
              </div>

              <div className="space-y-4">
                {grouped[year].map((eagle, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <div key={eagle.id || eagle.name + eagle.date} className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                      {/* Card */}
                      <div className={`w-5/12 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-3 ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
                        <div className="w-12 h-12 rounded-full bg-[#1a2744]/10 flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#1a2744]/20">
                          {eagle.photo_url ? (
                            <img src={eagle.photo_url} alt={`${eagle.name} — Eagle Scout`} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[#1a2744] font-bold text-lg">{eagle.name?.[0] || '?'}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a2744] text-sm">{eagle.name}</p>
                          <p className="text-xs text-gray-500">{format(new Date(eagle.date + 'T12:00:00'), 'MMM d, yyyy')}</p>
                          {eagle.project && <p className="text-xs text-gray-400 mt-0.5">{eagle.project}</p>}
                        </div>
                      </div>

                      {/* Center connector */}
                      <div className="flex-shrink-0 w-2/12 flex justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#1a2744] border-2 border-white shadow" />
                      </div>

                      {/* Spacer */}
                      <div className="w-5/12" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <AddEagleModal
          onClose={() => setShowAdd(false)}
          onSave={(data) => addMutation.mutate(data)}
        />
      )}
    </div>
  );
}