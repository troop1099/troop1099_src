import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Star, Plus, X, User, ExternalLink, ChevronLeft, Upload, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import AddBadgeModal from '@/components/meritbadges/AddBadgeModal';
import BadgeCard from '@/components/meritbadges/BadgeCard';
import AdminBar from '@/components/meritbadges/AdminBar';
import { refreshBadge } from '@/lib/meritBadgeUtils';
import { useToast } from '@/components/ui/use-toast';

// Badge images are stored in localStorage keyed by badge id (client-side upload preview)
// In a real deployment these would be uploaded to storage
function useBadgeImage(badgeId, initialUrl) {
  const key = `badge_img_${badgeId}`;
  const [img, setImg] = useState(() => localStorage.getItem(key) || initialUrl || null);
  const upload = async (file) => {
    const res = await base44.integrations.Core.UploadFile({ file });
    localStorage.setItem(key, res.file_url);
    setImg(res.file_url);
  };
  return [img, upload, setImg];
}

// BSA official requirements pages
const BSA_LINKS = {
  'first-aid': 'https://www.scouting.org/merit-badges/first-aid/',
  'citizenship-community': 'https://www.scouting.org/merit-badges/citizenship-in-the-community/',
  'citizenship-nation': 'https://www.scouting.org/merit-badges/citizenship-in-the-nation/',
  'citizenship-world': 'https://www.scouting.org/merit-badges/citizenship-in-the-world/',
  'citizenship-society': 'https://www.scouting.org/merit-badges/citizenship-in-society/',
  'communication': 'https://www.scouting.org/merit-badges/communications/',
  'cooking': 'https://www.scouting.org/merit-badges/cooking/',
  'personal-fitness': 'https://www.scouting.org/merit-badges/personal-fitness/',
  'personal-management': 'https://www.scouting.org/merit-badges/personal-management/',
  'camping': 'https://www.scouting.org/merit-badges/camping/',
  'family-life': 'https://www.scouting.org/merit-badges/family-life/',
  'emergency-preparedness': 'https://www.scouting.org/merit-badges/emergency-preparedness/',
  'lifesaving': 'https://www.scouting.org/merit-badges/lifesaving/',
  'environmental-science': 'https://www.scouting.org/merit-badges/environmental-science/',
  'sustainability': 'https://www.scouting.org/merit-badges/sustainability/',
  'swimming': 'https://www.scouting.org/merit-badges/swimming/',
  'hiking': 'https://www.scouting.org/merit-badges/hiking/',
  'cycling': 'https://www.scouting.org/merit-badges/cycling/',
};

