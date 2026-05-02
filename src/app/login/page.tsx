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
    // Mock login delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-blue/10 blur-[150px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass rounded-3xl p-8 border border-white/5 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-2xl shadow-brand-purple/20 mb-4">
              <TrendingUp className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-outfit text-white">Prex<span className="text-brand-purple">Up</span></h1>
            <p className="text-gray-400 text-sm mt-1">AI-Powered Real Estate CRM</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-purple/50 transition-all text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] text-brand-purple hover:text-brand-magenta transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-purple/50 transition-all text-white"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-bold text-sm shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-xs text-gray-500">Or continue with</p>
            <div className="flex gap-4 w-full">
              <button className="flex-1 py-2.5 rounded-xl glass-hover border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all">
                <Github className="w-4 h-4" />
                GitHub
              </button>
              <button className="flex-1 py-2.5 rounded-xl glass-hover border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Don&apos;t have an account? <Link href="#" className="text-brand-purple font-semibold hover:underline">Start free trial</Link>
            </p>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-gray-500 mt-8 uppercase tracking-widest font-bold">
          Powered by PrexUp AI v2.0
        </p>
      </motion.div>
    </div>
  );
}
