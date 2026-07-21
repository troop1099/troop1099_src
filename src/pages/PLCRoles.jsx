import React, { useState } from 'react';
import { Crown, Star, Users, PenLine, Package, BookOpen, Globe, ChevronDown, ChevronUp, Shield } from 'lucide-react';

const ROLES = [
  {
    title: 'Senior Patrol Leader (SPL)',
    abbr: 'SPL',
    icon: Crown,
    color: 'bg-yellow-50 border-yellow-300',
    iconBg: 'bg-yellow-500',
    elected: true,
    description: 'The SPL is the highest-ranking youth leader in the troop — elected by the entire troop. The SPL runs troop meetings, chairs the PLC, and represents the troop to the Scoutmaster.',
    duties: [
      'Preside over all troop meetings and courts of honor',
      'Chair the Patrol Leaders Council (PLC) monthly meetings',
      'Work with the Scoutmaster to plan the troop program',
      'Appoint youth leaders to their positions (with SM approval)',
      'Set the example of Scout spirit for the entire troop',
      'Represent the troop at district and council events',
    ],
    how: 'Elected by troop vote. Any Scout First Class or above who has served as a Patrol Leader is eligible. Elections are held every 6 months.',
  },
  {
    title: 'Assistant Senior Patrol Leader (ASPL)',
    abbr: 'ASPL',
    icon: Star,
    color: 'bg-orange-50 border-orange-300',
    iconBg: 'bg-orange-500',
    elected: true,
    description: 'The Assistant Senior Patrol Leader is an elected youth leadership position that supports the Senior Patrol Leader and steps in when the Senior Patrol Leader is absent.',
    duties: [
      'Assist the SPL in all duties',
      'Lead the troop in the SPL\'s absence',
      'Help train new Patrol Leaders',
      'Oversee the Quartermaster and Scribe',
      'Plan and run JLTC (Junior Leader Training)',
    ],
    how: 'Elected by troop vote. Usually the runner-up in the SPL election or a strong First Class+ Scout.',
  },
  {
    title: 'Patrol Leader (PL)',
    abbr: 'PL',
    icon: Shield,
    color: 'bg-green-50 border-green-300',
    iconBg: 'bg-green-600',
    elected: true,
    description: 'The Patrol Leader leads their patrol — planning meetings, assigning the Grubmaster, and representing their patrol at PLC meetings.',
    duties: [
      'Lead patrol meetings and activities',
      'Represent the patrol at monthly PLC meetings',
      'Assign the Grubmaster for each outing',
      'Ensure every patrol member knows the plan',
      'Motivate patrol members toward advancement',
      'Conduct "Roses, Buds, and Thorns" debrief after each outing',
    ],
    how: 'Elected by patrol members. Any Scout Tenderfoot or above is eligible. Elections are held every 6 months.',
  },
  {
    title: 'Assistant Patrol Leader (APL)',
    abbr: 'APL',
    icon: Shield,
    color: 'bg-teal-50 border-teal-300',
    iconBg: 'bg-teal-600',
    elected: false,
    description: 'The APL supports the Patrol Leader and steps in when the PL is absent. A great first leadership role.',
    duties: [
      'Assist the Patrol Leader in all duties',
      'Lead the patrol when the PL is absent',
      'Help newer Scouts with advancement requirements',
    ],
    how: 'Appointed by the Patrol Leader with the SPL\'s approval.',
  },
  {
    title: 'Troop Scribe',
    abbr: 'Scribe',
    icon: PenLine,
    color: 'bg-blue-50 border-blue-300',
    iconBg: 'bg-blue-600',
    elected: false,
    description: 'The Scribe keeps records for the troop — attendance, meeting minutes, and administrative tasks that keep the troop organized.',
    duties: [
      'Take attendance at every troop meeting',
      'Record minutes at PLC meetings',
      'Maintain the troop record book',
      'Assist the SPL and Scoutmaster with administrative tasks',
    ],
    how: 'Appointed by the SPL with Scoutmaster approval.',
  },
  {
    title: 'Troop Quartermaster',
    abbr: 'Quartermaster',
    icon: Package,
    color: 'bg-teal-50 border-teal-300',
    iconBg: 'bg-teal-600',
    elected: false,
    description: 'The Quartermaster manages the troop\u2019s equipment and supplies. The Quartermaster helps issue, collect, organize, inspect, and maintain troop gear and reports damaged or missing equipment to the appropriate adult leader.',
    duties: [
      'Issue and collect troop gear for outings',
      'Organize and maintain the troop equipment room',
      'Inspect gear before and after each outing',
      'Report damaged or missing equipment to adult leaders',
      'Keep an inventory of all troop equipment',
    ],
    how: 'Appointed by the SPL with Scoutmaster approval.',
  },
  {
    title: 'Troop Instructor',
    abbr: 'Instructor',
    icon: BookOpen,
    color: 'bg-indigo-50 border-indigo-300',
    iconBg: 'bg-indigo-600',
    elected: false,
    description: 'The Instructor teaches Scouting skills — knots, first aid, navigation, cooking — to newer Scouts at meetings and on outings.',
    duties: [
      'Teach Scouting skills at troop meetings',
      'Help Tenderfoot through First Class Scouts with requirements',
      'Plan and run skill instruction segments at meetings',
      'Work with the ASPL and SM on the training program',
    ],
    how: 'Appointed by the SPL with Scoutmaster approval. Should be First Class or above.',
  },
  {
    title: 'Youth Webmaster',
    abbr: 'Webmaster',
    icon: Globe,
    color: 'bg-red-50 border-red-300',
    iconBg: 'bg-red-600',
    elected: false,
    description: 'The Youth Webmaster manages the troop\'s digital presence — posting trip recaps, updating photos, and helping maintain the troop website alongside an adult co-admin.',
    duties: [
      'Post trip recaps to the troop website after each outing',
      'Upload and organize photos in the troop gallery',
      'Update the website with news and upcoming events',
      'Manage troop social media (with adult supervision)',
      'Participate in PLC and represent the digital/communications function',
    ],
    how: 'Appointed by the SPL with Scoutmaster approval. Should have basic computer skills and a passion for writing and photography.',
  },
];

