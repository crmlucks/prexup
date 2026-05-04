"use client";

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  User, 
  Plus, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  MoreVertical,
  CalendarCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Events
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Visita Residencial Alquimia',
    type: 'meeting',
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    time: '10:00 AM',
    client: 'Carlos Mendoza',
    location: 'Av. Las Palmas 123',
    status: 'pending',
    color: 'emerald'
  },
  {
    id: 2,
    title: 'Llamada de Seguimiento',
    type: 'call',
    date: new Date(), // Today
    time: '03:30 PM',
    client: 'María Fernández',
    location: 'Google Meet',
    status: 'completed',
    color: 'blue'
  },
  {
    id: 3,
    title: 'Enviar Contrato de Compraventa',
    type: 'task',
    date: new Date(), // Today
    time: '05:00 PM',
    client: 'Roberto Salas',
    location: '',
    status: 'pending',
    color: 'brand-purple'
  },
  {
    id: 4,
    title: 'Revisión de Documentos',
    type: 'task',
    date: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
    time: '11:00 AM',
    client: 'Ana Lira',
    location: '',
    status: 'pending',
    color: 'amber'
  }
];

const EVENT_TYPES = [
  { id: 'all', label: 'Todos', icon: CalendarIcon },
  { id: 'meeting', label: 'Citas', icon: MapPin },
  { id: 'call', label: 'Llamadas', icon: Phone },
  { id: 'task', label: 'Tareas', icon: CheckCircle2 }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'agenda'>('agenda');

  // Funciones de navegación de calendario
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const filteredEvents = MOCK_EVENTS.filter(e => filterType === 'all' || e.type === filterType)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Componente de Tarjeta de Evento (Agenda)
  const EventCard = ({ event }: { event: typeof MOCK_EVENTS[0] }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass p-4 rounded-2xl border-thin shadow-sm hover:shadow-xl transition-all relative overflow-hidden group flex flex-col md:flex-row gap-4 md:items-center",
        `hover:border-${event.color}-500/30`
      )}
    >
      <div className={cn("absolute top-0 left-0 w-1.5 h-full transition-all", `bg-${event.color}-500`)} />
      
      {/* Time block */}
      <div className="flex flex-col items-center justify-center min-w-[80px] pl-2 md:border-r border-black/5 dark:border-white/5 pr-4">
        <span className={cn("text-[16px] font-black tracking-tight", `text-${event.color}-500`)}>
          {event.time.split(' ')[0]}
        </span>
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
          {event.time.split(' ')[1]}
        </span>
      </div>

      {/* Info block */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-opacity-10",
            `text-${event.color}-500 bg-${event.color}-500/10 border-${event.color}-500/20`
          )}>
            {event.type === 'meeting' ? 'CITA' : event.type === 'call' ? 'LLAMADA' : 'TAREA'}
          </span>
          {event.status === 'completed' && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <CheckCircle2 size={10} /> Completado
            </span>
          )}
        </div>
        <h4 className="font-bold text-[15px] text-slate-800 dark:text-white/90 leading-tight mb-1 truncate">{event.title}</h4>
        
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted font-medium mt-2">
          <div className="flex items-center gap-1">
            <User size={12} className="text-brand-purple" /> {event.client}
          </div>
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-blue-500" /> {event.location}
            </div>
          )}
          <div className="flex items-center gap-1">
            <CalendarIcon size={12} className="text-amber-500" /> 
            {isToday(event.date) ? 'Hoy' : event.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </div>
        </div>
      </div>

      {/* Action block */}
      <div className="flex items-center gap-2 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-black/5 dark:border-white/5">
        <button className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-brand-purple/10 text-slate-500 hover:text-brand-purple transition-all">
          <CheckCircle2 size={16} />
        </button>
        <button className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-blue-500/10 text-slate-500 hover:text-blue-500 transition-all">
          <Edit2Icon />
        </button>
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all">
          <MoreVertical size={16} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* HEADER */}
      <div className="glass p-5 md:p-6 rounded-3xl border-thin bg-gradient-to-br from-white/60 to-white/30 dark:from-black/40 dark:to-black/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple text-[9px] font-black tracking-widest uppercase border border-brand-purple/20">
                PRODUCTIVIDAD
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-outfit text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
              <CalendarCheck className="text-brand-purple" size={28} />
              Gestión de Tareas y Citas
            </h1>
            <p className="text-sm text-slate-500 dark:text-muted mt-1 font-medium">
              Organiza tu día, haz seguimiento a leads y no pierdas ninguna oportunidad.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all border",
                showFilters 
                  ? "bg-brand-purple/10 border-brand-purple/30 text-brand-purple" 
                  : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-600 dark:text-muted hover:border-brand-purple/30 hover:text-brand-purple"
              )}>
              <Filter size={14} /> Filtros
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-[12px] font-bold shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02]">
              <Plus size={16} /> Nuevo Evento
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-2">
                {EVENT_TYPES.map(type => (
                  <button 
                    key={type.id}
                    onClick={() => setFilterType(type.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border",
                      filterType === type.id 
                        ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md" 
                        : "bg-white dark:bg-white/5 border-black/5 dark:border-white/5 text-slate-500 dark:text-muted hover:bg-black/5 dark:hover:bg-white/10"
                    )}
                  >
                    <type.icon size={12} /> {type.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONTROLES DE CALENDARIO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-white dark:bg-black/20 p-2 rounded-2xl border border-black/5 dark:border-white/5 glass">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-muted">
            <ChevronLeft size={18} />
          </button>
          <div className="w-40 text-center">
            <span className="text-[15px] font-black text-slate-800 dark:text-white capitalize">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-muted">
            <ChevronRight size={18} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded-lg bg-brand-purple/10 text-brand-purple text-[11px] font-bold ml-2">
            Hoy
          </button>
        </div>

        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5">
          <button 
            onClick={() => setViewMode('agenda')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all",
              viewMode === 'agenda' ? "bg-white dark:bg-black/60 text-brand-purple shadow-sm" : "text-slate-500 dark:text-muted hover:text-slate-800 dark:hover:text-white"
            )}
          >
            Agenda
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all",
              viewMode === 'grid' ? "bg-white dark:bg-black/60 text-brand-purple shadow-sm" : "text-slate-500 dark:text-muted hover:text-slate-800 dark:hover:text-white"
            )}
          >
            Mes
          </button>
        </div>
      </div>

      {/* VISTA AGENDA */}
      {viewMode === 'agenda' && (
        <div className="space-y-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="glass p-12 rounded-3xl border-thin flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-emerald-500 opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Todo al día</h3>
              <p className="text-[12px] text-slate-500 dark:text-muted mt-1 max-w-sm">
                No tienes citas ni tareas programadas para estos filtros. Disfruta tu tiempo libre o programa un nuevo evento.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VISTA MES (Ejemplo Estático Estilizado) */}
      {viewMode === 'grid' && (
        <div className="glass rounded-3xl overflow-hidden border-thin bg-white/50 dark:bg-black/20">
          <div className="grid grid-cols-7 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="p-3 text-center text-[10px] font-black uppercase tracking-widest text-brand-purple/70">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-[120px]">
            {/* Generación de días ficticia para el mockup */}
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 2; // Offset dummy
              const isCurrentMonth = dayNum > 0 && dayNum <= 31;
              const hasEvent = isCurrentMonth && (dayNum === 14 || dayNum === 22 || dayNum === 28);
              
              return (
                <div key={i} className={cn(
                  "p-2 border-r border-b border-black/5 dark:border-white/5 relative transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer",
                  !isCurrentMonth && "bg-black/[0.02] dark:bg-white/[0.01] opacity-50"
                )}>
                  <span className={cn(
                    "inline-flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold mb-1",
                    dayNum === new Date().getDate() ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {isCurrentMonth ? dayNum : ''}
                  </span>
                  
                  {hasEvent && (
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="text-[9px] font-bold text-white bg-blue-500 rounded px-1.5 py-0.5 truncate shadow-sm">
                        10:00 Visita
                      </div>
                      <div className="text-[9px] font-bold text-white bg-brand-purple rounded px-1.5 py-0.5 truncate shadow-sm">
                        15:30 Llamada
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Icono auxiliar
const Edit2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
