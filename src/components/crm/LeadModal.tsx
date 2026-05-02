"use client";

import React from 'react';
import { X, User, Phone, Mail, Home, Briefcase, BarChart, Globe, DollarSign, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

export function LeadModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (lead: any) => void }) {
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    onSave({
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      time: 'Ahora',
      priority: 'media'
    });
    
    showToast('Lead registrado correctamente', 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 md:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl glass rounded-2xl border border-card-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b border-card-border flex justify-between items-center bg-foreground/[0.02]">
              <div>
                <h2 className="text-lg font-bold font-outfit leading-tight">Registrar Nuevo Lead</h2>
                <p className="text-muted text-[10px] uppercase tracking-widest font-black">Información del Prospecto</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg glass-hover text-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Sección: Datos Personales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Nombre Completo</label>
                  <div className="relative">
                    <User size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input name="name" required type="text" placeholder="Ej. Juan Pérez" className="w-full rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:border-brand-purple/40" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Teléfono / WhatsApp</label>
                  <div className="relative">
                    <Phone size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input name="phone" required type="tel" placeholder="+57 300..." className="w-full rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:border-brand-purple/40" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Email (Opcional)</label>
                  <div className="relative">
                    <Mail size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input name="email" type="email" placeholder="juan@correo.com" className="w-full rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:border-brand-purple/40" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Origen del Lead</label>
                  <div className="relative">
                    <Globe size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <select name="source" className="w-full rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none appearance-none cursor-pointer">
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Google">Google Ads</option>
                      <option value="Referido">Referido</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-card-border my-2" />

              {/* Sección: Interés y Asignación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Proyecto de Interés</label>
                  <div className="relative">
                    <Home size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <select name="property" className="w-full rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none appearance-none cursor-pointer">
                      <option value="Villa Beachfront">Villa Beachfront</option>
                      <option value="Penthouse Downtown">Penthouse Downtown</option>
                      <option value="Luxury Estate">Luxury Estate</option>
                      <option value="General">Interés General</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Asesor Asignado</label>
                  <div className="relative">
                    <Briefcase size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <select name="agent" className="w-full rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none appearance-none cursor-pointer">
                      <option value="Alex Morgan">Alex Morgan</option>
                      <option value="Sarah Connor">Sarah Connor</option>
                      <option value="John Doe">John Doe</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Etapa Inicial</label>
                  <div className="relative">
                    <BarChart size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <select name="status" className="w-full rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none appearance-none cursor-pointer">
                      <option value="new">Nuevos Leads</option>
                      <option value="qualified">Calificados</option>
                      <option value="proposal">Propuesta</option>
                      <option value="negotiation">Negociación</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Moneda</label>
                    <div className="relative">
                      <DollarSign size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                      <select name="currency" className="w-full rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none appearance-none cursor-pointer">
                        <option value="USD">USD</option>
                        <option value="MXN">MXN</option>
                        <option value="COP">COP</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex-[2] space-y-1">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Presupuesto</label>
                    <input name="budget" type="text" placeholder="Ej. 500,000" className="w-full rounded-lg px-3 py-1.5 text-[11px] focus:outline-none focus:border-brand-purple/40" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Detalles de Interés / Notas</label>
                <div className="relative">
                  <AlignLeft size={12} className="absolute left-2.5 top-3 text-muted" />
                  <textarea name="details" rows={3} placeholder="Mencionar requerimientos específicos..." className="w-full rounded-lg pl-8 pr-3 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40 resize-none" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg glass-hover text-[11px] font-bold border border-card-border transition-all">
                  Cancelar
                </button>
                <button type="submit" className="flex-[1.5] py-2 rounded-lg bg-gradient-brand text-white text-[11px] font-black shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all uppercase tracking-widest">
                  Guardar Lead
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
