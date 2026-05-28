import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, ChevronDown } from 'lucide-react';

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const HERO_SLIDES = [
  {
    id: 1,
    title: 'GR SUPRA',
    subtitle: 'Toyota · Sport',
    tagline: 'La emoción pura del asfalto, reinventada',
    hp: 387,
    price: '$75,000',
    bg: 'https://di-uploads-pod11.dealerinspire.com/germaintoyotaofcolumbus/uploads/2025/07/Toyota-GR-Supra-Exterior.webp',
  },
  {
    id: 2,
    title: 'GT-R NISMO',
    subtitle: 'Nissan · Supercar',
    tagline: 'Tecnología de pista. Para las calles del Cusco',
    hp: 600,
    price: '$135,000',
    bg: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=2400',
  },
  {
    id: 3,
    title: 'EV6 GT',
    subtitle: 'Kia · Eléctrico',
    tagline: 'El futuro ya llegó al showroom',
    hp: 577,
    price: '$68,000',
    bg: 'https://www.kia.com/content/dam/kia/us/en/vehicles/ev6/2025/mep/in-page-gallery/my25-ev6-in-page-gallery-asset-carousel-02.jpg',
  },
];

const STATS = [
  { value: '12+', label: 'Años de experiencia' },
  { value: '2,400+', label: 'Vehículos entregados' },
  { value: '98%', label: 'Clientes satisfechos' },
  { value: '24/7', label: 'Soporte premium' },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-zinc-950">
      {/* Background slides */}
      {HERO_SLIDES.map((s, i) => (
        <motion.div
          key={s.id}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${s.bg}")` }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: i === current ? 0.55 : 0, scale: i === current ? 1 : 1.05 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-red-600/15 rounded-full blur-[100px] z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center flex-1 max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-16">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Kicker */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-[2px] bg-red-600" />
            <span className="font-display font-bold uppercase tracking-[0.35em] text-red-500 text-xs flex items-center gap-2">
              <Zap className="w-3 h-3" /> {slide.subtitle} · Colección 2026
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black uppercase tracking-tighter text-white leading-[0.85] text-6xl sm:text-8xl lg:text-[9rem] mb-4">
            {slide.title}
          </h1>

          {/* Tagline */}
          <p className="text-zinc-300 text-lg sm:text-xl font-light mb-3 max-w-xl leading-relaxed">
            {slide.tagline}
          </p>

          {/* Specs pill */}
          <div className="flex items-center gap-6 mb-10">
            <span className="inline-flex items-center gap-2 bg-zinc-900/70 border border-zinc-800 px-4 py-2 text-sm font-display font-bold text-white uppercase tracking-widest">
              <span className="text-red-500">{slide.hp}</span> HP
            </span>
            <span className="inline-flex items-center gap-2 bg-zinc-900/70 border border-zinc-800 px-4 py-2 text-sm font-display font-bold text-zinc-300 uppercase tracking-widest">
              Desde {slide.price}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo('modelos')}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-display font-bold uppercase tracking-widest text-sm px-8 py-4 transition-all duration-300 relative overflow-hidden border-none cursor-pointer"
            >
              <span className="relative z-10">Explorar Catálogo</span>
              <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </button>
            <button
              onClick={() => scrollTo('contacto')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-transparent border border-zinc-600 hover:border-white hover:bg-white/5 text-white font-display font-bold uppercase tracking-widest text-sm px-8 py-4 transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              Agendar Test Drive
            </button>
          </div>
        </motion.div>
      </div>

      {/* Slide dots */}
      <div className="relative z-20 flex justify-center gap-3 pb-8">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-[3px] transition-all duration-500 ${i === current ? 'w-10 bg-red-600' : 'w-4 bg-zinc-700 hover:bg-zinc-500'}`}
          />
        ))}
      </div>

      {/* Stats bar */}
      <div className="relative z-20 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4 divide-x divide-zinc-800">
          {STATS.map(s => (
            <div key={s.label} className="flex flex-col items-center text-center px-4">
              <span className="font-display font-black text-2xl md:text-3xl text-red-600">{s.value}</span>
              <span className="text-zinc-400 text-xs uppercase tracking-widest font-medium mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.button
        onClick={() => scrollTo('modelos')}
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-28 right-8 z-20 hidden lg:flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-display font-bold rotate-90 mb-2">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
