"use client";
import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

const EMOJI_CATEGORIES: Record<string, string[]> = {
  "😀 Caras": ["😀","😃","😄","😁","😆","🤣","😂","😊","😇","🙂","😉","😍","🥰","😘","😋","😜","🤪","🤗","🤔","🤫","🤭","😏","😌","😴","🥱","😷","🤒","🤕","🤑","🤠","😎","🥳","😤","😠","🤬","😈","💀","☠️","💩","🤡","👻","👽","🤖"],
  "👋 Manos": ["👋","🤚","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤝","🙏","💪"],
  "❤️ Amor": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","💕","💞","💓","💗","💖","💘","💝","💟","♥️","💋","💌","💐","🌹","🌷"],
  "🏠 Inmuebles": ["🏠","🏡","🏢","🏗️","🏘️","🏚️","🏛️","🏰","🏯","🗼","🏟️","🏪","🏬","🏭","🏨","🏫","🏥","🏦","🗺️","📍","📌","🔑","🗝️","🚪","🪟","🛏️","🛋️","🪑","🚿","🛁","💰","💵","💎","📊","📈","📉","✅","⭐","🌟","💯","🎯","🔥","⚡","✨"],
  "📱 Tech": ["📱","💻","⌨️","🖥️","🖨️","📷","📹","📞","☎️","📟","📠","📺","📻","🔔","🔕","📢","📣","💬","💭","🗯️","📝","📋","📎","🔗","📁","📂","🗂️","📅","📆","🕐"]
};

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(Object.keys(EMOJI_CATEGORIES)[0]);

  const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
  const filtered = search ? allEmojis.filter(e => e.includes(search)) : EMOJI_CATEGORIES[activeTab] || [];

  return (
    <div className="absolute bottom-16 left-0 w-[320px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2.5 border-b border-white/5">
        <span className="text-[9px] font-black uppercase tracking-widest text-brand-purple">Emojis</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10"><X size={12} className="text-muted" /></button>
      </div>
      {/* Search */}
      <div className="px-2.5 py-1.5">
        <div className="relative">
          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar emoji..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg text-[10px] bg-white/5 border border-white/5 focus:border-brand-purple/30 outline-none" />
        </div>
      </div>
      {/* Tabs */}
      {!search && (
        <div className="flex gap-0.5 px-2 overflow-x-auto scrollbar-none">
          {Object.keys(EMOJI_CATEGORIES).map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)}
              className={`px-2 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap transition-all ${activeTab === cat ? 'bg-brand-purple/20 text-brand-purple' : 'text-muted/50 hover:text-muted'}`}>
              {cat}
            </button>
          ))}
        </div>
      )}
      {/* Grid */}
      <div className="p-2 grid grid-cols-8 gap-0.5 max-h-[200px] overflow-y-auto custom-scrollbar">
        {filtered.map((emoji, i) => (
          <button key={i} onClick={() => onSelect(emoji)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-lg transition-all hover:scale-125">
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
