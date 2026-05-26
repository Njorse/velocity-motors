import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const NAV_LINKS = [
  { label: 'Modelos', href: '#modelos' },
  { label: 'Showroom', href: '#showroom' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Financiación', href: '#financiacion' },
  { label: 'Contacto', href: '#contacto' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-3 group" aria-label="Velocity Motors Home">
              <div className="w-8 h-8 bg-red-600 flex items-center justify-center font-black text-white text-sm font-display rotate-45 group-hover:rotate-0 transition-transform duration-500">
                V
              </div>
              <span className="font-display font-black text-white uppercase tracking-[0.15em] text-sm md:text-base">
                Velocity <span className="text-red-600">Motors</span>
              </span>
            </button>

            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href.replace('#', ''))}
                    className="text-zinc-400 hover:text-white font-display font-semibold uppercase tracking-[0.12em] text-xs transition-colors duration-300 relative group bg-transparent border-none cursor-pointer"
                    style={{ background: 'none' }}
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </li>
              ))}
            </ul>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollTo('contacto')}
                className="hidden lg:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-display font-bold uppercase tracking-widest text-xs px-6 py-3 transition-all duration-300 group border-none cursor-pointer"
              >
                Test Drive
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileOpen(o => !o)}
                className="lg:hidden text-white p-2"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-zinc-950 border-t border-zinc-800 overflow-hidden"
            >
              <ul className="flex flex-col py-4 px-4 gap-1">
                {NAV_LINKS.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => { scrollTo(link.href.replace('#', '')); setMobileOpen(false); }}
                      className="block w-full text-left py-3 px-4 text-zinc-300 hover:text-white hover:bg-zinc-900 font-display font-bold uppercase tracking-widest text-sm transition-all border-l-2 border-transparent hover:border-red-600 bg-transparent border-0 cursor-pointer"
                      style={{ background: 'none', borderLeft: '2px solid transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#dc2626'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#18181b'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.color = '#d4d4d8'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                <li className="mt-4">
                  <button
                    onClick={() => { scrollTo('contacto'); setMobileOpen(false); }}
                    className="block w-full py-4 px-4 bg-red-600 text-white font-display font-bold uppercase tracking-widest text-sm text-center border-none cursor-pointer"
                  >
                    Agendar Test Drive
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
