import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FOREST_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/076ef4343_generated_6a7495a0.png';

export default function CTASection() {
  return (
    <section className="relative py-32 md:py-44 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={FOREST_IMAGE}
          alt="Aerial view of a winding forest trail through dense pine trees in autumn"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#142319]/70" />
      </div>

      <div className="relative z-10 px-[5vw] md:px-[10vw] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <p className="font-heading text-xs tracking-[0.3em] uppercase text-[#D95D39] mb-6">
            Join the Journey
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
            Every Great Leader Started with a Single Step
          </h2>
          <p className="font-body text-white/60 text-lg mt-6 leading-relaxed">
            Ready to begin your scouting adventure? We welcome boys of all backgrounds
            to discover their potential through Troop 1099.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 mt-10 px-8 py-4 bg-[#D95D39] text-white font-heading font-semibold text-sm tracking-wider uppercase rounded-sm hover:bg-[#D95D39]/90 transition-colors group"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}