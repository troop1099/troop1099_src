import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Award, User, Users, FileText, Upload, Calendar, Download } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import SchedulingModal from '@/components/advancement/SchedulingModal';
import MyReservations from '@/components/advancement/MyReservations';
import AdminSchedule from '@/components/advancement/AdminSchedule';

function useRankImage(rankName) {
  const key = `rank_img_${rankName.replace(' ', '_')}`;
  const [img, setImg] = useState(() => localStorage.getItem(key) || null);
  const upload = async (file) => {
    const res = await base44.integrations.Core.UploadFile({ file });
    localStorage.setItem(key, res.file_url);
    setImg(res.file_url);
  };
  return [img, upload];
}

function RankCircle({ rank, size = 'lg', onClick }) {
  const [img, uploadImg] = useRankImage(rank.name);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleUpload = async (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    await uploadImg(file);
    setUploading(false);
  };

  const isLg = size === 'lg';
  const dim = isLg ? 'w-16 h-16' : 'w-10 h-10';

  return (
    <div className="relative group" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        className={`${dim} rounded-full border-2 flex items-center justify-center overflow-hidden bg-white cursor-pointer transition-all group-hover:scale-110`}
        style={{ borderColor: rank.color }}
        onClick={onClick}
      >
        {img ? (
          <img src={img} alt={rank.name} className="w-full h-full object-contain" />
        ) : (
          <Award className={isLg ? 'w-6 h-6' : 'w-5 h-5'} style={{ color: rank.color }} />
        )}
      </div>
      <button
        className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}
        title="Upload rank image"
      >
        <Upload className="w-3 h-3 text-white" />
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </div>
  );
}


const ranks = [
  { name: 'Scout', color: '#8B7355', description: 'The beginning of the trail.', requirements: ['Learn the Scout Oath and Law', 'Understand the patrol method', 'Demonstrate the Scout sign, salute, and handshake', 'Tie a square knot', 'Describe and identify the BSA uniform'] },
  { name: 'Tenderfoot', color: '#6B8E23', description: 'First steps into outdoor skills, fitness, and citizenship.', requirements: ['Participate in a campout', 'Cook a meal on a campout', 'Demonstrate first aid for simple injuries', 'Complete a 1-mile hike', 'Identify local poisonous plants'] },
  { name: 'Second Class', color: '#4682B4', description: 'Building competence in navigation, cooking, and nature.', requirements: ['Use a compass to take a bearing', 'Complete a 5-mile hike', 'Cook a full meal without utensils', 'Identify 10 native plants', 'Demonstrate knife safety'] },
  { name: 'First Class', color: '#CD853F', description: 'A skilled scout ready to lead patrols and teach others.', requirements: ['Complete a 10-mile day hike', 'Plan and lead a patrol campout', 'Use a map and compass together on a hike', 'Demonstrate rescue breathing', 'Identify local constellations', 'Complete a service project'] },
  { name: 'Star', color: '#DAA520', description: 'Stepping into leadership through merit badges and service.', requirements: ['Earn 6 merit badges (4 Eagle-required)', 'Serve actively in a troop leadership position for 4 months', 'Complete 6 hours of community service', 'Plan a community service project'] },
  { name: 'Life', color: '#B22222', description: 'A proven leader with deep commitment to service and growth.', requirements: ['Earn 11 merit badges (7 Eagle-required)', 'Serve in a leadership position for 6 months', 'Complete 6 additional hours of service', 'Participate in a Scoutmaster conference'] },
  { name: 'Eagle', color: '#D95D39', description: 'The pinnacle of Scouting achievement.', requirements: ['Earn 21 merit badges (13 Eagle-required)', 'Serve in a leadership position for 6 months', 'Plan and lead an Eagle service project', 'Complete an Eagle board of review', 'Demonstrate Scout spirit throughout your journey'] },
];

