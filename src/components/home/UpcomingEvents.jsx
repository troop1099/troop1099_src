import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRight, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function UpcomingEvents() {
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('date', 50),
    initialData: [],
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= today)
    .slice(0, 3);

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => base44.entities.Announcement.list('-created_date', 5),
    initialData: [],
  });

  const { data: calendarSetting } = useQuery({
    queryKey: ['setting', 'google_calendar_id'],
    queryFn: async () => {
      const results = await base44.entities.Setting.filter({ key: 'google_calendar_id' });
      return results[0] || null;
    },
  });

  const calendarId = calendarSetting?.value || '';

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* News & Announcements */}
        <div>
          <h2 className="flex items-center gap-2 font-heading font-bold text-[#1a2744] text-xl mb-6">
            <Info className="w-5 h-5 text-[#1a2744]" />
            News &amp; Announcements
          </h2>
          {announcements.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No announcements at this time.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="border-l-4 border-yellow-400 bg-yellow-50 px-4 py-3 rounded-r">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-[#1a2744] text-sm">{a.title}</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">{a.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="border-l-4 border-[#1a2744] pl-4">
            <h2 className="font-heading font-bold text-[#1a2744] text-xl mb-5">Upcoming Events</h2>
            {calendarId ? (
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <iframe
                  src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=America%2FNew_York&showNav=1&showTitle=0&showPrint=0&showCalendars=0&mode=AGENDA&height=400`}
                  style={{ border: 0 }}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  scrolling="no"
                  title="Troop 1099 Calendar"
                />
              </div>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No upcoming events scheduled.</p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
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
            )}
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