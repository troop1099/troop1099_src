import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Heart, Users, BookOpen, FileText, Phone, Star, CheckCircle, Mail } from 'lucide-react';

const VOLUNTEER_ROLES = [
  {
    title: 'Merit Badge Counselor',
    desc: 'Share your professional or hobby expertise by counseling Scouts on merit badges. You choose which badge(s) you teach.',
    commit: 'Flexible — as needed',
    color: 'bg-yellow-50 border-yellow-200',
    tag: 'bg-yellow-100 text-yellow-800',
  },
  {
    title: 'Troop Committee Member',
    desc: 'Support the troop\'s administrative needs — finances, equipment, planning, parent communication. Monthly meetings.',
    commit: '2–3 hrs/month',
    color: 'bg-blue-50 border-blue-200',
    tag: 'bg-blue-100 text-blue-800',
  },
  {
    title: 'Assistant Scoutmaster (ASM)',
    desc: 'Work directly with Scouts on campouts, hikes, and meetings. Requires Safeguarding Youth Training + leader training. Rewarding and hands-on.',
    commit: '4–8 hrs/month',
    color: 'bg-green-50 border-green-200',
    tag: 'bg-green-100 text-green-800',
  },
  {
    title: 'Event Support Volunteer',
    desc: 'Help with a single event — drive to a campout, cook a meal, assist with registration. No long-term commitment required.',
    commit: 'Per-event',
    color: 'bg-purple-50 border-purple-200',
    tag: 'bg-purple-100 text-purple-800',
  },
];

const COMMUNICATION = [
  { label: 'Troop Email List', desc: 'All announcements and trip info are sent to the troop Google Group. Ask your leader for the address.', icon: Mail },
  { label: 'Troop Website', desc: 'You\'re here! Calendar, documents, forms, and advancement resources are all on this site.', icon: ExternalLink },
  { label: 'WhatsApp Group', desc: 'The troop uses a WhatsApp group for quick updates. Ask the Scoutmaster for the invitation link.', icon: Phone },
];

const FAQ = [
  { q: 'What should my Scout wear to meetings?', a: 'Class A (full uniform) to all regular Monday meetings and Courts of Honor. Class B (troop t-shirt) for campouts and active events. See the Troop Guidelines page for the full uniform guide.' },
  { q: 'How do I pay troop dues?', a: 'Annual dues are $135 and due in January. Summer camp is paid separately. Use the Dues page on this website to notify the treasurer, then pay by check or Venmo as instructed.' },
  { q: 'What training do I need to attend campouts?', a: 'All adults on campouts must have a current Safeguarding Youth Training Certificate Course. It\'s free and takes about 90 minutes at my.scouting.org.' },
  { q: 'How does the rank advancement process work?', a: 'Scouts complete requirements with a merit badge counselor or leader, request a Scoutmaster Conference, then a Board of Review. See the Advancement page for details and request forms.' },
  { q: 'My Scout has special needs — is that okay?', a: 'Absolutely. Troop 1099 welcomes all Scouts. Contact the Scoutmaster to discuss accommodations before your first meeting so we can make the experience great from day one.' },
  { q: 'How do I become a Merit Badge Counselor?', a: 'Fill out the counselor sign-up form below and the Scoutmaster will follow up. You\'ll need the Safeguarding Youth Training Certificate Course and to register with the council — we\'ll walk you through it.' },
];

