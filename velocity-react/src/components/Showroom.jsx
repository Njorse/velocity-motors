import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, Zap, ArrowUpRight, Gauge, Star } from 'lucide-react';

// ===== CATÁLOGO REAL — MARCAS DISPONIBLES EN PERÚ =====
const VEHICLES = [
  // TOYOTA
  {
    id: 1, brand: 'Toyota', name: 'Land Cruiser 300', category: 'SUV', price: '$92,000',
    hp: 415, torque: '650 Nm', top: '210 km/h', acc: '6.7s',
    engine: '3.5L V6 Twin Turbo', transmission: '10-AT', drive: 'AWD',
    fuel: 'Gasolina', badge: 'Bestseller',
    image: 'https://acnews.blob.core.windows.net/imgnews/paragraph/NPAZ_e8425b2addf84bdb950093c403f1b194.jpg',
  },
  {
    id: 2, brand: 'Toyota', name: 'Hilux GR Sport', category: 'Camioneta', price: '$48,500',
    hp: 204, torque: '500 Nm', top: '175 km/h', acc: '10.2s',
    engine: '2.8L Diesel Turbo', transmission: '6-AT', drive: '4x4',

    image: 'https://www.tgrperu.com.pe/images/modelos/hilux/galeria/hiluxgrs-galeria6.jpg',
  },
  {
    id: 3, brand: 'Toyota', name: 'GR Supra', category: 'Sport', price: '$75,000',
    hp: 387, torque: '500 Nm', top: '250 km/h', acc: '4.3s',
    engine: '3.0L I6 Turbo', transmission: '8-AT', drive: 'RWD',
    fuel: 'Diesel', badge: 'Más Vendido',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/2025_Toyota_GR_Supra_3.0_front.jpg',
  },
  // HYUNDAI
  {
    id: 4, brand: 'Hyundai', name: 'IONIQ 6', category: 'Eléctrico', price: '$55,000',
    hp: 325, torque: '605 Nm', top: '185 km/h', acc: '5.1s',
    engine: 'Dual Motor Eléctrico', transmission: '1-vel', drive: 'AWD',
    fuel: 'Eléctrico', badge: 'Nuevo',
    image: 'https://www.diariomotor.com/imagenes/2025/04/Hyundai-Ioniq-6-2025-9-67ee723b77f13.jpg?class=M',
  },
  {
    id: 5, brand: 'Hyundai', name: 'Santa Fe Hybrid', category: 'SUV', price: '$42,000',
    hp: 230, torque: '350 Nm', top: '193 km/h', acc: '8.1s',
    engine: '1.6L Turbo + Motor E.', transmission: '6-DCT', drive: 'AWD',
    fuel: 'Híbrido', badge: null,
    image: 'https://s7d1.scene7.com/is/image/hyundai/2024-santa-fe-hybrid-0173-gallery:16-9?wid=1440&hei=810&qlt=85,0&fmt=webp',
  },
  // KIA
  {
    id: 6, brand: 'Kia', name: 'EV6 GT', category: 'Eléctrico', price: '$68,000',
    hp: 577, torque: '740 Nm', top: '260 km/h', acc: '3.5s',
    engine: 'Dual Motor Eléctrico', transmission: '1-vel', drive: 'AWD',
    fuel: 'Eléctrico', badge: 'Hot',
    image: 'https://www.electrive.com/media/2025/01/kia-ev6-gt-2025-3.jpg',
  },
  {
    id: 7, brand: 'Kia', name: 'Sportage GT-Line', category: 'SUV', price: '$38,000',
    hp: 180, torque: '265 Nm', top: '195 km/h', acc: '8.5s',
    engine: '1.6L Turbo GDi', transmission: '7-DCT', drive: 'AWD',
    fuel: 'Gasolina', badge: null,
    image: 'https://www.tester.pe/wp-content/uploads/2019/07/IMG_4878.jpg',
  },
  // NISSAN
  {
    id: 8, brand: 'Nissan', name: 'GT-R Nismo', category: 'Sport', price: '$135,000',
    hp: 600, torque: '652 Nm', top: '315 km/h', acc: '2.7s',
    engine: '3.8L V6 Twin Turbo', transmission: '6-DCT', drive: 'AWD',
    fuel: 'Gasolina', badge: 'Leyenda',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/2012_Nissan_GT-R_Egoist.jpg',
  },
  {
    id: 9, brand: 'Nissan', name: 'Navara Pro-4X', category: 'Camioneta', price: '$42,000',
    hp: 190, torque: '450 Nm', top: '180 km/h', acc: '11.5s',
    engine: '2.3L Diesel Biturbo', transmission: '7-AT', drive: '4x4',
    fuel: 'Diesel', badge: null,
    image: 'https://www-asia.nissan-cdn.net/content/dam/Nissan/AU/Images/about-nissan/news/2020/11/navara-pro4x-twilight-ridge-2400x1600.jpg.ximg.l_12_m.smart.jpg',
  },
  // BYD
  {
    id: 10, brand: 'BYD', name: 'Han EV', category: 'Eléctrico', price: '$48,000',
    hp: 517, torque: '700 Nm', top: '180 km/h', acc: '3.9s',
    engine: 'Dual Motor Blade Battery', transmission: '1-vel', drive: 'AWD',
    fuel: 'Eléctrico', badge: 'Nuevo',
    image: 'https://image.made-in-china.com/202f0j00HCFonWTgfIbs/Made-in-China-Byd-Han-EV-New-Cars-Electric-Sedan-4WD-High-Speed-New-Energy-Electrical-Vehicle-Latest-Adult-Wheel-Drive-Used-Car-Secondhand-Auto.webp',
  },
  {
    id: 11, brand: 'BYD', name: 'Tang EV', category: 'SUV', price: '$52,000',
    hp: 476, torque: '680 Nm', top: '180 km/h', acc: '4.6s',
    engine: 'Dual Motor Eléctrico', transmission: '1-vel', drive: 'AWD',
    fuel: 'Eléctrico', badge: null,
    image: 'https://autoschinos.org/wp-content/uploads/2021/07/BYD-Tang.jpg',
  },
  // MG
  {
    id: 12, brand: 'MG', name: 'MG4 Electric', category: 'Eléctrico', price: '$32,000',
    hp: 204, torque: '250 Nm', top: '160 km/h', acc: '7.7s',
    engine: 'Motor Eléctrico', transmission: '1-vel', drive: 'FWD',
    fuel: 'Eléctrico', badge: 'Eco',
    image: 'https://www.km77.com/images/medium/5/9/4/3/mg4-frontal-lateral.365943.jpg',
  },
  {
    id: 13, brand: 'MG', name: 'HS Plus EV', category: 'SUV', price: '$36,000',
    hp: 180, torque: '280 Nm', top: '175 km/h', acc: '8.6s',
    engine: 'Motor Eléctrico', transmission: '1-vel', drive: 'FWD',
    fuel: 'Eléctrico', badge: null,
    image: 'https://media.drive.com.au/obj/tx_q:50,rs:auto:1920:1080:1/driveau/upload/cms/uploads/grwkbavb7293ygamng40',
  },
  // MITSUBISHI
  {
    id: 14, brand: 'Mitsubishi', name: 'Outlander PHEV', category: 'SUV', price: '$45,000',
    hp: 302, torque: '450 Nm', top: '180 km/h', acc: '6.0s',
    engine: '2.4L + Dual Motor E.', transmission: 'CVT', drive: 'S-AWC',
    fuel: 'Híbrido', badge: null,
    image: 'https://media.ed.edmunds-media.com/mitsubishi/outlander-phev/2026/oem/2026_mitsubishi_outlander-phev_4dr-suv_sel_fq_oem_1_1600.jpg',
  },
  {
    id: 15, brand: 'Mitsubishi', name: 'L200 Triton', category: 'Camioneta', price: '$38,500',
    hp: 181, torque: '430 Nm', top: '170 km/h', acc: '12.0s',
    engine: '2.4L Diesel MIVEC', transmission: '6-AT', drive: '4x4',
    fuel: 'Diesel', badge: null,
    image: 'https://cdn.motor1.com/images/mgl/MkJ24p/s3/2024-mitsubishi-triton-l200.jpg',
  },
  // SUZUKI
  {
    id: 16, brand: 'Suzuki', name: 'Jimny 4WD', category: 'SUV', price: '$22,000',
    hp: 102, torque: '130 Nm', top: '145 km/h', acc: '13.0s',
    engine: '1.5L K15C', transmission: '4-AT', drive: '4WD',
    fuel: 'Gasolina', badge: 'Icónico',
    image: 'https://cdn-strapi.patiotuerca.com/cdn-cgi/image/trim=0;0;0;720/PORTERO_3d366ab0c0.png',
  },
  // JAC
  {
    id: 17, brand: 'JAC', name: 'JS4 GT', category: 'SUV', price: '$24,500',
    hp: 190, torque: '305 Nm', top: '185 km/h', acc: '8.2s',
    engine: '1.5L Turbo', transmission: '7-DCT', drive: 'FWD',
    fuel: 'Gasolina', badge: null,
    image: 'https://grupogranprix.com.pe/wp-content/uploads/2024/01/jac_final1.jpg',
  },
  // CHERY
  {
    id: 18, brand: 'Chery', name: 'Tiggo 8 Pro Max', category: 'SUV', price: '$29,000',
    hp: 197, torque: '290 Nm', top: '195 km/h', acc: '8.0s',
    engine: '2.0L TGDI', transmission: '7-DCT', drive: 'FWD',
    fuel: 'Gasolina', badge: null,
    image: 'https://media.drive.com.au/obj/tx_q:50,rs:auto:1920:1080:1/driveau/upload/cms/uploads/qex4hkssazfsxbpfyb32',
  },
];

