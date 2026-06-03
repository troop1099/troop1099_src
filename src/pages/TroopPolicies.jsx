import React, { useState } from 'react';
import { Shield, Smartphone, Package, CheckSquare, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const POLICIES = [
  {
    id: 'conduct',
    title: 'Code of Conduct',
    icon: Shield,
    color: 'border-blue-300 bg-blue-50',
    iconBg: 'bg-blue-600',
    intro: 'All Scouts, parents, and leaders of Troop 1099 are expected to uphold the Scout Oath and Law at all times. This Code of Conduct applies at all troop activities, meetings, campouts, and online communications.',
    sections: [
      {
        heading: 'Scout Behavior',
        items: [
          'Treat all Scouts, leaders, and adults with respect at all times',
          'No bullying, harassment, or exclusion of any kind — in person or online',
          'Follow the two-deep leadership rule: no Scout is ever alone with one adult',
          'Use appropriate language; no profanity at any troop activity',
          'Respect troop property and the property of others',
          'No alcohol, tobacco, or illegal substances — zero tolerance',
        ],
      },
      {
        heading: 'Consequences',
        items: [
          'Minor infractions: verbal warning from a leader',
          'Repeated or serious infractions: parent/guardian notified; Scout sent home at parent expense',
          'Severe misconduct: removed from troop with council notification per BSA policy',
          'All conduct issues are documented by the Scoutmaster',
        ],
      },
      {
        heading: 'Parent & Adult Expectations',
        items: [
          'All adults must maintain current YPT certification',
          'Follow the two-deep leadership rule — never one-on-one with a Scout',
          'Support the Scout Oath and Law in your own conduct',
          'Raise concerns through the Scoutmaster or committee — not directly to youth',
        ],
      },
    ],
  },
  {
    id: 'electronics',
    title: 'Electronics Policy',
    icon: Smartphone,
    color: 'border-orange-300 bg-orange-50',
    iconBg: 'bg-orange-600',
    intro: 'The purpose of Scouting is to develop young people through outdoor experiences and teamwork. Electronics that distract from this purpose are restricted at troop activities.',
    sections: [
      {
        heading: 'Phones at Meetings',
        items: [
          'Phones are permitted at Monday meetings for navigation and reference only',
          'Phones must be on silent and put away during instruction and ceremonies',
          'No social media use during meetings',
          'Scouts who violate this policy will be asked to put their phone in the leader bag',
        ],
      },
      {
        heading: 'Electronics on Campouts',
        items: [
          'Personal electronics (phones, tablets, gaming devices) are NOT permitted on campouts unless specifically announced by the Scoutmaster',
          'Exception: music devices may be used in tents at night with headphones',
          'Scouts may carry a phone for emergency use — it must stay off/silent during activities',
          'Cameras are encouraged for the Historian and Webmaster roles',
          'Any electronics violation results in confiscation until the end of the outing',
        ],
      },
      {
        heading: 'Social Media',
        items: [
          'No photos of other Scouts or leaders may be posted publicly without consent',
          'No identifying information (last names, locations) of minors posted publicly',
          'Troop social media is managed by the Youth Webmaster with adult oversight',
          'Scouts violating these rules may lose electronics privileges for the season',
        ],
      },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment Policy',
    icon: Package,
    color: 'border-green-300 bg-green-50',
    iconBg: 'bg-green-600',
    intro: 'Proper equipment ensures every Scout is safe and comfortable. This policy defines what is required, what the troop provides, and how to borrow gear.',
    sections: [
      {
        heading: 'Required Personal Gear',
        items: [
          'Scouts are expected to have their own sleeping bag (30°F rated minimum)',
          'Scouts must have appropriate footwear for each outing type — no open-toe shoes on hikes',
          'Rain gear is required for all campouts',
          'A 32oz water bottle is required for every outing',
          'Personal first aid kit and any prescription medications',
        ],
      },
      {
        heading: 'Troop-Provided Equipment',
        items: [
          'Troop tents are available for checkout via the Gear Checkout page',
          'Patrol cooking box (stoves, pots, utensils) is provided for each campout',
          'Water filters are available for backpacking trips — check out in advance',
          'Loaner sleeping bags may be available for new Scouts — ask the Equipment Coordinator',
        ],
      },
      {
        heading: 'Gear Care Standards',
        items: [
          'Return all borrowed gear clean and dry within 48 hours of the outing',
          'Report any damaged gear to a leader immediately — do not return damaged gear unannounced',
          'Scouts who lose or damage troop gear may be responsible for replacement cost',
          'Tents must be fully dry before storage to prevent mold',
        ],
      },
    ],
  },
  {
    id: 'signoff',
    title: 'Advancement Sign-off Policy',
    icon: CheckSquare,
    color: 'border-purple-300 bg-purple-50',
    iconBg: 'bg-purple-600',
    intro: 'This policy defines who can sign off Scouting requirements and how the sign-off process works. BSA policy does not allow self-certification.',
    sections: [
      {
        heading: 'Who Can Sign Off Requirements',
        items: [
          'Tenderfoot, Second Class, and First Class requirements: any First Class Scout or above, or any registered adult leader',
          'Merit badge requirements: only a registered Merit Badge Counselor for that badge',
          'Eagle-required merit badges: only In-Troop counselors, Summer Camp, or district Advance-A-Rama',
          'Scoutmaster Conference: Scoutmaster only (or designated ASM)',
          'Board of Review: troop committee members only (not the Scoutmaster)',
        ],
      },
      {
        heading: 'The Sign-off Process',
        items: [
          'Scout demonstrates or explains the requirement to the approver',
          'Approver witnesses the skill or confirms knowledge — no "I did it at home" sign-offs',
          'Scout records in their handbook; approver signs the handbook',
          'For merit badges: Scout must have a signed Blue Card before beginning any badge work',
          'Completed Blue Cards are turned in to the Scoutmaster immediately',
        ],
      },
      {
        heading: 'No Self-Certification',
        items: [
          'Scouts may not sign off their own requirements under any circumstances',
          'Parents may not sign off requirements in the Scout handbook (Blue Cards are different)',
          'Questionable sign-offs may be reviewed and voided by the Scoutmaster',
        ],
      },
    ],
  },
  {
    id: 'activity',
    title: 'Activity & Attendance Policy (Star–Eagle)',
    icon: Calendar,
    color: 'border-red-300 bg-red-50',
    iconBg: 'bg-red-600',
    intro: 'BSA requires Scouts to be "active" in the troop for a set period before advancing to Star, Life, and Eagle. This policy, developed by the PLC, defines what "active" means for Troop 1099.',
    sections: [
      {
        heading: '"Active" Defined',
        items: [
          'Attend at least 50% of regular Monday troop meetings during the required tenure period',
          'Attend at least 2 campouts or service projects during the required tenure period',
          'Participate meaningfully in a leadership role (for Star and above)',
          'Maintain Scout spirit — following the Scout Oath and Law in daily life',
        ],
      },
      {
        heading: 'Required Tenure Periods',
        items: [
          'Star: 4 months as a First Class Scout in a registered leadership position',
          'Life: 6 months as a Star Scout in a registered leadership position',
          'Eagle: 6 months as a Life Scout in a registered leadership position',
        ],
      },
      {
        heading: 'Absences & Exceptions',
        items: [
          'School-related absences (exams, sports, performances) do not count against activity',
          'Medical absences with parent notification do not count against activity',
          'Unexplained repeated absences may delay advancement — discuss with the Scoutmaster',
          'Scouts with extenuating circumstances should speak with the Scoutmaster before their Scoutmaster Conference',
        ],
      },
    ],
  },
];

export default function TroopPolicies() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Troop Policies</h1>
          <p className="text-white/70 mt-2">Code of Conduct, Electronics Policy, Equipment Policy, and Advancement Policies for Troop 1099.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-sm text-yellow-800">
          <strong>All Scouts and parents should read these policies.</strong> Scouts are expected to know and follow them. Questions? Ask the Scoutmaster at any Monday meeting.
        </div>

        {POLICIES.map(policy => (
          <div key={policy.id} className={`rounded-xl border-2 overflow-hidden ${policy.color}`}>
            <button
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/40 transition-colors"
              onClick={() => setExpanded(expanded === policy.id ? null : policy.id)}
            >
              <div className={`w-11 h-11 rounded-lg ${policy.iconBg} flex items-center justify-center shrink-0`}>
                <policy.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1a2744] text-base">{policy.title}</p>
                <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">{policy.intro}</p>
              </div>
              {expanded === policy.id ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
            </button>
            {expanded === policy.id && (
              <div className="px-5 pb-6 border-t border-white/50 pt-4 bg-white/70 space-y-5">
                <p className="text-gray-700 text-sm leading-relaxed">{policy.intro}</p>
                {policy.sections.map((section, si) => (
                  <div key={si}>
                    <p className="font-bold text-[#1a2744] text-sm mb-2">{section.heading}</p>
                    <ul className="space-y-1.5">
                      {section.items.map((item, ii) => (
                        <li key={ii} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 bg-[#1a2744] rounded-full mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}