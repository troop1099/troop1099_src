import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const sampleEvents = [
  { title: 'Weekly Troop Meeting', date: '2026-06-08', type: 'meeting', location: 'Community Center' },
  { title: 'Summer Camp — Camp Sequoyah', date: '2026-06-15', type: 'campout', location: 'Sequoyah Scout Reservation' },
  { title: 'Community Service Day', date: '2026-06-22', type: 'service', location: 'Riverside Park' },
  { title: 'Night Hike & Navigation', date: '2026-07-05', type: 'hike', location: 'Appalachian Trail Spur' },
];

const typeColors = {
  meeting: 'bg-foreground/10 text-foreground',
  campout: 'bg-accent/10 text-accent',
  hike: 'bg-accent/10 text-accent',
  service: 'bg-foreground/10 text-foreground',
  fundraiser: 'bg-accent/10 text-accent',
  special: 'bg-accent/10 text-accent',
};

export default function UpcomingEvents() {
  return (
    <section className="relative py-24 md:py-36 px-[5vw] md:px-[10vw] topo-pattern">
      <div className="absolute top-0 right-[10vw] w-px h-24 bg-accent/20" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Muster Station
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl leading-tight text-foreground">
            Upcoming Events
          </h2>
        </motion.div>
        <Link
          to="/events"
          className="mt-6 md:mt-0 group flex items-center gap-2 font-heading text-sm tracking-wider text-accent hover:text-accent/80 transition-colors"
        >
          Full Calendar
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-0">
        {sampleEvents.map((event, i) => (
          <motion.div
            key={event.title + event.date}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group border-t border-border py-6 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-8 hover:bg-muted/50 -mx-6 px-6 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 text-center shrink-0">
                <p className="font-heading font-bold text-2xl text-foreground leading-none">
                  {format(new Date(event.date), 'd')}
                </p>
                <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase mt-0.5">
                  {format(new Date(event.date), 'MMM')}
                </p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`font-heading text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-sm ${typeColors[event.type]}`}>
                    {event.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-all md:group-hover:translate-x-1 hidden md:block" />
          </motion.div>
        ))}
        <div className="border-t border-border" />
      </div>
    </section>
  );
}