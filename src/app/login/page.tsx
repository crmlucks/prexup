"use client";

import React, { useState } from 'react';
import { TrendingUp, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-blue/5 blur-[150px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[380px] z-10"
      >
        <div className="glass rounded-2xl p-6 border border-card-border shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-xl shadow-brand-purple/20 mb-3">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold font-outfit">Prex<span className="text-brand-purple">Up</span></h1>
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">CRM Inmobiliario con IA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="email" 
                  required
                  placeholder="ejemplo@empresa.com" 
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-lg pl-9 pr-3 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">Contraseña</label>
                <Link href="#" className="text-[9px] text-brand-purple font-bold hover:underline">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-lg pl-9 pr-3 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-brand text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-card-border flex flex-col items-center gap-4">
            <p className="text-[9px] text-muted font-bold uppercase tracking-widest">O continúa con</p>
            <div className="flex gap-3 w-full">
              <button className="flex-1 py-1.5 rounded-lg glass-hover border border-card-border flex items-center justify-center gap-2 text-[10px] font-bold transition-all">
                <Github size={14} />
                GitHub
              </button>
              <button className="flex-1 py-1.5 rounded-lg glass-hover border border-card-border flex items-center justify-center gap-2 text-[10px] font-bold transition-all">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>
            <p className="text-[10px] text-muted mt-2">
              ¿No tienes cuenta? <Link href="#" className="text-brand-purple font-black hover:underline">Prueba gratuita</Link>
            </p>
          </div>
        </div>
        
        <p className="text-center text-[9px] text-muted mt-6 uppercase tracking-widest font-black opacity-50">
          Powered by PrexUp AI v2.5
        </p>
      </motion.div>
    </div>
  );
}
