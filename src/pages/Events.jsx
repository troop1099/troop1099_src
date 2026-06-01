import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Download, FileText, ArrowRight } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const fallbackEvents = [
  { id: 'e1', title: 'Weekly Troop Meeting', date: '2026-06-08', type: 'meeting', location: 'Community Center', description: 'Regular troop meeting with skill-building activities and patrol time.' },
  { id: 'e2', title: 'Summer Camp — Camp Sequoyah', date: '2026-06-15', end_date: '2026-06-21', type: 'campout', location: 'Sequoyah Scout Reservation', description: 'Week-long summer camp with merit badge classes, swimming, and more.' },
  { id: 'e3', title: 'Community Service Day', date: '2026-06-22', type: 'service', location: 'Riverside Park', description: 'Trail maintenance and park cleanup for our adopted trail section.' },
  { id: 'e4', title: 'Night Hike & Navigation', date: '2026-07-05', type: 'hike', location: 'Appalachian Trail Spur', description: 'Nighttime navigation exercise using map, compass, and stars.' },
  { id: 'e5', title: 'Court of Honor', date: '2026-07-14', type: 'special', location: 'Community Center', description: 'Quarterly advancement ceremony recognizing scout achievements.' },
  { id: 'e6', title: 'Canoe Trip — New River', date: '2026-07-19', end_date: '2026-07-20', type: 'campout', location: 'New River Gorge, WV', description: 'Weekend canoe camping trip down the New River.' },
  { id: 'e7', title: 'Fundraiser: Popcorn Kickoff', date: '2026-08-01', type: 'fundraiser', location: 'Various Locations', description: 'Annual popcorn sale kickoff — help fund next year\'s adventures.' },
];

const resources = [
  { title: 'Permission Slip (General)', icon: FileText },
  { title: 'Medical Form A & B', icon: FileText },
  { title: 'Summer Camp Gear List', icon: FileText },
  { title: 'Camping Gear Checklist', icon: FileText },
  { title: 'Parent Handbook', icon: FileText },
];

const typeConfig = {
  meeting: { color: 'bg-foreground/10 text-foreground', label: 'Meeting' },
  campout: { color: 'bg-accent/15 text-accent', label: 'Campout' },
  hike: { color: 'bg-accent/15 text-accent', label: 'Hike' },
  service: { color: 'bg-foreground/10 text-foreground', label: 'Service' },
  fundraiser: { color: 'bg-foreground/10 text-foreground', label: 'Fundraiser' },
  special: { color: 'bg-accent/15 text-accent', label: 'Special' },
};

export default function Events() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('date', 50),
    initialData: [],
  });

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  return (
    <div className="pt-24 md:pt-32">
      {/* Header */}
      <section className="px-[5vw] md:px-[10vw] pb-16 md:pb-24 topo-pattern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Muster Station
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight">
            Events & Resources
          </h1>
        </motion.div>
      </section>

      {/* Split pane: Timeline + Resources */}
      <section className="px-[5vw] md:px-[10vw] pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Timeline */}
          <div className="lg:col-span-7">
            <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-8">
              Upcoming Schedule
            </p>
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[31px] top-0 bottom-0 w-px bg-border" />

              <div className="space-y-0">
                {displayEvents.map((event, i) => {
                  const cfg = typeConfig[event.type] || typeConfig.meeting;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="relative flex gap-6 pb-8 group"
                    >
                      {/* Timeline dot */}
                      <div className="relative z-10 shrink-0 w-16 flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full border-2 border-accent bg-background group-hover:bg-accent transition-colors" />
                      </div>

                      <div className="flex-1 -mt-1 pb-6 border-b border-border/50">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-heading text-xs tracking-wider text-muted-foreground">
                              {format(new Date(event.date), 'EEEE, MMMM d')}
                              {event.end_date && ` — ${format(new Date(event.end_date), 'MMMM d')}`}
                            </p>
                            <h3 className="font-heading font-semibold text-lg text-foreground mt-1 group-hover:text-accent transition-colors">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`font-heading text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-sm ${cfg.color}`}>
                                {cfg.label}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                            {event.description && (
                              <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resource Vault */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-8">
                Resource Vault
              </p>
              <div className="bg-muted/50 rounded-sm p-6 space-y-4">
                {resources.map((resource, i) => (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group flex items-center gap-4 p-3 rounded-sm hover:bg-background transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center shrink-0">
                      <resource.icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-heading text-sm text-foreground group-hover:text-accent transition-colors flex-1">
                      {resource.title}
                    </span>
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-secondary rounded-sm">
                <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-3">
                  Meeting Info
                </p>
                <p className="font-heading font-semibold text-secondary-foreground">
                  Every Monday at 7:00 PM
                </p>
                <p className="font-body text-sm text-secondary-foreground/60 mt-1">
                  Community Center, Room 204
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="font-heading text-xs text-secondary-foreground/60">
                    September through June
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}