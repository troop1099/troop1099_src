import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import {
  DollarSign, FileText, Users, BookOpen, Calendar,
  Megaphone, ChevronRight, ClipboardList, Package, MapPin, Tent
} from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Pay Dues', icon: DollarSign, color: 'text-yellow-600 bg-yellow-50', href: '/dues', internal: true },
  { label: 'Request BOR / SMC', icon: Users, color: 'text-red-600 bg-red-50', href: '/advancement', internal: true },
  { label: 'Merit Badges', icon: BookOpen, color: 'text-teal-600 bg-teal-50', href: '/merit-badges', internal: true },
  { label: 'Blue Card PDF', icon: FileText, color: 'text-blue-600 bg-blue-50', href: 'https://bsatroop143.com/wp-content/uploads/2024/08/mb-app-blue-card-fillable_.pdf', internal: false },
  { label: 'ScoutBook', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50', href: 'https://advancements.scouting.org/', internal: false },
  { label: 'Outing Manager', icon: Tent, color: 'text-green-600 bg-green-50', href: '/outing-manager', internal: true },
  { label: 'Gear Checkout', icon: Package, color: 'text-orange-600 bg-orange-50', href: '/gear-checkout', internal: true },
  { label: 'Documents', icon: ClipboardList, color: 'text-purple-600 bg-purple-50', href: '/documents', internal: true },
];

export default function Dashboard() {
  const { data: events = [] } = useQuery({
    queryKey: ['upcoming_events_dashboard'],
    queryFn: () => base44.entities.Event.list('date', 50),
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements_dashboard'],
    queryFn: () => base44.entities.Announcement.list('-created_date', 5),
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const upcomingEvents = events.filter(e => e.date >= today).slice(0, 4);

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-1">Troop 1099</p>
          <h1 className="text-3xl font-bold">Member Dashboard</h1>
          <p className="text-white/60 mt-1 text-sm">Quick access to everything you need.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Quick Links grid */}
        <section>
          <h2 className="font-bold text-[#1a2744] text-base mb-3 uppercase tracking-wide text-xs text-gray-500">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_LINKS.map(link => {
              const Icon = link.icon;
              const inner = (
                <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-[#1a2744] transition-all text-center group">
                  <div className={`w-10 h-10 rounded-full ${link.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#1a2744] leading-tight">{link.label}</span>
                </div>
              );
              return link.internal
                ? <Link key={link.label} to={link.href}>{inner}</Link>
                : <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{inner}</a>;
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1a2744] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FFD700]" /> Upcoming Events
              </h2>
              <Link to="/events" className="text-xs text-gray-400 hover:text-[#1a2744] flex items-center gap-1">
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
                      <span className="text-[#FFD700] text-[10px] font-bold leading-none uppercase">
                        {format(new Date(event.date + 'T12:00:00'), 'MMM')}
                      </span>
                      <span className="text-white text-sm font-bold leading-none">
                        {format(new Date(event.date + 'T12:00:00'), 'd')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a2744] text-sm">{event.title}</p>
                      {event.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{event.location}
                        </p>
                      )}
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

        {/* Meeting info bar */}
        <div className="bg-[#1a2744] text-white rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-1">Regular Meetings</p>
            <p className="font-bold text-lg">Every Monday · 7:00 – 8:30 PM</p>
            <p className="text-white/60 text-sm">Lanier United Methodist Church, Cumming GA</p>
          </div>
          <a href="https://maps.google.com/?q=Lanier+United+Methodist+Church+Cumming+GA" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap">
            <MapPin className="w-4 h-4 text-[#FFD700]" /> View on Maps
          </a>
        </div>
      </div>
    </div>
  );
}