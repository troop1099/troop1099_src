import React from 'react';
import { ExternalLink, CheckCircle, ArrowRight, Shield, Star, Award, Users } from 'lucide-react';

const REQUIRED_SEQUENCE = [
  {
    step: 1,
    title: 'Youth Protection Training (YPT)',
    description: 'Required for ALL registered adults before any Scouting activity. Must be renewed every 2 years. Complete at my.scouting.org.',
    url: 'https://my.scouting.org',
    urlLabel: 'Complete at my.scouting.org',
    badge: 'REQUIRED FIRST',
    badgeColor: 'bg-red-100 text-red-700',
    icon: Shield,
    iconColor: 'text-red-600',
  },
  {
    step: 2,
    title: 'Scoutmaster Specifics',
    description: 'Online course covering the role of the Scoutmaster, the patrol method, and troop operations. Complete at my.scouting.org.',
    url: 'https://my.scouting.org',
    urlLabel: 'my.scouting.org → E-Learning',
    badge: 'STEP 2',
    badgeColor: 'bg-blue-100 text-blue-700',
    icon: Users,
    iconColor: 'text-blue-600',
  },
  {
    step: 3,
    title: 'Introduction to Outdoor Leader Skills (IOLS)',
    description: 'Hands-on weekend training that covers the outdoor skills Scouts learn — camping, cooking, first aid, navigation. Required for Scoutmasters and ASMs.',
    url: 'https://www.scouting.org/training/adult/supplemental/introduction-to-outdoor-leader-skills/',
    urlLabel: 'scouting.org — IOLS info',
    badge: 'STEP 3',
    badgeColor: 'bg-green-100 text-green-700',
    icon: Award,
    iconColor: 'text-green-600',
  },
  {
    step: 4,
    title: 'Scoutmaster & ASM Leader Specific Training (SALT)',
    description: 'Formerly known as "Leader Specific Training." Completes the Trained Leader requirements for Scoutmasters and ASMs.',
    url: 'https://my.scouting.org',
    urlLabel: 'my.scouting.org → Training',
    badge: 'STEP 4',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    icon: CheckCircle,
    iconColor: 'text-yellow-600',
  },
];

const SUPPLEMENTAL = [
  {
    title: 'Wood Badge',
    description: 'BSA\'s flagship advanced leadership course. A transformative 6-day experience focused on leadership skills applicable to all areas of life. Highly recommended for all leaders.',
    url: 'https://www.scouting.org/training/resources-for-program-trainers-training-committees/woodbadge/',
    category: 'Advanced Leadership',
    color: 'border-yellow-300 bg-yellow-50',
    tagColor: 'bg-yellow-100 text-yellow-800',
  },
  {
    title: 'National Youth Leadership Training (NYLT)',
    description: 'For Scouts ages 13+ (not leaders). A week-long youth leadership course that mirrors Wood Badge. Scouts who complete NYLT are stronger patrol leaders.',
    url: 'https://www.scouting.org/training/youth/nylt/',
    category: 'Youth (Ages 13+)',
    color: 'border-green-300 bg-green-50',
    tagColor: 'bg-green-100 text-green-800',
  },
  {
    title: 'Safe Swim Defense & Safety Afloat',
    description: 'Required for any leader supervising swimming or watercraft activities. Complete online at my.scouting.org.',
    url: 'https://my.scouting.org',
    category: 'Aquatics Safety',
    color: 'border-cyan-300 bg-cyan-50',
    tagColor: 'bg-cyan-100 text-cyan-800',
  },
  {
    title: 'Climb On Safely',
    description: 'Required for leaders supervising climbing and rappelling activities.',
    url: 'https://my.scouting.org',
    category: 'Climbing Safety',
    color: 'border-orange-300 bg-orange-50',
    tagColor: 'bg-orange-100 text-orange-800',
  },
];

export default function LeaderTraining() {
  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Adult Leader Training</h1>
          <p className="text-white/70 mt-2">Required training sequence and supplemental development resources for Troop 1099 leaders.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        {/* Required Sequence */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-bold text-[#1a2744] text-xl">Required Training Sequence</h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">COMPLETE IN ORDER</span>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gray-200 hidden md:block" />

            <div className="space-y-4">
              {REQUIRED_SEQUENCE.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex gap-4 relative">
                    <div className={`w-12 h-12 rounded-full border-2 border-white shadow flex items-center justify-center shrink-0 bg-white z-10`}
                      style={{ boxShadow: '0 0 0 3px #e5e7eb' }}>
                      <span className="font-bold text-[#1a2744] text-lg">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.badgeColor} mr-2`}>{item.badge}</span>
                          <h3 className="font-bold text-[#1a2744] text-base mt-1">{item.title}</h3>
                        </div>
                        <Icon className={`w-5 h-5 ${item.iconColor} shrink-0`} />
                      </div>
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed">{item.description}</p>
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#1a2744] hover:text-red-600 transition-colors">
                        {item.urlLabel} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    {i < REQUIRED_SEQUENCE.length - 1 && (
                      <div className="absolute -bottom-3 left-5 w-5 flex justify-center z-20">
                        <ArrowRight className="w-4 h-4 text-gray-300 rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Supplemental Training */}
        <section>
          <h2 className="font-bold text-[#1a2744] text-xl mb-6">Supplemental & Elective Training</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUPPLEMENTAL.map(item => (
              <div key={item.title} className={`rounded-xl border-2 p-5 ${item.color}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-[#1a2744] text-base">{item.title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${item.tagColor}`}>{item.category}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.description}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a2744] hover:underline">
                  Learn more <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Reference */}
        <section className="bg-[#1a2744] rounded-xl p-6 text-white">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#FFD700]" /> "Trained" Leader Status
          </h2>
          <p className="text-white/80 text-sm mb-4">
            A Scoutmaster or ASM is considered "trained" when they complete: <strong>YPT + Scoutmaster Specifics + IOLS</strong>.
            The trained patch is awarded after all three are complete.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['YPT', 'Scoutmaster Specifics', 'IOLS'].map(item => (
              <div key={item} className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFD700] shrink-0" />
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
          <a href="https://my.scouting.org" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 bg-[#FFD700] text-[#1a2744] font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors">
            Start Training at my.scouting.org <ExternalLink className="w-4 h-4" />
          </a>
        </section>

      </div>
    </div>
  );
}