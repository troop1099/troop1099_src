import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, X, MapPin, Trash2, Settings, CalendarPlus, Check, Edit2 } from 'lucide-react';
import { useAdmin } from '@/lib/AdminContext';
import { safeFormatDate } from '@/lib/dateUtils';

const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';

const typeConfig = {
  meeting: { color: 'bg-gray-100 text-gray-600', label: 'Meeting' },
  campout: { color: 'bg-green-100 text-green-700', label: 'Campout' },
  hike: { color: 'bg-blue-100 text-blue-700', label: 'Hike' },
  service: { color: 'bg-purple-100 text-purple-700', label: 'Service' },
  fundraiser: { color: 'bg-yellow-100 text-yellow-700', label: 'Fundraiser' },
  special: { color: 'bg-red-100 text-red-700', label: 'Special' },
};

function AddEventModal({ onClose, onSave, saving }) {
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
          <button onClick={() => onSave(form)} disabled={saving || !form.title || !form.date} className="flex-1 py-2 bg-[#1a2744] text-white rounded text-sm font-semibold disabled:opacity-50">{saving ? 'Adding...' : 'Add Event'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState('calendar');
  const queryClient = useQueryClient();
  const { adminUnlocked } = useAdmin();

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
    onMutate: async (id) => {
      await queryClient.cancelQueries(['events']);
      const previous = queryClient.getQueryData(['events']);
      queryClient.setQueryData(['events'], (old) => (Array.isArray(old) ? old : []).filter(e => e.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['events'], context.previous);
    },
    onSuccess: () => queryClient.invalidateQueries(['events']),
  });

  // Google Calendar ID — stored in Setting entity so it's shared across all users
  const { data: calendarSetting } = useQuery({
    queryKey: ['setting', 'google_calendar_id'],
    queryFn: async () => {
      const results = await base44.entities.Setting.filter({ key: 'google_calendar_id' });
      return results[0] || null;
    },
  });

  const calendarId = calendarSetting?.value || '';
  const [editingCal, setEditingCal] = useState(false);
  const [calDraft, setCalDraft] = useState('');

  const saveCalendarId = async () => {
    const trimmed = calDraft.trim();
    if (!trimmed) return;
    if (calendarSetting) {
      await base44.entities.Setting.update(calendarSetting.id, { value: trimmed });
    } else {
      await base44.entities.Setting.create({ key: 'google_calendar_id', value: trimmed });
    }
    queryClient.invalidateQueries(['setting', 'google_calendar_id']);
    setEditingCal(false);
  };

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="Troop 1099" className="w-12 h-12 rounded-full object-contain bg-white p-1 hidden sm:block" />
            <div>
              <h1 className="text-3xl font-bold">Troop Calendar</h1>
              <p className="text-white/70 mt-1">Upcoming events and activities for Troop 1099.</p>
            </div>
          </div>
          {adminUnlocked && (
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('calendar')} className={`px-4 py-2 rounded font-semibold text-sm ${tab === 'calendar' ? 'bg-[#1a2744] text-white' : 'bg-white border border-gray-300 text-gray-600'}`}>
            📅 Google Calendar
          </button>
          <button onClick={() => setTab('list')} className={`px-4 py-2 rounded font-semibold text-sm ${tab === 'list' ? 'bg-[#1a2744] text-white' : 'bg-white border border-gray-300 text-gray-600'}`}>
            📋 Event List
          </button>
        </div>

        {tab === 'calendar' && (
          <div>
            {calendarId && !editingCal ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex gap-2">
                    <a
                      href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(calendarId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#1a2744] hover:bg-[#1a2744]/90 text-white px-4 py-2 rounded font-semibold text-sm"
                    >
                      <CalendarPlus className="w-4 h-4" /> Add to My Google Calendar
                    </a>
                    <a
                      href={`https://calendar.google.com/calendar/ical/${calendarId}/public/basic.ics`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:border-[#1a2744] text-gray-700 px-4 py-2 rounded font-semibold text-sm"
                    >
                      📲 iCal Feed
                    </a>
                  </div>
                  {adminUnlocked && (
                    <button onClick={() => { setCalDraft(calendarId); setEditingCal(true); }} className="text-xs text-gray-500 hover:text-[#1a2744] flex items-center gap-1">
                      <Edit2 className="w-3 h-3" /> Edit Calendar ID
                    </button>
                  )}
                </div>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <iframe
                    src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=America%2FNew_York&showNav=1&showTitle=0&showPrint=0&height=600`}
                    style={{ border: 0 }}
                    width="100%"
                    height="650"
                    frameBorder="0"
                    scrolling="no"
                    title="Troop 1099 Calendar"
                  />
                </div>
              </div>
            ) : editingCal ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 max-w-lg mx-auto">
                <h3 className="font-bold text-[#1a2744] text-lg mb-2">Google Calendar ID</h3>
                <p className="text-gray-500 text-sm mb-3">Paste your troop's Google Calendar ID (ends in <code className="bg-gray-100 px-1 rounded text-xs">@group.calendar.google.com</code> or <code className="bg-gray-100 px-1 rounded text-xs">@gmail.com</code>).</p>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-3"
                  value={calDraft}
                  onChange={e => setCalDraft(e.target.value)}
                  placeholder="troop1099@group.calendar.google.com"
                />
                <div className="flex gap-2">
                  <button onClick={() => setEditingCal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                  <button onClick={saveCalendarId} disabled={!calDraft.trim()} className="flex-1 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-10 text-center">
                <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-[#1a2744] text-lg mb-2">Connect Your Google Calendar</h3>
                <p className="text-gray-500 text-sm max-w-lg mx-auto mb-4">
                  Embed the troop's Google Calendar here so scouts and parents can see upcoming events and add them to their personal calendars.
                </p>
                <ol className="text-left text-sm text-gray-600 max-w-sm mx-auto space-y-2 mb-6">
                  <li className="flex gap-2"><span className="bg-[#1a2744] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">1</span> Open Google Calendar on desktop</li>
                  <li className="flex gap-2"><span className="bg-[#1a2744] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">2</span> Click the gear icon → Settings</li>
                  <li className="flex gap-2"><span className="bg-[#1a2744] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">3</span> Select your troop calendar → "Integrate calendar"</li>
                  <li className="flex gap-2"><span className="bg-[#1a2744] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">4</span> Copy the Calendar ID</li>
                  <li className="flex gap-2"><span className="bg-[#1a2744] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">5</span> Make sure the calendar is set to "Public"</li>
                </ol>
                <button onClick={() => { setCalDraft(''); setEditingCal(true); }} className="bg-[#1a2744] text-white px-5 py-2.5 rounded font-semibold text-sm">
                  Enter Calendar ID
                </button>
                <p className="text-xs text-gray-400 mt-4">Until then, use the Event List tab to add and view events.</p>
              </div>
            )}
          </div>
        )}

        {tab === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {events.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <p>No events added yet. Click "Add Event" to get started.</p>
                </div>
              )}
              {events.map(event => {
                const cfg = typeConfig[event.type] || typeConfig.meeting;
                return (
                  <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-5 flex gap-4 group hover:shadow-sm transition-shadow">
                    <div className="text-center w-14 shrink-0">
                      <p className="font-bold text-red-600 text-2xl leading-none">{safeFormatDate(event.date, 'd')}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{safeFormatDate(event.date, 'MMM')}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[#1a2744]">{event.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                          {adminUnlocked && (
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
                      {event.description && <p className="text-sm text-gray-600 mt-2">{event.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-[#1a2744] text-white rounded-lg p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FFD700] mb-3">Regular Meetings</p>
                <p className="font-bold text-lg">Every Monday</p>
                <p className="text-white/70 text-sm">7:00 PM – 8:30 PM</p>
                <p className="text-white/70 text-sm mt-2">Lanier United Methodist Church</p>
                <p className="text-white/50 text-xs mt-1">Not held on school holidays</p>
                <a href="https://maps.google.com/?q=Lanier+United+Methodist+Church+Cumming+GA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-[#FFD700] text-sm hover:underline">📍 View on Maps</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAdd && <AddEventModal onClose={() => setShowAdd(false)} onSave={(d) => addMutation.mutate(d)} saving={addMutation.isPending} />}
    </div>
  );
}