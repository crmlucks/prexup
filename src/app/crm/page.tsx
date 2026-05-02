"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  DollarSign,
  MessageCircle,
  Clock,
  LayoutGrid,
  List as ListIcon,
  GripVertical,
  ChevronRight,
  User,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { LeadModal } from '@/components/crm/LeadModal';
import { cn } from '@/lib/utils';

const columns = [
  { id: 'new', title: 'Nuevos Leads', color: 'bg-blue-500' },
  { id: 'qualified', title: 'Calificados', color: 'bg-purple-500' },
  { id: 'proposal', title: 'Propuesta', color: 'bg-pink-500' },
  { id: 'negotiation', title: 'Negociación', color: 'bg-orange-500' },
  { id: 'won', title: 'Cerrado Ganado', color: 'bg-emerald-500' },
];

export default function CRMPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mock data if API fails
        setLeads([
          { id: '1', name: 'Sarah Miller', phone: '+1 234 567', status: 'new', budget: '$450k', property: 'Villa Beachfront', agent: 'Alex Morgan', source: 'WhatsApp', time: '2h ago' },
          { id: '2', name: 'David Chen', phone: '+1 987 654', status: 'qualified', budget: '$1.2M', property: 'Penthouse', agent: 'Sarah Connor', source: 'Facebook', time: '5h ago' },
        ]);
        setLoading(false);
      });
  }, []);

  const moveLead = (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const handleAddLead = (newLead: any) => {
    setLeads(prev => [newLead, ...prev]);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-10">
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddLead} 
      />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-outfit tracking-tight">Gestión de Clientes CRM</h1>
          <p className="text-muted text-xs mt-0.5">Visualiza y gestiona tu pipeline de ventas.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex p-1 bg-foreground/5 rounded-lg border border-card-border mr-2">
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-1.5 rounded-md transition-all", view === 'kanban' ? "bg-background shadow-sm text-brand-purple" : "text-muted hover:text-foreground")}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-1.5 rounded-md transition-all", view === 'list' ? "bg-background shadow-sm text-brand-purple" : "text-muted hover:text-foreground")}
            >
              <ListIcon size={16} />
            </button>
          </div>

          <div className="relative group hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-9 pr-3 py-1.5 rounded-lg text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all w-40"
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-brand text-white text-[11px] font-bold shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={14} />
            Nuevo Lead
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'kanban' ? (
          <motion.div 
            key="kanban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]"
          >
            {columns.map((col) => (
              <div key={col.id} className="flex-shrink-0 w-64 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${col.color}`} />
                    <h3 className="font-bold text-[10px] text-foreground uppercase tracking-widest">{col.title}</h3>
                    <span className="text-[9px] text-muted bg-foreground/5 px-1.5 py-0.5 rounded-md">
                      {leads.filter(l => l.status === col.id).length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 p-2 bg-foreground/[0.01] rounded-xl border border-primary-brand shadow-[0_0_15px_rgba(192,0,255,0.03)]">
                  {leads.filter(l => l.status === col.id).map((lead) => (
                    <motion.div 
                      key={lead.id}
                      layoutId={lead.id}
                      className="glass p-3 rounded-lg cursor-grab active:cursor-grabbing hover:border-brand-purple/30 transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-1">
                          <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-foreground/5 text-muted">
                            {lead.source}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="text-muted hover:text-brand-purple transition-all p-1" title="Cambiar Etapa">
                            <ArrowRightLeft size={10} />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-[11px] mb-0.5 leading-tight">{lead.name}</h4>
                      <p className="text-[9px] text-muted mb-3 truncate">{lead.property} • {lead.agent}</p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-card-border">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-[9px] text-muted font-bold">
                            <DollarSign size={10} className="mr-0.5 text-emerald-500" />
                            {lead.budget}
                          </div>
                        </div>
                        <div className="flex items-center text-[8px] text-muted font-medium">
                          <Clock size={10} className="mr-0.5" />
                          {lead.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-1.5 border border-dashed border-card-border rounded-lg text-[9px] text-muted hover:text-foreground hover:border-brand-purple/40 transition-all uppercase tracking-widest font-black"
                  >
                    + Añadir Lead
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-xl overflow-hidden border border-card-border"
          >
            <table className="w-full text-left">
              <thead className="bg-foreground/[0.02] border-b border-card-border">
                <tr className="text-[10px] text-muted uppercase tracking-widest font-black">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Presupuesto</th>
                  <th className="px-4 py-3">Asesor</th>
                  <th className="px-4 py-3">Origen</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-card-border last:border-0 hover:bg-foreground/[0.01] transition-all group">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                          <User size={12} />
                        </div>
                        <div>
                          <p className="font-bold">{lead.name}</p>
                          <p className="text-[9px] text-muted">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                        columns.find(c => c.id === lead.status)?.color.replace('bg-', 'bg-opacity-10 text-')
                      )}>
                        {columns.find(c => c.id === lead.status)?.title}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-bold text-emerald-500">{lead.budget}</td>
                    <td className="px-4 py-2.5 text-muted">{lead.agent}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[9px] font-bold text-muted bg-foreground/5 px-1.5 py-0.5 rounded-md">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button className="p-1.5 hover:bg-brand-purple/10 rounded-md transition-all text-muted hover:text-brand-purple">
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
