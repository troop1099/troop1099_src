import React from 'react';
import { Link } from 'react-router-dom';

const TROOP_PHOTO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/ce0b69cb3_Screenshot2026-06-01at100800PM.png';
const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '420px' }}>
      <div className="absolute inset-0">
        <img
          src={TROOP_PHOTO}
          alt="BSA Troop 1099"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#1a2744]/70" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 md:py-28">
        <img src={LOGO} alt="Troop 1099 Logo" className="w-24 h-24 rounded-full object-contain bg-white/10 backdrop-blur p-2 mb-4 border-2 border-[#FFD700]/50" />
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
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          <a
            href="/dues"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded text-base transition-colors"
          >
            Join Troop 1099
          </a>
          <Link
            to="/about"
            className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-6 py-3 rounded text-base transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}