"use client";

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
  MessageCircle
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
    const interval = setInterval(fetchContacts, 10000);
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
      showToast('Error al cargar mensajes', 'error');
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !selectedChat || sending) return;

    setSending(true);
    const messageContent = inputText;
    setInputText('');

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
        fetchMessages(selectedChat.phone);
        showToast('Mensaje enviado', 'success');
      } else {
        showToast(data.error || 'Error al enviar WhatsApp', 'error');
        setInputText(messageContent);
      }
    } catch (error) {
      showToast('Error de conexión', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex glass rounded-2xl overflow-hidden border-deep animate-fade-in shadow-2xl">
      {/* Sidebar de Contactos */}
      <div className="w-full md:w-80 border-r border-deep flex flex-col bg-foreground/[0.01]">
        <div className="p-4 border-b border-deep">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold font-outfit tracking-tight">Chat AI CRM</h1>
            <button className="p-1.5 rounded-lg glass-hover"><MoreHorizontal size={18} /></button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Buscar conversaciones..." 
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-[11px] focus:outline-none focus:border-brand-purple/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-purple" /></div>
          ) : contacts.length === 0 ? (
            <div className="p-10 text-center opacity-40">
              <MessageCircle size={32} className="mx-auto mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Sin conversaciones</p>
            </div>
          ) : (
            contacts.map((chat) => (
              <div 
                key={chat.phone}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "p-4 flex gap-3 cursor-pointer transition-all border-b border-white/[0.02]",
                  selectedChat?.phone === chat.phone ? "bg-brand-purple/10 border-l-2 border-l-brand-purple" : "hover:bg-foreground/[0.02]"
                )}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center border-thin">
                    <User size={20} className="text-muted" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-[12px] truncate">{chat.name || chat.phone}</h3>
                    <span className="text-[9px] text-muted">{chat.time ? new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-muted truncate pr-2 italic">{chat.lastMsg}</p>
                    {chat.unread > 0 && (
                      <span className="bg-brand-purple text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de Chat Principal */}
      <div className="flex-1 flex flex-col bg-foreground/[0.005]">
        {selectedChat ? (
          <>
            <div className="p-3 border-b border-deep flex items-center justify-between bg-foreground/[0.01]">
              <div className="flex items-center gap-3">
                <button className="md:hidden p-1 text-muted"><ChevronLeft /></button>
                <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center border-thin">
                  <User size={18} className="text-muted" />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] leading-tight">{selectedChat.name || selectedChat.phone}</h3>
                  <p className="text-[10px] text-emerald-500 font-medium">Conectado vía Evolution</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-muted hover:text-brand-purple transition-colors"><Phone size={18} /></button>
                <button className="p-2 text-muted hover:text-brand-purple transition-colors"><Video size={18} /></button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.is_from_me ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-3 shadow-sm relative border-thin",
                    msg.is_from_me 
                      ? "bg-brand-purple text-white rounded-tr-none border-white/10" 
                      : "bg-foreground/10 text-foreground rounded-tl-none border-white/5"
                  )}>
                    <p className="text-[11px] leading-relaxed">{msg.message_text}</p>
                    <div className={cn("flex items-center justify-end gap-1 mt-1", msg.is_from_me ? "text-white/60" : "text-muted")}>
                      <span className="text-[8px] font-bold">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.is_from_me && <CheckCheck size={10} className="text-blue-300" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-foreground/[0.01] border-t border-deep">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <div className="flex gap-1">
                  <button type="button" className="p-2 text-muted hover:text-brand-purple transition-all"><Smile size={20} /></button>
                  <button type="button" className="p-2 text-muted hover:text-brand-purple transition-all"><Paperclip size={20} /></button>
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe un mensaje de WhatsApp..." 
                    className="w-full bg-foreground/5 border-thin rounded-xl px-4 py-2.5 text-[12px] focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={sending || !inputText.trim()}
                  className={cn(
                    "p-3 rounded-xl transition-all shadow-lg disabled:opacity-50",
                    inputText.trim() ? "bg-brand-purple text-white scale-100" : "bg-foreground/10 text-muted scale-95"
                  )}
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
            <MessageCircle size={80} className="mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-center">
              Selecciona un cliente para iniciar<br/>la conversación vía WhatsApp
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
