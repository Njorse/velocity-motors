import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import * as XLSX from 'xlsx';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch('http://127.0.0.1:8000/api/leads', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar leads (401 Unauthorized)');
      }

      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads.map(lead => ({
      'ID': lead.id,
      'Nombre': lead.nombre,
      'WhatsApp': lead.whatsapp,
      'Fecha de Registro': new Date(lead.created_at).toLocaleString()
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "Velocity_Leads.xlsx");
  };

  const totalLeads = leads.length;
  const leadsHoy = leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <div 
      className="min-h-screen bg-zinc-950 text-white p-8"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Reporte de Sistema - <span className="text-red-500">Leads</span></h1>
            <p className="text-zinc-500 text-sm mt-1">Gestión administrativa de Velocity Motors</p>
          </div>
          <button 
            onClick={handleLogout}
            className="border border-zinc-700 hover:border-red-500 hover:text-red-500 text-zinc-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-all cursor-pointer bg-zinc-900/50 hover:bg-zinc-800"
          >
            Cerrar Sesión
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 flex flex-col justify-center shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)]">
            <span className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-1">Total de Leads</span>
            <span className="text-4xl font-black text-white">{totalLeads}</span>
          </div>
          <div className="bg-zinc-900/60 border border-red-900/30 rounded-xl p-6 flex flex-col justify-center shadow-[0_0_20px_-5px_rgba(239,68,68,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
            <span className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-1">Nuevos Hoy</span>
            <span className="text-4xl font-black text-red-500">{leadsHoy}</span>
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-zinc-200">Listado Reciente</h2>
          <button 
            onClick={exportToExcel}
            className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs px-4 py-2 rounded transition-all shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)] hover:shadow-[0_0_20px_-3px_rgba(239,68,68,0.6)] flex items-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar a Excel
          </button>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest font-bold">
                  <th className="p-4 w-16">ID</th>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">WhatsApp</th>
                  <th className="p-4">Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-zinc-500 text-sm">Cargando leads...</td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-zinc-500 text-sm">No hay leads registrados todavía.</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                      <td className="p-4 text-zinc-500 text-sm font-mono">{lead.id}</td>
                      <td className="p-4 font-medium text-zinc-200">{lead.nombre}</td>
                      <td className="p-4 text-red-500 font-mono text-sm">{lead.whatsapp}</td>
                      <td className="p-4 text-zinc-500 text-sm">
                        {new Date(lead.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