export default function ForParents() {
  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-1">Troop 1099</p>
          <h1 className="text-3xl font-bold">For Parents & Families</h1>
          <p className="text-white/70 mt-2 max-w-2xl">Everything you need to support your Scout — communication, volunteer opportunities, required training, and key resources all in one place.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        {/* Special Needs Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-3">
          <Heart className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-800">All Scouts Are Welcome</p>
            <p className="text-blue-700 text-sm mt-1">Troop 1099 welcomes Scouts of all abilities. If your Scout has special needs or requires accommodations, please contact the Scoutmaster before the first meeting. We will work with you to make their experience exceptional.</p>
            <Link to="/contact" className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-blue-700 hover:underline">Contact the Scoutmaster <ExternalLink className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Quick Links for Parents */}
        <section>
          <h2 className="font-bold text-[#1a2744] text-xl mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#FFD700]" /> Key Resources for Parents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Pay Dues', desc: 'Annual dues & summer camp fees', href: '/dues', internal: true },
              { label: 'Troop Calendar', desc: 'Upcoming events & meetings', href: '/events', internal: true },
              { label: 'Camping Checklists', desc: 'Packing lists, health forms, downloads', href: '/camping-checklist', internal: true },
              { label: 'Advancement Center', desc: 'Rank requirements & BOR requests', href: '/advancement', internal: true },
              { label: 'Summer Camp Info', desc: 'Dates, costs & registration', href: '/summer-camp', internal: true },
              { label: 'Safeguarding Youth Training', desc: 'Required for all adults on campouts', href: 'https://my.scouting.org', internal: false },
            ].map(link => (
              link.internal
                ? <Link key={link.label} to={link.href} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1a2744] hover:shadow-sm transition-all flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#1a2744] rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1a2744] text-sm">{link.label}</p>
                      <p className="text-xs text-gray-500">{link.desc}</p>
                    </div>
                  </Link>
                : <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1a2744] hover:shadow-sm transition-all flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#1a2744] rounded-lg flex items-center justify-center shrink-0">
                      <ExternalLink className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1a2744] text-sm">{link.label}</p>
                      <p className="text-xs text-gray-500">{link.desc}</p>
                    </div>
                  </a>
            ))}
          </div>
        </section>

        {/* Communication */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-xl mb-5 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#1a2744]" /> How We Communicate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMMUNICATION.map(item => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                <item.icon className="w-5 h-5 text-[#1a2744] mb-2" />
                <p className="font-bold text-[#1a2744] text-sm">{item.label}</p>
                <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Required Training */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-xl mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" /> Required Training for Adults
          </h2>
          <p className="text-gray-500 text-sm mb-5">Before attending any Scouting activity with Scouts, all adults must complete:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</span>
              <div>
                <p className="font-bold text-[#1a2744]">Safeguarding Youth Training Certificate Course</p>
                <p className="text-sm text-gray-600 mt-0.5">Free, ~90 minutes. Required every 2 years. No exceptions.</p>
                <a href="https://my.scouting.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-red-700 hover:underline">Complete at my.scouting.org <ExternalLink className="w-3 h-3" /></a>
              </div>
            </div>
            <p className="text-sm text-gray-500 pl-1">Scoutmasters and ASMs must also complete Scoutmaster Specifics and IOLS. See the <Link to="/leader-training" className="text-[#1a2744] underline">Leader Training page</Link> for the full sequence.</p>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section>
          <h2 className="font-bold text-[#1a2744] text-xl mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1a2744]" /> Volunteer Opportunities
          </h2>
          <p className="text-gray-500 text-sm mb-5">The troop runs on parent volunteers. Every role below makes a direct difference for Scouts.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VOLUNTEER_ROLES.map(role => (
              <div key={role.title} className={`rounded-xl border-2 p-5 ${role.color}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-[#1a2744]">{role.title}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${role.tag}`}>{role.commit}</span>
                </div>
                <p className="text-gray-600 text-sm">{role.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-[#1a2744] text-white rounded-xl p-5">
            <p className="font-bold mb-1">Interested in volunteering?</p>
            <p className="text-white/70 text-sm mb-3">Contact the Scoutmaster or fill out our contact form — we'd love to have you involved.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#FFD700] text-[#1a2744] font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors">
              Get in Touch
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-bold text-[#1a2744] text-xl mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1a2744]" /> Parent FAQ
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <p className="font-bold text-[#1a2744] text-sm mb-2">Q: {item.q}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}