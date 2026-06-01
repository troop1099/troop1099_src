import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Users, Award, Flame } from 'lucide-react';

const stats = [
  { icon: Mountain, value: '50+', label: 'Campouts Per Year' },
  { icon: Users, value: '60+', label: 'Active Scouts' },
  { icon: Award, value: '25+', label: 'Eagle Scouts' },
  { icon: Flame, value: '20', label: 'Years of Adventure' },
];

export default function MissionSection() {
  return (
    <section className="relative py-24 md:py-36 px-[5vw] md:px-[10vw] topo-pattern">
      {/* Compass rule */}
      <div className="absolute top-0 left-[10vw] w-px h-24 bg-accent/20" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Our Mission
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground">
              Forging Character<br />
              <span className="text-accent">Beyond the Trail</span>
            </h2>
          </motion.div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="font-body text-lg md:text-xl text-muted-foreground leading-[1.65]">
              Troop 1099 is more than a scouting unit — we are an incubator for the leaders
              of tomorrow. Through wilderness expeditions, community service, and a commitment
              to the Scout Oath, our scouts develop the resilience, skills, and character that
              define exceptional young men.
            </p>
            <p className="font-body text-lg text-muted-foreground leading-[1.65] mt-6">
              Every campfire, every summit, every service project is a step on the
              path to becoming the best version of themselves.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 md:mt-28">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center md:text-left"
          >
            <stat.icon className="w-5 h-5 text-accent mb-3 mx-auto md:mx-0" />
            <p className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              {stat.value}
            </p>
            <p className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}