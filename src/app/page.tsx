"use client";

import React from 'react';
import { 
  Users, 
  Home, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Zap,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Total Leads', value: '1,284', change: '+12.5%', trend: 'up', icon: Users, color: 'text-blue-400' },
  { label: 'Properties', value: '432', change: '+3.2%', trend: 'up', icon: Home, color: 'text-purple-400' },
  { label: 'Active Deals', value: '48', change: '-2.4%', trend: 'down', icon: TrendingUp, color: 'text-pink-400' },
  { label: 'Total Revenue', value: '$4.2M', change: '+18.7%', trend: 'up', icon: DollarSign, color: 'text-emerald-400' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, Alex. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg glass-hover text-sm font-medium border border-white/10 transition-all">
            Export Report
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            + Add Property
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="glass p-6 rounded-2xl relative group overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</h3>
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart / Area - Placeholder for visual density */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-purple" />
              Sales Performance
            </h2>
            <select className="bg-transparent text-sm text-gray-400 border-none focus:ring-0 cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-end gap-2 px-2">
            {[40, 60, 45, 90, 65, 85, 100, 75, 50, 80, 95, 110].map((height, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, duration: 1 }}
                className="flex-1 bg-gradient-to-t from-brand-purple/40 to-brand-purple/5 rounded-t-sm"
              />
            ))}
          </div>
        </div>

        {/* AI Sales Insights */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-purple animate-pulse" />
            </div>
            <h2 className="text-lg font-semibold">AI Insights</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { title: 'Lead Hotness', desc: 'Leads from WhatsApp increased by 22%. 5 high-intent leads ready for follow-up.', icon: Zap, color: 'bg-yellow-400/20 text-yellow-400' },
              { title: 'Smart Recommendation', desc: 'Match found for "Villa Beachfront" with 3 active qualified leads.', icon: MessageCircle, color: 'bg-blue-400/20 text-blue-400' },
              { title: 'Follow-up Alert', desc: 'John Doe has been waiting for a response for 4 hours. High churn risk.', icon: TrendingUp, color: 'bg-red-400/20 text-red-400' }
            ].map((insight, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                <div className="flex gap-4">
                  <div className={`mt-1 p-2 rounded-lg h-fit ${insight.color}`}>
                    <insight.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-brand-purple transition-colors">{insight.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{insight.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-auto w-full py-3 text-xs font-semibold text-brand-purple hover:text-brand-magenta transition-colors border-t border-white/5 pt-6">
            View All AI Reports
          </button>
        </div>
      </div>

      {/* Recent Leads Table / List */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-6">Recent WhatsApp Leads</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                <th className="pb-4 font-medium">Lead</th>
                <th className="pb-4 font-medium">Phone</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Budget</th>
                <th className="pb-4 font-medium">Source</th>
                <th className="pb-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'Sarah Miller', phone: '+1 234 567 890', status: 'Qualified', budget: '$450k - $600k', source: 'WhatsApp' },
                { name: 'David Chen', phone: '+1 987 654 321', status: 'New', budget: '$1.2M - $1.5M', source: 'Facebook' },
                { name: 'Michael Ross', phone: '+1 456 789 012', status: 'Proposal', budget: '$800k - $900k', source: 'WhatsApp' },
                { name: 'Elena Gomez', phone: '+1 321 654 098', status: 'Won', budget: '$2.5M', source: 'Direct' },
              ].map((lead, i) => (
                <tr key={i} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="py-4 font-medium text-white">{lead.name}</td>
                  <td className="py-4 text-gray-400">{lead.phone}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'Won' ? 'bg-emerald-400/10 text-emerald-400' : 
                      lead.status === 'Qualified' ? 'bg-blue-400/10 text-blue-400' :
                      lead.status === 'Proposal' ? 'bg-purple-400/10 text-purple-400' : 'bg-white/10 text-white'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-400">{lead.budget}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-300">
                      <MessageCircle className="w-3 h-3 text-emerald-400" />
                      {lead.source}
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
