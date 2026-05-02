"use client";

import React from 'react';
import { 
  Users, 
  Home, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Zap,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Leads Totales', value: '1,284', change: '+12.5%', trend: 'up', icon: Users, color: 'text-blue-500' },
  { label: 'Propiedades', value: '432', change: '+3.2%', trend: 'up', icon: Home, color: 'text-purple-500' },
  { label: 'Tratos Activos', value: '48', change: '-2.4%', trend: 'down', icon: TrendingUp, color: 'text-pink-500' },
  { label: 'Ingresos Totales', value: '$4.2M', change: '+18.7%', trend: 'up', icon: DollarSign, color: 'text-emerald-500' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit tracking-tight">Panel de Control</h1>
          <p className="text-muted text-xs mt-0.5">Bienvenido de nuevo, Alex. Esto es lo que sucede hoy.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg glass-hover text-xs font-medium border border-card-border transition-all">
            Exportar Informe
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-gradient-brand text-white text-xs font-semibold shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            + Nueva Propiedad
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="glass p-4 rounded-xl relative group overflow-hidden border-thin hover:border-primary-brand transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-foreground/5 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                stat.trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                {stat.change}
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-muted text-[10px] font-semibold uppercase tracking-wider">{stat.label}</h3>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart / Area */}
        <div className="lg:col-span-2 glass rounded-xl p-5 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-purple" />
              Rendimiento de Ventas
            </h2>
            <select className="bg-transparent text-[11px] text-muted border-none focus:ring-0 cursor-pointer">
              <option>Últimos 30 días</option>
              <option>Últimos 6 meses</option>
              <option>Este año</option>
            </select>
          </div>
          <div className="flex-1 flex items-end gap-1.5 px-1">
            {[40, 60, 45, 90, 65, 85, 100, 75, 50, 80, 95, 110, 80, 70, 90].map((height, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.03, duration: 0.8 }}
                className="flex-1 bg-gradient-to-t from-brand-purple/30 to-brand-purple/5 rounded-t-[2px]"
              />
            ))}
          </div>
        </div>

        {/* AI Sales Insights */}
        <div className="glass rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-brand-purple/20 flex items-center justify-center">
              <Sparkles size={14} className="text-brand-purple animate-pulse" />
            </div>
            <h2 className="text-sm font-semibold">IA Insights</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { title: 'Leads Calientes', desc: 'Los leads de WhatsApp subieron un 22%. 5 prospectos listos.', icon: Zap, color: 'text-yellow-500' },
              { title: 'Recomendación IA', desc: 'Coincidencia para "Villa Beachfront" con 3 leads activos.', icon: MessageCircle, color: 'text-blue-500' },
              { title: 'Alerta Seguimiento', desc: 'Juan Pérez espera respuesta hace 4h. Riesgo de fuga.', icon: TrendingUp, color: 'text-red-500' }
            ].map((insight, i) => (
              <div key={i} className="p-3 rounded-lg bg-foreground/5 border border-transparent hover:border-brand-purple/20 transition-all cursor-pointer group">
                <div className="flex gap-3">
                  <div className={`mt-0.5 ${insight.color}`}>
                    <insight.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold group-hover:text-brand-purple transition-colors">{insight.title}</h4>
                    <p className="text-[10px] text-muted mt-0.5 leading-snug">{insight.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-auto w-full pt-4 text-[11px] font-bold text-brand-purple hover:text-brand-magenta transition-colors border-t border-card-border">
            Ver todos los reportes IA
          </button>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Leads Recientes (WhatsApp)</h2>
          <button className="text-[11px] text-brand-purple font-bold">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-muted uppercase tracking-widest border-b border-card-border">
                <th className="pb-2 font-semibold">Cliente</th>
                <th className="pb-2 font-semibold">Teléfono</th>
                <th className="pb-2 font-semibold">Estado</th>
                <th className="pb-2 font-semibold">Presupuesto</th>
                <th className="pb-2 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {[
                { name: 'Sarah Miller', phone: '+1 234 567 890', status: 'Calificado', budget: '$450k - $600k' },
                { name: 'David Chen', phone: '+1 987 654 321', status: 'Nuevo', budget: '$1.2M - $1.5M' },
                { name: 'Michael Ross', phone: '+1 456 789 012', status: 'Propuesta', budget: '$800k - $900k' },
                { name: 'Elena Gomez', phone: '+1 321 654 098', status: 'Ganado', budget: '$2.5M' },
              ].map((lead, i) => (
                <tr key={i} className="group hover:bg-foreground/[0.02] transition-colors border-b border-card-border last:border-0">
                  <td className="py-2.5 font-bold">{lead.name}</td>
                  <td className="py-2.5 text-muted">{lead.phone}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      lead.status === 'Ganado' ? 'bg-emerald-500/10 text-emerald-500' : 
                      lead.status === 'Calificado' ? 'bg-blue-500/10 text-blue-500' :
                      lead.status === 'Propuesta' ? 'bg-purple-500/10 text-purple-500' : 'bg-muted/10 text-muted'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted">{lead.budget}</td>
                  <td className="py-2.5 text-right">
                    <button className="p-1 hover:bg-brand-purple/10 rounded-md transition-colors text-muted hover:text-brand-purple">
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
