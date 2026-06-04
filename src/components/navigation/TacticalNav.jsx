import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Calendar', path: '/events' },
  { label: 'Advancement', path: '/advancement' },
  { label: 'Merit Badges', path: '/merit-badges' },
  { label: 'For Parents', path: '/for-parents' },
  { label: 'Dashboard', path: '/dashboard' },
];

const moreGroups = [
  {
    heading: 'Troop',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Leadership', path: '/leadership' },
      { label: 'Eagles Nest', path: '/eagles' },
      { label: 'Photo Gallery', path: '/photos' },
      { label: 'Adventures', path: '/adventures' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    heading: 'Scouts',
    links: [
      { label: 'Outing Prep', path: '/outing-prep' },
      { label: 'Camping Checklist', path: '/camping-checklist' },
      { label: 'PLC & Leadership', path: '/plc-roles' },
      { label: 'Life to Eagle', path: '/life-to-eagle' },
      { label: 'Summer Camp', path: '/summer-camp' },
      { label: 'Gear', path: '/gear' },
      { label: 'Gear Checkout', path: '/gear-checkout' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documents & Forms', path: '/documents' },
      { label: 'Troop Policies', path: '/policies' },
      { label: 'Leader Training', path: '/leader-training' },
      { label: 'Outing Manager', path: '/outing-manager' },
      { label: 'New Scout Info', path: '/new-scout' },
      { label: 'Troop Guidelines', path: '/guidelines' },
    ],
  },
  {
    heading: 'Fundraising',
    links: [
      { label: 'Pine Straw Orders', path: '/pinestraw' },
      { label: 'Dues & Payments', path: '/dues' },
    ],
  },
];

export default function TacticalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const allMoreLinks = moreGroups.flatMap(g => g.links);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a2744] shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-wide shrink-0">
          <img src="https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png" alt="Troop 1099" className="w-9 h-9 rounded-full object-contain bg-white p-0.5" />
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
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-20 w-[520px] p-4">
                  <div className="grid grid-cols-4 gap-4">
                    {moreGroups.map(group => (
                      <div key={group.heading}>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{group.heading}</p>
                        <div className="space-y-0.5">
                          {group.links.map(link => (
                            <Link
                              key={link.path}
                              to={link.path}
                              onClick={() => setMoreOpen(false)}
                              className={`block px-2 py-1.5 text-sm rounded transition-colors ${isActive(link.path) ? 'text-[#1a2744] font-semibold bg-gray-100' : 'text-gray-700 hover:bg-gray-50 hover:text-[#1a2744]'}`}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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
          {[...navLinks, ...allMoreLinks].map(link => (
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