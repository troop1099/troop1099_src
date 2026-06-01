import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Adventures', path: '/adventures' },
  { label: 'Events', path: '/events' },
  { label: 'Trail to Eagle', path: '/advancement' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function TacticalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="flex items-center justify-between px-[5vw] md:px-[10vw]">
          <Link to="/" className="flex items-center gap-3 group">
            {scrolled ? (
              <Compass className="w-7 h-7 text-accent transition-transform group-hover:rotate-45 duration-500" />
            ) : (
              <span className="font-heading font-bold text-lg tracking-wider text-foreground">
                TROOP 1099
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-sm hover:bg-foreground/5 transition-colors"
            aria-label="Open menu"
          >
            <Menu className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-foreground'}`} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-secondary flex flex-col"
          >
            {/* Topo pattern overlay */}
            <div className="absolute inset-0 topo-pattern opacity-20 pointer-events-none" />

            {/* Compass lines */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-accent/10" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-accent/10" />

            <div className="flex items-center justify-between px-[5vw] md:px-[10vw] py-5 relative z-10">
              <span className="font-heading font-bold text-lg tracking-wider text-secondary-foreground">
                TROOP 1099
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-secondary-foreground" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-[10vw] md:px-[20vw] relative z-10">
              <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-10">
                Navigate
              </p>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    className={`block font-heading text-3xl md:text-5xl font-bold py-3 md:py-4 transition-colors hover:text-accent ${
                      location.pathname === link.path
                        ? 'text-accent'
                        : 'text-secondary-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-[10vw] md:px-[20vw] py-8 relative z-10">
              <div className="h-px bg-accent/20 mb-6" />
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="font-body text-sm text-secondary-foreground/60">
                  BSA Troop 1099 · Chartered 2005
                </p>
                <p className="font-heading text-xs tracking-[0.2em] uppercase text-accent">
                  Leadership Born in the Wild
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}