const requestTypes = [
  {
    type: 'scoutmaster_conference', icon: User,
    color: 'bg-blue-100 text-blue-700 border-blue-200', btnColor: 'bg-[#1a2744] hover:bg-[#1a2744]/90',
    title: 'Scoutmaster Conference',
    description: 'Ready for your next rank? Request a conference with the Scoutmaster.',
    prereqs: [
      'Must have ASM sign-off on ALL rank requirements in handbook, including service hours and merit badge requirements.',
      'Register at least 1 week in advance of desired SMC date.',
      'Be in full Class A uniform (sash, socks, belt, handbook).',
      'Check in at the advancement table at the beginning of the meeting.',
    ],
  },
  {
    type: 'board_of_review', icon: Users,
    color: 'bg-red-100 text-red-700 border-red-200', btnColor: 'bg-red-600 hover:bg-red-700',
    title: 'Board of Review',
    description: 'Completed your conference? Schedule your Board of Review with the committee.',
    prereqs: [
      'Must have completed a Scoutmaster Conference first.',
      'Register at least 1 week in advance of desired Board of Review date.',
      'Be in full Class A uniform (sash, socks, belt, handbook).',
      'Check in at the advancement table at the beginning of the meeting.',
    ],
  },
  {
    type: 'blue_card', icon: FileText,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', btnColor: 'bg-yellow-600 hover:bg-yellow-700',
    title: 'Blue Card Request',
    description: 'Starting a new merit badge? A signed Blue Card is REQUIRED before beginning any badge.',
    prereqs: [
      'A Scout MUST obtain a signed Blue Card BEFORE starting any merit badge.',
      'Eagle-required badges may only be earned at Summer Camp, In-Council events, or with approved counselors.',
      'Download and print the fillable Blue Card PDF — bring it to the meeting to be signed.',
    ],
  },
];

