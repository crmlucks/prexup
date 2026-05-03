"use client";
import React, { useState } from 'react';
import { X, Zap, Edit2, Trash2, Plus, Save, Eye, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QR { id: number; label: string; text: string; category?: string; media_url?: string; }

interface Props {
  responses: QR[];
  onSend: (text: string, mediaUrl?: string) => void;
  onSave: (qr: Partial<QR>) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const CATEGORIES = ['general', 'seguimiento', 'ventas', 'soporte'];

export default function QuickResponseManager({ responses, onSend, onSave, onDelete, onClose }: Props) {
  const [mode, setMode] = useState<'list' | 'edit' | 'preview'>('list');
  const [editing, setEditing] = useState<Partial<QR> | null>(null);
  const [preview, setPreview] = useState<QR | null>(null);
  const [filterCat, setFilterCat] = useState('all');

  const filtered = filterCat === 'all' ? responses : responses.filter(r => (r.category || 'general') === filterCat);

  const startEdit = (qr?: QR) => {
    setEditing(qr ? { ...qr } : { label: '', text: '', category: 'general' });
    setMode('edit');
  };

  const handleSave = () => {
    if (!editing?.label || !editing?.text) return;
    onSave(editing);
    setMode('list');
    setEditing(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-16 left-0 right-0 mx-3 bg-white dark:bg-black/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-3 shadow-2xl z-50 max-h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-black/5 dark:border-white/5">
        <span className="text-[9px] font-black uppercase tracking-widest text-brand-purple flex items-center gap-1.5">
          <Zap size={10} /> Respuestas Rápidas
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => startEdit()} className="p-1 rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-all" title="Nueva">
            <Plus size={12} />
          </button>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"><X size={12} className="text-slate-500 dark:text-muted" /></button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 overflow-y-auto custom-scrollbar">
            {/* Category filter */}
            <div className="flex gap-1 flex-wrap">
              {['all', ...CATEGORIES].map(c => (
                <button key={c} onClick={() => setFilterCat(c)}
                  className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider transition-all ${filterCat === c ? 'bg-brand-purple/20 text-brand-purple' : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-muted/50 hover:text-slate-800 dark:hover:text-muted'}`}>
                  {c === 'all' ? 'Todas' : c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {filtered.map(qr => (
                <div key={qr.id} className="group relative text-left p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-brand-purple/10 border border-black/5 dark:border-white/5 hover:border-brand-purple/20 transition-all">
                  <button onClick={() => onSend(qr.text, qr.media_url)} className="w-full text-left">
                    <span className="text-[8px] font-black text-brand-purple uppercase flex items-center gap-1">
                      {qr.label} {qr.media_url && <span className="text-[10px]">📎</span>}
                    </span>
                    <p className="text-[9px] text-slate-500 dark:text-white/50 line-clamp-2 mt-0.5">{qr.text || 'Multimedia'}</p>
                  </button>
                  <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                    <button onClick={() => { setPreview(qr); setMode('preview'); }} className="p-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"><Eye size={9} className="text-slate-500 dark:text-muted" /></button>
                    <button onClick={() => startEdit(qr)} className="p-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"><Edit2 size={9} className="text-blue-500 dark:text-blue-400" /></button>
                    <button onClick={() => onDelete(qr.id)} className="p-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"><Trash2 size={9} className="text-red-500 dark:text-red-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {mode === 'edit' && editing && (
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <div className="flex gap-2">
              <input value={editing.label || ''} onChange={e => setEditing({ ...editing, label: e.target.value })}
                placeholder="Etiqueta" className="flex-1 px-3 py-1.5 rounded-lg text-[11px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-brand-purple/30 outline-none text-slate-800 dark:text-white" />
              <select value={editing.category || 'general'} onChange={e => setEditing({ ...editing, category: e.target.value })}
                className="px-2 py-1.5 rounded-lg text-[10px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none text-slate-800 dark:text-white cursor-pointer">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-muted uppercase flex items-center gap-1">
                <Zap size={10} /> Adjuntar Multimedia (Opcional)
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setEditing({ ...editing, media_url: reader.result as string });
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-brand-purple file:text-white hover:file:bg-brand-purple/80 text-slate-500 dark:text-white/70"
                />
                {editing.media_url && (
                  <button onClick={() => setEditing({ ...editing, media_url: undefined })} className="p-1 text-red-500 hover:bg-red-500/10 rounded" title="Eliminar adjunto">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
            <textarea value={editing.text || ''} onChange={e => setEditing({ ...editing, text: e.target.value })}
              placeholder="Mensaje de respuesta rápida..." rows={3}
              className="w-full px-3 py-2 rounded-lg text-[11px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-brand-purple/30 outline-none resize-none text-slate-800 dark:text-white" />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setMode('list'); setEditing(null); }}
                className="px-3 py-1 rounded-lg text-[10px] font-bold text-slate-500 dark:text-muted hover:bg-black/5 dark:hover:bg-white/5">Cancelar</button>
              <button onClick={handleSave}
                className="px-3 py-1 rounded-lg text-[10px] font-bold bg-brand-purple text-white flex items-center gap-1">
                <Save size={10} /> Guardar
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'preview' && preview && (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <div className="text-[9px] font-black text-brand-purple uppercase mb-1">Vista Previa</div>
            <div className="bg-brand-purple/90 text-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%] ml-auto shadow-md">
              {preview.media_url && (
                <div className="mb-2 bg-black/20 p-2 rounded text-center text-[10px] overflow-hidden">
                  {preview.media_url.startsWith('data:image') ? (
                    <img src={preview.media_url} alt="Adjunto" className="w-full max-h-32 object-cover rounded mb-1" />
                  ) : preview.media_url.startsWith('data:video') ? (
                    <video src={preview.media_url} controls className="w-full max-h-32 object-cover rounded mb-1" />
                  ) : preview.media_url.startsWith('data:audio') ? (
                    <audio src={preview.media_url} controls className="w-full mb-1" />
                  ) : (
                    "📎 Documento adjunto"
                  )}
                </div>
              )}
              <p className="text-[11px] leading-relaxed">{preview.text}</p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setMode('list')} className="px-3 py-1 rounded-lg text-[10px] font-bold text-slate-500 dark:text-muted hover:bg-black/5 dark:hover:bg-white/5">Volver</button>
              <button onClick={() => { onSend(preview.text, preview.media_url); onClose(); }}
                className="px-3 py-1 rounded-lg text-[10px] font-bold bg-emerald-500 text-white shadow-md shadow-emerald-500/20">Enviar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
