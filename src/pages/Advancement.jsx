import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Award, User, Users, FileText, Upload, Calendar } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import SchedulingModal from '@/components/advancement/SchedulingModal';
import ScoutPhoneLookup from '@/components/advancement/ScoutPhoneLookup';
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
  { name: 'Scout', color: '#8B7355', description: 'The beginning of the trail.', requirements: [
    '1a. Repeat from memory the Scout Oath, Scout Law, Scout motto, and Scout slogan. Explain their meaning.',
    '1b. Explain what Scout spirit is and describe ways you have shown Scout spirit.',
    '1c. Demonstrate the Scout sign, salute, and handshake. Explain when they should be used.',
    '1d. Describe the First Class Scout badge and tell what each part stands for.',
    '1e. Repeat from memory the Outdoor Code. List the seven principles of Leave No Trace. Explain the difference.',
    '1f. Repeat from memory the Pledge of Allegiance and explain its meaning.',
    '2a–2d. After attending at least one troop meeting: describe troop leadership, the four steps of advancement, BSA ranks, and merit badges.',
    '3a–3b. Explain the patrol method and become familiar with your patrol name, emblem, flag, and yell.',
    '4a. Show how to tie a square knot, two half-hitches, and a taut-line hitch.',
    '4b. Show the proper care of a rope by whipping and fusing the ends.',
    '5. Tell what you need to know about using a pocketknife safely and responsibly.',
    '6a–6b. With parent/guardian, complete child safety exercises and view Personal Safety Awareness videos.',
    '7. Participate in a Scoutmaster conference.',
  ]},
  { name: 'Tenderfoot', color: '#6B8E23', description: 'First steps into outdoor skills, fitness, and citizenship.', requirements: [
    '1a. Present yourself prepared for an overnight camping trip. Show your personal and camping gear.',
    '1b. Spend at least one night on a patrol or troop campout. Sleep in a tent you helped pitch.',
    '1c. Explain how you demonstrated the Outdoor Code and Leave No Trace on campouts.',
    '2a. On a campout, assist in preparing one meal. Explain why patrol members share meal prep and cleanup.',
    '2b. Demonstrate the safe method of cleaning items used to prepare, serve, and eat a meal.',
    '2c. Explain the importance of eating together as a patrol.',
    '3a–3d. Demonstrate practical use of square knot, two half-hitches, taut-line hitch; demonstrate proper care of knife, saw, and ax.',
    '4a. Show first aid for: cuts, blisters, burns, insect/tick bites, snakebite, nosebleed, frostbite, sunburn, and choking.',
    '4b. Describe common poisonous plants and tell how to treat exposure.',
    '4c. Tell how to prevent or reduce injuries on campouts.',
    '4d. Assemble a personal first-aid kit.',
    '5a–5d. Explain the buddy system; describe what to do if lost; explain safe hiking rules; explain hiking on durable surfaces.',
    '6a–6c. Record fitness baselines (pushups, situps, sit-and-reach, 1-mile run); develop improvement plan; show improvement after 30 days.',
    '7a. Demonstrate how to display, raise, lower, and fold the U.S. flag.',
    '7b. Participate in one hour of service approved by your Scoutmaster.',
    '8. Describe and use the Teaching EDGE method to teach another person to tie a square knot.',
    '9. Demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you lived four points of the Scout Law.',
    '10. Participate in a Scoutmaster conference.',
    '11. Successfully complete your board of review for the Tenderfoot rank.',
  ]},
  { name: 'Second Class', color: '#4682B4', description: 'Building competence in navigation, cooking, and nature.', requirements: [
    '1a. Participate in five separate troop/patrol activities (at least 3 outdoors, at least 2 with overnight camping).',
    '1b. Recite the principles of Leave No Trace from memory.',
    '1c. Select a patrol campsite location and explain the factors to consider.',
    '2a–2e. Demonstrate fire-building and stove use; plan and cook one hot breakfast or lunch using MyPlate nutrition model.',
    '2f–2g. Demonstrate tying the sheet bend and bowline knots.',
    '3a–3d. Demonstrate how a compass works and orient a map; complete a 5-mile hike using map and compass; find directions without a compass.',
    '4. Identify evidence of at least 10 kinds of wild animals in your local area.',
    '5a–5d. Tell swim precautions; pass the Scouting America beginner swim test; demonstrate water rescue methods.',
    '6a–6e. Demonstrate first aid for: eye injuries, animal bites, punctures, serious burns, heat exhaustion, shock, heatstroke, dehydration, hypothermia; explain emergency response procedures.',
    '7a–7c. Be physically active 30 min/day, 5 days/week for 4 weeks; discuss substance abuse dangers.',
    '8a–8e. Participate in a flag ceremony; explain flag respect; develop and follow an earnings/savings plan; participate in two hours of service.',
    '9a–9b. Explain the three R\'s of personal safety; describe bullying and appropriate responses.',
    '10. Demonstrate Scout spirit by living the Scout Oath and Scout Law.',
    '11. Participate in a Scoutmaster conference.',
    '12. Successfully complete your board of review for the Second Class rank.',
  ]},
  { name: 'First Class', color: '#CD853F', description: 'A skilled scout ready to lead patrols and teach others.', requirements: [
    '1a. Participate in 10 separate troop/patrol activities (at least 6 outdoors, at least 3 with overnight camping).',
    '1b. Explain the potential impacts of camping on the environment. Explain why the Outdoor Code and Leave No Trace are important.',
    '2a–2e. Plan a campout menu with breakfast, lunch, and dinner; make a budget/shopping list; serve as cook and supervise cleanup.',
    '3a–3d. Demonstrate lashings (timber hitch, clove hitch, square, shear, diagonal); use lashings to make a camp gadget.',
    '4a–4b. Complete a 1-mile orienteering course using map and compass; demonstrate use of a handheld GPS unit.',
    '5a–5d. Identify 10 native plants; identify two ways to get a weather forecast; describe natural indicators of hazardous weather; describe extreme weather in your area.',
    '6a–6e. Pass the Scouting America swimmer test; tell precautions for safe afloat trips; identify canoe/boat parts; demonstrate line rescue.',
    '7a–7f. Demonstrate first aid bandaging; show transport techniques; explain CPR steps; develop home emergency action plan; explain how to obtain potable water in an emergency.',
    '8a–8b. Be physically active 30 min/day, 5 days/week for 4 weeks; set a continuing fitness goal.',
    '9a–9d. Visit and discuss constitutional rights with a public official; investigate an environmental issue; reduce waste on an outing; participate in three hours of service.',
    '10. Tell someone eligible to join Scouts BSA about your Scouting activities and invite them to join.',
    '11. Demonstrate Scout spirit by living the Scout Oath and Scout Law.',
    '12. Participate in a Scoutmaster conference.',
    '13. Successfully complete your board of review for the First Class rank.',
  ]},
  { name: 'Star', color: '#DAA520', description: 'Stepping into leadership through merit badges and service.', requirements: [
    '1. Be active in your troop for at least four months as a First Class Scout.',
    '2. Demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God.',
    '3. Earn six merit badges, including any four from the Eagle-required list (18 merit badges on that list to choose from).',
    '4. While a First Class Scout, participate in six hours of service through one or more Scoutmaster-approved service projects.',
    '5. While a First Class Scout, serve actively in your troop for four months in a position of responsibility (patrol leader, senior patrol leader, den chief, scribe, quartermaster, historian, chaplain aide, instructor, webmaster, etc.).',
    '6a–6b. Complete child abuse prevention exercises and Personal Safety Awareness videos with parent/guardian.',
    '7. Participate in a Scoutmaster conference.',
    '8. Successfully complete your board of review for the Star rank.',
  ]},
  { name: 'Life', color: '#B22222', description: 'A proven leader with deep commitment to service and growth.', requirements: [
    '1. Be active in your troop for at least six months as a Star Scout.',
    '2. Demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God.',
    '3. Earn five more merit badges (11 total), including any three additional Eagle-required badges.',
    '4. While a Star Scout, participate in six hours of service. At least three hours must be conservation-related.',
    '5. While a Star Scout, serve actively in your troop for six months in a position of responsibility.',
    '6. Use the Teaching EDGE method to teach another Scout skills from one required area (first aid, navigation, cooking/tools, etc.).',
    '7. Participate in a Scoutmaster conference.',
    '8. Successfully complete your board of review for the Life rank.',
  ]},
  { name: 'Eagle', color: '#D95D39', description: 'The pinnacle of Scouting achievement.', requirements: [
    '1. Be active in your troop for at least six months as a Life Scout.',
    '2. Demonstrate Scout Spirit. Tell how you have done your duty to God, lived the Scout Oath and Law, and how they will guide your future. List references on your Eagle Scout Rank Application.',
    '3. Earn 21 merit badges total, including these 14 required: First Aid, Citizenship in the Community, Citizenship in the Nation, Citizenship in Society, Citizenship in the World, Communication, Cooking, Personal Fitness, Emergency Preparedness OR Lifesaving, Environmental Science OR Sustainability, Personal Management, Swimming OR Hiking OR Cycling, Camping, and Family Life.',
    '4. While a Life Scout, serve actively in your troop for six months in a position of responsibility (patrol leader, senior patrol leader, troop guide, etc.).',
    '5. While a Life Scout, plan, develop, and give leadership to others in a service project. Project must be approved by the benefiting organization, your Scoutmaster and unit committee, and the council/district BEFORE you start. Use the Eagle Scout Service Project Workbook (No. 512-927).',
    '6. Participate in a Scoutmaster conference.',
    '7. Successfully complete your board of review for the Eagle Scout rank.',
  ]},
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
  const [form, setForm] = useState({ scout_email: '', rank: '', merit_badge: '', date_requested: 'next_meeting', notes: '' });
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [scoutName, setScoutName] = useState('');
  const [verified, setVerified] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) =>
      base44.functions.invoke('submit-advancement-request', {
        phone_number: verifiedPhone,
        request_data: { ...data, type: reqType.type },
      }),
    onSuccess: () => {
      toast({ title: 'Request submitted!', description: 'The Scoutmaster will follow up soon.' });
      onClose();
    }
  });

  const handleReset = () => {
    setVerified(false);
    setScoutName('');
    setVerifiedPhone('');
    setForm({ scout_email: '', rank: '', merit_badge: '', date_requested: 'next_meeting', notes: '' });
  };

  const handleSubmit = () => {
    mutation.mutate({ ...form, scout_name: scoutName });
  };

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

        {/* Scout verification gate */}
        <div className="mb-5">
          <ScoutPhoneLookup
            instruction="You must verify your Scout record before filling out this request. Enter the phone number on file with the troop roster."
            onVerified={(phone, name) => {
              setVerifiedPhone(phone);
              setScoutName(name);
              setVerified(true);
            }}
            onReset={handleReset}
          />
        </div>

        {/* Form fields — only visible after verification */}
        {verified && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Scout Name</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                value={scoutName}
                readOnly
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
              <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]" value={form.scout_email} onChange={e => setForm(f => ({...f, scout_email: e.target.value}))} placeholder="your@email.com" />
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
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]" placeholder="e.g. Cooking" value={form.merit_badge} onChange={e => setForm(f => ({...f, merit_badge: e.target.value}))} />
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
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]" rows={3} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} />
            </div>
          </div>
        )}
        {verified && (
          <div className="flex gap-2 mt-5">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm">Cancel</button>
            <button onClick={handleSubmit} disabled={!scoutName.trim() || mutation.isPending} className={`flex-1 py-2.5 text-white rounded-lg text-sm font-semibold disabled:opacity-50 ${reqType.btnColor}`}>
              {mutation.isPending ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        )}
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

      {/* My Reservations + Admin */}
      <section className="bg-gray-50 pb-10 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
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