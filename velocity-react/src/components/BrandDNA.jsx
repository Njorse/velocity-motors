import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Wrench, Award, Clock, Car, HeartHandshake } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12 } }),
};

const PILLARS = [
  { icon: Shield, title: 'Ingeniería de Precisión', desc: 'Cada vehículo pasa por 240 puntos de inspección técnica antes de llegar al showroom.' },
  { icon: Award, title: 'Garantía Extendida', desc: '5 años de garantía completa en todos los modelos de la Colección 2026.' },
  { icon: Wrench, title: 'Taller Certificado', desc: 'Servicio post-venta con técnicos especializados y piezas 100% originales.' },
  { icon: Clock, title: 'Entrega Express', desc: 'Delivery en 72 horas hábiles para todos los modelos disponibles en stock.' },
  { icon: Car, title: 'Test Drive Premium', desc: 'Prueba tu modelo favorito en circuito cerrado o en carretera. Sin compromiso.' },
  { icon: HeartHandshake, title: 'Financiación a Medida', desc: 'Planes flexibles desde 0% de interés. Aprobación en 24 horas.' },
];

const BrandDNA = () => (
  <section id="servicios" className="w-full bg-zinc-950 border-t border-zinc-900 py-28 px-4 sm:px-8 overflow-hidden">
    <div className="max-w-7xl mx-auto">

      {/* Top split layout */}
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-[2px] bg-red-600" />
            <span className="text-red-500 font-display font-black uppercase tracking-[0.3em] text-xs">
              ADN de Marca
            </span>
          </div>
          <h2 className="font-display font-black uppercase tracking-tighter text-5xl sm:text-6xl text-white leading-[0.88] mb-6">
            No Vendemos<br />
            <span className="text-red-600">Autos.</span><br />
            Vendemos<br />Emociones.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
            En Velocity Motors creemos que un vehículo de lujo no es solo transporte.
            Es una declaración de quién eres, de lo que exiges de la vida. Cada línea,
            cada cilindro, cada decisión de ingeniería es un acto de rebeldía contra lo mediocre.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-6 sm:gap-6">
            <div className="flex flex-col">
              <span className="font-display font-black text-4xl text-red-600">12+</span>
              <span className="text-zinc-500 text-xs uppercase tracking-widest">Años en el mercado</span>
            </div>
            <div className="w-[1px] h-12 bg-zinc-800" />
            <div className="flex flex-col">
              <span className="font-display font-black text-4xl text-red-600">48</span>
              <span className="text-zinc-500 text-xs uppercase tracking-widest">Marcas asociadas</span>
            </div>
            <div className="w-[1px] h-12 bg-zinc-800" />
            <div className="flex flex-col">
              <span className="font-display font-black text-4xl text-red-600">#1</span>
              <span className="text-zinc-500 text-xs uppercase tracking-widest">Concesionaria premium</span>
            </div>
          </div>
        </motion.div>

        {/* Right image collage */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block h-[480px]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=900")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          <div className="absolute inset-0 border border-zinc-700" />
          {/* Red accent bar */}
          <div className="absolute bottom-0 left-0 h-1 w-1/3 bg-red-600" />
          {/* Floating spec card */}
          <div className="absolute bottom-6 right-6 bg-zinc-950/90 backdrop-blur-md border border-zinc-700 p-5 min-w-[180px]">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-1">Potencia máxima</p>
            <p className="font-display font-black text-white text-3xl">1,080<span className="text-red-600 text-lg ml-1">HP</span></p>
            <p className="text-zinc-400 text-xs mt-1">APEX COUPÉ · V12</p>
          </div>
        </motion.div>
      </div>

      {/* Pillars grid */}
      <div className="border-t border-zinc-900 pt-20">
        <div className="text-center mb-14">
          <span className="text-red-500 font-display font-black uppercase tracking-[0.3em] text-xs">Nuestros Servicios</span>
          <h3 className="font-display font-black uppercase tracking-tighter text-4xl sm:text-5xl text-white mt-3">
            La Experiencia Completa
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-zinc-800">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="group border-b border-r border-zinc-800 p-8 hover:bg-zinc-900/60 transition-all duration-400 relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 group-hover:w-full transition-all duration-500" />
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 group-hover:border-red-600 group-hover:bg-red-600/10 transition-all duration-300">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="font-display font-black uppercase tracking-tight text-white text-lg mb-3">{p.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="border-t border-b border-zinc-900 py-5 mt-20 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-12">
          {['SUPERCARS', 'SUV PREMIUM', 'SEDANES', 'ELÉCTRICOS', 'FINANCIACIÓN 0%', 'TEST DRIVE', 'GARANTÍA 5 AÑOS', 'TALLER CERTIFICADO'].concat(
            ['SUPERCARS', 'SUV PREMIUM', 'SEDANES', 'ELÉCTRICOS', 'FINANCIACIÓN 0%', 'TEST DRIVE', 'GARANTÍA 5 AÑOS', 'TALLER CERTIFICADO']
          ).map((t, i) => (
            <span key={i} className="inline-flex items-center gap-6 font-display font-black uppercase tracking-[0.3em] text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
              {t} <span className="text-red-700">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default BrandDNA;
