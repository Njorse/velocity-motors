import React from 'react';

const styles = `
  @keyframes pulseRing {
    0%   { transform: scale(1);    opacity: 0.6; }
    100% { transform: scale(1.8);  opacity: 0;   }
  }
`;

const WhatsAppIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const WhatsAppButton = ({ phoneNumber = '51954157560', message = '¡Hola! Me interesa un vehículo de Velocity Motors.' }) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <style>{styles}</style>
      <div className="fixed bottom-6 right-6 z-50" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      <div style={{
        position: 'absolute', inset: '-4px', borderRadius: '50%',
        border: '2px solid rgba(37,211,102,0.4)',
        animation: 'pulseRing 2.5s ease-out infinite',
      }} />
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        style={{
          width: '56px', height: '56px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer', position: 'relative',
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          boxShadow: '0 8px 32px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          textDecoration: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,211,102,0.6), 0 2px 8px rgba(0,0,0,0.4)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.4)'; }}
      >
        <WhatsAppIcon size={26} />
      </a>

      <div style={{
        position: 'absolute', bottom: '64px', right: '0',
        background: '#18181b', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px', padding: '6px 10px', whiteSpace: 'nowrap',
        fontSize: '11px', color: '#a1a1aa', pointerEvents: 'none',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}>
        WhatsApp ✦
      </div>
    </div>
    </>
  );
};

export default WhatsAppButton;