const BADGES = [
  {
    id: 'first-aid',
    name: 'First Aid',
    image: null,
    description: 'Scouts learn to manage emergency situations and treat injuries. First Aid merit badge teaches scouts to handle everything from minor cuts and burns to serious emergencies — a fundamental skill for every Scout.',
    requirements: [
      'Demonstrate to your counselor the rescues techniques for a person who is not breathing.',
      'Show first aid for the following: cuts and scratches, bites and stings, poisonous plants, burns and scalds, blisters on the hand and foot.',
      'Do the following: Tell the six signs of a heart attack. Demonstrate hands-only CPR.',
      'Show first aid for shock.',
      'Show first aid for a nosebleed.',
      'Show first aid for frostbite and sunburn.',
      'Explain and demonstrate how you would transport a person with a serious back or neck injury.',
      'Tell the four most common signals of a diabetic emergency. Describe the steps (Recognize, React, Report) for a bystander to take.',
      'Show first aid for a sprained ankle.',
      'Make a first-aid kit for your home.',
    ]
  },
  {
    id: 'citizenship-community',
    name: 'Citizenship in the Community',
    image: null,
    description: 'This merit badge helps Scouts understand and meet the responsibilities of citizenship in their community, learning how local government works and contributing to their neighborhoods.',
    requirements: [
      'Discuss the meaning of citizenship and what it means to be a good citizen in your community.',
      'Do the following: On a map of your community, locate the main government buildings. Chart the organization of your local or state government.',
      'Discuss with your counselor the three branches of government.',
      'Do four of the following: Attend a city or county council meeting. Tour your city hall or county courthouse. Observe a court in session. Volunteer 8 hours for a community project.',
      'Describe the natural resources in your community and how they are used.',
      'Explain what the Electoral College is and how it works.',
      'Do the following: Discuss with your counselor your understanding of the Declaration of Independence. Memorize and explain the meaning of the Preamble to the Constitution.',
    ]
  },
  {
    id: 'citizenship-nation',
    name: 'Citizenship in the Nation',
    image: null,
    description: 'Scouts learn about the U.S. government, the rights and duties of citizens, and the importance of civic involvement at the national level.',
    requirements: [
      'Explain what citizenship in the nation means and what it takes to be a good citizen.',
      'Do TWO of the following: Visit a place that is listed as a national historic landmark or that is on the National Register of Historic Places. Tour your state capitol building or the U.S. Capitol.',
      'Watch the national evening news five days in a row OR read the front page of a major daily newspaper five days in a row.',
      'Discuss each of the following documents with your counselor: Declaration of Independence, U.S. Constitution, Bill of Rights.',
      'Discuss with your counselor about 10 rights guaranteed by the Bill of Rights.',
      'With your counselor\'s approval, choose a speech of national historic importance. Deliver it in person or by recording.',
      'Name your two U.S. Senators and the U.S. Representative from your congressional district.',
    ]
  },
  {
    id: 'citizenship-world',
    name: 'Citizenship in the World',
    image: null,
    description: 'Scouts explore international relations, world organizations, and what it means to be a citizen of the global community.',
    requirements: [
      'Explain what citizenship in the world means to you and how you can demonstrate good citizenship locally, nationally, and internationally.',
      'Explain how communications and transportation have changed relationships between countries.',
      'Pick a current world event. In relation to this, discuss with your counselor the following: How the event is related to world peace, international goodwill, or the environment.',
      'Describe the United Nations and its role in world affairs. Describe the aims and accomplishments of at least one international organization.',
      'Explain the following: How the geography, natural resources, and climate of a country affect its economy and the lives of its citizens.',
      'Do the following: Discuss the differences between the cultures, governments, and economies of two countries (other than the U.S.).',
      'Discuss the following: How a Scout can demonstrate good citizenship internationally.',
    ]
  },
  {
    id: 'citizenship-society',
    name: 'Citizenship in Society',
    image: null,
    eagle_required: false,
    description: 'This badge focuses on diversity, equity, and inclusion — helping Scouts understand and respect different perspectives and identities in American society.',
    requirements: [
      'Research and define the following terms: Diversity, Equity, Inclusion, Discrimination, Bias, Stereotype, Racism.',
      'Do the following: Identify a time when you felt excluded. Identify a time when you saw someone else being excluded.',
      'Research and identify how you can show respect for people who are different from you.',
      'Complete a project that promotes inclusion within your community.',
      'Identify and interview someone in your community who works to make it more inclusive.',
      'Discuss with your counselor how learning about diversity has changed how you interact with others.',
    ]
  },
  {
    id: 'communication',
    name: 'Communication',
    image: null,
    description: 'Scouts learn the fundamentals of effective communication — listening, writing, speaking, and presenting — skills that are vital for leadership and life.',
    requirements: [
      'Do the following: Tell a story at a Scouts BSA or family gathering. Write a short story and have it reviewed by your counselor.',
      'Write a letter to a Scout organization requesting materials. Keep the response for later use.',
      'Interview someone you admire. With this person\'s permission, share what you learned.',
      'Show how to read a map. Tell how a compass works.',
      'Do ONE of the following: Write to the editor of a newspaper about a matter of concern. Write a petition and get people to sign it.',
      'Keep a journal for 30 days.',
      'Deliver a speech of at least 5 minutes to a group or club.',
    ]
  },
  {
    id: 'cooking',
    name: 'Cooking',
    image: null,
    description: 'Scouts learn food safety, nutrition, and how to cook in various settings — from home to backcountry. Cooking merit badge fosters self-reliance and teamwork.',
    requirements: [
      'Health and safety: Explain to your counselor the most likely hazards you may encounter while participating in cooking activities.',
      'Nutrition: Using the MyPlate food guide or the current USDA nutrition model, explain what it means to eat a balanced diet.',
      'Cooking at home: Plan and cook two different breakfast meals.',
      'Cooking at home: Plan and cook two different lunch meals.',
      'Cooking at home: Plan and cook three different dinner meals.',
      'Camp cooking: Plan menus and prepare at least one breakfast, one lunch, and one dinner for your patrol on a campout.',
      'Trail and backpacking meals: Plan and prepare two backpacking meals.',
    ]
  },
  {
    id: 'personal-fitness',
    name: 'Personal Fitness',
    image: null,
    description: 'Scouts develop a personal fitness program and learn the importance of physical health, mental well-being, and making good lifestyle choices.',
    requirements: [
      'Before completing requirements 2 through 9, have a physical examination from a physician.',
      'Explain to your counselor what it means to be mentally healthy.',
      'Explain the following about nutrition: the importance of good nutrition, what it means to eat a balanced diet.',
      'Do the following: Complete a fitness assessment and record your results. Develop a 12-week fitness program with your counselor.',
      'Follow your fitness program for 12 weeks and record your progress.',
      'After completing your 12-week fitness program, redo the fitness assessment. Discuss how your fitness has improved.',
      'Find out about three career opportunities in personal fitness.',
    ]
  },
  {
    id: 'personal-management',
    name: 'Personal Management',
    image: null,
    description: 'Scouts learn financial literacy, goal setting, and time management — practical life skills that apply long after Scouting.',
    requirements: [
      'Do the following: Choose an item you would like to purchase. Make a list of the steps necessary to save enough money to buy it.',
      'Develop a budget for a 13-week period.',
      'Discuss with your counselor the difference between saving and investing.',
      'Explain what interest is. Demonstrate the "Rule of 72" and discuss the benefits of compound interest.',
      'Explain the following about taxes: what a W-2 form is, what a 1040 form is.',
      'Discuss the importance of a will.',
      'Do one of the following: Interview your parent/guardian about family finances. Develop a business plan for a new business.',
    ]
  },
  {
    id: 'camping',
    name: 'Camping',
    image: null,
    description: 'One of the most comprehensive merit badges — Scouts learn outdoor skills, Leave No Trace principles, and campsite preparation through actual camping experience.',
    requirements: [
      'Show you know first aid for and how to prevent injuries or illnesses that could occur while camping.',
      'Learn the Leave No Trace Seven Principles for the outdoor settings.',
      'Make a list of clothing you would need for overnight camping in both warm and cold weather.',
      'Demonstrate 10 different knots and their uses.',
      'Do the following: Help set up a campsite. Help break down and clean up a campsite.',
      'At each of 20 separate camping experiences, spend the night in a camp that you helped set up.',
      'On any of these camping experiences, cook at least five meals using a stove, Dutch oven, or campfire.',
    ]
  },
  {
    id: 'family-life',
    name: 'Family Life',
    image: null,
    description: 'Scouts learn about the importance of strong family relationships, their role in the family, and how to contribute positively at home.',
    requirements: [
      'Prepare an outline on what a family is and how the actions of one member can affect other members.',
      'List several reasons why you are important to your family and discuss this list with your parents or guardians.',
      'Prepare a list of your regular home duties or chores and do them for 90 days.',
      'With the approval of your parents or guardians and your counselor, decide on and carry out a project that you would do around the home that would benefit your family.',
      'Plan and carry out a family meeting where you discuss a topic and encourage all family members to participate.',
      'Discuss with your counselor how to plan and carry out a family meeting and how to deal with conflict within families.',
    ]
  },
  {
    id: 'emergency-preparedness',
    name: 'Emergency Preparedness',
    image: null,
    description: 'Scouts learn to prepare for and respond to various types of emergencies at home, in their community, and outdoors.',
    requirements: [
      'Earn the First Aid merit badge.',
      'Do the following: Discuss with your counselor the aspects of emergency preparedness including group and individual factors.',
      'Demonstrate A-B-Cs of emergency preparation.',
      'Make an emergency service call (simulated).',
      'Make a 72-hour emergency preparedness kit.',
      'Discuss and demonstrate with your family an emergency plan for home.',
      'Show what to do in the following emergencies: fire, flood, tornado, nuclear disaster, terrorism.',
    ]
  },
  {
    id: 'lifesaving',
    name: 'Lifesaving',
    image: null,
    description: 'Scouts learn water rescue skills, CPR, and how to respond to emergencies. Scouts must be strong swimmers before beginning this badge.',
    requirements: [
      'Earn the Swimming merit badge.',
      'Before doing requirements 3 through 15, demonstrate the ability to swim 400 yards continuously.',
      'Explain the basic principles of lifesaving including the order of rescue: shout, throw, reach, wade, row, swim.',
      'Explain and demonstrate reaching assists.',
      'Explain and demonstrate throwing assists including ring buoy, throw bag, and heaving line.',
      'Explain and demonstrate the following rescues: wading assists, swimming rescues without equipment.',
      'Explain and demonstrate the following: hair carry, chin pull, cross-chest carry.',
      'Do the following: Explain the dangers of hyperventilating when free diving. Explain each step in the Ready-Position sequence.',
      'Show rescue breathing and CPR techniques.',
    ]
  },
  {
    id: 'environmental-science',
    name: 'Environmental Science',
    image: null,
    description: 'Scouts investigate different ecosystems, human impacts on the environment, and how to protect natural resources for future generations.',
    requirements: [
      'Make a time line of the history of environmental science and explain how it relates to today.',
      'Define and explain the following terms: population, community, ecosystem, biosphere, biotic, abiotic.',
      'Do each of the following: Conduct an experiment illustrating the greenhouse effect. Discuss what you learn.',
      'Do ONE activity from seven different fields of environmental science: ecology, air pollution, water pollution, land pollution, endangered species, forest, and wilderness.',
      'Using the construction project provided, perform each of the following: Discuss the project\'s effect on the environment. Discuss your recommendations for protecting the environment.',
      'Find out about three career opportunities in environmental science.',
    ]
  },
  {
    id: 'sustainability',
    name: 'Sustainability',
    image: null,
    description: 'Scouts explore how to meet the needs of today without compromising the ability of future generations to meet their needs — across food, water, community, energy, and stuff.',
    requirements: [
      'Before beginning work on this merit badge, complete the Sustainability Merit Badge introduction.',
      'Water: Do an audit of how your family uses water. Develop and implement a plan to reduce your water use by at least 5% for 30 days.',
      'Food: Do an audit of how your family buys food. Explain what sustainability means when it comes to the food we eat.',
      'Community: Do an audit of how your family affects the community. Complete a project that improves sustainability in your community.',
      'Energy: Do an audit of how your family uses energy. Develop and implement a plan to reduce your home energy use by 10% for 30 days.',
      'Stuff: Do an audit of your personal possessions. Discuss with your counselor how reducing, reusing, recycling, and refusing affect sustainability.',
      'Research and share three career opportunities in sustainability.',
    ]
  },
  {
    id: 'swimming',
    name: 'Swimming',
    image: null,
    description: 'Scouts develop swimming skills and water safety knowledge — a prerequisite for many other water-based merit badges and outdoor activities.',
    requirements: [
      'Do the following: Explain safe-swimming rules. Explain the meaning of Safe Swim Defense.',
      'Jump feetfirst into water over your head in depth, swim 75 yards in a strong manner using one or more of the following strokes: sidestroke, breaststroke, trudgen, or crawl.',
      'Do the following: Swim 25 yards using the elementary backstroke. Swim 25 yards using the sidestroke.',
      'Demonstrate water-rescue methods by reaching with your arm or leg, by reaching with a suitable object, and by throwing lines and objects.',
      'Explain to your counselor how to prevent aquatic accidents.',
      'Before or after attempting the above, swim continuously for 150 yards.',
      'Explain the following to your counselor: precautions for swimmer and nonswimmer areas, diving safety precautions.',
    ]
  },
  {
    id: 'hiking',
    name: 'Hiking',
    image: null,
    description: 'Scouts complete a series of increasingly longer hikes, learning trail skills, safety, first aid, and how to plan and prepare for outdoor adventures.',
    requirements: [
      'Explain to your counselor the most likely hazards you may encounter while hiking and what you should do to anticipate, help prevent, mitigate, and respond to these hazards.',
      'Show you know first aid for injuries and other health conditions that could occur while hiking.',
      'Explain and, where possible, show the points of good hiking practices and trail etiquette.',
      'Explain how to properly plan a hike: how to choose a good location, maps needed, distances to cover, timing.',
      'Take the five following hikes, each on a different day, each of continuous nature: One hike of 5 continuous miles. Three hikes of 10 continuous miles each. One hike of 15 continuous miles.',
      'After each hike, write a short report in your journal.',
      'Participate in a service project that improves the outdoors.',
    ]
  },
  {
    id: 'cycling',
    name: 'Cycling',
    image: null,
    description: 'Scouts develop cycling skills, bike safety, and fitness through a series of progressively longer rides — an alternative to the Hiking or Swimming elective.',
    requirements: [
      'Explain to your counselor the most likely hazards you may encounter while cycling and what you should do to help prevent or mitigate these hazards.',
      'Show that you know first aid for the types of injuries that could occur while cycling.',
      'Explain the rules of the road for cyclists.',
      'Demonstrate your ability to properly fit a bicycle helmet.',
      'Demonstrate the ABC Quick Check for bicycles.',
      'Take the following rides, each on a different day: Two rides of 10 miles each. Two rides of 15 miles each. One ride of 25 miles.',
      'After each ride, write a short report in your journal.',
    ]
  },
];

