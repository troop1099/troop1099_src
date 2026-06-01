import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Ruler, Mountain, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const CAMPSITE_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/992b04127_generated_0a120ab2.png';
const LAKE_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/c2faee563_generated_06599f5b.png';
const CLIMBING_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/47557857d_generated_3bc0a702.png';
const COMPASS_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/ee891a942_generated_3427581d.png';

const fallbackAdventures = [
  {
    id: 'f1',
    title: 'Blue Ridge Summit Expedition',
    date: '2026-05-15',
    location: 'Blue Ridge Mountains, NC',
    distance: '14 Miles',
    elevation: '3,200 ft',
    skill: 'Navigation & Orienteering',
    description: 'A challenging ridge-line traverse through some of the most spectacular scenery in the Appalachians. Scouts practiced advanced map-and-compass skills while summiting three peaks.',
    image_url: CAMPSITE_IMAGE,
  },
  {
    id: 'f2',
    title: 'Boundary Waters Canoe Trip',
    date: '2026-04-20',
    location: 'Northern Minnesota',
    distance: '32 Miles',
    elevation: 'Water Level',
    skill: 'Canoeing & Portage',
    description: 'Five days paddling through pristine wilderness lakes with portages between waterways. Scouts earned their Canoeing merit badge while immersed in raw nature.',
    image_url: LAKE_IMAGE,
  },
  {
    id: 'f3',
    title: 'Red River Gorge Rock Craft',
    date: '2026-03-10',
    location: 'Red River Gorge, KY',
    distance: '8 Miles',
    elevation: '1,800 ft',
    skill: 'Climbing & Rappelling',
    description: 'Introduction to technical rock climbing on natural sandstone faces. Every scout completed at least one lead climb and a 60-foot rappel.',
    image_url: CLIMBING_IMAGE,
  },
  {
    id: 'f4',
    title: 'Winter Survival Camp',
    date: '2026-02-05',
    location: 'Shenandoah Valley, VA',
    distance: '6 Miles',
    elevation: '900 ft',
    skill: 'Cold Weather Survival',
    description: 'A test of grit and preparedness. Scouts built emergency shelters, practiced fire-starting in wet conditions, and learned cold-weather first aid.',
    image_url: COMPASS_IMAGE,
  },
];

export default function Adventures() {
  const { data: adventures } = useQuery({
    queryKey: ['adventures'],
    queryFn: () => base44.entities.Adventure.list('-date', 20),
    initialData: [],
  });

  const displayAdventures = adventures.length > 0 ? adventures : fallbackAdventures;

  return (
    <div className="pt-14">
      {/* Header */}
      <section className="px-[5vw] md:px-[10vw] pb-16 md:pb-24 topo-pattern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Adventure Log
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight">
            Where We've Been
          </h1>
          <p className="font-body text-lg text-muted-foreground mt-4 max-w-xl leading-relaxed">
            Every expedition is a chapter in our story. These are the trails we've conquered,
            the skills we've mastered, and the memories we've forged.
          </p>
        </motion.div>
      </section>

      {/* Z-Pattern Adventures */}
      <section className="px-[5vw] md:px-[10vw] pb-24 md:pb-36">
        <div className="space-y-20 md:space-y-32">
          {displayAdventures.map((adventure, i) => (
            <motion.div
              key={adventure.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${
                i % 2 === 1 ? 'md:direction-rtl' : ''
              }`}
            >
              {/* Image */}
              <div className={`md:col-span-7 ${i % 2 === 1 ? 'md:col-start-6' : ''}`}>
                <div className="relative group overflow-hidden rounded-sm aspect-[3/2]">
                  <img
                    src={adventure.image_url || CAMPSITE_IMAGE}
                    alt={adventure.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Tech spec overlay */}
                  <div className="absolute inset-0 bg-[#142319]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="grid grid-cols-2 gap-4 text-white/80 text-sm font-heading w-full">
                      <div>
                        <p className="text-[10px] tracking-wider uppercase text-accent">Distance</p>
                        <p className="font-semibold">{adventure.distance || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-wider uppercase text-accent">Elevation</p>
                        <p className="font-semibold">{adventure.elevation || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-wider uppercase text-accent">Skill Focus</p>
                        <p className="font-semibold">{adventure.skill || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-wider uppercase text-accent">Location</p>
                        <p className="font-semibold">{adventure.location || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field Notes */}
              <div className={`md:col-span-4 ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : 'md:col-start-9'}`}>
                <div className="space-y-4">
                  <p className="font-heading text-xs tracking-wider text-accent uppercase">
                    {adventure.date ? format(new Date(adventure.date), 'MMMM d, yyyy') : ''}
                  </p>
                  <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground leading-tight">
                    {adventure.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="font-heading text-sm">{adventure.location}</span>
                  </div>
                  <p className="font-body text-muted-foreground leading-[1.65]">
                    {adventure.description}
                  </p>

                  {/* Tech specs */}
                  <div className="pt-4 border-t border-border flex gap-6">
                    {adventure.distance && (
                      <div>
                        <p className="font-heading text-[10px] tracking-wider text-muted-foreground uppercase">Dist</p>
                        <p className="font-heading font-semibold text-foreground">{adventure.distance}</p>
                      </div>
                    )}
                    {adventure.elevation && (
                      <div>
                        <p className="font-heading text-[10px] tracking-wider text-muted-foreground uppercase">Elev</p>
                        <p className="font-heading font-semibold text-foreground">{adventure.elevation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}