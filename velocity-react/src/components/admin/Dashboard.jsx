import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import * as XLSX from 'xlsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  // --- Procesamiento de Datos para Gráficas ---
  // 1. Crecimiento de Leads (Últimos 7 días)
  const processGrowthData = () => {
    const data = {};
    const today = new Date();
    // Inicializar los últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      data[dateString] = 0;
    }
    
    leads.forEach(lead => {
      const d = new Date(lead.created_at);
      const dateString = d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      if (data[dateString] !== undefined) {
        data[dateString] += 1;
      }
    });

    return Object.keys(data).map(key => ({ date: key, count: data[key] }));
  };

  // 2. Diversidad de Modelos (Pie Chart)
  const processModelData = () => {
    const data = {};
    leads.forEach(lead => {
      // Ignorar leads viejos sin modelo si no queremos que salgan "Desconocido"
      // o mapearlos:
      const model = lead.modelo_auto || 'Otros';
      data[model] = (data[model] || 0) + 1;
    });
    return Object.keys(data).map(key => ({ name: key, value: data[key] }));
  };

  const growthData = processGrowthData();
  const modelData = processModelData();
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

  return (
    <div 
      className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Reporte de Sistema - <span className="text-red-500">Leads</span></h1>
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

        {/* --- SECCIÓN DE GRÁFICAS (Analytics) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Crecimiento LineChart */}
           <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)]">
            <h2 className="text-base sm:text-lg font-bold text-zinc-200 mb-4 sm:mb-6">Crecimiento de Leads (Últimos 7 días)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-35} textAnchor="end" height={50} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#ef4444' }}
                  />
                  <Line type="monotone" dataKey="count" name="Leads" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diversidad PieChart */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)] flex flex-col">
            <h2 className="text-base sm:text-lg font-bold text-zinc-200 mb-2">Preferencia de Modelos</h2>
            <div className="flex-1 min-h-[200px] flex items-center justify-center">
              {modelData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {modelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-zinc-500 text-sm text-center">No hay datos suficientes</p>
              )}
            </div>
            {/* Leyenda personalizada */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {modelData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-4">
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
