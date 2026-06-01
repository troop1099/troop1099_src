import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Leadership', path: '/leadership' },
  { label: 'Calendar', path: '/events' },
  { label: 'Advancement', path: '/advancement' },
  { label: 'Eagles', path: '/eagles' },
  { label: 'Merit Badges', path: '/merit-badges' },
  { label: 'Gear', path: '/gear' },
];

const moreLinks = [
  { label: 'Adventures', path: '/adventures' },
  { label: 'New Scout Info', path: '/new-scout' },
  { label: 'Troop Guidelines', path: '/guidelines' },
  { label: 'Life to Eagle', path: '/life-to-eagle' },
  { label: 'Contact', path: '/contact' },
];

export default function TacticalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a2744] shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-wide shrink-0">
          <span className="text-[#FFD700] text-2xl">⚜</span>
          <span>TROOP 1099</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-2.5 py-1 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive(link.path)
                  ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(o => !o)}
              className="flex items-center gap-0.5 px-2.5 py-1 text-sm font-medium text-white/80 hover:text-white"
            >
              MORE <ChevronDown className="w-3 h-3" />
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white rounded shadow-lg border border-gray-200 z-20 min-w-[180px]">
                  {moreLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1a2744]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/contact" className="hidden lg:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors">
            Join Troop 1099
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-1" aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#1a2744] border-t border-white/10 max-h-[80vh] overflow-y-auto">
          {[...navLinks, ...moreLinks].map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 text-sm font-medium border-b border-white/10 ${isActive(link.path) ? 'text-[#FFD700]' : 'text-white/80'}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="p-4">
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-center bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded">
              Join Troop 1099
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}