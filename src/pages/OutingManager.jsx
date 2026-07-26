import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Download, CheckSquare, Square, X, MessageSquare, FileText, Users, Trash2, ChefHat, Clock } from 'lucide-react';
import { useAdmin } from '@/lib/AdminContext';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const SCOUT_ROSTER = [
  { scout_name: 'Mark Romero', patrol: 'Bonsai' },
  { scout_name: 'Aarav Swami', patrol: 'Bonsai' },
  { scout_name: 'Jaykrith Vallabhaneni', patrol: 'Bonsai' },
  { scout_name: 'Karthik Sirigiri', patrol: 'Bonsai' },
  { scout_name: 'Abhijith Mokkapatti', patrol: 'Bonsai' },
  { scout_name: 'Jashith Dadibattina', patrol: 'Bonsai' },
  { scout_name: 'Nimallen Karthikeyan', patrol: 'Bonsai' },
  { scout_name: 'Owen Causseaux', patrol: 'Pyro' },
  { scout_name: 'Jack Kashin', patrol: 'Pyro' },
  { scout_name: 'Sathvik Narsepalle', patrol: 'Pyro' },
  { scout_name: 'Maanas Shastri', patrol: 'Pyro' },
  { scout_name: 'Vibhav Reddy Ade', patrol: 'Pyro' },
  { scout_name: 'Prajeeth Eskala', patrol: 'Shamrock' },
  { scout_name: 'Kyle Guillory', patrol: 'Shamrock' },
  { scout_name: 'Aditya Harathi', patrol: 'Shamrock' },
  { scout_name: 'Praful Musty', patrol: 'Shamrock' },
  { scout_name: 'Arjun Puvvada', patrol: 'Shamrock' },
  { scout_name: 'Elliott Surguine', patrol: 'Shamrock' },
  { scout_name: 'Rohan Ravikumara', patrol: 'Shamrock' },
  { scout_name: 'Anirudh Konakalla', patrol: '' },
  { scout_name: 'Agasthya Ucha', patrol: '' },
  { scout_name: 'Sriyan Chopperla', patrol: '' },
  { scout_name: 'Sriyansh Jayamangala', patrol: '' },
  { scout_name: 'Ridhit Malav', patrol: '' },
  { scout_name: 'Naithik Nandyala', patrol: '' },
  { scout_name: 'Saisurya Yeduvaka', patrol: '' },
  { scout_name: 'Arvin Reddy', patrol: '' },
  { scout_name: 'Anish Reddy', patrol: '' },
];

const PATROLS = ['Bonsai', 'Pyro', 'Shamrock'];

