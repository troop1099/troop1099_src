import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Upload, Download, CheckSquare, Square, X, MessageSquare, FileText, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

// Pre-populated scout roster from the spreadsheet screenshot
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

function CreateOutingModal({ onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef();
  const [form, setForm] = useState({ title: '', month_label: '', departure_date: '', return_date: '' });
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
    const outing = await base44.entities.Outing.create({ ...form, permission_slip_url, active: true });
    // Seed all scouts
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
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
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
            <label className="text-xs font-semibold text-gray-600 block mb-1">Month Label</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" placeholder="e.g. March 2026 — Backpacking" value={form.month_label} onChange={e => setForm(f => ({...f, month_label: e.target.value}))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Departure Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.departure_date} onChange={e => setForm(f => ({...f, departure_date: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Return Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={form.return_date} onChange={e => setForm(f => ({...f, return_date: e.target.value}))} />
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
          <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50">
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
      outing_id: outingId,
      scout_name: name,
      attending: false,
      permission_slip: false,
      paid: false,
      request_to_attend: true,
      notes: message,
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

export default function OutingManager() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedOutingId, setSelectedOutingId] = useState(null);
  const [showRequest, setShowRequest] = useState(false);
  const [noteModal, setNoteModal] = useState(null);

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

  const selectedOuting = outings.find(o => o.id === selectedOutingId);

  // Group attendees by patrol
  const patrolGroups = attendees.reduce((acc, a) => {
    const key = a.patrol || 'Unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const confirmed = attendees.filter(a => a.attending).length;
  const requested = attendees.filter(a => a.request_to_attend && !a.attending).length;

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Outing Sign-Up Manager</h1>
            <p className="text-white/70 mt-1">Manage permission slips, attendance, and payments per outing.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-[#FFD700] text-[#1a2744] font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm">
            <Plus className="w-4 h-4" /> New Outing
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {outings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-400">No outings yet. Create the first one.</p>
            <button onClick={() => setShowCreate(true)} className="mt-4 bg-[#1a2744] text-white px-5 py-2 rounded-lg text-sm font-semibold">Create Outing</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Outing list sidebar */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Outings</p>
              {outings.map(o => (
                <button key={o.id} onClick={() => setSelectedOutingId(o.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${selectedOutingId === o.id ? 'border-[#1a2744] bg-[#1a2744] text-white' : 'border-gray-200 bg-white hover:border-[#1a2744] text-gray-700'}`}>
                  <p className="font-bold">{o.title}</p>
                  {o.departure_date && <p className={`text-xs mt-0.5 ${selectedOutingId === o.id ? 'text-white/70' : 'text-gray-400'}`}>{format(new Date(o.departure_date + 'T12:00:00'), 'MMM d, yyyy')}</p>}
                </button>
              ))}
            </div>

            {/* Attendee table */}
            <div className="lg:col-span-3">
              {!selectedOutingId ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>Select an outing to view the sign-up sheet.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-bold text-[#1a2744] text-lg">{selectedOuting?.title}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">{confirmed} confirmed · {requested > 0 ? `${requested} pending requests` : ''}</p>
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
              )}
            </div>
          </div>
        )}
      </div>

      {showCreate && <CreateOutingModal onClose={() => setShowCreate(false)} />}
      {showRequest && selectedOutingId && <RequestAttendanceModal outingId={selectedOutingId} onClose={() => { setShowRequest(false); queryClient.invalidateQueries(['attendees', selectedOutingId]); }} />}
      {noteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-3">
              <p className="font-bold text-[#1a2744]">{noteModal.scout_name}</p>
              <button onClick={() => setNoteModal(null)}><X className="w-4 h-4" /></button>
            </div>
            <p className="text-gray-700 text-sm">{noteModal.notes}</p>
            <button onClick={() => { updateMutation.mutate({ id: noteModal.id, data: { attending: true } }); setNoteModal(null); }}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">
              ✓ Mark as Attending
            </button>
          </div>
        </div>
      )}
    </div>
  );
}