import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Ruler } from 'lucide-react';

const CAMPSITE_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/992b04127_generated_0a120ab2.png';
const LAKE_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/c2faee563_generated_06599f5b.png';
const CLIMBING_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/47557857d_generated_3bc0a702.png';

const adventures = [
  {
    title: 'Summit Expedition',
    location: 'Blue Ridge Mountains',
    distance: '14 Miles',
    image: CAMPSITE_IMAGE,
    alt: 'Scouts setting up camp in a forest clearing at dusk with warm campfire glow',
  },
  {
    title: 'Boundary Waters Canoe',
    location: 'Northern Minnesota',
    distance: '32 Miles',
    image: LAKE_IMAGE,
    alt: 'Pristine mountain lake at sunrise with a canoe on still water and misty mountains',
  },
  {
    title: 'Rock Craft Challenge',
    location: 'Red River Gorge',
    distance: '8 Miles',
    image: CLIMBING_IMAGE,
    alt: 'Scouts rock climbing on a natural cliff face with safety ropes during golden hour',
  },
];

export default function AdventurePreview() {
  return (
    <section className="relative py-24 md:py-36 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="absolute inset-0 topo-pattern opacity-10 pointer-events-none" />

      <div className="relative z-10 px-[5vw] md:px-[10vw]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Adventure Log
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-5xl leading-tight">
              Recent Expeditions
            </h2>
          </motion.div>
          <Link
            to="/adventures"
            className="mt-6 md:mt-0 group flex items-center gap-2 font-heading text-sm tracking-wider text-accent hover:text-accent/80 transition-colors"
          >
            View All Adventures
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {adventures.map((adventure, i) => (
            <motion.div
              key={adventure.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-5">
                <img
                  src={adventure.image}
                  alt={adventure.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Tech spec overlay on hover */}
                <div className="absolute inset-0 bg-[#142319]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div className="flex items-center gap-4 text-white/80 text-sm font-heading">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      {adventure.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-accent" />
                      {adventure.distance}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-heading font-semibold text-xl group-hover:text-accent transition-colors">
                {adventure.title}
              </h3>
              <p className="font-heading text-xs tracking-wider text-secondary-foreground/50 mt-1 uppercase">
                {adventure.location}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}