import React, { useState, useEffect, useRef } from 'react';

/* ─── Estilos en línea para animaciones personalizadas ─── */
const styles = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);    opacity: 0.6; }
    100% { transform: scale(1.8);  opacity: 0;   }
  }
  @keyframes gradientShift {
    0%   { background-position: 0%   50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0%   50%; }
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0);    }
    40%           { transform: translateY(-6px);  }
  }
  .chat-window { animation: slideUp 0.25s cubic-bezier(0.22,1,0.36,1) forwards; }
  .gradient-btn {
    background: linear-gradient(135deg, #dc2626, #b91c1c, #7f1d1d, #dc2626);
    background-size: 300% 300%;
    animation: gradientShift 4s ease infinite;
  }
  .dot-1 { animation: dotBounce 1.2s infinite ease-in-out 0s;   }
  .dot-2 { animation: dotBounce 1.2s infinite ease-in-out 0.2s; }
  .dot-3 { animation: dotBounce 1.2s infinite ease-in-out 0.4s; }
  .pulse-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 2px solid rgba(220,38,38,0.5);
    animation: pulseRing 2s ease-out infinite;
  }
`;

/* ─── Icono AI / Spark ─── */
const SparkIcon = ({ size = 20, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
      fill={color} stroke={color} strokeWidth="0.5" strokeLinejoin="round"
    />
    <path d="M19 16L19.9 18.1L22 19L19.9 19.9L19 22L18.1 19.9L16 19L18.1 18.1L19 16Z"
      fill={color} opacity="0.7"
    />
  </svg>
);

/* ─── Icono Micrófono elegante ─── */
const MicIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="9" y="2" width="6" height="12" rx="3" fill={active ? 'rgba(220,38,38,0.3)' : 'none'} />
    <path d="M5 10a7 7 0 0014 0" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="9"  y1="22" x2="15" y2="22" />
  </svg>
);

/* ─── Icono Enviar ─── */
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none" />
  </svg>
);

/* ─── Typewriter Effect Component ─── */
const TypewriterText = ({ text, delay = 30 }) => {
  const [index, setIndex] = useState(0);

  // Reiniciar cuando cambia el texto
  useEffect(() => {
    setIndex(0);
  }, [text]);

  // Avanzar letra por letra
  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [index, text, delay]);

  return <>{text.substring(0, index)}</>;
};

/* ═══════════════════════════════════════════════════════════ */
const ChatWidget = ({ hideButton = false }) => {
  const [isOpen, setIsOpen]               = useState(false);
  const [hasStarted, setHasStarted]       = useState(false);
  const [isListening, setIsListening]     = useState(false);
  const [isProcessing, setIsProcessing]   = useState(false);
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [inputText, setInputText]     = useState('');
  const [messages, setMessages]       = useState([]);

  const messagesEndRef  = useRef(null);
  const inputRef        = useRef(null);
  const recognitionRef  = useRef(null);
  const currentAudioRef = useRef(null);
  const sessionIdRef    = useRef(null);
  const hasSpeech       = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  /* ── Speech Recognition ── */
  useEffect(() => {
    if (!hasSpeech) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'es-ES';
    rec.onstart  = () => setIsListening(true);
    rec.onresult = (e) => { setIsListening(false); handleSend(e.results[0][0].transcript); };
    rec.onerror  = () => setIsListening(false);
    rec.onend    = () => setIsListening(false);
    recognitionRef.current = rec;
    return () => { rec.abort(); if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; } };
  }, []);

  /* ── Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  /* ── Voz ── */
  const toggleListen = () => {
    if (isListening) { recognitionRef.current?.stop(); }
    else {
      // Detener audio actual si está sonando
      if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
      recognitionRef.current?.start();
    }
  };

  const playAudioBase64 = (base64Data) => {
    if (!base64Data) return;
    try {
      // Detener audio previo
      if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
      const audio = new Audio('data:audio/mpeg;base64,' + base64Data);
      currentAudioRef.current = audio;
      audio.play().catch(err => console.warn('Audio play error:', err));
    } catch (err) {
      console.warn('Error reproduciendo audio Kokoro:', err);
    }
  };

  /* ── Enviar mensaje ── */
  const handleSend = async (text) => {
    const msg = (text || inputText).trim();
    if (!msg || isProcessing) return;

    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setIsProcessing(true);

    try {
      const res  = await fetch('http://127.0.0.1:8000/chat-voz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: msg, session_id: sessionIdRef.current }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.session_id) sessionIdRef.current = data.session_id;
      setMessages(prev => [...prev, { sender: 'bot', text: data.audio_texto }]);
      playAudioBase64(data.audio_base64);
      // Si el lead fue capturado o la sesión terminó, bloquear el chat
      if (data.lead_captured) {
        setIsLeadCaptured(true);
        sessionIdRef.current = null;
      } else if (data.session_ended) {
        setIsSessionEnded(true);
        sessionIdRef.current = null;
      }
    } catch {
      const err = 'Lo siento, hubo un problema al conectar con el servidor.';
      setMessages(prev => [...prev, { sender: 'bot', text: err }]);
    } finally {
      setIsProcessing(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  /* ── Toggle con reset de sesión ── */
  const handleNuevaConversacion = () => {
    if (sessionIdRef.current) {
      fetch(`http://127.0.0.1:8000/sesion/${sessionIdRef.current}`, { method: 'DELETE' }).catch(() => {});
      sessionIdRef.current = null;
    }
    setIsLeadCaptured(false);
    setIsSessionEnded(false);
    setHasStarted(false);
    setMessages([]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleToggle = () => {
    if (isOpen && sessionIdRef.current) {
      fetch(`http://127.0.0.1:8000/sesion/${sessionIdRef.current}`, { method: 'DELETE' }).catch(() => {});
      sessionIdRef.current = null;
    }
    if (isOpen) {
      setIsLeadCaptured(false);
      setIsSessionEnded(false);
      setHasStarted(false);
      setMessages([]);
    }
    setIsOpen(o => !o);
  };

  /* ── Iniciar conversación ── */
  const handleStartConversation = () => {
    setHasStarted(true);
    const greeting = '¡Hola! Soy tu asesor virtual de Velocity Motors. ¿Qué modelo de auto te interesa? Tenemos Toyota, Hyundai, Kia, BYD y más.';
    setMessages([{ sender: 'bot', text: greeting }]);
    // Generar audio del saludo desde el backend
    fetch('http://127.0.0.1:8000/chat-voz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: '__GREETING__', session_id: null }),
    }).then(r => r.json()).then(data => {
      if (data.session_id) sessionIdRef.current = data.session_id;
      setMessages([{ sender: 'bot', text: data.audio_texto }]);
      playAudioBase64(data.audio_base64);
    }).catch(() => {});
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* ══════════════ RENDER ══════════════ */
  return (
    <>
      <style>{styles}</style>

      {/* ── Botón flotante ── */}
      {!hideButton && (
      <div className="fixed bottom-6 right-6 z-50" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
        {/* Anillo pulsante (solo cuando está cerrado) */}
        {!isOpen && (
          <div style={{
            position: 'absolute', inset: '-4px', borderRadius: '50%',
            border: '2px solid rgba(220,38,38,0.4)',
            animation: 'pulseRing 2.5s ease-out infinite'
          }} />
        )}
        <button
          onClick={handleToggle}
          aria-label="Abrir asistente Velocity AI"
          className="gradient-btn"
          style={{
            width: '56px', height: '56px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', position: 'relative',
            boxShadow: '0 8px 32px rgba(220,38,38,0.45), 0 2px 8px rgba(0,0,0,0.4)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(220,38,38,0.6), 0 2px 8px rgba(0,0,0,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 8px 32px rgba(220,38,38,0.45), 0 2px 8px rgba(0,0,0,0.4)'; }}
        >
          {isOpen
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <SparkIcon size={22} />
          }
        </button>

        {/* Badge tooltip */}
        {!isOpen && (
          <div style={{
            position: 'absolute', bottom: '64px', right: '0',
            background: '#18181b', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '6px 10px', whiteSpace: 'nowrap',
            fontSize: '11px', color: '#a1a1aa', pointerEvents: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            Velocity AI ✦
          </div>
          )}
      </div>
      )}

      {/* ── Ventana del chat ── */}
      {isOpen && (
        <div
          className="chat-window"
          style={{
            position: 'fixed', bottom: '96px', right: '24px',
            width: '380px', height: '540px', zIndex: 9998,
            display: 'flex', flexDirection: 'column',
            borderRadius: '20px', overflow: 'hidden',
            background: 'linear-gradient(160deg, #131316 0%, #0d0d10 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(220,38,38,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* ── Header ── */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0,
          }}>
            {/* Avatar pequeño */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(220,38,38,0.4)',
            }}>
              <SparkIcon size={14} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#f4f4f5', fontWeight: 700, fontSize: '13px', letterSpacing: '0.01em' }}>
                  Velocity AI
                </span>
                <span style={{
                  background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
                  color: '#f87171', fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em',
                  padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase',
                }}>BETA</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
                <span style={{ color: '#71717a', fontSize: '11px' }}>Asesor activo · Velocity Motors</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {/* Botón Reiniciar */}
              <button
                onClick={handleNuevaConversacion}
                title="Reiniciar conversación"
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '5px', cursor: 'pointer', color: '#71717a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f4f4f5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#71717a'; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>

              {/* Botón Cerrar */}
              <button
                onClick={handleToggle}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '5px', cursor: 'pointer', color: '#71717a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f4f4f5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#71717a'; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Pantalla de Bienvenida (estado inactivo) ── */}
          {!hasStarted ? (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '20px',
              padding: '24px',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(220,38,38,0.4)',
              }}>
                <SparkIcon size={28} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#f4f4f5', fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                  Velocity Motors
                </h3>
                <p style={{ color: '#71717a', fontSize: '12.5px', marginTop: '6px', lineHeight: '1.5' }}>
                  Bienvenido a tu experiencia de Test Drive
                </p>
              </div>
              <button
                onClick={handleStartConversation}
                style={{
                  padding: '12px 28px', borderRadius: '14px',
                  background: 'transparent',
                  border: '1.5px solid rgba(220,38,38,0.5)',
                  color: '#f87171', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.25s',
                  letterSpacing: '0.03em', textTransform: 'uppercase',
                  boxShadow: '0 0 20px rgba(220,38,38,0.15)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(220,38,38,0.45)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#f87171';
                  e.currentTarget.style.borderColor = 'rgba(220,38,38,0.5)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(220,38,38,0.15)';
                }}
              >
                Iniciar Conversación
              </button>
              <p style={{ color: '#3f3f46', fontSize: '10px', textAlign: 'center', marginTop: '4px' }}>
                También puedes hablar por voz 🎙️
              </p>
            </div>
          ) : (
          <>

          {/* ── Área de mensajes ── */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px 14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
            scrollbarWidth: 'thin', scrollbarColor: '#27272a transparent',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '6px' }}>

                {/* Avatar del bot */}
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '8px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <SparkIcon size={11} />
                  </div>
                )}

                {/* Burbuja */}
                <div style={{
                  maxWidth: '76%', padding: '9px 13px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '13.5px', lineHeight: '1.55', wordBreak: 'break-word',
                  ...(msg.sender === 'user'
                    ? {
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        color: '#fff',
                        boxShadow: '0 4px 16px rgba(220,38,38,0.3)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: '#d4d4d8',
                      }
                  ),
                }}>
                  {msg.sender === 'bot' ? <TypewriterText text={msg.text} delay={35} /> : msg.text}
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {isProcessing && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '8px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <SparkIcon size={11} />
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '11px 16px', display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  <span className="dot-1" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#52525b', display: 'inline-block' }} />
                  <span className="dot-2" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#52525b', display: 'inline-block' }} />
                  <span className="dot-3" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#52525b', display: 'inline-block' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Area ── */}
          <div style={{
            flexShrink: 0, padding: '12px 14px 14px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.25)',
          }}>

            { (isLeadCaptured || isSessionEnded) ? (
              /* ── Estado bloqueado: post-lead o post-despedida ── */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 14px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
                  background: isLeadCaptured ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.05)', 
                  border: isLeadCaptured ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.1)',
                }}>
                  <span style={{ fontSize: '14px' }}>{isLeadCaptured ? '✅' : '👋'}</span>
                  <span style={{ color: isLeadCaptured ? '#86efac' : '#a1a1aa', fontSize: '12px', fontWeight: 500 }}>
                    {isLeadCaptured ? 'Solicitud enviada. ¡Te contactaremos pronto!' : 'Conversación terminada.'}
                  </span>
                </div>
                <button
                  onClick={handleNuevaConversacion}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '12px', border: 'none',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#a1a1aa', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    transition: 'all 0.2s', letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#e4e4e7'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#a1a1aa'; }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </svg>
                  Nueva conversación
                </button>
              </div>
            ) : (
              /* ── Input normal ── */
              <>
                {isListening && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '10px', padding: '7px 12px',
                    background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
                    borderRadius: '10px',
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 8px #ef4444' }} />
                    <span style={{ color: '#f87171', fontSize: '12px', fontWeight: 500 }}>Escuchando... habla ahora</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <textarea
                      ref={inputRef}
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe tu mensaje..."
                      rows={1}
                      disabled={isProcessing || isListening}
                      style={{
                        width: '100%', resize: 'none', outline: 'none',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px', padding: '10px 14px',
                        color: '#e4e4e7', fontSize: '13px', lineHeight: '1.5',
                        maxHeight: '80px', boxSizing: 'border-box',
                        fontFamily: 'inherit', transition: 'border-color 0.15s',
                        opacity: isProcessing || isListening ? 0.5 : 1,
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(220,38,38,0.5)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  {hasSpeech && (
                    <button onClick={toggleListen} disabled={isProcessing} title={isListening ? 'Detener' : 'Hablar'}
                      style={{
                        width: '40px', height: '40px', flexShrink: 0, borderRadius: '12px', cursor: isProcessing ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                        background: isListening ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.06)',
                        border: isListening ? '1px solid rgba(220,38,38,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        color: isListening ? '#ef4444' : '#71717a', opacity: isProcessing ? 0.4 : 1,
                        boxShadow: isListening ? '0 0 14px rgba(220,38,38,0.3)' : 'none',
                      }}>
                      <MicIcon active={isListening} />
                    </button>
                  )}
                  <button onClick={() => handleSend()} disabled={isProcessing || !inputText.trim()} title="Enviar"
                    style={{
                      width: '40px', height: '40px', flexShrink: 0, borderRadius: '12px', cursor: isProcessing || !inputText.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: inputText.trim() ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'rgba(255,255,255,0.06)',
                      border: '1px solid ' + (inputText.trim() ? 'transparent' : 'rgba(255,255,255,0.1)'),
                      color: inputText.trim() ? 'white' : '#52525b', transition: 'all 0.2s',
                      opacity: isProcessing || !inputText.trim() ? 0.5 : 1,
                      boxShadow: inputText.trim() ? '0 4px 16px rgba(220,38,38,0.4)' : 'none',
                    }}>
                    <SendIcon />
                  </button>
                </div>
                <p style={{ textAlign: 'center', color: '#3f3f46', fontSize: '10.5px', marginTop: '8px' }}>
                  {hasSpeech ? 'Enter para enviar  ·  🎙 para hablar' : 'Enter para enviar'}
                </p>
              </>
            )}
          </div>
          </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
