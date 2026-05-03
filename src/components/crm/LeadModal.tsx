"use client";

import React, { useState } from 'react';
import { X, Save, User, Phone, Mail, Home, Users, Layout, DollarSign, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: any) => void;
}

export const LeadModal = ({ isOpen, onClose, onSave }: LeadModalProps) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project_interest: 'Villa Beachfront',
    assigned_agent: 'Alex Morgan',
    status: 'new',
    source: 'WhatsApp',
    currency: 'USD',
    budget: '',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showToast('Lead guardado con éxito', 'success');
        onSave({ ...formData, id: data.id });
        onClose();
        setFormData({
          name: '', phone: '', email: '', 
          project_interest: 'Villa Beachfront', assigned_agent: 'Alex Morgan',
          status: 'new', source: 'WhatsApp', currency: 'USD', budget: '', details: ''
        });
      } else {
        showToast(data.error || 'Error al guardar el lead', 'error');
      }
    } catch (error) {
      showToast('Error de conexión con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass w-full max-w-2xl rounded-2xl overflow-hidden border-thin shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-foreground/[0.02]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-purple/10 text-brand-purple">
                <User size={18} />
              </div>
              <h2 className="text-lg font-bold font-outfit tracking-tight">Registrar Nuevo Lead</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X size={20} className="text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Sección: Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Nombre Completo</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Teléfono / WhatsApp</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+51 987 654 321"
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Email (Opcional)</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="juan@ejemplo.com"
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Origen del Lead</label>
                <div className="relative">
                  <Layout size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <select 
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all appearance-none bg-background"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Referido">Referido</option>
                    <option value="Web">Sitio Web</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Interés y Asignación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Proyecto de Interés</label>
                <div className="relative">
                  <Home size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <select 
                    value={formData.project_interest}
                    onChange={(e) => setFormData({...formData, project_interest: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all appearance-none bg-background"
                  >
                    <option value="Villa Beachfront">Villa Beachfront</option>
                    <option value="Penthouse Downtown">Penthouse Downtown</option>
                    <option value="Modern Loft">Modern Loft</option>
                    <option value="Luxury Mansion">Luxury Mansion</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Asesor Asignado</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <select 
                    value={formData.assigned_agent}
                    onChange={(e) => setFormData({...formData, assigned_agent: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all appearance-none bg-background"
                  >
                    <option value="Alex Morgan">Alex Morgan</option>
                    <option value="Sarah Connor">Sarah Connor</option>
                    <option value="John Wick">John Wick</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Presupuesto y Etapa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Presupuesto y Moneda</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="w-20 px-2 py-2 rounded-xl text-[11px] border border-white/5 bg-background focus:outline-none focus:border-brand-purple/50"
                  >
                    <option value="USD">USD</option>
                    <option value="PEN">PEN</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <div className="relative flex-1">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input 
                      type="number" 
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      placeholder="Ej. 150000"
                      className="w-full pl-9 pr-4 py-2 rounded-xl text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Etapa del Pipeline</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl text-[11px] border border-white/5 bg-background focus:outline-none focus:border-brand-purple/50"
                >
                  <option value="new">Nuevo Lead</option>
                  <option value="qualified">Calificado</option>
                  <option value="proposal">Propuesta</option>
                  <option value="negotiation">Negociación</option>
                  <option value="won">Ganado</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Detalles de Interés</label>
              <div className="relative">
                <FileText size={14} className="absolute left-3 top-3 text-muted" />
                <textarea 
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  placeholder="Escribe notas adicionales aquí..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all resize-none bg-background"
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-4 border-t border-white/5 flex items-center justify-end gap-3 bg-foreground/[0.02]">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[11px] font-bold text-muted hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-brand text-white text-[11px] font-black shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Guardar Lead
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
