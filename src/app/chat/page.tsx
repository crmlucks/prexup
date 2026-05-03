"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Paperclip, 
  Smile, 
  Send, 
  Mic, 
  CheckCheck,
  Phone,
  Video,
  User,
  MoreHorizontal,
  Loader2,
  MessageCircle,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  Zap,
  X,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

const QUICK_RESPONSES = [
  { id: 1, text: "¡Hola! Gracias por contactar a PrexUp. ¿En qué proyecto estás interesado?" },
  { id: 2, text: "Te adjunto el catálogo de propiedades disponibles para este mes." },
  { id: 3, text: "Excelente, agendemos una visita para que puedas conocer el proyecto." },
  { id: 4, text: "Nuestras opciones de financiamiento incluyen crédito directo." }
];

export default function ChatPage() {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showQuickRes, setShowQuickRes] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.phone);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/chat/contacts');
      const data = await res.json();
      if (Array.isArray(data)) setContacts(data);
    } catch (err) {
      console.error('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (phone: string) => {
    try {
      const res = await fetch(`/api/chat/messages?phone=${phone}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      showToast('Error al cargar historial', 'error');
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !selectedChat || sending) return;

    setSending(true);
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedChat.phone,
          text: textToSend
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchMessages(selectedChat.phone);
        setInputText('');
        setShowQuickRes(false);
      } else {
        showToast(data.error || 'Error al enviar', 'error');
      }
    } catch (error) {
      showToast('Error de conexión', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = () => {
    showToast('Función de carga de archivos vinculando con Evolution...', 'info');
  };

  return (
    <div className="h-[calc(100vh-100px)] flex glass rounded-3xl overflow-hidden border-deep animate-fade-in shadow-2xl bg-background/20">
      {/* Sidebar de Contactos */}
      <div className="w-full md:w-80 border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black font-outfit tracking-tight text-white/90">Mensajería</h1>
            <button onClick={fetchContacts} className="p-2 rounded-xl glass-hover text-brand-purple">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Buscar conversación..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[12px] bg-white/5 border-thin focus:border-brand-purple/40 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading && contacts.length === 0 ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-purple" /></div>
          ) : (
            contacts.map((chat) => (
              <div 
                key={chat.phone}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "p-4 flex gap-3 cursor-pointer transition-all border-b border-white/[0.02] group",
                  selectedChat?.phone === chat.phone ? "bg-brand-purple/10 border-l-4 border-l-brand-purple shadow-inner" : "hover:bg-white/[0.03]"
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 flex items-center justify-center border-thin">
                    <span className="text-[16px] font-black text-brand-purple">{(chat.name || 'U').charAt(0)}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0a0a0a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[13px] truncate text-white/90">{chat.name || chat.phone}</h3>
                    <span className="text-[9px] font-black text-muted/60 uppercase">
                      {chat.time ? new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted truncate pr-4 group-hover:text-white/60 transition-colors">
                    {chat.lastMsg}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col relative">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center border-thin">
                  <User size={20} className="text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-white/90 leading-tight">{selectedChat.name || selectedChat.phone}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em]">En línea • WhatsApp</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl bg-white/5 text-muted hover:text-brand-purple transition-all border border-white/5"><Phone size={18} /></button>
                <button className="p-2.5 rounded-xl bg-white/5 text-muted hover:text-brand-purple transition-all border border-white/5"><Video size={18} /></button>
                <button className="p-2.5 rounded-xl bg-white/5 text-muted hover:text-brand-purple transition-all border border-white/5"><MoreHorizontal size={18} /></button>
              </div>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed opacity-95 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.is_from_me ? "justify-end" : "justify-start")}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "max-w-[70%] rounded-2xl p-4 shadow-2xl relative border",
                      msg.is_from_me 
                        ? "bg-brand-purple text-white rounded-tr-none border-white/10" 
                        : "bg-black/40 text-white/90 rounded-tl-none border-white/5 backdrop-blur-sm"
                    )}
                  >
                    {/* Render de Multimedia */}
                    {msg.message_type === 'image' && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-white/10">
                         <img src={msg.media_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'} alt="Media" className="w-full h-auto max-h-60 object-cover" />
                      </div>
                    )}
                    {msg.message_type === 'document' && (
                      <div className="mb-2 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <FileText size={24} className="text-brand-purple" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold truncate">{msg.message_text || 'Archivo PDF'}</p>
                          <p className="text-[9px] opacity-60">Documento adjunto</p>
                        </div>
                        <Download size={16} className="text-muted" />
                      </div>
                    )}

                    <p className="text-[12px] leading-relaxed font-medium">{msg.message_text}</p>
                    
                    <div className={cn("flex items-center justify-end gap-1.5 mt-2", msg.is_from_me ? "text-white/40" : "text-muted/40")}>
                      <span className="text-[9px] font-black uppercase">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.is_from_me && <CheckCheck size={12} className="text-brand-blue" />}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Barra de Entrada */}
            <div className="p-5 bg-black/40 border-t border-white/5 backdrop-blur-lg">
              {/* Menu de Respuestas Rápidas */}
              <AnimatePresence>
                {showQuickRes && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-[90px] left-5 right-5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50"
                  >
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-purple flex items-center gap-2">
                        <Zap size={14} /> Respuestas Rápidas
                      </h4>
                      <button onClick={() => setShowQuickRes(false)} className="text-muted"><X size={14} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {QUICK_RESPONSES.map((qr) => (
                        <button 
                          key={qr.id}
                          onClick={() => handleSendMessage(qr.text)}
                          className="text-left p-3 rounded-xl bg-white/5 hover:bg-brand-purple/10 border border-white/5 hover:border-brand-purple/30 transition-all group"
                        >
                          <p className="text-[11px] text-white/70 group-hover:text-white transition-colors line-clamp-1">{qr.text}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className="flex items-center gap-3">
                <div className="flex gap-1">
                  <button type="button" onClick={handleFileUpload} className="p-3 text-muted hover:text-brand-purple transition-all bg-white/5 rounded-2xl border border-white/5"><Paperclip size={20} /></button>
                  <button type="button" onClick={() => setShowQuickRes(!showQuickRes)} className="p-3 text-muted hover:text-brand-purple transition-all bg-white/5 rounded-2xl border border-white/5"><Zap size={20} /></button>
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe un mensaje de WhatsApp..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-[13px] focus:outline-none focus:border-brand-purple/50 transition-all shadow-inner"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-brand-purple"><Smile size={20} /></button>
                </div>
                <button 
                  type="submit" 
                  disabled={sending || !inputText.trim()}
                  className={cn(
                    "p-4 rounded-2xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center min-w-[56px]",
                    inputText.trim() ? "bg-gradient-brand text-white shadow-brand-purple/30 scale-105" : "bg-white/5 text-muted"
                  )}
                >
                  {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
            <div className="p-12 rounded-full bg-white/5 mb-8 animate-pulse">
              <MessageCircle size={140} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-center text-white">
              Bandeja de<br/>Entrada
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
