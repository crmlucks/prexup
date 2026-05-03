"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Paperclip, Send, CheckCheck, Phone,
  User, Loader2, MessageCircle, RefreshCw,
  FileText, Zap, X, Download, Image as ImageIcon,
  Video, File, ArrowLeft, Mic, Smile, Filter, Edit2, Play, Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import EmojiPicker from '@/components/chat/EmojiPicker';
import QuickResponseManager from '@/components/chat/QuickResponseManager';

const LEAD_STATUSES = [
  { id: 'new', label: 'Nuevo Lead', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { id: 'contacted', label: 'Contactado', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { id: 'qualified', label: 'Calificado', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { id: 'proposal', label: 'Propuesta', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'negotiation', label: 'Negociación', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  { id: 'closed', label: 'Ganado', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'lost', label: 'Perdido', color: 'text-red-500 bg-red-500/10 border-red-500/20' }
];

export default function ChatPage() {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // UI States
  const [showQuick, setShowQuick] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Data States
  const [quickResponses, setQuickResponses] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch initial data
  useEffect(() => {
    fetchContacts();
    fetchQuickResponses();
    const iv = setInterval(fetchContacts, 15000); // Polling every 15s
    return () => clearInterval(iv);
  }, []);

  // Filter contacts
  useEffect(() => {
    let result = contacts;
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        (c.name||'').toLowerCase().includes(q) || 
        (c.phone||'').includes(q)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    
    setFilteredContacts(result);
  }, [search, statusFilter, contacts]);

  // Handle selected contact changes
  useEffect(() => {
    if (selected) {
      fetchMessages(selected.phone);
      // Setup interval to poll messages for selected chat
      const msgIv = setInterval(() => fetchMessages(selected.phone, true), 5000);
      return () => clearInterval(msgIv);
    }
  }, [selected]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- API Calls ---
  const fetchContacts = async () => {
    try {
      const r = await fetch('/api/chat/contacts');
      const d = await r.json();
      if (Array.isArray(d)) {
        setContacts(d);
      }
    } catch (_) {} finally { setLoading(false); }
  };

  const fetchMessages = async (phone: string, silent = false) => {
    try {
      const r = await fetch(`/api/chat/messages?phone=${encodeURIComponent(phone)}`);
      const d = await r.json();
      if (Array.isArray(d)) {
        // Only update if changed or not silent
        if (!silent || d.length !== messages.length) {
          setMessages(d);
        }
      }
    } catch (_) { 
      if (!silent) setMessages([]); 
    }
  };

  const fetchQuickResponses = async () => {
    try {
      const r = await fetch('/api/chat/quick-responses');
      const d = await r.json();
      if (Array.isArray(d)) setQuickResponses(d);
    } catch (_) {}
  };

  // --- Handlers ---
  const selectContact = (c: any) => {
    setSelected(c);
    setMessages([]); // Clear until loaded
    setMobileView('chat');
  };

  const handleUpdateLeadStatus = async (newStatus: string) => {
    if (!selected) return;
    
    const prevStatus = selected.status;
    // Optimistic UI
    setSelected({ ...selected, status: newStatus });
    setContacts(contacts.map(c => c.phone === selected.phone ? { ...c, status: newStatus } : c));
    
    try {
      const r = await fetch('/api/chat/update-lead', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: selected.phone, status: newStatus })
      });
      const d = await r.json();
      if (!d.success) throw new Error('Failed to update');
      showToast('Estado actualizado', 'success');
    } catch (error) {
      // Revert on error
      setSelected({ ...selected, status: prevStatus });
      setContacts(contacts.map(c => c.phone === selected.phone ? { ...c, status: prevStatus } : c));
      showToast('Error al actualizar estado', 'error');
    }
  };

  const handleSendText = async (textToSend: string = input, mediaUrl?: string) => {
    if ((!textToSend.trim() && !mediaUrl) || !selected || sending) return;
    
    const text = textToSend.trim();
    setInput(''); 
    setShowQuick(false); 
    setShowEmoji(false);
    setSending(true);
    
    // Optimistic message
    const tempMsg = {
      id: Date.now(),
      message_text: text || 'Multimedia',
      message_type: mediaUrl ? 'document' : 'text',
      media_url: mediaUrl,
      is_from_me: 1,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      let r, d;
      if (mediaUrl) {
        const fd = new FormData();
        fd.append('phone', selected.phone);
        fd.append('mediaUrl', mediaUrl);
        fd.append('caption', text);
        r = await fetch('/api/chat/send-media', { method: 'POST', body: fd });
      } else {
        r = await fetch('/api/chat/send', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: selected.phone, text })
        });
      }
      
      d = await r.json();
      if (!d.success) { 
        showToast(d.error || 'Error al enviar', 'error'); 
        setInput(text); // Restore input
        setMessages(prev => prev.filter(m => m.id !== tempMsg.id)); // Remove optimistic
      } else {
        fetchMessages(selected.phone); // Refresh actual DB state
        fetchContacts();
      }
    } catch (_) { 
      showToast('Sin conexión', 'error'); 
      setInput(text);
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    } finally { 
      setSending(false); 
    }
  };

  const handleSendMedia = async (file: File | Blob, caption: string = '') => {
    if (!selected) return;
    
    setShowAttach(false); 
    setSending(true);

    const typeStr = file.type.split('/')[0];
    const uiCaption = typeStr === 'image' ? '📷 Imagen' : typeStr === 'video' ? '🎬 Video' : typeStr === 'audio' ? '🎤 Audio' : `📄 Archivo`;
    
    showToast(`Enviando ${uiCaption}...`, 'info');

    try {
      const fd = new FormData();
      fd.append('phone', selected.phone);
      // Special case for audio blobs recorded via mic
      if (file instanceof Blob && !file.name) {
          fd.append('file', file, 'audio.webm');
      } else {
          fd.append('file', file);
      }
      fd.append('caption', caption || uiCaption);

      const r = await fetch('/api/chat/send-media', { method: 'POST', body: fd });
      const d = await r.json();
      
      if (d.success) { 
        showToast('Enviado correctamente', 'success'); 
        fetchMessages(selected.phone); 
        fetchContacts();
      } else {
        showToast(d.error || 'Error al enviar', 'error');
      }
    } catch (_) { 
      showToast('Error de conexión', 'error'); 
    } finally { 
      setSending(false); 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSendMedia(file);
    e.target.value = ''; // Reset
  };

  // --- Audio Recording ---
  const toggleRecording = async () => {
    if (recording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          handleSendMedia(audioBlob, 'Audio Message');
          stream.getTracks().forEach(track => track.stop()); // Clean up
        };

        mediaRecorder.start();
        setRecording(true);
      } catch (err) {
        showToast('Error al acceder al micrófono', 'error');
      }
    }
  };

  // --- Quick Responses Managers ---
  const saveQR = async (qr: any) => {
    try {
      const method = qr.id ? 'PUT' : 'POST';
      const r = await fetch('/api/chat/quick-responses', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qr)
      });
      if (r.ok) {
        showToast('Guardado', 'success');
        fetchQuickResponses();
      }
    } catch (_) {}
  };

  const deleteQR = async (id: number) => {
    if(!confirm('¿Eliminar respuesta rápida?')) return;
    try {
      const r = await fetch(`/api/chat/quick-responses?id=${id}`, { method: 'DELETE' });
      if (r.ok) {
        showToast('Eliminado', 'success');
        fetchQuickResponses();
      }
    } catch (_) {}
  };


  // --- Render Helpers ---
  const renderMessageContent = (m: any) => {
    switch(m.message_type) {
      case 'image':
        return m.media_url ? 
          <img src={m.media_url} alt="Image" className="w-full max-h-48 object-cover rounded-lg mb-1" /> : 
          <p className="italic opacity-70">📷 Imagen</p>;
      case 'video':
        return m.media_url ? 
          <video src={m.media_url} controls className="w-full max-h-48 rounded-lg mb-1" /> : 
          <p className="italic opacity-70">🎬 Video</p>;
      case 'audio':
        return m.media_url ? 
          <audio src={m.media_url} controls className="w-full max-w-[200px] mb-1" /> : 
          <p className="italic opacity-70 flex items-center gap-1"><Mic size={12}/> Audio</p>;
      case 'document':
        return (
          <a href={m.media_url || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-black/20 rounded-lg mb-1 hover:bg-black/30 transition-colors">
            <FileText size={16} className="text-brand-purple flex-shrink-0" />
            <span className="text-[11px] truncate flex-1">{m.message_text || 'Documento'}</span>
            <Download size={14} className="text-white/70" />
          </a>
        );
      default:
        return <p className="text-[12px] whitespace-pre-wrap leading-relaxed">{m.message_text}</p>;
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl bg-white dark:bg-black/20 backdrop-blur-md transition-colors">
      {/* Hidden inputs for file uploads */}
      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" className="hidden" onChange={handleFileChange} />
      <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <input ref={vidRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
      <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />

      {/* --- SIDEBAR --- */}
      <div className={cn(
        "w-full md:w-[320px] lg:w-[360px] border-r border-black/5 dark:border-white/5 flex flex-col bg-slate-50 dark:bg-black/40 flex-shrink-0 transition-colors",
        mobileView === 'chat' ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-black font-outfit text-slate-800 dark:text-white">Chats</h1>
            <div className="flex gap-1.5">
              <button onClick={() => setShowFilters(!showFilters)} className={cn("p-1.5 rounded-lg transition-colors", showFilters ? "bg-brand-purple/20 text-brand-purple" : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-muted")}>
                <Filter size={16} />
              </button>
              <button onClick={fetchContacts} className="p-1.5 rounded-lg text-brand-purple hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre, teléfono..." 
                className="w-full pl-9 pr-3 py-2 rounded-xl text-[12px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-brand-purple/40 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-muted/50 text-slate-800 dark:text-white shadow-sm dark:shadow-none" />
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <button onClick={() => setStatusFilter('all')} className={cn("px-2 py-1 rounded-md text-[10px] font-bold border transition-all", statusFilter === 'all' ? "bg-slate-800 text-white dark:bg-white dark:text-black border-transparent" : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-500 dark:text-muted")}>
                      Todos
                    </button>
                    {LEAD_STATUSES.map(s => (
                      <button key={s.id} onClick={() => setStatusFilter(s.id)}
                        className={cn("px-2 py-1 rounded-md text-[10px] font-bold border transition-all", statusFilter === s.id ? s.color : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-500 dark:text-muted/70 hover:text-slate-800 dark:hover:text-white")}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading && contacts.length === 0 ? (
            <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-brand-purple" size={24} /></div>
          ) : filteredContacts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-muted/50 p-6 text-center">
              <MessageCircle size={32} className="mb-3 opacity-20" />
              <p className="text-[12px] font-bold">Sin conversaciones</p>
              <p className="text-[10px]">Ajusta tus filtros de búsqueda</p>
            </div>
          ) : filteredContacts.map(c => {
            const statusColor = LEAD_STATUSES.find(s => s.id === c.status)?.color || 'text-muted bg-white/5';
            const statusLabel = LEAD_STATUSES.find(s => s.id === c.status)?.label || c.status;

            return (
              <div key={c.phone} onClick={() => selectContact(c)}
                className={cn("p-4 flex gap-3 cursor-pointer border-b border-black/[0.02] dark:border-white/[0.02] transition-all relative group",
                  selected?.phone === c.phone ? "bg-brand-purple/10 border-l-2 border-l-brand-purple" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                )}>
                
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 flex items-center justify-center border border-brand-purple/10 dark:border-white/10 flex-shrink-0 relative">
                  <span className="text-sm font-black text-brand-purple dark:text-white/90">{(c.name||'?')[0].toUpperCase()}</span>
                  {c.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white dark:border-black">
                      {c.unread}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-[13px] text-slate-800 dark:text-white/90 truncate">{c.name || c.phone}</h3>
                    <span className="text-[9px] text-slate-400 dark:text-muted/60 flex-shrink-0 font-medium">
                      {c.time ? new Date(c.time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : ''}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className={cn("text-[11px] truncate pr-2 flex items-center gap-1", c.unread > 0 ? "text-slate-800 dark:text-white font-medium" : "text-slate-500 dark:text-muted/60")}>
                      {c.lastMsgType !== 'text' && <span className="text-[10px]">📁</span>}
                      {c.lastMsg}
                    </p>
                    {c.status && (
                      <span className={cn("text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border bg-white dark:bg-transparent", statusColor)}>
                        {statusLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- CHAT AREA --- */}
      <div className={cn(
        "flex-1 flex flex-col relative min-w-0 bg-slate-50/50 dark:bg-black/20 transition-colors",
        mobileView === 'list' ? "hidden md:flex" : "flex"
      )}>
        {selected ? (
          <>
            {/* Chat Header */}
            <div className="px-5 py-3 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-black/40 backdrop-blur-md flex-shrink-0 z-10 shadow-sm transition-colors">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileView('list')} className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-slate-500 dark:text-muted md:hidden mr-1 hover:bg-black/10 dark:hover:bg-white/10">
                  <ArrowLeft size={16} />
                </button>
                <div className="w-10 h-10 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 flex items-center justify-center border border-brand-purple/20 dark:border-brand-purple/30">
                  <User size={18} className="text-brand-purple" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-[14px] text-slate-800 dark:text-white/90 leading-tight flex items-center gap-2">
                    {selected.name || selected.phone}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> WhatsApp
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-muted">•</span>
                    <span className="text-[10px] text-slate-500 dark:text-muted font-medium">{selected.phone}</span>
                  </div>
                </div>
              </div>

              {/* Status Editor directly in header */}
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-black/5 dark:border-white/10">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-muted uppercase tracking-wider">Etapa:</span>
                  <select 
                    value={selected.status} 
                    onChange={(e) => handleUpdateLeadStatus(e.target.value)}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest bg-transparent outline-none cursor-pointer border-none p-0",
                      LEAD_STATUSES.find(s => s.id === selected.status)?.color.split(' ')[0]
                    )}
                  >
                    {LEAD_STATUSES.map(s => <option key={s.id} value={s.id} className="bg-white text-slate-800 dark:bg-brand-dark dark:text-white">{s.label}</option>)}
                  </select>
                </div>
                <a href={`tel:${selected.phone}`} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-slate-500 dark:text-muted hover:text-slate-800 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 border border-transparent dark:border-white/5 transition-all">
                  <Phone size={16} />
                </a>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-gradient-to-b dark:from-transparent dark:to-black/20">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 dark:opacity-30">
                  <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 border border-black/10 dark:border-white/10">
                    <MessageCircle size={32} className="text-slate-500 dark:text-white" />
                  </div>
                  <p className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-white">Comienza la conversación</p>
                  <p className="text-[11px] mt-1 text-center max-w-xs text-slate-500 dark:text-white/70">Envía un mensaje o utiliza una respuesta rápida para conectar con {selected.name}</p>
                </div>
              ) : messages.map((m, i) => {
                const isMe = m.is_from_me === 1 || m.is_from_me === true;
                return (
                  <div key={m.id||i} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md relative group",
                      isMe 
                        ? "bg-brand-purple/90 text-white rounded-tr-sm border border-brand-purple/20" 
                        : "bg-white dark:bg-white/10 text-slate-800 dark:text-white/90 rounded-tl-sm border border-black/5 dark:border-white/5 backdrop-blur-sm"
                    )}>
                      {renderMessageContent(m)}
                      
                      <div className={cn("flex items-center justify-end gap-1 mt-1.5", isMe ? "text-white/60" : "text-slate-400 dark:text-white/40")}>
                        <span className="text-[9px] font-medium tracking-wide">
                          {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : ''}
                        </span>
                        {isMe && (
                          <CheckCheck size={12} className={m.is_read ? "text-blue-300" : ""} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overlays (Emoji, Attach, Quick) */}
            <div className="relative">
              <AnimatePresence>
                {showEmoji && (
                  <EmojiPicker onClose={() => setShowEmoji(false)} onSelect={(emoji) => setInput(prev => prev + emoji)} />
                )}
                
                {showAttach && (
                  <motion.div initial={{opacity:0,y:10, scale:0.95}} animate={{opacity:1,y:0, scale:1}} exit={{opacity:0,y:10, scale:0.95}}
                    className="absolute bottom-16 left-3 bg-white dark:bg-black/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                    <div className="flex flex-col gap-1 min-w-[180px]">
                      <button onClick={() => { imgRef.current?.click(); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-brand-purple/20 text-left transition-all group">
                        <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20"><ImageIcon size={16} className="text-blue-500 dark:text-blue-400" /></div>
                        <span className="text-[12px] font-bold text-slate-700 dark:text-white">Imagen</span>
                      </button>
                      <button onClick={() => { vidRef.current?.click(); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-brand-purple/20 text-left transition-all group">
                        <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20"><Video size={16} className="text-emerald-500 dark:text-emerald-400" /></div>
                        <span className="text-[12px] font-bold text-slate-700 dark:text-white">Video</span>
                      </button>
                      <button onClick={() => { audioRef.current?.click(); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-brand-purple/20 text-left transition-all group">
                        <div className="p-2 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20"><Mic size={16} className="text-pink-500 dark:text-pink-400" /></div>
                        <span className="text-[12px] font-bold text-slate-700 dark:text-white">Audio</span>
                      </button>
                      <button onClick={() => { fileRef.current?.click(); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-brand-purple/20 text-left transition-all group">
                        <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20"><File size={16} className="text-amber-500 dark:text-amber-400" /></div>
                        <span className="text-[12px] font-bold text-slate-700 dark:text-white">Documento</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {showQuick && (
                  <QuickResponseManager 
                    responses={quickResponses} 
                    onSend={handleSendText} 
                    onSave={saveQR} 
                    onDelete={deleteQR} 
                    onClose={() => setShowQuick(false)} 
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white/80 dark:bg-black/40 backdrop-blur-md border-t border-black/5 dark:border-white/5 flex-shrink-0">
              <form onSubmit={e => { e.preventDefault(); handleSendText(); }} className="flex items-end gap-2 max-w-5xl mx-auto">
                <div className="flex gap-1 mb-1">
                  <button type="button" onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); setShowQuick(false); }}
                    className={cn("p-2 rounded-xl transition-all", showEmoji ? "bg-black/10 dark:bg-white/10 text-slate-800 dark:text-white" : "text-slate-500 dark:text-muted hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5")}>
                    <Smile size={18} />
                  </button>
                  <button type="button" onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); setShowQuick(false); }}
                    className={cn("p-2 rounded-xl transition-all", showAttach ? "bg-black/10 dark:bg-white/10 text-slate-800 dark:text-white" : "text-slate-500 dark:text-muted hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5")}>
                    <Paperclip size={18} />
                  </button>
                  <button type="button" onClick={() => { setShowQuick(!showQuick); setShowEmoji(false); setShowAttach(false); }}
                    className={cn("p-2 rounded-xl transition-all", showQuick ? "bg-brand-purple/20 text-brand-purple" : "text-slate-500 dark:text-muted hover:text-brand-purple hover:bg-black/5 dark:hover:bg-white/5")}>
                    <Zap size={18} />
                  </button>
                </div>
                
                <div className="flex-1 relative bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-brand-purple/50 focus-within:bg-slate-50 dark:focus-within:bg-white/10 transition-all shadow-sm dark:shadow-none">
                  <textarea 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendText();
                      }
                    }}
                    placeholder="Escribe un mensaje..." 
                    rows={1}
                    className="w-full bg-transparent px-4 py-3 text-[13px] focus:outline-none resize-none max-h-32 min-h-[44px] custom-scrollbar block text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-muted"
                    style={{ height: 'auto' }}
                  />
                </div>

                <div className="flex gap-1 mb-1">
                  {input.trim() ? (
                    <button type="submit" disabled={sending}
                      className="p-3 rounded-xl bg-brand-purple text-white shadow-lg shadow-brand-purple/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center min-w-[44px]">
                      {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
                    </button>
                  ) : (
                    <button type="button" onClick={toggleRecording}
                      className={cn(
                        "p-3 rounded-xl transition-all shadow-lg flex items-center justify-center min-w-[44px]",
                        recording 
                          ? "bg-red-500 text-white shadow-red-500/30 animate-pulse" 
                          : "bg-white/10 text-white hover:bg-white/20"
                      )}>
                      {recording ? <span className="w-2.5 h-2.5 bg-white rounded-sm" /> : <Mic size={18} />}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 dark:opacity-20 hidden md:flex">
            <div className="w-24 h-24 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/10 dark:border-white/10 mb-6">
              <MessageCircle size={48} className="text-slate-600 dark:text-white" />
            </div>
            <p className="text-xl font-black font-outfit uppercase tracking-[0.3em] bg-gradient-to-r from-slate-800 to-slate-400 dark:from-white dark:to-white/50 bg-clip-text text-transparent">
              PREXUP CHAT
            </p>
            <p className="text-[12px] mt-2 font-medium tracking-widest uppercase text-slate-500 dark:text-white/70">Selecciona un lead para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
}
