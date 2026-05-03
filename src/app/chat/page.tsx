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
  ChevronLeft,
  User,
  MoreHorizontal,
  Loader2,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function ChatPage() {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContacts();
    // Auto-refresh cada 15 segundos para ver nuevos mensajes
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
      if (Array.isArray(data)) {
        setContacts(data);
      }
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

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !selectedChat || sending) return;

    const messageContent = inputText;
    setInputText('');
    setSending(true);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedChat.phone,
          text: messageContent
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refrescar mensajes inmediatamente
        fetchMessages(selectedChat.phone);
        // Actualizar último mensaje en la lista lateral
        setContacts(prev => prev.map(c => 
          c.phone === selectedChat.phone ? { ...c, lastMsg: messageContent, time: new Date() } : c
        ));
      } else {
        showToast(data.error || 'Error al enviar WhatsApp', 'error');
        setInputText(messageContent); // Devolver el texto si falló
      }
    } catch (error) {
      showToast('Error de conexión', 'error');
      setInputText(messageContent);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex glass rounded-2xl overflow-hidden border-deep animate-fade-in shadow-2xl">
      {/* Sidebar de Leads */}
      <div className="w-full md:w-80 border-r border-deep flex flex-col bg-foreground/[0.01]">
        <div className="p-4 border-b border-deep">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold font-outfit tracking-tight">Chat de Leads</h1>
            <button onClick={fetchContacts} className="p-1.5 rounded-lg glass-hover text-brand-purple">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o celular..." 
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-[11px] bg-foreground/5 border-thin focus:outline-none focus:border-brand-purple/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && contacts.length === 0 ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-purple" /></div>
          ) : contacts.length === 0 ? (
            <div className="p-10 text-center opacity-40">
              <User size={32} className="mx-auto mb-2 text-muted" />
              <p className="text-[10px] font-black uppercase tracking-widest">No hay leads registrados</p>
              <p className="text-[9px] mt-1">Crea un lead en el CRM para verlo aquí</p>
            </div>
          ) : (
            contacts.map((chat) => (
              <div 
                key={chat.phone}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "p-4 flex gap-3 cursor-pointer transition-all border-b border-white/[0.02]",
                  selectedChat?.phone === chat.phone ? "bg-brand-purple/10 border-l-2 border-l-brand-purple shadow-inner" : "hover:bg-foreground/[0.02]"
                )}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 flex items-center justify-center border-thin">
                    <span className="text-[14px] font-bold text-brand-purple">{(chat.name || 'U').charAt(0)}</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-[12px] truncate">{chat.name || chat.phone}</h3>
                    <span className="text-[8px] font-medium text-muted">
                      {chat.time ? new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted truncate italic pr-4">
                    {chat.lastMsg}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de Conversación */}
      <div className="flex-1 flex flex-col bg-foreground/[0.005]">
        {selectedChat ? (
          <>
            <div className="p-3 border-b border-deep flex items-center justify-between bg-foreground/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center border-thin">
                  <User size={20} className="text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] leading-tight">{selectedChat.name || selectedChat.phone}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Lead Directo • WhatsApp</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2.5 text-muted hover:text-brand-purple transition-all bg-foreground/5 rounded-xl mr-1"><Phone size={16} /></button>
                <button className="p-2.5 text-muted hover:text-brand-purple transition-all bg-foreground/5 rounded-xl"><MoreHorizontal size={16} /></button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <MessageCircle size={48} className="mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No hay mensajes anteriores</p>
                  <p className="text-[9px]">Escribe abajo para iniciar el contacto por WhatsApp</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.is_from_me ? "justify-end" : "justify-start")}>
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "max-w-[75%] rounded-2xl p-3 shadow-md relative border-thin",
                        msg.is_from_me 
                          ? "bg-brand-purple text-white rounded-tr-none border-white/10" 
                          : "bg-white text-black rounded-tl-none border-gray-100"
                      )}
                    >
                      <p className="text-[11.5px] leading-relaxed font-medium">{msg.message_text}</p>
                      <div className={cn("flex items-center justify-end gap-1 mt-1.5", msg.is_from_me ? "text-white/60" : "text-muted")}>
                        <span className="text-[8px] font-bold">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.is_from_me && <CheckCheck size={10} className="text-blue-300" />}
                      </div>
                    </motion.div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-background border-t border-deep shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button type="button" className="p-2.5 text-muted hover:text-brand-purple transition-all bg-foreground/5 rounded-xl"><Smile size={20} /></button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe un mensaje de WhatsApp para este lead..." 
                    className="w-full bg-foreground/5 border-thin rounded-2xl px-5 py-3 text-[12px] focus:outline-none focus:border-brand-purple/40 transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={sending || !inputText.trim()}
                  className={cn(
                    "p-3.5 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center min-w-[50px]",
                    inputText.trim() ? "bg-brand-purple text-white hover:scale-105 active:scale-95" : "bg-foreground/10 text-muted"
                  )}
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10">
            <div className="p-10 rounded-full bg-foreground/5 mb-6">
              <MessageCircle size={120} />
            </div>
            <p className="text-lg font-black uppercase tracking-[0.3em] text-center">
              Selecciona un Lead<br/>para chatear
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
