"use client";

import React, { useState } from 'react';
import { X, Upload, Plus, MapPin, DollarSign, Home, Info, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

export function PropertyModal({ isOpen, onClose, property }: { isOpen: boolean, onClose: () => void, property?: any }) {
  const { showToast } = useToast();
  const [images, setImages] = useState<string[]>(property?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      setTimeout(() => {
        setImages([...images, URL.createObjectURL(e.target.files![0])]);
        setUploading(false);
        showToast('Imagen subida correctamente', 'success');
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
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
            className="relative w-full max-w-3xl glass rounded-2xl border border-card-border shadow-2xl overflow-hidden flex flex-col md:flex-row h-[70vh] md:h-auto max-h-[90vh]"
          >
            {/* Left: Image Management */}
            <div className="w-full md:w-2/5 bg-foreground/[0.02] p-4 flex flex-col gap-4 overflow-y-auto border-r border-card-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <ImageIcon size={16} className="text-brand-purple" />
                  Galería
                </h3>
                <label className="cursor-pointer p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-all">
                  <Upload size={14} />
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    <button className="absolute top-1 right-1 p-1 bg-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}
                {uploading && (
                  <div className="aspect-square rounded-lg bg-foreground/5 border border-dashed border-card-border flex flex-col items-center justify-center gap-1">
                    <div className="w-4 h-4 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
                  </div>
                )}
                <label className="aspect-square rounded-lg bg-foreground/5 border border-dashed border-card-border flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/10 transition-all group">
                  <Plus size={18} className="text-muted group-hover:text-brand-purple transition-all" />
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Right: Details Form */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold font-outfit leading-tight">{property?.title || 'Nueva Propiedad'}</h2>
                  <p className="text-muted text-[10px] mt-0.5 uppercase tracking-widest font-bold">Detalles del Inventario</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg glass-hover text-muted hover:text-foreground">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Precio</label>
                  <div className="relative">
                    <DollarSign size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="text" defaultValue={property?.price} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:border-brand-purple/40" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Tipo</label>
                  <div className="relative">
                    <Home size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <select className="w-full bg-foreground/[0.03] border border-card-border rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none appearance-none cursor-pointer">
                      <option>Casa</option>
                      <option>Apartamento</option>
                      <option>Local</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Ubicación</label>
                <div className="relative">
                  <MapPin size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="text" defaultValue={property?.location} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:border-brand-purple/40" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Descripción</label>
                <textarea rows={3} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg p-3 text-[11px] focus:outline-none focus:border-brand-purple/40 resize-none" placeholder="Describe la propiedad..." />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button onClick={onClose} className="flex-1 py-2 rounded-lg glass-hover text-[11px] font-bold border border-card-border transition-all">
                  Cancelar
                </button>
                <button onClick={() => { showToast('Propiedad guardada', 'success'); onClose(); }} className="flex-[1.5] py-2 rounded-lg bg-gradient-brand text-white text-[11px] font-black shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
