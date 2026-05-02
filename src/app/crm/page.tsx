"use client";

import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  DollarSign,
  MessageCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const columns = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-400' },
  { id: 'qualified', title: 'Qualified', color: 'bg-purple-400' },
  { id: 'proposal', title: 'Proposal', color: 'bg-pink-400' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-400' },
  { id: 'won', title: 'Closed Won', color: 'bg-emerald-400' },
];

export default function CRMPage() {
  const [leads, setLeads] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        // Map API data to UI format if needed
        const mappedData = data.map((l: any) => ({
          ...l,
          budget: typeof l.budget === 'number' ? `$${(l.budget / 1000).toFixed(0)}k` : l.budget,
          time: l.time || 'Just now',
          priority: l.priority || 'medium',
          property: l.property || 'Analyzing interest...'
        }));
        setLeads(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Sales Pipeline</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your leads and deals across the sales funnel.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-purple transition-colors" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 transition-all w-64"
            />
          </div>
          <button className="p-2 rounded-lg glass-hover border border-white/10">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[calc(100vh-250px)]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
          </div>
        ) : columns.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-72 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                <h3 className="font-semibold text-sm text-white">{col.title}</h3>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {leads.filter(l => l.status === col.id).length}
                </span>
              </div>
              <button className="text-gray-500 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 p-2 bg-white/[0.02] rounded-2xl border border-white/5">
              {leads.filter(l => l.status === col.id).map((lead) => (
                <motion.div 
                  key={lead.id}
                  layoutId={lead.id}
                  className="glass p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-brand-purple/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      lead.priority === 'high' ? 'bg-red-400/10 text-red-400' : 
                      lead.priority === 'medium' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-blue-400/10 text-blue-400'
                    }`}>
                      {lead.priority}
                    </span>
                    <button className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-semibold text-sm text-white mb-1">{lead.name}</h4>
                  <p className="text-xs text-gray-400 mb-4 truncate">{lead.property}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-[10px] text-gray-500">
                        <DollarSign className="w-3 h-3 mr-0.5 text-emerald-400" />
                        {lead.budget}
                      </div>
                      <div className="flex items-center text-[10px] text-gray-500">
                        <MessageCircle className="w-3 h-3 mr-0.5 text-blue-400" />
                        WhatsApp
                      </div>
                    </div>
                    <div className="flex items-center text-[10px] text-gray-500">
                      <Clock className="w-3 h-3 mr-0.5" />
                      {lead.time}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <button className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-gray-500 hover:text-white hover:border-white/20 transition-all">
                + Add Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
