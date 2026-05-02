"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send, 
  Mic, 
  Image as ImageIcon, 
  FileText, 
  CheckCheck,
  Phone,
  Video,
  ChevronLeft,
  User,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock de datos iniciales (esto vendrá de tu DB vía Webhooks de n8n)
const initialChats = [
  { id: '1', name: 'Juan Pérez', lastMsg: 'Hola, me interesa la Villa Beachfront', time: '10:45 AM', unread: 2, online: true, avatar: null },
  { id: '2', name: 'Sarah Miller', lastMsg: '¿Cuál es el precio final?', time: '09:20 AM', unread: 0, online: false, avatar: null },
  { id: '3', name: 'David Chen', lastMsg: 'Archivo: Contrato_Venta.pdf', time: 'Ayer', unread: 0, online: true, avatar: null },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<any>(initialChats[0]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simular carga de mensajes históricos de Evolution API
    setMessages([
      { id: 1, text: 'Hola Juan, bienvenido a PrexUp. ¿En qué puedo ayudarte?', sender: 'me', type: 'text', time: '10:40 AM' },
      { id: 2, text: 'Hola, me interesa la Villa Beachfront. ¿Sigue disponible?', sender: 'them', type: 'text', time: '10:45 AM' },
      { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', sender: 'me', time: '10:46 AM' },
      { id: 4, text: 'Sí, adjunto una foto real. Es una joya.', sender: 'me', type: 'text', time: '10:46 AM' },
    ]);
  }, [selectedChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      type: 'text',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputText('');
    
    // Aquí llamaríamos a /api/chat/send que conecta con Evolution API
    console.log('Enviando a Evolution API:', inputText);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex glass rounded-2xl overflow-hidden border-deep animate-fade-in">
      {/* Sidebar de Contactos */}
      <div className="w-full md:w-80 border-r border-deep flex flex-col bg-foreground/[0.01]">
        <div className="p-4 border-b border-deep">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold font-outfit tracking-tight">Mensajes</h1>
            <button className="p-1.5 rounded-lg glass-hover"><MoreHorizontal size={18} /></button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Buscar chats..." 
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-[11px] focus:outline-none focus:border-brand-purple/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {initialChats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                "p-4 flex gap-3 cursor-pointer transition-all border-b border-white/[0.02]",
                selectedChat.id === chat.id ? "bg-brand-purple/10 border-l-2 border-l-brand-purple" : "hover:bg-foreground/[0.02]"
              )}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center border-thin">
                  <User size={20} className="text-muted" />
                </div>
                {chat.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-[12px] truncate">{chat.name}</h3>
                  <span className="text-[9px] text-muted">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-muted truncate pr-2">{chat.lastMsg}</p>
                  {chat.unread > 0 && (
                    <span className="bg-brand-purple text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Chat Principal */}
      <div className="flex-1 flex flex-col bg-foreground/[0.005]">
        {/* Header de Chat */}
        <div className="p-3 border-b border-deep flex items-center justify-between bg-foreground/[0.01]">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1 text-muted"><ChevronLeft /></button>
            <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center border-thin">
              <User size={18} className="text-muted" />
            </div>
            <div>
              <h3 className="font-bold text-[13px] leading-tight">{selectedChat.name}</h3>
              <p className="text-[10px] text-emerald-500 font-medium">En línea</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted hover:text-brand-purple transition-colors"><Phone size={18} /></button>
            <button className="p-2 text-muted hover:text-brand-purple transition-colors"><Video size={18} /></button>
            <button className="p-2 text-muted hover:text-brand-purple transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Mensajes */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://w0.peakpx.com/wallpaper/508/606/HD-wallpaper-whatsapp-dark-background-whatsapp-dark-pattern.jpg')] bg-repeat bg-contain bg-opacity-5">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] rounded-2xl p-3 shadow-sm relative",
                msg.sender === 'me' 
                  ? "bg-brand-purple text-white rounded-tr-none" 
                  : "bg-foreground/10 text-foreground rounded-tl-none border border-white/5"
              )}>
                {msg.type === 'image' ? (
                  <div className="space-y-2">
                    <img src={msg.url} alt="image" className="rounded-xl w-full max-w-xs" />
                  </div>
                ) : (
                  <p className="text-[11px] leading-relaxed">{msg.text}</p>
                )}
                <div className={cn("flex items-center justify-end gap-1 mt-1", msg.sender === 'me' ? "text-white/60" : "text-muted")}>
                  <span className="text-[8px] font-bold">{msg.time}</span>
                  {msg.sender === 'me' && <CheckCheck size={10} className="text-blue-300" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input de Mensaje */}
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
                placeholder="Escribe un mensaje..." 
                className="w-full bg-foreground/5 border-thin rounded-xl px-4 py-2 text-[12px] focus:outline-none focus:border-brand-purple/40"
              />
            </div>
            <button 
              type="submit" 
              className={cn(
                "p-3 rounded-xl transition-all shadow-lg",
                inputText.trim() ? "bg-brand-purple text-white scale-100" : "bg-foreground/10 text-muted scale-95"
              )}
            >
              {inputText.trim() ? <Send size={18} /> : <Mic size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
