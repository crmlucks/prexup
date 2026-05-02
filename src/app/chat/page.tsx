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
  { id: '1', name: 'Sarah Miller', lastMsg: 'I am interested in the beachfront villa.', time: '10:45 AM', unread: 2, online: true, avatar: '/api/placeholder/40/40' },
  { id: '2', name: 'David Chen', lastMsg: 'When can we schedule a visit?', time: '09:20 AM', unread: 0, online: false, avatar: '/api/placeholder/40/40' },
  { id: '3', name: 'Michael Ross', lastMsg: 'Sent you the proposal document.', time: 'Yesterday', unread: 0, online: true, avatar: '/api/placeholder/40/40' },
  { id: '4', name: 'Elena Gomez', lastMsg: 'Thank you for the information!', time: 'Yesterday', unread: 0, online: false, avatar: '/api/placeholder/40/40' },
];

const mockMessages = [
  { id: '1', text: 'Hello, I saw your listing for the Beachfront Villa.', type: 'received', time: '10:40 AM' },
  { id: '2', text: 'Hi Sarah! Yes, it is still available. Would you like to see some more details or schedule a call?', type: 'sent', time: '10:42 AM' },
  { id: '3', text: 'I am interested in the beachfront villa.', type: 'received', time: '10:45 AM' },
];

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState('1');
  const [msg, setMsg] = useState('');

  return (
    <div className="h-[calc(100vh-120px)] flex animate-fade-in glass rounded-3xl overflow-hidden border border-white/5">
      {/* Sidebar: Contacts */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-white/[0.02]">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-outfit">Chats</h2>
            <button className="p-2 glass-hover rounded-lg transition-all">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-purple/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedId(contact.id)}
              className={cn(
                "w-full p-4 flex items-center gap-3 transition-all hover:bg-white/5",
                selectedId === contact.id && "bg-brand-purple/10 border-l-4 border-brand-purple"
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-brand flex-shrink-0" />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-sm text-white truncate">{contact.name}</h4>
                  <span className="text-[10px] text-gray-500">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400 truncate pr-4">{contact.lastMsg}</p>
                  {contact.unread > 0 && (
                    <span className="bg-brand-purple text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
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
      <div className="flex-1 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between glass z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-brand" />
            <div>
              <h3 className="font-semibold text-sm text-white">{contacts.find(c => c.id === selectedId)?.name}</h3>
              <p className="text-[10px] text-emerald-400">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 glass-hover rounded-lg text-gray-400 hover:text-white transition-all">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 glass-hover rounded-lg text-gray-400 hover:text-white transition-all">
              <Video className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button className="p-2 glass-hover rounded-lg text-gray-400 hover:text-white transition-all">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Assistant Overlay */}
        <div className="px-4 py-2 bg-brand-purple/5 border-b border-brand-purple/10 flex items-center justify-center gap-2 text-[10px] text-brand-purple font-semibold uppercase tracking-widest">
          <Sparkles className="w-3 h-3 animate-pulse" />
          AI Assistant Active: Auto-qualifying Lead
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex flex-col max-w-[70%]",
              msg.type === 'sent' ? "ml-auto items-end" : "items-start"
            )}>
              <div className={cn(
                "p-3 rounded-2xl text-sm relative group",
                msg.type === 'sent' 
                  ? "bg-brand-purple text-white rounded-tr-none shadow-lg shadow-brand-purple/10" 
                  : "glass text-white rounded-tl-none border-white/10"
              )}>
                {msg.text}
                <div className={cn(
                  "flex items-center gap-1 mt-1 text-[10px]",
                  msg.type === 'sent' ? "text-purple-100/70" : "text-gray-500"
                )}>
                  {msg.time}
                  {msg.type === 'sent' && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 glass">
          <div className="flex items-center gap-3">
            <button className="p-2 glass-hover rounded-lg text-gray-400 hover:text-white transition-all">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type a message..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple/50 transition-all pr-12"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-brand-purple transition-all">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            {msg ? (
              <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-3 bg-brand-purple rounded-full text-white shadow-lg shadow-brand-purple/20 hover:scale-110 active:scale-95 transition-all"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            ) : (
              <button className="p-3 glass-hover rounded-full text-gray-400 hover:text-white transition-all">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