const DEBRIEF = {
  title: '"Roses, Buds, and Thorns" — Post-Outing Debrief',
  description: 'After every outing, the Patrol Leader runs a quick debrief using the Roses, Buds, and Thorns format. This is Troop 1099\'s standard closing ritual.',
  items: [
    { label: '🌹 Rose', color: 'text-red-600', desc: 'Something that went really well. A highlight of the trip.' },
    { label: '🌱 Bud', color: 'text-green-600', desc: 'Something with potential — an idea for next time or something to grow.' },
    { label: '🌵 Thorn', color: 'text-gray-600', desc: 'Something that didn\'t go well. Honest feedback for improvement.' },
  ],
  process: 'Each patrol member shares one of each. The Patrol Leader listens without judgment and brings key feedback to the next PLC meeting.',
};

export default function PLCRoles() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">PLC & Youth Leadership Roles</h1>
          <p className="text-white/70 mt-2">The Patrol Leaders Council (PLC) is how Troop 1099 is youth-led. Every position, its duties, and how to get involved.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* PLC Hierarchy diagram */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-lg mb-5">Leadership Hierarchy</h2>
          <div className="flex flex-col items-center gap-2 text-center text-sm">
            <div className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg">SPL</div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="bg-orange-500 text-white font-bold px-6 py-2 rounded-lg">ASPL</div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex gap-4 flex-wrap justify-center">
              <div className="bg-green-600 text-white font-bold px-4 py-1.5 rounded-lg">PL (each patrol)</div>
              <div className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-lg">Scribe</div>
              <div className="bg-teal-600 text-white font-bold px-4 py-1.5 rounded-lg">Quartermaster</div>
              <div className="bg-indigo-600 text-white font-bold px-4 py-1.5 rounded-lg">Instructor</div>
              <div className="bg-red-600 text-white font-bold px-4 py-1.5 rounded-lg">Webmaster</div>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="bg-teal-600 text-white font-semibold px-4 py-1.5 rounded-lg">APL (each patrol)</div>
          </div>
        </div>

        {/* Role cards */}
        {ROLES.map(role => (
          <div key={role.abbr} className={`rounded-xl border-2 overflow-hidden ${role.color}`}>
            <button
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/40 transition-colors"
              onClick={() => setExpanded(expanded === role.abbr ? null : role.abbr)}
            >
              <div className={`w-11 h-11 rounded-lg ${role.iconBg} flex items-center justify-center shrink-0`}>
                <role.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#1a2744]">{role.title}</p>
                  {role.elected && <span className="text-xs bg-[#FFD700] text-[#1a2744] font-bold px-2 py-0.5 rounded-full">ELECTED</span>}
                </div>
                <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">{role.description}</p>
              </div>
              {expanded === role.abbr ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
            </button>
            {expanded === role.abbr && (
              <div className="px-5 pb-5 space-y-4 border-t border-white/50 pt-4 bg-white/60">
                <p className="text-gray-700 text-sm leading-relaxed">{role.description}</p>
                <div>
                  <p className="font-bold text-[#1a2744] text-sm mb-2">Key Duties:</p>
                  <ul className="space-y-1.5">
                    {role.duties.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-[#1a2744] rounded-full mt-1.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#1a2744]/5 rounded-lg p-3">
                  <p className="font-bold text-[#1a2744] text-sm mb-1">How to Get This Role:</p>
                  <p className="text-gray-700 text-sm">{role.how}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Roses Buds Thorns */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-lg mb-2">{DEBRIEF.title}</h2>
          <p className="text-gray-600 text-sm mb-4">{DEBRIEF.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {DEBRIEF.items.map(item => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                <p className={`font-bold text-base mb-1 ${item.color}`}>{item.label}</p>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 italic">{DEBRIEF.process}</p>
        </div>

      </div>
    </div>
  );
}