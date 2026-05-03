"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Paperclip, Send, CheckCheck, Phone, Video,
  User, MoreHorizontal, Loader2, MessageCircle, RefreshCw,
  FileText, Zap, X, Download, Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

const QUICK_RESPONSES = [
  { id: 1, label: "Saludo", text: "¡Hola! Gracias por contactar a PrexUp. ¿En qué proyecto estás interesado?" },
  { id: 2, label: "Catálogo", text: "Te comparto el catálogo de propiedades disponibles para este mes." },
  { id: 3, label: "Visita", text: "Excelente, agendemos una visita para que puedas conocer el proyecto." },
  { id: 4, label: "Financiamiento", text: "Nuestras opciones de financiamiento incluyen crédito directo y bancario." },
  { id: 5, label: "Seguimiento", text: "Hola, ¿tuviste oportunidad de revisar la propuesta que te envié?" },
  { id: 6, label: "Cierre", text: "¡Felicidades por tu nueva propiedad! Te enviaré los detalles del contrato." }
];

export default function ChatPage() {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showQuickRes, setShowQuickRes] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cargar contactos al iniciar
  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 20000);
    return () => clearInterval(interval);
  }, []);

  // Filtrar contactos por búsqueda
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredContacts(contacts);
    } else {
      const q = searchText.toLowerCase();
      setFilteredContacts(contacts.filter(c => 
        (c.name || '').toLowerCase().includes(q) || 
        (c.phone || '').includes(q)
      ));
    }
  }, [searchText, contacts]);

  // Cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    if (selectedChat) fetchMessages(selectedChat.phone);
  }, [selectedChat]);

  // Scroll automático
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/chat/contacts');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (Array.isArray(data)) {
        setContacts(data);
        if (!selectedChat && data.length > 0) setFilteredContacts(data);
      }
    } catch (err) {
      console.error('Error cargando contactos');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (phone: string) => {
    try {
      const res = await fetch(`/api/chat/messages?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
      else setMessages([]);
    } catch (err) {
      setMessages([]);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !selectedChat || sending) return;
    const messageContent = text.trim();
    setInputText('');
    setShowQuickRes(false);
    setSending(true);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: selectedChat.phone, text: messageContent })
      });
      const data = await res.json();
      if (data.success) {
        fetchMessages(selectedChat.phone);
        fetchContacts();
        showToast('Mensaje enviado', 'success');
      } else {
        showToast(data.error || 'Error al enviar', 'error');
        setInputText(messageContent);
      }
    } catch (error) {
      showToast('Error de conexión', 'error');
      setInputText(messageContent);
    } finally {
      setSending(false);
    }
  };

  // ── RENDER ──
  return (
    <div className="h-[calc(100vh-100px)] flex glass rounded-2xl overflow-hidden border border-white/5 animate-fade-in shadow-2xl">
      
      {/* ─── SIDEBAR DE CONTACTOS ─── */}
      <div className="w-full md:w-80 border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-black font-outfit">Conversaciones</h1>
            <button onClick={fetchContacts} className="p-1.5 rounded-lg text-brand-purple hover:bg-white/5">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar lead..." 
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[11px] bg-white/5 border border-white/5 focus:border-brand-purple/40 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading && contacts.length === 0 ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-purple" size={24} /></div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle size={32} className="mx-auto mb-3 text-muted/30" />
              <p className="text-[11px] font-bold text-muted/50">No hay leads registrados</p>
              <p className="text-[10px] text-muted/30 mt-1">Crea un lead en el CRM</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div 
                key={contact.phone}
                onClick={() => { setSelectedChat(contact); setMessages([]); }}
                className={cn(
                  "p-3 flex gap-3 cursor-pointer transition-all border-b border-white/[0.03]",
                  selectedChat?.phone === contact.phone 
                    ? "bg-brand-purple/10 border-l-2 border-l-brand-purple" 
                    : "hover:bg-white/[0.02]"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 flex items-center justify-center border border-white/5 flex-shrink-0">
                  <span className="text-sm font-black text-brand-purple">{(contact.name || '?').charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-[12px] truncate">{contact.name || contact.phone}</h3>
                    <span className="text-[8px] text-muted/50 flex-shrink-0">
                      {contact.time ? new Date(contact.time).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted/60 truncate">{contact.lastMsg}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── ÁREA DE CHAT ─── */}
      <div className="flex-1 flex flex-col relative">
        {selectedChat ? (
          <>
            {/* Header del chat */}
            <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-purple/10 flex items-center justify-center border border-white/5">
                  <User size={18} className="text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] leading-tight">{selectedChat.name || selectedChat.phone}</h3>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" /> WhatsApp
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <a href={`tel:${selectedChat.phone}`} className="p-2 rounded-lg bg-white/5 text-muted hover:text-brand-purple border border-white/5"><Phone size={16} /></a>
                <button className="p-2 rounded-lg bg-white/5 text-muted hover:text-brand-purple border border-white/5"><MoreHorizontal size={16} /></button>
              </div>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <MessageCircle size={48} className="mb-3" />
                  <p className="text-[11px] font-bold">No hay mensajes</p>
                  <p className="text-[10px] mt-1">Envía el primer mensaje a este lead</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={msg.id || i} className={cn("flex", msg.is_from_me ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-3 shadow-lg border",
                      msg.is_from_me 
                        ? "bg-brand-purple text-white rounded-tr-sm border-brand-purple/30" 
                        : "bg-white/5 text-white/90 rounded-tl-sm border-white/5"
                    )}>
                      {msg.message_type === 'image' && msg.media_url && (
                        <img src={msg.media_url} alt="" className="w-full max-h-48 object-cover rounded-lg mb-2 border border-white/10" />
                      )}
                      {msg.message_type === 'document' && (
                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2 border border-white/10">
                          <FileText size={18} className="text-brand-purple flex-shrink-0" />
                          <span className="text-[10px] truncate">{msg.message_text || 'Documento'}</span>
                          <Download size={14} className="text-muted flex-shrink-0" />
                        </div>
                      )}
                      <p className="text-[12px] leading-relaxed">{msg.message_text}</p>
                      <div className={cn("flex items-center justify-end gap-1 mt-1.5", msg.is_from_me ? "text-white/40" : "text-muted/40")}>
                        <span className="text-[8px] font-bold">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                        {msg.is_from_me && <CheckCheck size={10} />}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Respuestas Rápidas */}
            <AnimatePresence>
              {showQuickRes && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-20 left-4 right-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl z-50"
                >
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-purple flex items-center gap-1.5"><Zap size={12} /> Respuestas Rápidas</span>
                    <button onClick={() => setShowQuickRes(false)}><X size={14} className="text-muted" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {QUICK_RESPONSES.map((qr) => (
                      <button key={qr.id} onClick={() => handleSend(qr.text)}
                        className="text-left p-2.5 rounded-lg bg-white/5 hover:bg-brand-purple/10 border border-white/5 hover:border-brand-purple/20 transition-all"
                      >
                        <span className="text-[9px] font-black text-brand-purple uppercase">{qr.label}</span>
                        <p className="text-[10px] text-white/60 line-clamp-1 mt-0.5">{qr.text}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-3 bg-black/30 border-t border-white/5">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }} className="flex items-center gap-2">
                <button type="button" onClick={() => setShowQuickRes(!showQuickRes)} className={cn("p-2.5 rounded-xl border border-white/5 transition-all", showQuickRes ? "bg-brand-purple/20 text-brand-purple" : "bg-white/5 text-muted hover:text-brand-purple")}><Zap size={18} /></button>
                <button type="button" className="p-2.5 rounded-xl bg-white/5 text-muted hover:text-brand-purple border border-white/5"><Paperclip size={18} /></button>
                <input 
                  type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe un mensaje..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[12px] focus:outline-none focus:border-brand-purple/40"
                />
                <button type="submit" disabled={sending || !inputText.trim()}
                  className={cn("p-2.5 rounded-xl transition-all disabled:opacity-40", inputText.trim() ? "bg-brand-purple text-white" : "bg-white/5 text-muted")}
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-15">
            <MessageCircle size={80} className="mb-4" />
            <p className="text-lg font-black uppercase tracking-[0.3em]">Selecciona un lead</p>
          </div>
        )}
      </div>
    </div>
  );
}