function CounselorForm({ badge }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.MeritBadgeCounselor.create({ ...data, badge_id: badge.id }),
    onSuccess: () => { queryClient.invalidateQueries(['counselors', badge.id]); setForm({ name: '', email: '' }); }
  });
  return (
    <div className="border-t border-gray-200 mt-4 pt-4">
      <p className="text-sm font-semibold text-[#1a2744] mb-2">Add Yourself as Counselor</p>
      <div className="flex flex-col gap-2">
        <input placeholder="Your name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
        <input placeholder="Email (optional)" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
        <button
          onClick={() => addMutation.mutate(form)}
          disabled={!form.name || addMutation.isPending}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50 transition-colors"
        >
          {addMutation.isPending ? 'Adding...' : 'Add as Counselor'}
        </button>
      </div>
    </div>
  );
}

function BadgeDetail({ badge, onBack, adminUnlocked, onDelete }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [badgeImg, uploadBadgeImg, setBadgeImg] = useBadgeImage(badge.id, badge.image_url);
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fileRef = useRef();

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    await uploadBadgeImg(file);
    setUploading(false);
  };

  const { data: counselors = [] } = useQuery({
    queryKey: ['counselors', badge.id],
    queryFn: () => base44.entities.MeritBadgeCounselor.filter({ badge_id: badge.id }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MeritBadgeCounselor.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['counselors', badge.id])
  });

  const handleRefresh = async () => {
    if (!badge.bsa_url) {
      toast({ title: 'No official BSA URL for this badge', variant: 'destructive' });
      return;
    }
    setRefreshing(true);
    try {
      const result = await refreshBadge(badge, queryClient);
      if (result.success) {
        if (result.updateData?.image_url) {
          setBadgeImg(result.updateData.image_url);
          setImgError(false);
        }
        toast({ title: 'Badge refreshed from BSA page', description: 'Image, description, and requirements updated.' });
      } else {
        toast({ title: 'Unable to refresh', description: result.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Refresh failed', description: err?.message, variant: 'destructive' });
    }
    setRefreshing(false);
  };

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1 text-white/70 hover:text-white text-sm">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="font-bold text-lg">{badge.name}</h1>
        {badge.eagle_required && (
          <span className="bg-[#FFD700] text-[#1a2744] text-xs font-bold px-2 py-0.5 rounded">⭐ EAGLE REQUIRED</span>
        )}
        {adminUnlocked && (
          <button
            onClick={() => onDelete(badge)}
            className="ml-auto flex items-center gap-1.5 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-semibold"
          >
            <Trash2 className="w-4 h-4" /> Delete Badge
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: image + counselors */}
        <div>
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFD700] mx-auto mb-1 bg-gray-100 flex items-center justify-center group cursor-pointer" onClick={() => fileRef.current.click()}>
            {badgeImg && !imgError ? (
              <img src={badgeImg} alt={badge.name} className="w-full h-full object-contain p-2" onError={() => setImgError(true)} />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <Star className="w-8 h-8 text-[#FFD700]" />
                <span className="text-xs text-center px-2">Upload badge image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImgUpload} />
          </div>
          {uploading && <p className="text-center text-xs text-gray-400 mb-1">Uploading...</p>}
          {badge.bsa_url && (
            <a href={badge.bsa_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:underline mt-1 mb-2">
              <ExternalLink className="w-3 h-3" /> Official BSA Page
            </a>
          )}
          {badge.bsa_url && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1a2744] border border-gray-300 px-3 py-2 rounded mb-3 disabled:opacity-50 hover:bg-gray-50"
            >
              {refreshing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Refreshing...</> : <><RefreshCw className="w-3.5 h-3.5" /> Refresh from Official BSA Page</>}
            </button>
          )}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-[#1a2744] text-sm mb-3 flex items-center gap-1">
              <User className="w-4 h-4" /> Available Counselors ({counselors.length})
            </p>
            {counselors.length === 0 && <p className="text-gray-400 text-xs italic">No counselors registered yet.</p>}
            {counselors.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded p-2 mb-2">
                <div>
                  <p className="text-sm font-medium text-[#1a2744]">{c.name}</p>
                  {c.email && <p className="text-xs text-gray-500">{c.email}</p>}
                </div>
                <button onClick={() => deleteMutation.mutate(c.id)} className="text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <CounselorForm badge={badge} />
          </div>
        </div>

        {/* Right: info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="font-bold text-[#1a2744] text-base mb-2 flex items-center gap-2">📋 Description</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{badge.description}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="font-bold text-[#1a2744] text-base mb-4 flex items-center gap-2">✅ Official Requirements</h2>
            <div className="space-y-2">
              {badge.requirements.map((req, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#FFD700]/20 text-[#b8860b] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{req}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-4 italic">All requirements listed above are current as of 2026.</p>
          </div>

          {/* Merit badge process note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
            <p className="font-semibold text-[#1a2744] text-sm mb-2">⚠️ Merit Badge Process Reminder</p>
            <p className="text-gray-700 text-xs leading-relaxed">A Scout MUST obtain a signed Blue Card from the Scoutmaster BEFORE beginning work on any merit badge. Eagle-Required badges may only be earned at Summer Camp, an In-Council Advance-A-Rama, or with In-Troop or pre-approved counselors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MeritBadges() {
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [hiddenBadges, setHiddenBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hidden_badges') || '[]'); } catch { return []; }
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteBadge = async (badge) => {
    const confirmed = window.confirm(`Delete "${badge.name}"?\n${badge.dbId ? 'This badge will be permanently removed from the database.' : 'This built-in badge will be hidden from the library.'}`);
    if (!confirmed) return;

    if (badge.dbId) {
      try {
        await base44.entities.MeritBadge.delete(badge.dbId);
        queryClient.invalidateQueries(['merit-badges']);
        toast({ title: `"${badge.name}" deleted from database.` });
      } catch (err) {
        toast({ title: 'Failed to delete badge', variant: 'destructive' });
      }
    } else {
      const updated = [...hiddenBadges, badge.id];
      setHiddenBadges(updated);
      localStorage.setItem('hidden_badges', JSON.stringify(updated));
      toast({ title: `"${badge.name}" hidden from library.` });
    }
    setSelected(null);
  };

  const { data: allCounselors = [] } = useQuery({
    queryKey: ['counselors-all'],
    queryFn: () => base44.entities.MeritBadgeCounselor.list(),
  });

  const { data: dbBadges = [] } = useQuery({
    queryKey: ['merit-badges'],
    queryFn: () => base44.entities.MeritBadge.list(),
  });

  const allBadges = [
    ...BADGES.map(b => {
      const dbOverride = dbBadges.find(db => db.bsa_url === BSA_LINKS[b.id]);
      return {
        ...b,
        bsa_url: BSA_LINKS[b.id] || null,
        image_url: dbOverride?.image_url || null,
        description: dbOverride?.description || b.description,
        requirements: dbOverride?.requirements
          ? (() => { try { return JSON.parse(dbOverride.requirements); } catch { return b.requirements; } })()
          : b.requirements,
        eagle_required: b.eagle_required !== undefined ? b.eagle_required : (dbOverride?.eagle_required ?? true),
        dbId: dbOverride?.id,
      };
    }),
    ...dbBadges
      .filter(db => !Object.values(BSA_LINKS).includes(db.bsa_url))
      .map(b => ({
        id: b.id,
        name: b.name,
        description: b.description || '',
        requirements: b.requirements ? (() => { try { return JSON.parse(b.requirements); } catch { return []; } })() : [],
        bsa_url: b.bsa_url,
        image_url: b.image_url,
        eagle_required: !!b.eagle_required,
        dbId: b.id,
      })),
  ].filter(b => !hiddenBadges.includes(b.id) || b.dbId);

  const getCounselorCount = (badgeId) => allCounselors.filter(c => c.badge_id === badgeId).length;

  const handleRefreshAll = async () => {
    setRefreshingAll(true);
    const success = [];
    const failed = [];
    for (const badge of allBadges.filter(b => b.bsa_url)) {
      try {
        const result = await refreshBadge(badge, queryClient);
        if (result.success) success.push(badge.name);
        else failed.push(badge.name);
      } catch {
        failed.push(badge.name);
      }
    }
    setRefreshingAll(false);
    toast({
      title: `Refreshed ${success.length} badge${success.length !== 1 ? 's' : ''}`,
      description: failed.length > 0 ? `Could not refresh: ${failed.join(', ')}` : 'All badges updated successfully.',
    });
  };

  const selectedBadge = selected ? allBadges.find(b => b.id === selected.id) || selected : null;
  if (selectedBadge) return <BadgeDetail badge={selectedBadge} onBack={() => setSelected(null)} adminUnlocked={adminUnlocked} onDelete={handleDeleteBadge} />;

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Merit Badge Library</h1>
            <p className="text-white/70 mt-2">Explore the Eagle Required badges. All requirements are listed here for your convenience.</p>
          </div>
          <div className="flex items-center gap-3">
            <AdminBar unlocked={adminUnlocked} onUnlock={setAdminUnlocked} />
            {adminUnlocked && (
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-semibold"
              >
                <Plus className="w-4 h-4" /> Add Merit Badge
              </button>
            )}
            <button
              onClick={handleRefreshAll}
              disabled={refreshingAll}
              className="flex items-center gap-1 text-sm bg-[#FFD700] hover:bg-yellow-400 text-[#1a2744] px-3 py-1.5 rounded font-semibold disabled:opacity-50"
            >
              {refreshingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {refreshingAll ? 'Refreshing...' : 'Refresh All'}
            </button>
            <a href="https://www.scouting.org/skills/merit-badges/all/" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1 text-sm text-white/70 hover:text-white border border-white/20 px-3 py-1.5 rounded">
              <ExternalLink className="w-4 h-4" /> Full BSA Badge List
            </a>
          </div>
        </div>
      </div>

      {/* Process section */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="font-bold text-[#1a2744] text-lg mb-3">Merit Badge Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-2">In order to work on a merit badge, a Scout MUST:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Obtain a signed Blue Card from the Scoutmaster or In-Troop Merit Badge Counselor</li>
                <li>Fill out all personal information on the front of the Blue Card</li>
                <li>Contact the Merit Badge Counselor (MBC) to begin work</li>
                <li>Work on requirements with guidance from the MBC</li>
                <li>Have your MBC sign the completed Blue Card</li>
                <li>Turn in the completed Blue Card to Scoutmaster</li>
                <li>Keep your Applicant's Record section permanently — <strong>DO NOT LOSE IT!</strong></li>
              </ol>
            </div>
            <div>
              <p className="font-semibold mb-2">Special Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                <li>Eagle-Required Merit Badges may ONLY be earned at Summer Camp, In-Council Advance-A-Rama, or with In-Troop/Pre-Approved Counselors</li>
                <li>Personal Management and Family Life may ONLY be earned with In-Troop Counselors</li>
                <li>Merit Badges COMPLETED at Summer Camp do not need a Blue Card</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allBadges.map(badge => {
            const count = getCounselorCount(badge.id);
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                count={count}
                onClick={() => setSelected(badge)}
                adminUnlocked={adminUnlocked}
                onDelete={handleDeleteBadge}
              />
            );
          })}
        </div>
      </div>

      {showAdd && (
        <AddBadgeModal
          onClose={() => setShowAdd(false)}
          onSaved={() => queryClient.invalidateQueries(['merit-badges'])}
          existingUrls={[...Object.values(BSA_LINKS), ...dbBadges.map(b => b.bsa_url).filter(Boolean)]}
        />
      )}
    </div>
  );
}