const BRANDS = ['Todas', 'Toyota', 'Hyundai', 'Kia', 'Nissan', 'BYD', 'MG', 'Mitsubishi', 'Suzuki', 'JAC', 'Chery'];
const CATEGORIES = ['Todos', 'SUV', 'Sport', 'Eléctrico', 'Camioneta', 'Híbrido'];
const FUEL_ICONS = { Gasolina: Fuel, Eléctrico: Zap, Diesel: Gauge, Híbrido: Star };

const VehicleCard = ({ v }) => {
  const FuelIcon = FUEL_ICONS[v.fuel] || Fuel;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45 }}
      className="group relative bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-red-600/60 transition-all duration-500 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10" />
        <img
          src={v.image}
          alt={`${v.brand} ${v.name}`}
          loading="lazy"
          className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105 transition-all duration-700"
        />
        {v.badge && (
          <span className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[10px] font-display font-black uppercase tracking-[0.15em] px-3 py-1">
            {v.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-zinc-950/80 backdrop-blur-sm border border-zinc-700 text-zinc-300 text-[10px] font-display font-bold uppercase tracking-widest px-3 py-1">
          <FuelIcon className="w-3 h-3 text-red-500" /> {v.fuel}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-1">
          <span className="text-red-500 text-[10px] font-display font-black uppercase tracking-[0.2em]">{v.brand}</span>
          <span className="text-zinc-500 text-[10px] font-display font-bold uppercase tracking-widest">{v.category}</span>
        </div>
        <h3 className="font-display font-black text-white uppercase tracking-tighter text-2xl leading-none mb-4 group-hover:text-red-400 transition-colors duration-300">
          {v.name}
        </h3>

        {/* Specs */}
        <div className="grid grid-cols-4 gap-2 mb-4 border-t border-zinc-800 pt-4">
          {[
            { label: 'HP', value: v.hp },
            { label: '0–100', value: v.acc },
            { label: 'Top', value: v.top },
            { label: 'Torque', value: v.torque },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="text-white font-display font-black text-sm leading-none">{s.value}</span>
              <span className="text-zinc-600 text-[9px] uppercase tracking-widest mt-1">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Engine / trans pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[v.engine, v.drive].map(t => (
            <span key={t} className="text-[10px] text-zinc-500 font-display font-bold uppercase tracking-widest border border-zinc-800 px-2 py-1">{t}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto border-t border-zinc-800 pt-4">
          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Precio desde</p>
            <p className="font-display font-black text-xl text-white">{v.price}</p>
          </div>
          <button
            id={`btn-ver-${v.id}`}
            aria-label={`Ver detalles de ${v.brand} ${v.name}`}
            className="w-11 h-11 bg-zinc-950 border border-zinc-700 flex items-center justify-center text-white group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300"
          >
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const Showroom = () => {
  const [brand, setBrand] = useState('Todas');
  const [category, setCategory] = useState('Todos');

  const filtered = VEHICLES.filter(v =>
    (brand === 'Todas' || v.brand === brand) &&
    (category === 'Todos' || v.category === category || v.fuel === category)
  );

  return (
    <section id="modelos" className="w-full bg-zinc-950 py-28 px-4 sm:px-8 border-t border-zinc-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/4 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-[2px] bg-red-600" />
              <span className="text-red-500 font-display font-black uppercase tracking-[0.3em] text-xs">Disponible en Perú</span>
            </div>
            <h2 className="font-display font-black uppercase tracking-tighter text-5xl sm:text-6xl text-white leading-none">
              Nuestros<br /><span className="text-zinc-600">Modelos</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-xs">
            {VEHICLES.length} modelos disponibles en Cusco con entrega inmediata o a pedido.
          </p>
        </div>

        {/* Brand filter — scrollable on mobile */}
        <div className="mb-4">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold mb-3">Filtrar por marca</p>
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2" style={{ scrollbarWidth: 'none' }}>
            {BRANDS.map(b => (
              <button
                key={b}
                id={`brand-${b.toLowerCase()}`}
                onClick={() => setBrand(b)}
                className={`shrink-0 font-display font-bold uppercase tracking-widest text-xs px-5 py-2.5 border transition-all duration-300 ${brand === b
                  ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                  : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                  }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-10">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold mb-3">Filtrar por tipo</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                id={`cat-${c.toLowerCase()}`}
                onClick={() => setCategory(c)}
                className={`font-display font-bold uppercase tracking-widest text-xs px-5 py-2.5 border transition-all duration-300 ${category === c
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                  : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-white'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-zinc-600 text-sm mb-8 font-medium">
          {filtered.length} modelo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map(v => <VehicleCard key={v.id} v={v} />)}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display font-black uppercase tracking-tighter text-zinc-700 text-3xl">Sin resultados</p>
            <p className="text-zinc-600 mt-2 text-sm">Prueba con otro filtro de marca o categoría.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Showroom;
