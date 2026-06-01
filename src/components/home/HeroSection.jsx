import React from 'react';
import { Link } from 'react-router-dom';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/27fa56982_generated_5ff523de.png';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '340px' }}>
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="BSA Troop 1099"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a2744]/65" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 md:py-28">
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-white leading-tight">
          BSA Troop 1099
        </h1>
        <p className="text-white/90 text-lg mt-3">
          Adventure, Leadership, Service | Cumming, GA
        </p>
        <p className="text-white/75 text-sm mt-1 font-medium">
          Meets Mondays 7:00 PM – 8:30 PM at Lanier United Methodist Church, Cumming, GA
        </p>
        <a
          href="https://maps.google.com/?q=Lanier+United+Methodist+Church+Cumming+GA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FFD700] text-xs mt-1 inline-block hover:underline"
        >
          📍 View on Google Maps
        </a>
        <Link
          to="/contact"
          className="mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded text-base transition-colors inline-block"
        >
          Join Troop 1099
        </Link>
      </div>
    </section>
  );
}