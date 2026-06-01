import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRight, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const fallbackEvents = [
  { id: 'e1', title: 'Troop Meeting', date: '2026-06-08', time: '7:00 PM' },
  { id: 'e2', title: 'Fall Campout', date: '2026-06-15', time: '5:00 PM' },
  { id: 'e3', title: 'Service Project', date: '2026-06-22', time: '9:00 AM' },
];

const announcements = [
  { title: 'Dues Deadline Extended', date: 'Oct 1', body: 'Annual dues deadline moved to Oct 15.', color: 'border-yellow-400 bg-yellow-50' },
  { title: 'Summer Camp Signups', date: 'Sep 25', body: 'Deposits for Summer Camp 2024 are now being accepted.', color: 'border-yellow-400 bg-yellow-50' },
];

export default function UpcomingEvents() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('date', 5),
    initialData: [],
  });

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* News & Announcements */}
        <div>
          <h2 className="flex items-center gap-2 font-heading font-bold text-[#1a2744] text-xl mb-6">
            <Info className="w-5 h-5 text-[#1a2744]" />
            News &amp; Announcements
          </h2>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.title} className={`border-l-4 px-4 py-3 rounded-r ${a.color}`}>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-[#1a2744] text-sm">{a.title}</span>
                  <span className="text-xs text-red-600 font-semibold ml-4 shrink-0">{a.date}</span>
                </div>
                <p className="text-gray-600 text-xs mt-1">{a.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="border-l-4 border-[#1a2744] pl-4">
            <h2 className="font-heading font-bold text-[#1a2744] text-xl mb-5">Upcoming Events</h2>
            <div className="space-y-4">
              {displayEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="text-center w-10 shrink-0">
                    <p className="font-heading text-[10px] uppercase text-gray-500 tracking-wider">
                      {format(new Date(event.date), 'MMM')}
                    </p>
                    <p className="font-heading font-bold text-[#1a2744] text-2xl leading-none">
                      {format(new Date(event.date), 'd')}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a2744] text-sm">{event.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{event.time || '7:00 PM'}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1 text-[#1a2744] text-sm font-semibold mt-6 hover:text-red-600 transition-colors"
            >
              View Calendar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}