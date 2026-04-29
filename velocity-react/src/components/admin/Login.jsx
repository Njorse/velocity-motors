import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-2xl border border-red-500/20 shadow-[0_0_40px_-15px_rgba(239,68,68,0.3)] w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Acceso Administrativo</h2>
          <p className="text-red-500 font-bold uppercase tracking-widest text-sm mt-2">Velocity Motors</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              required 
            />
          </div>
          <div className="mb-2">
            <label className="block text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-sm p-3.5 rounded-lg transition-all disabled:opacity-50 shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.8)] mt-2"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
