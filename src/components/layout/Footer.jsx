import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary text-secondary-foreground relative">
      {/* Topo pattern */}
      <div className="absolute inset-0 topo-pattern opacity-10 pointer-events-none" />
      
      <div className="relative z-10 px-[5vw] md:px-[10vw] py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <h3 className="font-heading font-bold text-2xl tracking-wider mb-4">
              TROOP 1099
            </h3>
            <p className="font-body text-secondary-foreground/60 text-lg leading-relaxed max-w-sm">
              Building leaders through outdoor adventure, community service, and the timeless values of the Scouting tradition.
            </p>
            <div className="mt-8 flex items-center gap-6 text-sm text-secondary-foreground/40">
              <span className="font-heading tracking-wider uppercase text-xs">Est. 2005</span>
              <span className="w-8 h-px bg-accent/30" />
              <span className="font-heading tracking-wider uppercase text-xs">Boy Scouts of America</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:col-start-7">
            <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-6">
              Explore
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Adventures', path: '/adventures' },
                { label: 'Upcoming Events', path: '/events' },
                { label: 'Trail to Eagle', path: '/advancement' },
                { label: 'About Our Troop', path: '/about' },
                { label: 'Contact Us', path: '/contact' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-heading text-sm text-secondary-foreground/60 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-6">
              Reach Us
            </p>
            <div className="flex flex-col gap-4 text-sm text-secondary-foreground/60">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>Meeting Location TBD<br />Every Monday, 7:00 PM</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>troop1099@bsa.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>(555) 109-9000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-heading text-xs text-secondary-foreground/30 tracking-wider">
            © {new Date().getFullYear()} BSA TROOP 1099. ALL RIGHTS RESERVED.
          </p>

          {/* Back to top knot */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-secondary-foreground/40 hover:text-accent transition-colors"
            aria-label="Back to top"
          >
            <span className="font-heading text-xs tracking-wider uppercase">Summit</span>
            <div className="w-11 h-11 rounded-full border border-secondary-foreground/20 group-hover:border-accent flex items-center justify-center transition-all group-hover:-translate-y-1">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}