import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Adventures', path: '/adventures' },
  { label: 'Calendar', path: '/events' },
  { label: 'Advancement', path: '/advancement' },
  { label: 'Contact', path: '/contact' },
];

export default function TacticalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a2744] shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-wide">
          <span className="text-[#FFD700] text-2xl">⚜</span>
          <span>TROOP 1099</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden md:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors"
          >
            Join Troop 1099
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a2744] border-t border-white/10">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 text-sm font-medium border-b border-white/10 ${
                location.pathname === link.path ? 'text-[#FFD700]' : 'text-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="p-4">
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
            >
              Join Troop 1099
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}