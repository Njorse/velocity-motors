import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, DollarSign, Calendar } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const FinanceCalculator = () => {
  const [price, setPrice] = useState(285000);
  const [downPct, setDownPct] = useState(30);
  const [months, setMonths] = useState(60);
  const [rate, setRate] = useState(4.9);

  const { down, loan, monthly, totalPay, totalInterest } = useMemo(() => {
    const down = price * (downPct / 100);
    const loan = price - down;
    const r = rate / 100 / 12;
    const monthly = r === 0 ? loan / months : (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const totalPay = monthly * months + down;
    const totalInterest = totalPay - price;
    return { down, loan, monthly, totalPay, totalInterest };
  }, [price, downPct, months, rate]);

  const sliders = [
    {
      id: 'price', label: 'Precio del vehículo', min: 50000, max: 500000, step: 5000,
      value: price, setter: setPrice, display: fmt(price), icon: DollarSign,
    },
    {
      id: 'down', label: 'Cuota inicial', min: 10, max: 60, step: 5,
      value: downPct, setter: setDownPct, display: `${downPct}%  (${fmt(price * downPct / 100)})`, icon: TrendingDown,
    },
    {
      id: 'months', label: 'Plazo en meses', min: 12, max: 84, step: 12,
      value: months, setter: setMonths, display: `${months} meses`, icon: Calendar,
    },
    {
      id: 'rate', label: 'Tasa de interés anual', min: 1, max: 15, step: 0.1,
      value: rate, setter: setRate, display: `${rate.toFixed(1)}%`, icon: Calculator,
    },
  ];

  return (
    <section id="financiacion" className="w-full bg-zinc-950 border-t border-zinc-900 py-28 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-[2px] bg-red-600" />
              <span className="text-red-500 font-display font-black uppercase tracking-[0.3em] text-xs">Herramienta Financiera</span>
            </div>
            <h2 className="font-display font-black uppercase tracking-tighter text-5xl sm:text-6xl text-white leading-none">
              Simula tu<br />
              <span className="text-zinc-600">Financiación</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            Usa nuestra calculadora en tiempo real para diseñar el plan de pago perfecto para tu próximo vehículo de lujo.
          </p>
        </div>

        {/* Two-col layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">

          {/* Sliders */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 space-y-10">
            {sliders.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.id}>
                  <div className="flex justify-between items-center mb-4">
                    <label htmlFor={s.id} className="flex items-center gap-2 text-zinc-400 font-display font-bold uppercase tracking-widest text-xs">
                      <Icon className="w-4 h-4 text-red-500" /> {s.label}
                    </label>
                    <span className="text-white font-display font-black text-sm">{s.display}</span>
                  </div>
                  <div className="relative">
                    <input
                      id={s.id}
                      type="range"
                      min={s.min} max={s.max} step={s.step}
                      value={s.value}
                      onChange={e => s.setter(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-zinc-600 text-[10px] font-medium">{typeof s.min === 'number' && s.id === 'price' ? fmt(s.min) : s.min + (s.id === 'rate' ? '%' : s.id === 'down' ? '%' : s.id === 'months' ? ' m' : '')}</span>
                      <span className="text-zinc-600 text-[10px] font-medium">{typeof s.max === 'number' && s.id === 'price' ? fmt(s.max) : s.max + (s.id === 'rate' ? '%' : s.id === 'down' ? '%' : s.id === 'months' ? ' m' : '')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Results card */}
          <motion.div
            key={monthly}
            initial={{ opacity: 0.7, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-zinc-900 border border-zinc-800 flex flex-col"
          >
            {/* Monthly highlight */}
            <div className="bg-red-600 p-8 flex flex-col items-center justify-center text-center">
              <p className="text-red-200 font-display font-bold uppercase tracking-[0.25em] text-xs mb-2">Cuota Mensual</p>
              <p className="font-display font-black text-white text-5xl tracking-tighter">{fmt(monthly)}</p>
              <p className="text-red-200 text-xs mt-2 font-medium">por {months} meses</p>
            </div>

            {/* Breakdown */}
            <div className="p-6 flex-1 space-y-4">
              {[
                { label: 'Precio del vehículo', value: fmt(price) },
                { label: 'Cuota inicial', value: fmt(down) },
                { label: 'Monto a financiar', value: fmt(loan) },
                { label: 'Interés total', value: fmt(totalInterest) },
                { label: 'Total a pagar', value: fmt(totalPay), highlight: true },
              ].map(row => (
                <div key={row.label} className={`flex justify-between items-center py-3 border-b border-zinc-800 ${row.highlight ? 'border-0 pt-4' : ''}`}>
                  <span className={`text-xs font-medium uppercase tracking-widest ${row.highlight ? 'text-white font-display font-bold' : 'text-zinc-500'}`}>
                    {row.label}
                  </span>
                  <span className={`font-display font-black ${row.highlight ? 'text-red-500 text-lg' : 'text-white text-sm'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="p-6 pt-0">
              <a
                href="#contacto"
                id="btn-solicitar-credito"
                className="block w-full bg-white hover:bg-zinc-100 text-zinc-950 font-display font-black uppercase tracking-widest text-xs py-4 text-center transition-colors duration-300"
              >
                Solicitar Pre-aprobación
              </a>
              <p className="text-zinc-600 text-[10px] text-center mt-3 leading-relaxed">
                *Cálculo referencial. Sujeto a aprobación crediticia. Tasas pueden variar.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinanceCalculator;
