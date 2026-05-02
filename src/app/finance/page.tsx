"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Filter,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

export default function FinancePage() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/finance')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0));
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Finance</h1>
          <p className="text-gray-400 text-sm mt-1">Track your commissions, expenses and financial growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg glass-hover border border-white/10 text-sm">
            <Download className="w-4 h-4" />
            Download CSV
          </button>
          <button 
            onClick={() => showToast('Feature coming soon: Manual transaction entry', 'info')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02]"
          >
            <DollarSign className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12% vs last month</span>
          </div>
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Income</h3>
          <p className="text-3xl font-bold text-white mt-1">${totalIncome.toLocaleString()}</p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full group-hover:bg-emerald-500/10 transition-all" />
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">-4% vs last month</span>
          </div>
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Expenses</h3>
          <p className="text-3xl font-bold text-white mt-1">${totalExpenses.toLocaleString()}</p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[40px] rounded-full group-hover:bg-red-500/10 transition-all" />
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 border-brand-purple/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/10 text-white">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider">Net Profit</h3>
          <p className="text-3xl font-bold text-white mt-1">${netProfit.toLocaleString()}</p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transactions Table */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button className="text-sm text-brand-purple hover:text-brand-magenta transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
              </div>
            ) : transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white truncate max-w-[200px]">{tx.title}</h4>
                    <p className="text-[10px] text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-500">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown / Sidebar Card */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6">Expense Breakdown</h2>
            <div className="space-y-4">
              {[
                { label: 'Marketing', amount: '$4,500', color: 'bg-blue-400', percent: 35 },
                { label: 'Operations', amount: '$3,200', color: 'bg-purple-400', percent: 25 },
                { label: 'Taxes', amount: '$2,800', color: 'bg-pink-400', percent: 22 },
                { label: 'Others', amount: '$1,950', color: 'bg-orange-400', percent: 18 },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-semibold">{item.amount}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full ${item.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 bg-gradient-brand border-none">
            <h2 className="text-lg font-bold text-white mb-2">Ready to scale?</h2>
            <p className="text-xs text-white/80 mb-4">Connect your bank account to automate commission tracking and tax filing.</p>
            <button className="w-full py-2.5 rounded-xl bg-white text-brand-purple text-xs font-bold hover:bg-gray-100 transition-all">
              Connect Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