function RequestModal({ reqType, onClose }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ scout_name: '', scout_email: '', rank: '', merit_badge: '', date_requested: 'next_meeting', notes: '' });
  const mutation = useMutation({
    mutationFn: (data) => base44.entities.AdvancementRequest.create({ ...data, type: reqType.type }),
    onSuccess: () => {
      toast({ title: 'Request submitted!', description: 'The Scoutmaster will follow up soon.' });
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-xl">{reqType.title}</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        {/* Prerequisites */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-5">
          <p className="font-bold text-[#1a2744] text-sm mb-2">⚠ Before You Submit</p>
          <ul className="space-y-1">
            {reqType.prereqs.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="w-1.5 h-1.5 bg-[#1a2744] rounded-full mt-1.5 shrink-0" />{p}
              </li>
            ))}
          </ul>
          {reqType.type === 'blue_card' && (
            <a href="https://bsatroop143.com/wp-content/uploads/2024/08/mb-app-blue-card-fillable_.pdf" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-blue-700 hover:underline">
              📄 Download Fillable Blue Card PDF →
            </a>
          )}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">First Name *</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.scout_name.split(' ')[0] || ''} onChange={e => setForm(f => ({...f, scout_name: e.target.value + ' ' + (f.scout_name.split(' ')[1] || '')}))} placeholder="First" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Last Name *</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.scout_name.split(' ').slice(1).join(' ') || ''} onChange={e => setForm(f => ({...f, scout_name: (f.scout_name.split(' ')[0] || '') + ' ' + e.target.value}))} placeholder="Last" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.scout_email} onChange={e => setForm(f => ({...f, scout_email: e.target.value}))} placeholder="your@email.com" />
          </div>
          {(reqType.type === 'scoutmaster_conference' || reqType.type === 'board_of_review') && (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Current Rank</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" onChange={e => setForm(f => ({...f, notes: 'Current: ' + e.target.value + (f.notes ? ' | ' + f.notes : '')}))}>
                  <option value="">Please select your current rank</option>
                  {ranks.map(r => <option key={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Rank Being Pursued</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.rank} onChange={e => setForm(f => ({...f, rank: e.target.value}))}>
                  <option value="">Please select your rank request</option>
                  {ranks.map(r => <option key={r.name}>{r.name}</option>)}
                </select>
              </div>
            </>
          )}
          {reqType.type === 'blue_card' && (
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Merit Badge Name</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Cooking" value={form.merit_badge} onChange={e => setForm(f => ({...f, merit_badge: e.target.value}))} />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Date Requested</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="date" value="next_meeting" checked={form.date_requested === 'next_meeting'} onChange={() => setForm(f => ({...f, date_requested: 'next_meeting'}))} />
                Next Troop Meeting
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="date" value="other" checked={form.date_requested !== 'next_meeting'} onChange={() => setForm(f => ({...f, date_requested: 'other'}))} />
                Other
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Any Additional Information</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={() => mutation.mutate(form)} disabled={!form.scout_name.trim() || mutation.isPending} className={`flex-1 py-2.5 text-white rounded-lg text-sm font-semibold disabled:opacity-50 ${reqType.btnColor}`}>
            {mutation.isPending ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Advancement() {
  const [selectedRank, setSelectedRank] = useState(null);
  const [requestModal, setRequestModal] = useState(null);
  const [showScheduling, setShowScheduling] = useState(false);

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Advancement Center</h1>
          <p className="text-white/70 mt-2">Track your progress and request advancement steps.</p>
        </div>
      </div>

      {/* Request Cards */}
      <section className="bg-gray-50 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-[#1a2744] text-xl mb-6">Request Advancement Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {requestTypes.map(rt => (
              <div key={rt.type} className={`bg-white rounded-lg border-2 ${rt.color} p-6 text-center`}>
                <div className={`w-14 h-14 rounded-full ${rt.color} flex items-center justify-center mx-auto mb-4`}>
                  <rt.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-[#1a2744] text-lg mb-2">{rt.title}</h3>
                <p className="text-gray-600 text-sm mb-5">{rt.description}</p>
                {rt.type === 'blue_card' ? (
                  <button
                    onClick={() => setRequestModal(rt)}
                    className={`w-full py-2 text-white rounded font-semibold text-sm ${rt.btnColor} transition-colors`}
                  >
                    Request {rt.title}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowScheduling(true)}
                    className={`w-full py-2 text-white rounded font-semibold text-sm ${rt.btnColor} transition-colors flex items-center justify-center gap-1.5`}
                  >
                    <Calendar className="w-4 h-4" /> Schedule {rt.title}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Worksheet + My Reservations + Admin */}
      <section className="bg-gray-50 pb-10 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <a
            href="https://filestore.scouting.org/filestore/pdf/512-728_WB_fillable.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a2744] hover:underline"
          >
            <Download className="w-4 h-4" /> Download the Scoutmaster Conference and Board of Review Worksheet
          </a>
          <MyReservations />
          <AdminSchedule />
        </div>
      </section>

      {/* Trail to Eagle */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-[#1a2744] text-xl mb-2">Trail to Eagle</h2>
          <p className="text-gray-500 text-sm mb-8">Click any rank to see requirements.</p>

          {/* Desktop ribbon */}
          <div className="hidden md:block relative">
            <div className="absolute top-12 left-0 right-0 h-px bg-gray-200" />
            <div className="grid grid-cols-7 gap-4">
              {ranks.map((rank, i) => (
                <motion.div key={rank.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center pt-4">
                  <RankCircle rank={rank} size="lg" onClick={() => setSelectedRank(rank)} />
                  <h3 className="font-semibold text-sm text-[#1a2744] mt-4 hover:text-red-600 transition-colors cursor-pointer" onClick={() => setSelectedRank(rank)}>{rank.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            {ranks.map(rank => (
              <div key={rank.name} className="w-full flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-4 text-left hover:border-[#1a2744] transition-colors">
                <RankCircle rank={rank} size="sm" onClick={() => setSelectedRank(rank)} />
                <button className="flex-1 text-left" onClick={() => setSelectedRank(rank)}>
                  <p className="font-semibold text-[#1a2744]">{rank.name}</p>
                  <p className="text-xs text-gray-500">{rank.description}</p>
                </button>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto shrink-0 cursor-pointer" onClick={() => setSelectedRank(rank)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rank Modal */}
      <AnimatePresence>
        {selectedRank && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedRank(null)}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <RankCircle rank={selectedRank} size="sm" onClick={() => {}} />
                    <div>
                      <h2 className="font-bold text-xl text-[#1a2744]">{selectedRank.name}</h2>
                      <p className="text-sm text-gray-500">{selectedRank.description}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedRank(null)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3">Key Requirements</p>
                  <ul className="space-y-2">
                    {selectedRank.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-500 shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-gray-700 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {requestModal && <RequestModal reqType={requestModal} onClose={() => setRequestModal(null)} />}
      {showScheduling && <SchedulingModal onClose={() => setShowScheduling(false)} />}
    </div>
  );
}