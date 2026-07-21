import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1a2744] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-3">
            <span className="text-[#FFD700] text-2xl">⚜</span>
            TROOP 1099
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Empowering young men to lead, serve, and explore the outdoors. A proud member of the Northeast Georgia Council.
          </p>
          <p className="text-white/40 text-xs mt-4">Cumming, GA</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading text-xs tracking-[0.2em] uppercase text-white/50 mb-4">Quick Links</h4>
          <nav className="flex flex-col gap-2">
            {[
              { label: 'Calendar', path: '/events' },
              { label: 'Forms & Docs', path: '/events' },
              { label: 'Advancement', path: '/advancement' },
              { label: 'Adventures', path: '/adventures' },
              { label: 'Contact Us', path: '/contact' },
            ].map(link => (
              <Link key={link.path + link.label} to={link.path} className="text-sm text-white/60 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Scouting Links */}
        <div>
          <h4 className="font-heading text-xs tracking-[0.2em] uppercase text-white/50 mb-4">Scouting Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: 'My.Scouting', href: 'https://my.scouting.org' },
              { label: 'Scoutbook', href: 'https://scoutbook.scouting.org' },
              { label: 'Northeast Georgia Council', href: 'https://www.nega.org' },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-white/30 text-xs">
        © {new Date().getFullYear()} BSA Troop 1099 · Cumming, GA · All Rights Reserved
      </div>
    </footer>
  );
}