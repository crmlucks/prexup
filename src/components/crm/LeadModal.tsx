"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Tag, 
  UserPlus, 
  DollarSign, 
  FileText,
  Save,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editLead?: any; // Recibe el lead a editar si existe
}

export default function LeadModal({ isOpen, onClose, onSuccess, editLead }: LeadModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Facebook',
    project_interest: 'Penthouse Downtown',
    assigned_agent: 'Alex Morgan',
    budget: '',
    currency: 'PEN',
    status: 'new',
    details: ''
  });

  // Pre-llenar datos si estamos editando
  useEffect(() => {
    if (editLead) {
      setFormData({
        name: editLead.name || '',
        phone: editLead.phone || '',
        email: editLead.email || '',
        source: editLead.source || 'Facebook',
        project_interest: editLead.project_interest || '',
        assigned_agent: editLead.assigned_agent || '',
        budget: editLead.budget || '',
        currency: editLead.currency || 'PEN',
        status: editLead.status || 'new',
        details: editLead.details || ''
      });
    } else {
      setFormData({
        name: '', phone: '', email: '', source: 'Facebook',
        project_interest: '', assigned_agent: '', budget: '',
        currency: 'PEN', status: 'new', details: ''
      });
    }
  }, [editLead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/leads';
      const method = editLead ? 'PUT' : 'POST';
      const body = editLead ? { ...formData, id: editLead.id } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        showToast(editLead ? 'Lead actualizado con éxito' : 'Lead registrado con éxito', 'success');
        onSuccess();
        onClose();
      } else {
        showToast(data.error || 'Error al procesar la solicitud', 'error');
      }
    } catch (error) {
      showToast('Error de conexión con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl glass rounded-2xl overflow-hidden border-deep shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-deep flex items-center justify-between bg-gradient-brand">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20 text-white">
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl font-bold font-outfit text-white">
              {editLead ? 'Editar Lead' : 'Registrar Nuevo Lead'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Fila 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Nombre Completo</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-purple" />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-medium transition-all" 
                  placeholder="Ej: Johana Oblitas"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Teléfono / WhatsApp</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-purple" />
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-medium transition-all"
                  placeholder="Ej: +51957100984"
                />
              </div>
            </div>
          </div>

          {/* Fila 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Email (Opcional)</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-purple" />
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-medium transition-all"
                  placeholder="juan@ejemplo.com"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Origen del Lead</label>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-purple" />
                <select 
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-medium transition-all appearance-none cursor-pointer"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Referido">Referido</option>
                  <option value="Landing Page">Landing Page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fila 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Proyecto de Interés</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-purple" />
                <input 
                  type="text"
                  value={formData.project_interest}
                  onChange={(e) => setFormData({...formData, project_interest: e.target.value})}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-medium transition-all"
                  placeholder="Ej: Penthouse Downtown"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Asesor Asignado</label>
              <div className="relative">
                <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-purple" />
                <input 
                  type="text"
                  value={formData.assigned_agent}
                  onChange={(e) => setFormData({...formData, assigned_agent: e.target.value})}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-medium transition-all"
                  placeholder="Ej: Alex Morgan"
                />
              </div>
            </div>
          </div>

          {/* Fila 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Presupuesto y Moneda</label>
              <div className="flex gap-2">
                <select 
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-24 px-3 py-2 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-bold cursor-pointer"
                >
                  <option value="PEN">PEN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <div className="flex-1 relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-purple" />
                  <input 
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-medium transition-all"
                    placeholder="Ej: 50000"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Etapa del Pipeline</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-medium transition-all cursor-pointer"
              >
                <option value="new">Nuevo Lead</option>
                <option value="contacted">Contactado</option>
                <option value="qualified">Calificado</option>
                <option value="proposal">Propuesta Enviada</option>
                <option value="negotiation">Negociación</option>
                <option value="closed">Vendido / Ganado</option>
                <option value="lost">Perdido</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Detalles de Interés</label>
            <div className="relative">
              <FileText size={14} className="absolute left-3 top-4 text-brand-purple" />
              <textarea 
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-foreground/5 border-thin focus:border-brand-purple/40 outline-none text-[12px] font-medium transition-all resize-none"
                placeholder="Escribe notas adicionales aquí..."
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-deep flex justify-end gap-3 bg-foreground/[0.02]">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-[12px] font-bold text-muted hover:bg-foreground/5 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 rounded-xl bg-gradient-brand text-white text-[12px] font-black shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {editLead ? 'Guardar Cambios' : 'Guardar Lead'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
