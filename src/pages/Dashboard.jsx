import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  DollarSign, FileText, Users, BookOpen, Calendar,
  ExternalLink, Megaphone, ChevronRight, ClipboardList
} from 'lucide-react';
import { format } from 'date-fns';

const QUICK_LINKS = [
  {
    label: 'Pay Dues',
    description: 'Annual dues & summer camp',
    icon: DollarSign,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    iconBg: 'bg-yellow-100',
    href: '/dues',
    internal: true,
  },
  {
    label: 'Blue Card PDF',
    description: 'Download a blank Blue Card',
    icon: FileText,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    iconBg: 'bg-blue-100',
    href: 'https://filestore.scouting.org/filestore/pdf/34124.pdf',
    internal: false,
  },
  {
    label: 'Request BOR',
    description: 'Board of Review request',
    icon: Users,
    color: 'bg-red-50 border-red-200 text-red-700',
    iconBg: 'bg-red-100',
    href: '/advancement',
    internal: true,
  },
  {
    label: 'SM Conference',
    description: 'Scoutmaster Conference request',
    icon: ClipboardList,
    color: 'bg-green-50 border-green-200 text-green-700',
    iconBg: 'bg-green-100',
    href: '/advancement',
    internal: true,
  },
  {
    label: 'ScoutBook',
    description: 'Track your advancement',
    icon: BookOpen,
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    iconBg: 'bg-indigo-100',
    href: 'https://www.scoutbook.scouting.org/',
    internal: false,
  },
  {
    label: 'Troop Calendar',
    description: 'View & subscribe via iCal',
    icon: Calendar,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    iconBg: 'bg-purple-100',
    href: '/events',
    internal: true,
  },
  {
    label: 'Documents & Forms',
    description: 'Packing lists, health forms',
    icon: FileText,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    iconBg: 'bg-orange-100',
    href: '/documents',
    internal: true,
  },
  {
    label: 'Merit Badges',
    description: 'Eagle-required badge info',
    icon: BookOpen,
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    iconBg: 'bg-teal-100',
    href: '/merit-badges',
    internal: true,
  },
];

function QuickLinkCard({ link }) {
  const Icon = link.icon;
  const content = (
    <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${link.color} hover:shadow-md transition-all group cursor-pointer`}>
      <div className={`w-11 h-11 rounded-lg ${link.iconBg} flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-[#1a2744] leading-tight">{link.label}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{link.description}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
    </div>
  );

  if (link.internal) {
    return <Link to={link.href}>{content}</Link>;
  }
  return <a href={link.href} target="_blank" rel="noopener noreferrer">{content}</a>;
}

export default function Dashboard() {
  const { data: events = [] } = useQuery({
    queryKey: ['upcoming_events_dashboard'],
    queryFn: () => base44.entities.Event.list('date', 50),
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements_dashboard'],
    queryFn: () => base44.entities.Announcement.list('-created_date', 5),
  });

  const upcomingEvents = events
    .filter(e => e.date >= format(new Date(), 'yyyy-MM-dd'))
    .slice(0, 3);

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-1">Member Portal</p>
          <h1 className="text-3xl font-bold">Troop 1099 Dashboard</h1>
          <p className="text-white/70 mt-1">Quick access to everything you need.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Quick Links */}
        <section>
          <h2 className="font-bold text-[#1a2744] text-lg mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#FFD700] rounded-full inline-block"></span>
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_LINKS.map(link => (
              <QuickLinkCard key={link.label} link={link} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Upcoming Events */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1a2744] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FFD700]" /> Upcoming Events
              </h2>
              <Link to="/events" className="text-xs text-[#1a2744] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No upcoming events.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#1a2744] rounded-lg flex flex-col items-center justify-center shrink-0">
                      <span className="text-[#FFD700] text-xs font-bold leading-none">
                        {format(new Date(event.date + 'T12:00:00'), 'MMM').toUpperCase()}
                      </span>
                      <span className="text-white text-sm font-bold leading-none">
                        {format(new Date(event.date + 'T12:00:00'), 'd')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a2744] text-sm">{event.title}</p>
                      {event.location && <p className="text-xs text-gray-400">{event.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Announcements */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1a2744] flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-red-500" /> Announcements
              </h2>
            </div>
            {announcements.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No announcements yet.</p>
            ) : (
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="border-l-2 border-[#FFD700] pl-3">
                    <p className="font-semibold text-[#1a2744] text-sm">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.body}</p>
                    <p className="text-xs text-gray-300 mt-1">{format(new Date(a.created_date), 'MMM d, yyyy')}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}