"use client";

import React, { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Info, 
  Send, 
  Paperclip, 
  Smile,
  Mic,
  CheckCheck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const contacts = [
  { id: '1', name: 'Sarah Miller', lastMsg: 'Me interesa la villa frente al mar.', time: '10:45 AM', unread: 2, online: true },
  { id: '2', name: 'David Chen', lastMsg: '¿Cuándo podemos agendar visita?', time: '09:20 AM', unread: 0, online: false },
  { id: '3', name: 'Michael Ross', lastMsg: 'Te envié el documento de propuesta.', time: 'Ayer', unread: 0, online: true },
  { id: '4', name: 'Elena Gomez', lastMsg: '¡Gracias por la información!', time: 'Ayer', unread: 0, online: false },
];

const mockMessages = [
  { id: '1', text: 'Hola, vi tu anuncio de la Villa frente al mar.', type: 'received', time: '10:40 AM' },
  { id: '2', text: '¡Hola Sarah! Sí, aún está disponible. ¿Te gustaría ver más detalles o agendar una llamada?', type: 'sent', time: '10:42 AM' },
  { id: '3', text: 'Me interesa mucho la villa.', type: 'received', time: '10:45 AM' },
];

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState('1');
  const [msg, setMsg] = useState('');

  return (
    <div className="h-[calc(100vh-100px)] flex animate-fade-in glass rounded-xl overflow-hidden border border-card-border">
      {/* Sidebar: Contacts */}
      <div className="w-64 md:w-72 border-r border-card-border flex flex-col bg-foreground/[0.01]">
        <div className="p-4 border-b border-card-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-outfit">Mensajes</h2>
            <button className="p-1.5 glass-hover rounded-lg transition-all text-muted">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-purple transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar chats..." 
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-[11px] focus:outline-none focus:border-brand-purple/40 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedId(contact.id)}
              className={cn(
                "w-full p-3 flex items-center gap-3 transition-all hover:bg-foreground/[0.03] border-b border-card-border last:border-0",
                selectedId === contact.id && "bg-brand-purple/5 border-l-2 border-brand-purple"
              )}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-xs">
                  {contact.name[0]}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-[11px] truncate">{contact.name}</h4>
                  <span className="text-[9px] text-muted">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-muted truncate pr-2">{contact.lastMsg}</p>
                  {contact.unread > 0 && (
                    <span className="bg-brand-purple text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-foreground/[0.01]">
        {/* Chat Header */}
        <div className="p-3 border-b border-card-border flex items-center justify-between glass z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">
              {contacts.find(c => c.id === selectedId)?.name[0]}
            </div>
            <div>
              <h3 className="font-bold text-xs leading-tight">{contacts.find(c => c.id === selectedId)?.name}</h3>
              <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">En línea</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 glass-hover rounded-lg text-muted hover:text-brand-purple transition-all">
              <Phone size={16} />
            </button>
            <button className="p-2 glass-hover rounded-lg text-muted hover:text-brand-purple transition-all">
              <Video size={16} />
            </button>
            <div className="w-px h-5 bg-card-border mx-1" />
            <button className="p-2 glass-hover rounded-lg text-muted hover:text-brand-purple transition-all">
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* AI Assistant Overlay */}
        <div className="px-4 py-1.5 bg-brand-purple/5 border-b border-brand-purple/10 flex items-center justify-center gap-2 text-[9px] text-brand-purple font-black uppercase tracking-widest">
          <Sparkles size={12} className="animate-pulse" />
          Asistente IA Activo: Calificando Lead...
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex flex-col max-w-[80%]",
              msg.type === 'sent' ? "ml-auto items-end" : "items-start"
            )}>
              <div className={cn(
                "p-2.5 rounded-xl text-[11px] relative shadow-sm",
                msg.type === 'sent' 
                  ? "bg-brand-purple text-white rounded-tr-none" 
                  : "glass text-foreground rounded-tl-none border-card-border"
              )}>
                {msg.text}
                <div className={cn(
                  "flex items-center gap-1 mt-1 text-[8px] font-bold uppercase tracking-tighter opacity-70",
                  msg.type === 'sent' ? "text-white" : "text-muted"
                )}>
                  {msg.time}
                  {msg.type === 'sent' && <CheckCheck size={10} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-card-border glass">
          <div className="flex items-center gap-2">
            <button className="p-2 glass-hover rounded-lg text-muted hover:text-brand-purple transition-all">
              <Paperclip size={18} />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Escribe un mensaje..." 
                className="w-full bg-foreground/[0.03] border border-card-border rounded-xl px-4 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40 transition-all pr-10"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-brand-purple transition-all">
                <Smile size={18} />
              </button>
            </div>
            {msg ? (
              <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-2.5 bg-brand-purple rounded-full text-white shadow-lg shadow-brand-purple/20 hover:scale-110 transition-all"
              >
                <Send size={16} />
              </motion.button>
            ) : (
              <button className="p-2.5 glass-hover rounded-full text-muted hover:text-brand-purple transition-all">
                <Mic size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
