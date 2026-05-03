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
  ExternalLink
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
      setLeads(data);
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
        showToast('Lead eliminado', 'success');
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
              <h3 className="font-bold text-[12px] uppercase tracking-wider">{col.title}</h3>
              <span className="text-[10px] bg-foreground/5 px-2 py-0.5 rounded-full font-bold">
                {leads.filter(l => l.status === col.id).length}
              </span>
            </div>
            <button className="p-1 text-muted hover:text-foreground"><MoreVertical size={14} /></button>
          </div>

          <div className="flex-1 space-y-3 p-2 bg-foreground/[0.02] rounded-2xl border-thin">
            {leads
              .filter((lead) => lead.status === col.id)
              .map((lead) => (
                <motion.div 
                  key={lead.id}
                  layoutId={lead.id.toString()}
                  className="glass p-4 rounded-xl border-thin shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-purple">{lead.source}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(lead)} className="p-1.5 rounded-lg bg-foreground/5 hover:bg-brand-purple/10 text-muted hover:text-brand-purple"><Edit2 size={12} /></button>
                      <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded-lg bg-foreground/5 hover:bg-red-500/10 text-muted hover:text-red-500"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-[13px] mb-1">{lead.name}</h4>
                  <div className="flex items-center gap-2 text-muted mb-3">
                    <Phone size={12} className="text-brand-purple" />
                    <span className="text-[11px] font-medium">{lead.phone}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-brand-purple/20 border-2 border-background flex items-center justify-center">
                        <User size={12} className="text-brand-purple" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Link href="/chat" className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all">
                         <MessageCircle size={14} />
                       </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="glass rounded-2xl overflow-hidden border-thin">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-foreground/[0.02] border-b border-deep text-[10px] font-black uppercase tracking-widest text-muted">
            <th className="p-4">Lead</th>
            <th className="p-4">Contacto</th>
            <th className="p-4">Proyecto</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Agente</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-deep hover:bg-foreground/[0.01] transition-all group">
              <td className="p-4">
                <div className="font-bold">{lead.name}</div>
                <div className="text-[10px] text-muted">{lead.source}</div>
              </td>
              <td className="p-4">
                <div className="flex flex-col gap-0.5">
                   <span className="font-medium">{lead.phone}</span>
                   <span className="text-[10px] text-muted">{lead.email || 'Sin email'}</span>
                </div>
              </td>
              <td className="p-4 font-medium text-brand-purple">{lead.project_interest}</td>
              <td className="p-4">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                  columns.find(c => c.id === lead.status)?.color.replace('bg-', 'text-').replace('500', '600') || 'text-gray-500',
                  "bg-white/10"
                )}>
                  {columns.find(c => c.id === lead.status)?.title || lead.status}
                </span>
              </td>
              <td className="p-4 font-medium">{lead.assigned_agent}</td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <Link href="/chat" title="Ir al Chat" className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:scale-110 transition-all"><MessageCircle size={14} /></Link>
                  <a href={`tel:${lead.phone}`} title="Llamar" className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:scale-110 transition-all"><Phone size={14} /></a>
                  <button onClick={() => handleEdit(lead)} title="Editar" className="p-2 rounded-xl bg-amber-500/10 text-amber-500 hover:scale-110 transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(lead.id)} title="Eliminar" className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:scale-110 transition-all"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header CRM */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit tracking-tight">Pipeline de Ventas</h1>
          <p className="text-muted text-[11px] mt-0.5">Gestiona tus leads y haz seguimiento a tus cierres.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-foreground/5 p-1 rounded-xl border-thin">
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-2 rounded-lg transition-all", view === 'kanban' ? "bg-white shadow-sm text-brand-purple" : "text-muted hover:text-foreground")}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-white shadow-sm text-brand-purple" : "text-muted hover:text-foreground")}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button 
            onClick={() => { setEditingLead(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-gradient-brand text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={16} />
            Nuevo Lead
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, teléfono o proyecto..." 
            className="w-full bg-foreground/[0.02] border-thin rounded-xl pl-10 pr-4 py-2.5 text-[12px] focus:outline-none focus:border-brand-purple/40"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-foreground/[0.02] border-thin rounded-xl text-[12px] font-bold text-muted hover:text-foreground transition-all">
            <Filter size={14} /> Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-foreground/[0.02] border-thin rounded-xl text-[12px] font-bold text-muted hover:text-foreground transition-all">
            <Calendar size={14} /> Fecha
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-purple" size={32} />
          </div>
        ) : view === 'kanban' ? (
          <motion.div 
            key="kanban" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            <KanbanView />
          </motion.div>
        ) : (
          <motion.div 
            key="list" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
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