function CreateOutingModal({ onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef();
  const CLASS_B_COLORS = ['Yellow', 'Gray', 'Blue', 'Red', 'Green'];

  const [form, setForm] = useState({
    title: '', month_label: '',
    departure_date: '', departure_time: '',
    return_date: '', return_time: '',
    price_per_scout: '',
    friday_shirt: '', saturday_shirt: '', sunday_shirt: '',
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    let permission_slip_url = '';
    if (file) {
      const res = await base44.integrations.Core.UploadFile({ file });
      permission_slip_url = res.file_url;
    }
    const outing = await base44.entities.Outing.create({
      ...form,
      permission_slip_url,
      active: true,
      grubmasters: JSON.stringify({}),
    });
    await base44.entities.OutingAttendee.bulkCreate(
      SCOUT_ROSTER.map(s => ({ ...s, outing_id: outing.id, attending: false, permission_slip: false, paid: false }))
    );
    queryClient.invalidateQueries(['outings']);
    setSaving(false);
    toast({ title: 'Outing created!', description: form.title });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-[#1a2744] text-lg">New Outing</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Outing Title *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" placeholder="e.g. Hawk Mountain Backpacking" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Month / Activity Label</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" placeholder="e.g. March 2026 — Backpacking" value={form.month_label} onChange={e => setForm(f => ({...f, month_label: e.target.value}))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Departure Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.departure_date} onChange={e => setForm(f => ({...f, departure_date: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Departure Time</label>
              <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.departure_time} onChange={e => setForm(f => ({...f, departure_time: e.target.value}))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Return Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.return_date} onChange={e => setForm(f => ({...f, return_date: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Return Time (approx.)</label>
              <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.return_time} onChange={e => setForm(f => ({...f, return_time: e.target.value}))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Price Per Scout ($)</label>
            <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" placeholder="e.g. 45" value={form.price_per_scout} onChange={e => setForm(f => ({...f, price_per_scout: e.target.value}))} />
          </div>

          {/* Class B shirt colors */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Class B Shirt Colors</label>
            <div className="space-y-2">
              {['friday', 'saturday', 'sunday'].map(day => (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-16 text-xs font-semibold text-gray-500 capitalize">{day}</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {CLASS_B_COLORS.map(c => (
                      <button key={c} type="button"
                        onClick={() => setForm(f => ({ ...f, [`${day}_shirt`]: f[`${day}_shirt`] === c ? '' : c }))}
                        className={`px-2 py-1 text-xs rounded-full border font-semibold transition-all ${form[`${day}_shirt`] === c ? 'border-[#1a2744] bg-[#1a2744] text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                        {c}
                      </button>
                    ))}
                    <span className="text-xs text-gray-400 self-center">{form[`${day}_shirt`] ? '' : 'none'}</span>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-1">Select only the days that apply (e.g. skip Sunday for a 2-day outing).</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Permission Slip (PDF)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-[#1a2744] transition-colors" onClick={() => fileRef.current.click()}>
              {file ? <p className="text-sm text-[#1a2744] font-semibold">{file.name}</p> : <p className="text-sm text-gray-400">Click to upload permission slip PDF</p>}
            </div>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.title.trim() || !form.month_label.trim() || !form.departure_date || !form.departure_time || !form.return_date || !form.return_time || !form.price_per_scout || !file} className="flex-1 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Outing'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AttendeeRow({ attendee, onToggle, onMessage }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-2 px-3 text-sm font-medium text-[#1a2744]">{attendee.scout_name}</td>
      <td className="py-2 px-3 text-xs text-gray-500">{attendee.patrol || '—'}</td>
      <td className="py-2 px-3 text-center">
        <button onClick={() => onToggle(attendee.id, 'attending', !attendee.attending)}>
          {attendee.attending ? <CheckSquare className="w-5 h-5 text-green-500 mx-auto" /> : <Square className="w-5 h-5 text-gray-300 mx-auto" />}
        </button>
      </td>
      <td className="py-2 px-3 text-center">
        <button onClick={() => onToggle(attendee.id, 'permission_slip', !attendee.permission_slip)}>
          {attendee.permission_slip ? <CheckSquare className="w-5 h-5 text-blue-500 mx-auto" /> : <Square className="w-5 h-5 text-gray-300 mx-auto" />}
        </button>
      </td>
      <td className="py-2 px-3 text-center">
        <button onClick={() => onToggle(attendee.id, 'paid', !attendee.paid)}>
          {attendee.paid ? <CheckSquare className="w-5 h-5 text-yellow-500 mx-auto" /> : <Square className="w-5 h-5 text-gray-300 mx-auto" />}
        </button>
      </td>
      <td className="py-2 px-3 text-center">
        {attendee.request_to_attend && !attendee.attending && (
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Requested</span>
        )}
        {attendee.notes && (
          <button onClick={() => onMessage(attendee)} title={attendee.notes}>
            <MessageSquare className="w-4 h-4 text-gray-400 hover:text-[#1a2744] mx-auto" />
          </button>
        )}
      </td>
    </tr>
  );
}

function RequestAttendanceModal({ outingId, onClose }) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await base44.entities.OutingAttendee.create({
      outing_id: outingId, scout_name: name,
      attending: false, permission_slip: false, paid: false,
      request_to_attend: true, notes: message,
    });
    setSaving(false);
    toast({ title: 'Request submitted!', description: 'The Scoutmaster will add you to the list.' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-[#1a2744] text-lg">Request to Attend</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <p className="text-gray-600 text-sm mb-4">Couldn't sign up at the meeting? Submit a request here and the Scoutmaster will add you to the list.</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Message (optional)</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" rows={3} placeholder="Any notes for the Scoutmaster..." value={message} onChange={e => setMessage(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !name} className="flex-1 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50">
            {saving ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

function GrubmastersPanel({ outingId, attendees }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [grubmasters, setGrubmasters] = useState({});
  const [editing, setEditing] = useState(false);

  const { data: outingData } = useQuery({
    queryKey: ['outing_grubmaster', outingId],
    queryFn: () => base44.entities.Outing.filter({ id: outingId }),
    enabled: !!outingId,
    onSuccess: (data) => {
      if (data[0]?.grubmasters) setGrubmasters(JSON.parse(data[0].grubmasters || '{}'));
    }
  });

  const saveMutation = useMutation({
    mutationFn: () => base44.entities.Outing.update(outingId, { grubmasters: JSON.stringify(grubmasters) }),
    onSuccess: () => { toast({ title: 'Grubmasters saved!' }); setEditing(false); queryClient.invalidateQueries(['outing_grubmaster', outingId]); },
  });

  // Get attending scouts grouped by patrol
  const attendingByPatrol = attendees.filter(a => a.attending).reduce((acc, a) => {
    const p = a.patrol || 'Unassigned';
    if (!acc[p]) acc[p] = [];
    acc[p].push(a.scout_name);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1a2744] flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-orange-500" /> Grubmasters by Patrol
        </h3>
        {!editing
          ? <button onClick={() => setEditing(true)} className="text-xs text-[#1a2744] border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Edit</button>
          : <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="text-xs border border-gray-300 px-3 py-1.5 rounded-lg">Cancel</button>
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="text-xs bg-[#1a2744] text-white px-3 py-1.5 rounded-lg">Save</button>
            </div>
        }
      </div>
      {Object.keys(attendingByPatrol).length === 0 && (
        <p className="text-gray-400 text-sm italic">Mark scouts as attending to assign Grubmasters.</p>
      )}
      <div className="space-y-3">
        {Object.entries(attendingByPatrol).map(([patrol, scouts]) => (
          <div key={patrol} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-20 shrink-0">
              <p className="font-bold text-xs text-[#1a2744] uppercase tracking-wide">{patrol}</p>
            </div>
            {editing ? (
              <select
                className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm"
                value={grubmasters[patrol] || ''}
                onChange={e => setGrubmasters(g => ({ ...g, [patrol]: e.target.value }))}
              >
                <option value="">— Select Grubmaster —</option>
                {scouts.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <div className="flex-1">
                {grubmasters[patrol]
                  ? <span className="flex items-center gap-2 text-sm font-semibold text-[#1a2744]"><ChefHat className="w-3.5 h-3.5 text-orange-500" />{grubmasters[patrol]}</span>
                  : <span className="text-gray-400 text-sm italic">Not assigned</span>
                }
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OutingManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedOutingId, setSelectedOutingId] = useState(null);
  const [showRequest, setShowRequest] = useState(false);
  const [noteModal, setNoteModal] = useState(null);
  const { adminUnlocked } = useAdmin();

  const { data: outings = [] } = useQuery({
    queryKey: ['outings'],
    queryFn: () => base44.entities.Outing.list('-created_date', 20),
  });

  const { data: attendees = [] } = useQuery({
    queryKey: ['attendees', selectedOutingId],
    queryFn: () => base44.entities.OutingAttendee.filter({ outing_id: selectedOutingId }),
    enabled: !!selectedOutingId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.OutingAttendee.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['attendees', selectedOutingId]),
  });

  const deleteOutingMutation = useMutation({
    mutationFn: async (outingId) => {
      const attendeesToDelete = await base44.entities.OutingAttendee.filter({ outing_id: outingId });
      await Promise.all(attendeesToDelete.map(a => base44.entities.OutingAttendee.delete(a.id)));
      await base44.entities.Outing.delete(outingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['outings']);
      setSelectedOutingId(null);
      toast({ title: 'Outing removed.' });
    },
  });

  const selectedOuting = outings.find(o => o.id === selectedOutingId);
  const patrolGroups = attendees.reduce((acc, a) => {
    const key = a.patrol || 'Unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});
  const confirmed = attendees.filter(a => a.attending).length;
  const requested = attendees.filter(a => a.request_to_attend && !a.attending).length;

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const ampm = +h >= 12 ? 'PM' : 'AM';
    return `${+h % 12 || 12}:${m} ${ampm}`;
  };

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Outing Sign-Up Manager</h1>
            <p className="text-white/70 mt-1">Manage permission slips, attendance, payments, and Grubmasters per outing.</p>
          </div>
          {adminUnlocked && (
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-[#FFD700] text-[#1a2744] font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm">
              <Plus className="w-4 h-4" /> New Outing
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {outings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-400">No outings yet. Create the first one.</p>
            {adminUnlocked && (
              <button onClick={() => setShowCreate(true)} className="mt-4 bg-[#1a2744] text-white px-5 py-2 rounded-lg text-sm font-semibold">Create Outing</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Outing list sidebar */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Outings</p>
              {outings.map(o => (
                <div key={o.id} className={`rounded-lg border-2 transition-all ${selectedOutingId === o.id ? 'border-[#1a2744] bg-[#1a2744]' : 'border-gray-200 bg-white hover:border-[#1a2744]'}`}>
                  <button onClick={() => setSelectedOutingId(o.id)} className="w-full text-left p-3">
                    <p className={`font-bold text-sm ${selectedOutingId === o.id ? 'text-white' : 'text-gray-700'}`}>{o.title}</p>
                    {o.departure_date && (
                      <p className={`text-xs mt-0.5 ${selectedOutingId === o.id ? 'text-white/70' : 'text-gray-400'}`}>
                        {format(new Date(o.departure_date + 'T12:00:00'), 'MMM d, yyyy')}
                        {o.departure_time && ` · ${formatTime(o.departure_time)}`}
                      </p>
                    )}
                  </button>
                  <div className="px-3 pb-2">
                    {adminUnlocked && (
                      <button
                        onClick={() => deleteOutingMutation.mutate(o.id)}
                        className={`text-xs flex items-center gap-1 ${selectedOutingId === o.id ? 'text-red-300 hover:text-red-100' : 'text-red-400 hover:text-red-600'} transition-colors`}
                      >
                        <Trash2 className="w-3 h-3" /> Remove outing
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Main area */}
            <div className="lg:col-span-3">
              {!selectedOutingId ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>Select an outing to view the sign-up sheet.</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div>
                          <h2 className="font-bold text-[#1a2744] text-lg">{selectedOuting?.title}</h2>
                          <p className="text-xs text-gray-500 mt-0.5">{confirmed} confirmed · {requested > 0 ? `${requested} pending request${requested > 1 ? 's' : ''}` : 'no pending requests'}</p>
                          {(selectedOuting?.departure_date || selectedOuting?.departure_time) && (
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {selectedOuting.departure_date && (
                                <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  <Clock className="w-3 h-3" />
                                  Depart: {format(new Date(selectedOuting.departure_date + 'T12:00:00'), 'EEE MMM d')}
                                  {selectedOuting.departure_time && ` at ${formatTime(selectedOuting.departure_time)}`}
                                </span>
                              )}
                              {selectedOuting.return_date && (
                                <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  <Clock className="w-3 h-3" />
                                  Return: {format(new Date(selectedOuting.return_date + 'T12:00:00'), 'EEE MMM d')}
                                  {selectedOuting.return_time && ` ~${formatTime(selectedOuting.return_time)}`}
                                </span>
                              )}
                              {selectedOuting.price_per_scout && (
                                <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded font-semibold">
                                  💵 ${selectedOuting.price_per_scout} / scout
                                </span>
                              )}
                            </div>
                          )}
                          {/* Class B shirt schedule */}
                          {(selectedOuting.friday_shirt || selectedOuting.saturday_shirt || selectedOuting.sunday_shirt) && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {[['Fri', selectedOuting.friday_shirt], ['Sat', selectedOuting.saturday_shirt], ['Sun', selectedOuting.sunday_shirt]]
                                .filter(([, color]) => color)
                                .map(([day, color]) => (
                                  <span key={day} className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-semibold">
                                    👕 {day}: {color} Class B
                                  </span>
                                ))
                                }
                                </div>
                                )}
                                </div>
                        <div className="flex gap-2 flex-wrap">
                          {selectedOuting?.permission_slip_url && (
                            <a href={selectedOuting.permission_slip_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100">
                              <Download className="w-3.5 h-3.5" /> Permission Slip
                            </a>
                          )}
                          <button onClick={() => setShowRequest(true)}
                            className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-100">
                            <MessageSquare className="w-3.5 h-3.5" /> Request to Attend
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 text-xs text-gray-500 font-bold uppercase tracking-wide">
                            <th className="py-2 px-3 text-left">Scout Name</th>
                            <th className="py-2 px-3 text-left">Patrol</th>
                            <th className="py-2 px-3 text-center">Attending</th>
                            <th className="py-2 px-3 text-center">Perm Slip</th>
                            <th className="py-2 px-3 text-center">Paid</th>
                            <th className="py-2 px-3 text-center">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(patrolGroups).map(([patrol, scouts]) => (
                            <React.Fragment key={patrol}>
                              <tr><td colSpan={6} className="bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider">{patrol}</td></tr>
                              {scouts.map(a => (
                                <AttendeeRow key={a.id} attendee={a}
                                  onToggle={(id, field, val) => updateMutation.mutate({ id, data: { [field]: val } })}
                                  onMessage={setNoteModal}
                                />
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Grubmasters panel */}
                  <GrubmastersPanel outingId={selectedOutingId} attendees={attendees} />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showCreate && <CreateOutingModal onClose={() => { setShowCreate(false); queryClient.invalidateQueries(['outings']); }} />}
      {showRequest && selectedOutingId && (
        <RequestAttendanceModal outingId={selectedOutingId} onClose={() => { setShowRequest(false); queryClient.invalidateQueries(['attendees', selectedOutingId]); }} />
      )}

      {/* Note modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-3">
              <p className="font-bold text-[#1a2744]">{noteModal.scout_name}</p>
              <button onClick={() => setNoteModal(null)}><X className="w-4 h-4" /></button>
            </div>
            <p className="text-gray-700 text-sm mb-4">{noteModal.notes}</p>
            <button onClick={() => { updateMutation.mutate({ id: noteModal.id, data: { attending: true } }); setNoteModal(null); }}
              className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">
              ✓ Mark as Attending
            </button>
          </div>
        </div>
      )}
    </div>
  );
}