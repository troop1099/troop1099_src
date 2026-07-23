import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';

const NAV = [
  {
    label: 'About',
    links: [
      { label: 'About the Troop', path: '/about' },
      { label: 'Leadership', path: '/leadership' },
      { label: 'Eagles Nest', path: '/eagles' },
      { label: 'Adventures', path: '/adventures' },
      { label: 'Photo Gallery', path: '/photos' },
      { label: 'Contact Us', path: '/contact' },
    ],
  },
  { label: 'Calendar', path: '/events' },
  {
    label: 'Advancement',
    links: [
      { label: 'Advancement Center', path: '/advancement' },
      { label: 'Merit Badges', path: '/merit-badges' },
      { label: 'Life to Eagle', path: '/life-to-eagle' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'New Scout Info', path: '/new-scout' },
      { label: 'Troop Guidelines', path: '/guidelines' },
      { label: 'Outing Prep Guides', path: '/outing-prep' },
      { label: 'Camping Checklist', path: '/camping-checklist' },
      { label: 'Summer Camp', path: '/summer-camp' },
      { label: 'Gear Shop', path: '/gear' },
      { label: 'Gear Checkout', path: '/gear-checkout' },
    ],
  },
  {
    label: 'Parents',
    links: [
      { label: 'For Parents', path: '/for-parents' },
      { label: 'Dues & Payments', path: '/dues' },
      { label: 'Pine Straw Fundraiser', path: '/pinestraw' },
    ],
  },
  {
    label: 'Leaders',
    links: [
      { label: 'PLC & Leadership Roles', path: '/plc-roles' },
      { label: 'Leader Training', path: '/leader-training' },
      { label: 'Troop Policies', path: '/policies' },
      { label: 'Outing Manager', path: '/outing-manager' },
    ],
  },
];

export default function TacticalNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const isGroupActive = (links) => links?.some((l) => isActive(l.path));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a2744] shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-wide shrink-0">
          <img src={LOGO} alt="Troop 1099" className="w-9 h-9 rounded-full object-contain bg-white p-0.5" />
          <span className="hidden sm:inline">TROOP 1099</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className={`px-3 py-1 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(item.path)
                    ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className={`flex items-center gap-0.5 px-3 py-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    openDropdown === item.label || isGroupActive(item.links)
                      ? 'text-[#FFD700]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === item.label && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                    <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 min-w-[200px] py-2">
                      {item.links.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setOpenDropdown(null)}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActive(link.path)
                              ? 'text-[#1a2744] font-semibold bg-yellow-50'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-[#1a2744]'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          )}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/contact" className="hidden lg:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors">
            Join Troop 1099
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white p-1" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#1a2744] border-t border-white/10 max-h-[80vh] overflow-y-auto">
          {NAV.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm font-medium border-b border-white/10 ${
                  isActive(item.path) ? 'text-[#FFD700]' : 'text-white/80'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <div key={item.label}>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium border-b border-white/10 ${
                    isGroupActive(item.links) ? 'text-[#FFD700]' : 'text-white/80'
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded === item.label && (
                  <div className="bg-white/5">
                    {item.links.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-8 py-2.5 text-sm border-b border-white/5 ${
                          isActive(link.path) ? 'text-[#FFD700]' : 'text-white/70'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
          <div className="p-4">
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-center bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded">
              Join Troop 1099
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}