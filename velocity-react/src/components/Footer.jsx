import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

// Social icons inline
const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const YtIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const FOOTER_LINKS = {
  'Modelos': ['Supercars', 'SUV Premium', 'Sedanes', 'Eléctricos e Híbridos', 'Camionetas'],
  'Servicios': ['Test Drive', 'Financiación', 'Taller Certificado', 'Garantía Extendida', 'Seguros'],
  'Empresa': ['Quiénes Somos', 'Nuestro Showroom', 'Trabaja con Nosotros', 'Blog Automotriz', 'Prensa'],
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) { setSent(true); setEmail(''); }
  };

  return (
    <footer id="contacto" className="w-full bg-zinc-950 border-t border-zinc-900">

      {/* Contact CTA Banner */}
      <div className="bg-red-600 py-14 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display font-black uppercase tracking-tighter text-white text-4xl sm:text-5xl leading-none mb-2">
              ¿Listo para el siguiente nivel?
            </h3>
            <p className="text-red-200 text-base">Un asesor exclusivo te contacta en menos de 2 horas.</p>
          </div>
          <a
            href="tel:+5114567890"
            id="btn-llamar-ahora"
            className="shrink-0 inline-flex items-center gap-3 bg-white hover:bg-zinc-100 text-red-600 font-display font-black uppercase tracking-widest text-sm px-8 py-4 transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            Llamar Ahora
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-red-600 flex items-center justify-center font-display font-black text-white text-base rotate-45">
                V
              </div>
              <span className="font-display font-black uppercase tracking-[0.15em] text-white text-lg">
                Velocity <span className="text-red-600">Motors</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-sm">
              La concesionaria de vehículos premium más importante del Perú.
              Más de 12 años entregando experiencias de manejo excepcionales.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-8">
              {[
                { Icon: MapPin, text: 'Av. de la Cultura 1200, San Jerónimo, Cusco' },
                { Icon: Phone, text: '+51 84 456-7890' },
                { Icon: Mail, text: 'ventas@velocitymotors.pe' },
                { Icon: Clock, text: 'Lun–Sáb: 9am–7pm · Dom: 10am–3pm' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span className="text-zinc-400 text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { Icon: IgIcon, label: 'Instagram', href: '#' },
                { Icon: FbIcon, label: 'Facebook', href: '#' },
                { Icon: YtIcon, label: 'YouTube', href: '#' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-red-600 hover:bg-red-600/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-black uppercase tracking-[0.15em] text-white text-xs mb-6 flex items-center gap-3">
                <span className="w-4 h-[2px] bg-red-600" /> {title}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-0 h-[1px] bg-red-600 group-hover:w-3 transition-all duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border border-zinc-800 p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-black uppercase tracking-tighter text-white text-2xl mb-1">
                Newsletter Exclusivo
              </h4>
              <p className="text-zinc-500 text-sm">Lanzamientos, eventos VIP y ofertas antes que nadie.</p>
            </div>
            {sent ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 font-display font-bold uppercase tracking-widest text-sm"
              >
                ✓ ¡Te has suscrito exitosamente!
              </motion.p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-0 w-full md:w-auto">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 md:w-72 bg-zinc-900 border border-zinc-700 border-r-0 text-white px-5 py-4 text-sm placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors"
                />
                <button
                  type="submit"
                  id="btn-suscribir"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 transition-colors duration-300 flex items-center gap-2 font-display font-bold uppercase tracking-widest text-xs shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Suscribir</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-zinc-900 pt-8">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} Velocity Motors SAC · RUC: 20607890123 · Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {['Política de Privacidad', 'Términos y Condiciones', 'Cookies'].map(t => (
              <a key={t} href="#" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
