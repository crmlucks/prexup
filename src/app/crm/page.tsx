"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  DollarSign,
  Clock,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  User,
  GripHorizontal,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { LeadModal } from '@/components/crm/LeadModal';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

const columns = [
  { id: 'new', title: 'Nuevos Leads', color: 'border-blue-500/30', dot: 'bg-blue-500', divider: 'divider-new' },
  { id: 'qualified', title: 'Calificados', color: 'border-purple-500/30', dot: 'bg-purple-500', divider: 'divider-qualified' },
  { id: 'proposal', title: 'Propuesta', color: 'border-pink-500/30', dot: 'bg-pink-500', divider: 'divider-proposal' },
  { id: 'negotiation', title: 'Negociación', color: 'border-orange-500/30', dot: 'bg-orange-500', divider: 'divider-negotiation' },
  { id: 'won', title: 'Cerrado Ganado', color: 'border-emerald-500/30', dot: 'bg-emerald-500', divider: 'divider-won' },
];

export default function CRMPage() {
  const { showToast } = useToast();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeads(data);
      }
    } catch (error) {
      showToast('Error al cargar leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Actualización local para velocidad
    const updatedLeads = leads.map(l => 
      String(l.id) === draggableId ? { ...l, status: destination.droppableId } : l
    );
    setLeads(updatedLeads);

    // TODO: Enviar actualización a la DB (api/leads/update)
    console.log('Cambiando estado de', draggableId, 'a', destination.droppableId);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-10">
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchLeads} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-outfit tracking-tight">Embudo de Ventas</h1>
          <p className="text-muted text-[11px] mt-0.5">Gestión visual de prospectos en tiempo real.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex p-0.5 bg-foreground/5 rounded-lg border border-primary-brand mr-2">
            <button onClick={() => setView('kanban')} className={cn("p-1.5 rounded-md transition-all", view === 'kanban' ? "bg-background shadow-sm text-brand-purple" : "text-muted")}>
              <LayoutGrid size={14} />
            </button>
            <button onClick={() => setView('list')} className={cn("p-1.5 rounded-md transition-all", view === 'list' ? "bg-background shadow-sm text-brand-purple" : "text-muted")}>
              <ListIcon size={14} />
            </button>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-brand text-white text-[11px] font-black shadow-lg shadow-brand-purple/20 transition-all uppercase tracking-widest">
            <Plus size={14} />
            Nuevo Lead
          </button>
        </div>
      </div>

      {loading && leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
          <Loader2 size={40} className="animate-spin text-brand-purple mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest">Sincronizando con MariaDB...</p>
        </div>
      ) : view === 'kanban' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)] items-start">
            {columns.map((col) => (
              <div key={col.id} className="flex-shrink-0 w-64 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1 h-1 rounded-full", col.dot)} />
                    <h3 className="font-black text-[10px] text-foreground uppercase tracking-widest opacity-80">{col.title}</h3>
                    <span className="text-[9px] text-muted bg-foreground/5 px-1.5 py-0.5 rounded-md font-bold">
                      {leads.filter(l => l.status === col.id).length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex-1 space-y-3 p-2 bg-foreground/[0.005] rounded-xl border-deep transition-all min-h-[300px]",
                        snapshot.isDraggingOver && "bg-foreground/[0.02] border-brand-purple/20"
                      )}
                    >
                      {leads.filter(l => l.status === col.id).map((lead, index) => (
                        <Draggable key={String(lead.id)} draggableId={String(lead.id)} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "glass p-3 rounded-lg border-thin transition-all group relative",
                                col.color,
                                snapshot.isDragging ? "shadow-2xl z-50 border-brand-purple/50" : ""
                              )}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-foreground/5 text-muted">
                                  {lead.source}
                                </span>
                                <GripHorizontal size={10} className="text-muted opacity-40 group-hover:opacity-100 transition-opacity" />
                              </div>
                              
                              <h4 className="font-bold text-[12px] mb-0.5 tracking-tight">{lead.name}</h4>
                              <p className="text-[10px] text-muted leading-tight truncate">
                                {lead.project_interest || lead.property || 'Sin proyecto'} <br />
                                <span className="text-[9px] opacity-60 italic">{lead.assigned_agent || lead.agent}</span>
                              </p>
                              
                              <div className={cn("w-full h-[0.5px] mt-3 mb-2", col.divider)} />
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-[11px] font-black text-emerald-500">
                                  <DollarSign size={10} className="mr-0.5" />
                                  {lead.budget} {lead.currency}
                                </div>
                                <div className="flex items-center text-[9px] text-muted font-bold">
                                  <Clock size={10} className="mr-0.5" />
                                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'Hoy'}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 border border-dashed border-white/[0.05] rounded-lg text-[9px] text-muted hover:text-foreground hover:border-brand-purple/20 transition-all uppercase tracking-widest font-black"
                      >
                        + Añadir Lead
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="glass rounded-xl overflow-hidden border border-deep">
          <table className="w-full text-left">
            <thead className="bg-foreground/[0.02] border-b border-primary-subtle">
              <tr className="text-[10px] text-muted uppercase tracking-widest font-black">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Presupuesto</th>
                <th className="px-4 py-3">Asesor</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-primary-subtle last:border-0 hover:bg-foreground/[0.01] transition-all">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center text-muted">
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
                      columns.find(c => c.id === lead.status)?.dot.replace('bg-', 'bg-opacity-10 text-')
                    )}>
                      {columns.find(c => c.id === lead.status)?.title}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-bold text-emerald-500">{lead.budget} {lead.currency}</td>
                  <td className="px-4 py-2.5 text-muted">{lead.assigned_agent}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button className="p-1.5 hover:bg-brand-purple/10 rounded-md transition-all text-muted hover:text-brand-purple">
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
