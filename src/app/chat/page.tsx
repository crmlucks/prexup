"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Paperclip, Send, CheckCheck, Phone,
  User, Loader2, MessageCircle, RefreshCw,
  FileText, Zap, X, Download, Image as ImageIcon,
  Video, File, ArrowLeft, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

const QUICK_RESPONSES = [
  { id: 1, label: "Saludo", text: "¡Hola! Gracias por contactar a PrexUp. ¿En qué proyecto estás interesado?", type: "text" },
  { id: 2, label: "Catálogo", text: "Te comparto el catálogo de propiedades disponibles.", type: "text" },
  { id: 3, label: "Visita", text: "Agendemos una visita para que puedas conocer el proyecto.", type: "text" },
  { id: 4, label: "Financiamiento", text: "Nuestras opciones incluyen crédito directo y bancario.", type: "text" },
  { id: 5, label: "Seguimiento", text: "¿Tuviste oportunidad de revisar la propuesta que te envié?", type: "text" },
  { id: 6, label: "Cierre", text: "¡Felicidades! Te enviaré los detalles del contrato.", type: "text" }
];

export default function ChatPage() {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContacts();
    const iv = setInterval(fetchContacts, 20000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!search.trim()) setFiltered(contacts);
    else {
      const q = search.toLowerCase();
      setFiltered(contacts.filter(c => (c.name||'').toLowerCase().includes(q) || (c.phone||'').includes(q)));
    }
  }, [search, contacts]);

  useEffect(() => {
    if (selected) fetchMessages(selected.phone);
  }, [selected]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const r = await fetch('/api/chat/contacts');
      const d = await r.json();
      if (Array.isArray(d)) { setContacts(d); if (filtered.length === 0) setFiltered(d); }
    } catch (_) {} finally { setLoading(false); }
  };

  const fetchMessages = async (phone: string) => {
    try {
      const r = await fetch(`/api/chat/messages?phone=${encodeURIComponent(phone)}`);
      const d = await r.json();
      setMessages(Array.isArray(d) ? d : []);
    } catch (_) { setMessages([]); }
  };

  const selectContact = (c: any) => {
    setSelected(c);
    setMessages([]);
    setMobileView('chat');
  };

  const goBack = () => {
    setMobileView('list');
    setSelected(null);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !selected || sending) return;
    setInput(''); setShowQuick(false); setSending(true);
    try {
      const r = await fetch('/api/chat/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: selected.phone, text: text.trim() })
      });
      const d = await r.json();
      if (d.success) { fetchMessages(selected.phone); fetchContacts(); }
      else { showToast(d.error || 'Error al enviar', 'error'); setInput(text); }
    } catch (_) { showToast('Sin conexión', 'error'); setInput(text); }
    finally { setSending(false); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selected) return;
    setShowAttach(false); setSending(true);

    const caption = file.type.startsWith('image/') ? '📷 Imagen' : file.type.startsWith('video/') ? '🎬 Video' : `📄 ${file.name}`;
    showToast(`Enviando ${caption}...`, 'info');

    try {
      const fd = new FormData();
      fd.append('phone', selected.phone);
      fd.append('file', file);
      fd.append('caption', caption);

      const r = await fetch('/api/chat/send-media', { method: 'POST', body: fd });
      const d = await r.json();
      if (d.success) { showToast('Archivo enviado', 'success'); fetchMessages(selected.phone); }
      else showToast('Error al enviar archivo', 'error');
    } catch (_) { showToast('Error de conexión', 'error'); }
    finally { setSending(false); e.target.value = ''; }
  };

  // ── RENDER ──
  return (
    <div className="h-[calc(100vh-80px)] flex rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-black/10">
      {/* Inputs ocultos para archivos */}
      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" className="hidden" onChange={handleFileChange} />
      <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <input ref={vidRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />

      {/* ─── SIDEBAR ─── */}
      <div className={cn(
        "w-full md:w-72 lg:w-80 border-r border-white/5 flex flex-col bg-black/20 flex-shrink-0",
        mobileView === 'chat' ? "hidden md:flex" : "flex"
      )}>
        <div className="p-3 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-black font-outfit">Chats</h1>
            <button onClick={fetchContacts} className="p-1 rounded text-brand-purple"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." 
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-[11px] bg-white/5 border border-white/5 focus:border-brand-purple/40 outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading && contacts.length === 0 ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-purple" size={20} /></div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center opacity-40">
              <MessageCircle size={24} className="mx-auto mb-2" />
              <p className="text-[10px] font-bold">Sin leads</p>
            </div>
          ) : filtered.map(c => (
            <div key={c.phone} onClick={() => selectContact(c)}
              className={cn("p-3 flex gap-2.5 cursor-pointer border-b border-white/[0.03] transition-all",
                selected?.phone === c.phone ? "bg-brand-purple/10 border-l-2 border-l-brand-purple" : "hover:bg-white/[0.02]"
              )}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 flex items-center justify-center border border-white/5 flex-shrink-0">
                <span className="text-xs font-black text-brand-purple">{(c.name||'?')[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-[11px] truncate">{c.name || c.phone}</h3>
                  <span className="text-[8px] text-muted/40 flex-shrink-0">{c.time ? new Date(c.time).toLocaleDateString() : ''}</span>
                </div>
                <p className="text-[10px] text-muted/50 truncate">{c.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CHAT ─── */}
      <div className={cn(
        "flex-1 flex flex-col relative min-w-0",
        mobileView === 'list' ? "hidden md:flex" : "flex"
      )}>
        {selected ? (
          <>
            {/* Header */}
            <div className="p-2.5 border-b border-white/5 flex items-center gap-2 bg-black/20 flex-shrink-0">
              <button onClick={goBack} className="p-1.5 rounded-lg bg-white/5 text-muted md:hidden"><ArrowLeft size={16} /></button>
              <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center border border-white/5">
                <User size={16} className="text-brand-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[12px] truncate leading-tight">{selected.name || selected.phone}</h3>
                <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" /> WhatsApp
                </p>
              </div>
              <a href={`tel:${selected.phone}`} className="p-1.5 rounded-lg bg-white/5 text-muted hover:text-brand-purple border border-white/5"><Phone size={14} /></a>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-15">
                  <MessageCircle size={40} className="mb-2" />
                  <p className="text-[10px] font-bold">Sin mensajes</p>
                  <p className="text-[9px]">Envía el primer mensaje</p>
                </div>
              ) : messages.map((m, i) => (
                <div key={m.id||i} className={cn("flex", m.is_from_me ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[75%] sm:max-w-[65%] rounded-2xl px-3 py-2 shadow border",
                    m.is_from_me ? "bg-brand-purple text-white rounded-tr-sm border-brand-purple/20" : "bg-white/5 text-white/90 rounded-tl-sm border-white/5"
                  )}>
                    {m.message_type === 'image' && m.media_url && (
                      <img src={m.media_url} alt="" className="w-full max-h-40 object-cover rounded-lg mb-1.5 border border-white/10" />
                    )}
                    {m.message_type === 'video' && m.media_url && (
                      <video src={m.media_url} controls className="w-full max-h-40 rounded-lg mb-1.5 border border-white/10" />
                    )}
                    {m.message_type === 'document' && (
                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-1.5 border border-white/10">
                        <FileText size={16} className="text-brand-purple flex-shrink-0" />
                        <span className="text-[10px] truncate flex-1">{m.message_text || 'Documento'}</span>
                        <Download size={12} className="text-muted flex-shrink-0" />
                      </div>
                    )}
                    <p className="text-[11px] leading-relaxed">{m.message_text}</p>
                    <div className={cn("flex items-center justify-end gap-1 mt-1", m.is_from_me ? "text-white/30" : "text-muted/30")}>
                      <span className="text-[8px] font-bold">{m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : ''}</span>
                      {m.is_from_me && <CheckCheck size={10} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Menú Adjuntar */}
            <AnimatePresence>
              {showAttach && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
                  className="absolute bottom-16 left-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl z-50">
                  <div className="flex flex-col gap-1 min-w-[160px]">
                    <button onClick={() => { imgRef.current?.click(); }} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-brand-purple/10 text-left transition-all">
                      <div className="p-1.5 rounded-lg bg-blue-500/10"><ImageIcon size={14} className="text-blue-500" /></div>
                      <span className="text-[11px] font-medium">Imagen</span>
                    </button>
                    <button onClick={() => { vidRef.current?.click(); }} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-brand-purple/10 text-left transition-all">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10"><Video size={14} className="text-emerald-500" /></div>
                      <span className="text-[11px] font-medium">Video</span>
                    </button>
                    <button onClick={() => { fileRef.current?.click(); }} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-brand-purple/10 text-left transition-all">
                      <div className="p-1.5 rounded-lg bg-amber-500/10"><File size={14} className="text-amber-500" /></div>
                      <span className="text-[11px] font-medium">Documento</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Respuestas Rápidas */}
            <AnimatePresence>
              {showQuick && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
                  className="absolute bottom-16 left-0 right-0 mx-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 shadow-2xl z-50">
                  <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-white/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-purple flex items-center gap-1"><Zap size={10} /> Respuestas Rápidas</span>
                    <button onClick={() => setShowQuick(false)}><X size={12} className="text-muted" /></button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {QUICK_RESPONSES.map(qr => (
                      <button key={qr.id} onClick={() => handleSend(qr.text)}
                        className="text-left p-2 rounded-lg bg-white/5 hover:bg-brand-purple/10 border border-white/5 hover:border-brand-purple/20 transition-all">
                        <span className="text-[8px] font-black text-brand-purple uppercase">{qr.label}</span>
                        <p className="text-[9px] text-white/50 line-clamp-1 mt-0.5">{qr.text}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Bar */}
            <div className="p-2 bg-black/30 border-t border-white/5 flex-shrink-0">
              <form onSubmit={e => { e.preventDefault(); handleSend(input); }} className="flex items-center gap-1.5">
                <button type="button" onClick={() => { setShowAttach(!showAttach); setShowQuick(false); }}
                  className={cn("p-2 rounded-xl border border-white/5 transition-all flex-shrink-0", showAttach ? "bg-brand-purple/20 text-brand-purple" : "bg-white/5 text-muted hover:text-brand-purple")}>
                  <Paperclip size={16} />
                </button>
                <button type="button" onClick={() => { setShowQuick(!showQuick); setShowAttach(false); }}
                  className={cn("p-2 rounded-xl border border-white/5 transition-all flex-shrink-0", showQuick ? "bg-brand-purple/20 text-brand-purple" : "bg-white/5 text-muted hover:text-brand-purple")}>
                  <Zap size={16} />
                </button>
                <input type="text" value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Mensaje..." 
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-brand-purple/40" />
                <button type="submit" disabled={sending || !input.trim()}
                  className={cn("p-2 rounded-xl transition-all flex-shrink-0 disabled:opacity-30", input.trim() ? "bg-brand-purple text-white" : "bg-white/5 text-muted")}>
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex-col items-center justify-center opacity-10 hidden md:flex">
            <MessageCircle size={64} className="mb-3" />
            <p className="text-sm font-black uppercase tracking-[0.3em]">Selecciona un lead</p>
          </div>
        )}
      </div>
    </div>
  );
}
