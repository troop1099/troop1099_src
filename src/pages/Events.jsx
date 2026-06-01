import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Calendar, MapPin, Plus, X, Clock, Trash2 } from 'lucide-react';

const typeConfig = {
  meeting: { color: 'bg-gray-100 text-gray-600', label: 'Meeting' },
  campout: { color: 'bg-green-100 text-green-700', label: 'Campout' },
  hike: { color: 'bg-blue-100 text-blue-700', label: 'Hike' },
  service: { color: 'bg-purple-100 text-purple-700', label: 'Service' },
  fundraiser: { color: 'bg-yellow-100 text-yellow-700', label: 'Fundraiser' },
  special: { color: 'bg-red-100 text-red-700', label: 'Special' },
};

const resources = [
  'Permission Slip (General)',
  'Medical Form A & B',
  'Summer Camp Gear List',
  'Camping Gear Checklist',
  'Parent Handbook',
];

function AddEventModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', date: '', end_date: '', location: '', type: 'meeting', description: '' });
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-lg">Add Event</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Title *</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Start Date *</label>
              <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">End Date</label>
              <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.end_date} onChange={e => setForm(f => ({...f, end_date: e.target.value}))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Type</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
              {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Location</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded text-sm">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.title || !form.date} className="flex-1 py-2 bg-[#1a2744] text-white rounded text-sm font-semibold disabled:opacity-50">Add Event</button>
        </div>
      </div>
    </div>
  );
}

const fallbackEvents = [
  { id: 'e1', title: 'Weekly Troop Meeting', date: '2026-06-08', type: 'meeting', location: 'Lanier UMC', description: 'Regular troop meeting with skill-building activities and patrol time.' },
  { id: 'e2', title: 'Summer Camp — Camp Sequoyah', date: '2026-06-15', end_date: '2026-06-21', type: 'campout', location: 'Sequoyah Scout Reservation', description: 'Week-long summer camp with merit badge classes, swimming, and more.' },
  { id: 'e3', title: 'Community Service Day', date: '2026-06-22', type: 'service', location: 'Riverside Park', description: 'Trail maintenance and park cleanup.' },
];

export default function Events() {
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('date', 50),
  });

  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.Event.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['events']); setShowAdd(false); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['events'])
  });

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Troop Calendar</h1>
            <p className="text-white/70 mt-1">Upcoming events and activities.</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events list */}
        <div className="lg:col-span-2 space-y-3">
          {displayEvents.map(event => {
            const cfg = typeConfig[event.type] || typeConfig.meeting;
            return (
              <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-5 flex gap-4 group hover:shadow-sm transition-shadow">
                <div className="text-center w-14 shrink-0">
                  <p className="font-bold text-red-600 text-2xl leading-none">{format(new Date(event.date), 'd')}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{format(new Date(event.date), 'MMM')}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[#1a2744]">{event.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                      {event.id && !event.id.startsWith('e') && (
                        <button onClick={() => deleteMutation.mutate(event.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" /> {event.location}
                    </div>
                  )}
                  {event.end_date && (
                    <p className="text-xs text-gray-400 mt-0.5">Through {format(new Date(event.end_date), 'MMM d')}</p>
                  )}
                  {event.description && <p className="text-sm text-gray-600 mt-2">{event.description}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Meeting info */}
          <div className="bg-[#1a2744] text-white rounded-lg p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FFD700] mb-3">Regular Meetings</p>
            <p className="font-bold text-lg">Every Monday</p>
            <p className="text-white/70 text-sm">7:00 PM – 8:30 PM</p>
            <p className="text-white/70 text-sm mt-2">Lanier United Methodist Church</p>
            <p className="text-white/50 text-xs mt-1">Not held on school holidays</p>
            <a href="https://maps.google.com/?q=Lanier+United+Methodist+Church+Cumming+GA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-[#FFD700] text-sm hover:underline">
              📍 View on Maps
            </a>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Resource Vault</p>
            {resources.map(r => (
              <div key={r} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 hover:text-[#1a2744] cursor-pointer">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && <AddEventModal onClose={() => setShowAdd(false)} onSave={(d) => addMutation.mutate(d)} />}
    </div>
  );
}