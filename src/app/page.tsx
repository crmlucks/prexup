"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Zap,
  MessageCircle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [leadsRes, propsRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/properties').catch(() => null)
        ]);
        
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData);
        }
        
        if (propsRes && propsRes.ok) {
          const propsData = await propsRes.json();
          setPropertiesCount(propsData.length || 0);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalLeads = leads.length;
  const activeDeals = leads.filter(l => l.status !== 'closed' && l.status !== 'lost').length;
  const totalPipelineValue = leads
    .filter(l => l.status !== 'closed' && l.status !== 'lost')
    .reduce((sum, l) => sum + (Number(l.budget) || 0), 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value}`;
  };

  const stats = [
    { label: 'Leads Totales', value: loading ? '...' : totalLeads.toString(), change: '+12%', trend: 'up', icon: Users, color: 'text-blue-500' },
    { label: 'Propiedades', value: loading ? '...' : propertiesCount.toString(), change: '+3%', trend: 'up', icon: Home, color: 'text-purple-500' },
    { label: 'Tratos Activos', value: loading ? '...' : activeDeals.toString(), change: '+5%', trend: 'up', icon: TrendingUp, color: 'text-pink-500' },
    { label: 'Pipeline (Valor)', value: loading ? '...' : formatCurrency(totalPipelineValue), change: '+18%', trend: 'up', icon: DollarSign, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit tracking-tight">Panel de Control</h1>
          <p className="text-muted text-[11px] mt-0.5 uppercase tracking-wider font-semibold">Resumen de Actividades en Tiempo Real</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/crm" className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] uppercase tracking-widest font-black shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Ir al CRM
          </Link>
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
            className="glass p-4 rounded-xl relative group overflow-hidden border-thin hover:border-brand-purple transition-all"
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
              <h3 className="text-muted text-[10px] font-black uppercase tracking-wider">{stat.label}</h3>
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
              { title: 'Leads Calientes', desc: `Detectados ${Math.max(1, Math.floor(activeDeals * 0.2))} prospectos con alta probabilidad de cierre.`, icon: Zap, color: 'text-yellow-500' },
              { title: 'Oportunidad de Venta', desc: 'Sugerencia de contactar leads inactivos con ofertas nuevas.', icon: MessageCircle, color: 'text-blue-500' },
              { title: 'Alerta Seguimiento', desc: 'Hay leads en fase de propuesta esperando respuesta.', icon: TrendingUp, color: 'text-red-500' }
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
          
          <button className="mt-auto w-full pt-4 text-[11px] font-bold text-brand-purple hover:scale-105 transition-all border-t border-card-border uppercase tracking-widest">
            Actualizar Análisis
          </button>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="glass rounded-xl p-5 border-thin hover:border-brand-purple/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Leads Recientes</h2>
          <Link href="/crm" className="text-[10px] uppercase font-black tracking-widest text-brand-purple hover:scale-105 transition-all">Ver todos en CRM</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-black text-muted uppercase tracking-widest border-b border-card-border">
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Contacto</th>
                <th className="pb-3">Origen / Etapa</th>
                <th className="pb-3">Presupuesto</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <Loader2 size={24} className="animate-spin text-brand-purple mx-auto mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Cargando Leads...</span>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Aún no hay leads registrados.</span>
                  </td>
                </tr>
              ) : leads.slice(0, 5).map((lead, i) => (
                <tr key={lead.id || i} className="group hover:bg-white/[0.02] dark:hover:bg-white/[0.02] transition-colors border-b border-card-border/50 last:border-0">
                  <td className="py-3 font-bold text-slate-800 dark:text-white/90">{lead.name || 'Desconocido'}</td>
                  <td className="py-3 text-slate-500 dark:text-muted text-[10px] font-medium">{lead.phone || lead.email || 'Sin contacto'}</td>
                  <td className="py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`w-max px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${
                        lead.status === 'closed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        lead.status === 'qualified' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        lead.status === 'proposal' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {lead.status || 'Nuevo'}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted">{lead.source || 'ORGÁNICO'}</span>
                    </div>
                  </td>
                  <td className="py-3 text-emerald-500 font-bold text-[11px]">${lead.budget || '0'} <span className="text-[8px] text-muted">{lead.currency || 'USD'}</span></td>
                  <td className="py-3 text-right">
                    <Link href={`/chat`} className="inline-flex p-1.5 hover:bg-brand-purple/10 rounded-md transition-colors text-muted hover:text-brand-purple">
                      <ArrowUpRight size={14} />
                    </Link>
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
