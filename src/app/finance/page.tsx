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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-outfit tracking-tight">Finanzas</h1>
          <p className="text-muted text-xs mt-0.5">Control de comisiones, gastos y crecimiento financiero.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-hover border border-primary-subtle text-[11px]">
            <Download size={14} />
            Descargar CSV
          </button>
          <button 
            onClick={() => showToast('Próximamente: Entrada manual', 'info')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-brand text-white text-[11px] font-bold shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02]"
          >
            <DollarSign size={14} />
            Nueva Transacción
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp size={18} />
            </div>
            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">+12% vs mes anterior</span>
          </div>
          <h3 className="text-muted text-[10px] font-semibold uppercase tracking-wider">Ingresos Totales</h3>
          <p className="text-2xl font-bold mt-1">${totalIncome.toLocaleString()}</p>
        </div>

        <div className="glass p-4 rounded-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <TrendingDown size={18} />
            </div>
            <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-md">-4% vs mes anterior</span>
          </div>
          <h3 className="text-muted text-[10px] font-semibold uppercase tracking-wider">Gastos Totales</h3>
          <p className="text-2xl font-bold mt-1">${totalExpenses.toLocaleString()}</p>
        </div>

        <div className="glass p-4 rounded-xl relative overflow-hidden group bg-gradient-brand text-white border-none shadow-xl shadow-brand-purple/20">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-white/20 text-white">
              <Wallet size={18} />
            </div>
          </div>
          <h3 className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Beneficio Neto</h3>
          <p className="text-2xl font-bold mt-1">${netProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Table */}
        <div className="lg:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Transacciones Recientes</h2>
            <button className="text-[11px] text-brand-purple font-bold">Ver todo</button>
          </div>
          <div className="space-y-2.5">
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-6 h-6 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
              </div>
            ) : transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-foreground/[0.02] border border-card-border group hover:bg-foreground/[0.04] transition-all">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold truncate max-w-[150px]">{tx.title}</h4>
                    <p className="text-[9px] text-muted">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[11px] font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-muted">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown / Sidebar Card */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Distribución de Gastos</h2>
            <div className="space-y-3">
              {[
                { label: 'Marketing', amount: '$4,500', color: 'bg-blue-500', percent: 35 },
                { label: 'Operaciones', amount: '$3,200', color: 'bg-purple-500', percent: 25 },
                { label: 'Impuestos', amount: '$2,800', color: 'bg-pink-500', percent: 22 },
                { label: 'Otros', amount: '$1,950', color: 'bg-orange-500', percent: 18 },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted font-medium">{item.label}</span>
                    <span className="font-bold">{item.amount}</span>
                  </div>
                  <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
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

          <div className="glass rounded-xl p-5 bg-gradient-brand border-none text-white shadow-xl shadow-brand-purple/10">
            <h2 className="text-sm font-bold mb-1">¿Listo para escalar?</h2>
            <p className="text-[10px] text-white/80 mb-4 leading-relaxed">Conecta tu cuenta bancaria para automatizar el rastreo de comisiones e impuestos.</p>
            <button className="w-full py-2 rounded-lg bg-white text-brand-purple text-[10px] font-black hover:bg-gray-100 transition-all">
              Conectar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
