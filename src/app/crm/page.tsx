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
  ChevronRight,
  User,
  GripHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { LeadModal } from '@/components/crm/LeadModal';
import { cn } from '@/lib/utils';

const columns = [
  { id: 'new', title: 'Nuevos Leads', color: 'border-blue-500', dot: 'bg-blue-500' },
  { id: 'qualified', title: 'Calificados', color: 'border-purple-500', dot: 'bg-purple-500' },
  { id: 'proposal', title: 'Propuesta', color: 'border-pink-500', dot: 'bg-pink-500' },
  { id: 'negotiation', title: 'Negociación', color: 'border-orange-500', dot: 'bg-orange-500' },
  { id: 'won', title: 'Cerrado Ganado', color: 'border-emerald-500', dot: 'bg-emerald-500' },
];

export default function CRMPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulando carga de datos
    setTimeout(() => {
      setLeads([
        { id: '1', name: 'Sarah Miller', phone: '+1 234 567', status: 'new', budget: '$450k', property: 'Villa Beachfront', agent: 'Alex Morgan', source: 'WhatsApp', time: 'Ahora' },
        { id: '2', name: 'David Chen', phone: '+1 987 654', status: 'new', budget: '$1.2M', property: 'Penthouse', agent: 'Sarah Connor', source: 'Facebook', time: '5m' },
        { id: '3', name: 'Juan Perez', phone: '+57 300...', status: 'qualified', budget: '$50k', property: 'Penthouse Downtown', agent: 'Sarah Connor', source: 'Facebook', time: '1h' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    setLeads(prev => prev.map(l => 
      l.id === draggableId ? { ...l, status: destination.droppableId } : l
    ));
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-outfit tracking-tight">Embudo de Ventas</h1>
          <p className="text-muted text-[11px] mt-0.5">Gestiona tus prospectos con precisión.</p>
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

          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-brand text-white text-[11px] font-bold shadow-lg shadow-brand-purple/20 transition-all uppercase tracking-widest">
            <Plus size={14} />
            Nuevo Lead
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)] items-start">
            {columns.map((col) => (
              <div key={col.id} className="flex-shrink-0 w-64 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", col.dot)} />
                    <h3 className="font-black text-[10px] text-foreground uppercase tracking-widest">{col.title}</h3>
                    <span className="text-[9px] text-muted bg-foreground/5 px-1.5 py-0.5 rounded-md font-bold">
                      {leads.filter(l => l.status === col.id).length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableId}
                      ref={provided.innerRef}
                      className={cn(
                        "flex-1 space-y-3 p-2 bg-foreground/[0.01] rounded-xl border border-thin transition-colors min-h-[150px]",
                        snapshot.isDraggingOver ? "bg-foreground/[0.03] border-brand-purple/40" : "border-card-border"
                      )}
                    >
                      {leads.filter(l => l.status === col.id).map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "glass p-3 rounded-lg border-thin transition-all group relative",
                                col.color, // Color del borde igual al pipeline
                                snapshot.isDragging && "shadow-2xl rotate-2 scale-105 z-50 border-brand-purple"
                              )}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-foreground/5 text-muted">
                                  {lead.source}
                                </span>
                                <GripHorizontal size={12} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              
                              <h4 className="font-bold text-[12px] mb-0.5 tracking-tight">{lead.name}</h4>
                              <p className="text-[10px] text-muted leading-tight truncate">
                                {lead.property} <br />
                                <span className="text-[9px] opacity-70 italic">{lead.agent}</span>
                              </p>
                              
                              <div className="flex items-center justify-between pt-2 mt-3 border-t border-card-border">
                                <div className="flex items-center text-[10px] font-black text-emerald-500">
                                  <DollarSign size={10} className="mr-0.5" />
                                  {lead.budget}
                                </div>
                                <div className="flex items-center text-[9px] text-muted font-bold">
                                  <Clock size={10} className="mr-0.5" />
                                  {lead.time}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-1.5 border border-dashed border-card-border rounded-lg text-[9px] text-muted hover:text-foreground hover:border-brand-purple/40 transition-all uppercase tracking-widest font-black"
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
        <div className="glass rounded-xl overflow-hidden border border-primary-brand">
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
                  <td className="px-4 py-2.5 font-bold text-emerald-500">{lead.budget}</td>
                  <td className="px-4 py-2.5 text-muted">{lead.agent}</td>
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
