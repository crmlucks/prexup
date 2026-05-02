"use client";

import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  DollarSign,
  MessageCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const columns = [
  { id: 'new', title: 'Nuevos Leads', color: 'bg-blue-500' },
  { id: 'qualified', title: 'Calificados', color: 'bg-purple-500' },
  { id: 'proposal', title: 'Propuesta', color: 'bg-pink-500' },
  { id: 'negotiation', title: 'Negociación', color: 'bg-orange-500' },
  { id: 'won', title: 'Cerrado Ganado', color: 'bg-emerald-500' },
];

export default function CRMPage() {
  const [leads, setLeads] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map((l: any) => ({
          ...l,
          budget: typeof l.budget === 'number' ? `$${(l.budget / 1000).toFixed(0)}k` : l.budget,
          time: l.time || 'Ahora',
          priority: l.priority === 'high' ? 'alta' : l.priority === 'medium' ? 'media' : 'baja',
          property: l.property || 'Analizando interés...'
        }));
        setLeads(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-outfit tracking-tight">Embudo de Ventas</h1>
          <p className="text-muted text-xs mt-0.5">Gestiona tus prospectos y cierres de forma eficiente.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-purple transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar leads..." 
              className="pl-9 pr-3 py-1.5 rounded-lg text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all w-48"
            />
          </div>
          <button className="p-1.5 rounded-lg glass-hover border border-card-border">
            <Filter size={16} className="text-muted" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-brand text-white text-[11px] font-bold shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02]">
            <Plus size={14} />
            Nuevo Trato
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
          </div>
        ) : columns.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-64 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${col.color}`} />
                <h3 className="font-bold text-[11px] text-foreground uppercase tracking-wider">{col.title}</h3>
                <span className="text-[10px] text-muted bg-foreground/5 px-1.5 py-0.5 rounded-md">
                  {leads.filter(l => l.status === col.id).length}
                </span>
              </div>
              <button className="text-muted hover:text-foreground">
                <MoreVertical size={14} />
              </button>
            </div>

            <div className="flex-1 space-y-3 p-2 bg-foreground/[0.01] rounded-xl border border-primary-brand shadow-[0_0_15px_rgba(192,0,255,0.05)]">
              {leads.filter(l => l.status === col.id).map((lead) => (
                <motion.div 
                  key={lead.id}
                  layoutId={lead.id}
                  className="glass p-3 rounded-lg cursor-grab active:cursor-grabbing hover:border-brand-purple/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                      lead.priority === 'alta' ? 'bg-red-500/10 text-red-500' : 
                      lead.priority === 'media' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {lead.priority}
                    </span>
                    <button className="text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-[12px] mb-0.5">{lead.name}</h4>
                  <p className="text-[10px] text-muted mb-3 truncate">{lead.property}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-card-border">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-[9px] text-muted">
                        <DollarSign size={10} className="mr-0.5 text-emerald-500" />
                        {lead.budget}
                      </div>
                      <div className="flex items-center text-[9px] text-muted">
                        <MessageCircle size={10} className="mr-0.5 text-blue-500" />
                        WA
                      </div>
                    </div>
                    <div className="flex items-center text-[9px] text-muted">
                      <Clock size={10} className="mr-0.5" />
                      {lead.time}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <button className="w-full py-1.5 border border-dashed border-card-border rounded-lg text-[10px] text-muted hover:text-foreground hover:border-brand-purple/40 transition-all">
                + Añadir Tarjeta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
