"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  MessageCircle, 
  Phone, 
  Calendar,
  LayoutGrid,
  List as ListIcon,
  User,
  Trash2,
  Edit2,
  ExternalLink,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LeadModal from '@/components/crm/LeadModal';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

const columns = [
  { id: 'new', title: 'Nuevo Lead', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Contactado', color: 'bg-purple-500' },
  { id: 'qualified', title: 'Calificado', color: 'bg-amber-500' },
  { id: 'proposal', title: 'Propuesta', color: 'bg-emerald-500' },
  { id: 'negotiation', title: 'Negociación', color: 'bg-brand-purple' },
];

export default function CRMPage() {
  const { showToast } = useToast();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState<any>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      if (Array.isArray(data)) setLeads(data);
    } catch (error) {
      console.error('Error fetching leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este lead?')) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Lead eliminado con éxito', 'success');
        fetchLeads();
      }
    } catch (err) {
      showToast('Error al eliminar', 'error');
    }
  };

  const handleEdit = (lead: any) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const KanbanView = () => (
    <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-250px)] custom-scrollbar">
      {columns.map((col) => (
        <div key={col.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", col.color)} />
              <h3 className="font-black text-[11px] uppercase tracking-[0.15em] text-foreground/80">{col.title}</h3>
              <span className="text-[10px] bg-foreground/5 px-2 py-0.5 rounded-full font-bold">
                {leads.filter(l => l.status === col.id).length}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 p-3 bg-foreground/[0.02] rounded-3xl border-thin">
            {leads
              .filter((lead) => lead.status === col.id)
              .map((lead) => (
                <motion.div 
                  key={lead.id}
                  layoutId={lead.id.toString()}
                  className="glass p-5 rounded-2xl border-thin shadow-sm hover:shadow-xl hover:border-brand-purple/30 transition-all cursor-grab active:cursor-grabbing bg-background/40 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-md">{lead.source || 'WHATSAPP'}</span>
                    <button className="text-muted hover:text-foreground"><MoreVertical size={14} /></button>
                  </div>
                  
                  <h4 className="font-bold text-[14px] mb-1 text-foreground leading-tight">{lead.name}</h4>
                  <p className="text-[11px] text-muted mb-1 font-medium">{lead.project_interest}</p>
                  
                  {/* TELÉFONO VISIBLE */}
                  <div className="flex items-center gap-2 text-brand-purple font-bold mb-4">
                    <Phone size={12} />
                    <span className="text-[12px]">{lead.phone}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                       <span className="text-[13px] font-black text-emerald-500">${lead.budget || '0'} <span className="text-[9px] opacity-60">{lead.currency}</span></span>
                    </div>
                    
                    {/* BOTONES DE ACCIÓN VISIBLES */}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleEdit(lead)} 
                        title="Editar Lead"
                        className="p-2 rounded-xl bg-foreground/5 hover:bg-brand-purple/10 text-muted hover:text-brand-purple transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <Link 
                        href="/chat" 
                        title="Ir al Chat"
                        className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:scale-110 transition-all"
                      >
                        <MessageCircle size={14} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(lead.id)} 
                        title="Eliminar"
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            
            <button 
              onClick={() => { setEditingLead(null); setIsModalOpen(true); }}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-white/5 hover:border-brand-purple/20 hover:bg-brand-purple/5 text-muted hover:text-brand-purple transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Añadir Lead
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="glass rounded-3xl overflow-hidden border-thin bg-background/40">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-foreground/[0.03] border-b border-deep text-[10px] font-black uppercase tracking-widest text-muted">
            <th className="p-5">Lead / Origen</th>
            <th className="p-5">Contacto</th>
            <th className="p-5">Proyecto</th>
            <th className="p-5">Estado</th>
            <th className="p-5 text-right">Acciones de Seguimiento</th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-deep hover:bg-foreground/[0.02] transition-all">
              <td className="p-5">
                <div className="font-bold text-[13px]">{lead.name}</div>
                <div className="text-[9px] font-black text-brand-purple uppercase tracking-widest mt-0.5">{lead.source}</div>
              </td>
              <td className="p-5">
                <div className="flex flex-col gap-0.5">
                   <span className="font-bold text-foreground/90">{lead.phone}</span>
                   <span className="text-[11px] text-muted">{lead.email || 'Sin correo'}</span>
                </div>
              </td>
              <td className="p-5 font-bold text-foreground/80">{lead.project_interest}</td>
              <td className="p-5">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block shadow-sm",
                  columns.find(c => c.id === lead.status)?.color.replace('bg-', 'text-').replace('500', '600') || 'text-gray-500',
                  "bg-white/10"
                )}>
                  {columns.find(c => c.id === lead.status)?.title || lead.status}
                </span>
              </td>
              <td className="p-5">
                <div className="flex items-center justify-end gap-3">
                  <a href={`tel:${lead.phone}`} title="Llamar ahora" className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 hover:scale-110 transition-all border border-blue-500/20"><Phone size={16} /></a>
                  <Link href="/chat" title="Chat WhatsApp" className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:scale-110 transition-all border border-emerald-500/20"><MessageCircle size={16} /></Link>
                  <button onClick={() => handleEdit(lead)} title="Editar Lead" className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 hover:scale-110 transition-all border border-amber-500/20"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(lead.id)} title="Eliminar" className="p-2.5 rounded-2xl bg-red-500/10 text-red-500 hover:scale-110 transition-all border border-red-500/20"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header CRM */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-2xl font-black font-outfit tracking-tight">CRM PrexUp</h1>
             <span className="bg-brand-purple/20 text-brand-purple text-[9px] font-black px-2 py-0.5 rounded-md border border-brand-purple/30 uppercase tracking-widest">v1.5 PRODUCTION</span>
          </div>
          <p className="text-muted text-[11px] font-medium uppercase tracking-wider">Gestión de Pipeline en tiempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-foreground/5 p-1 rounded-2xl border-thin">
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-2.5 rounded-xl transition-all", view === 'kanban' ? "bg-white shadow-md text-brand-purple" : "text-muted hover:text-foreground")}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-2.5 rounded-xl transition-all", view === 'list' ? "bg-white shadow-md text-brand-purple" : "text-muted hover:text-foreground")}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button 
            onClick={() => { setEditingLead(null); setIsModalOpen(true); }}
            className="flex items-center gap-3 bg-gradient-brand text-white px-6 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-brand-purple/30 hover:scale-[1.03] active:scale-95 transition-all"
          >
            <Plus size={18} />
            Nuevo Lead
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-foreground/[0.01] p-2 rounded-2xl border-thin">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, teléfono o proyecto..." 
            className="w-full bg-white/5 border-thin rounded-xl pl-12 pr-4 py-3 text-[13px] font-medium focus:outline-none focus:border-brand-purple/50 transition-all shadow-inner"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 border-thin rounded-xl text-[11px] font-black uppercase tracking-widest text-muted hover:text-brand-purple transition-all">
            <Filter size={14} /> Filtros
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-brand-purple" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Sincronizando Leads...</p>
          </div>
        ) : view === 'kanban' ? (
          <motion.div key="kanban" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <KanbanView />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <ListView />
          </motion.div>
        )}
      </AnimatePresence>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingLead(null); }} 
        onSuccess={fetchLeads}
        editLead={editingLead}
      />
    </div>
  );
}
