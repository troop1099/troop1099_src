import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/27fa56982_generated_5ff523de.png';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background image with parallax-like effect */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Scouts hiking along a mountain ridge at dawn with golden hour lighting"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142319]/80 via-[#142319]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#142319]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 px-[5vw] md:px-[10vw]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p className="font-heading text-xs md:text-sm tracking-[0.4em] uppercase text-[#D95D39] mb-4 md:mb-6">
            BSA Troop 1099
          </p>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tight max-w-4xl">
            LEADERSHIP
            <br />
            <span className="text-[#D95D39]">BORN</span> IN
            <br />
            THE WILD
          </h1>
          <p className="font-body text-white/60 text-lg md:text-xl mt-6 md:mt-8 max-w-lg leading-relaxed">
            Where young men forge character through adventure, service, and the pursuit of the horizon.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </div>

      {/* Compass rule lines */}
      <div className="absolute bottom-0 left-[10vw] w-px h-32 bg-gradient-to-t from-[#D95D39]/40 to-transparent" />
      <div className="absolute bottom-16 left-[10vw] w-20 h-px bg-[#D95D39]/20" />
    </section>
  );
}