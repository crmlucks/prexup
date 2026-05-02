"use client";

import React, { useState } from 'react';
import { 
  Zap, 
  Settings, 
  QrCode, 
  Globe, 
  Bot, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Link as LinkIcon,
  ShieldCheck,
  Cpu,
  MessageSquareText,
  Save,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export default function ChatbotsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'evolution' | 'meta'>('evolution');
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus('connected');
      setLoading(false);
      showToast('Instancia conectada con éxito', 'success');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-outfit tracking-tight">Configuración de Chatbots</h1>
        <p className="text-muted text-[11px] mt-0.5">Gestiona tus conexiones de WhatsApp y automatización IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Selección de Servicio */}
        <div className="lg:col-span-1 space-y-4">
          <div 
            onClick={() => setActiveTab('evolution')}
            className={cn(
              "glass p-4 rounded-2xl cursor-pointer border-thin transition-all group",
              activeTab === 'evolution' ? "border-brand-purple bg-brand-purple/5 shadow-lg shadow-brand-purple/10" : "hover:border-white/10"
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <QrCode size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[13px]">Evolution API</h3>
                <p className="text-[10px] text-muted font-medium">Conexión vía QR Code</p>
              </div>
            </div>
            <p className="text-[10px] text-muted leading-relaxed">Usa tu VPS para conectar instancias ilimitadas de WhatsApp de forma estable.</p>
          </div>

          <div 
            onClick={() => setActiveTab('meta')}
            className={cn(
              "glass p-4 rounded-2xl cursor-pointer border-thin transition-all group opacity-60",
              activeTab === 'meta' ? "border-brand-purple bg-brand-purple/5" : "hover:border-white/10"
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[13px]">Meta Business API</h3>
                <p className="text-[10px] text-muted font-medium">Oficial (Próximamente)</p>
              </div>
            </div>
            <p className="text-[10px] text-muted leading-relaxed">Conexión directa con los servidores de Meta para alta escala y verificación oficial.</p>
          </div>

          {/* Estado de Conexión */}
          <div className="glass p-5 rounded-2xl border-thin bg-foreground/[0.01]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">Estado del Servicio</h4>
            <div className="flex items-center gap-3">
              {status === 'connected' ? (
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={24} />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                  <XCircle size={24} />
                </div>
              )}
              <div>
                <p className="font-bold text-[13px]">{status === 'connected' ? 'En Línea' : 'Desconectado'}</p>
                <p className="text-[10px] text-muted">Instancia: PrexUp_Main</p>
              </div>
            </div>
            {status === 'connected' && (
              <button 
                onClick={() => setStatus('disconnected')}
                className="w-full mt-4 py-2 rounded-lg border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/10 transition-all uppercase tracking-widest"
              >
                Desconectar Instancia
              </button>
            )}
          </div>
        </div>

        {/* Columna Derecha: Configuración Detallada */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl border-thin relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Settings size={120} />
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple">
                <LinkIcon size={16} />
              </div>
              <h2 className="text-lg font-bold font-outfit">Parámetros de Integración</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Servidor VPS (URL)</label>
                  <input 
                    type="text" 
                    placeholder="https://evolution.tu-servidor.com" 
                    className="w-full rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Global API Key</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••••••" 
                    className="w-full rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Nombre de la Instancia</label>
                  <input 
                    type="text" 
                    placeholder="PrexUp_Instance" 
                    className="w-full rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleConnect}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-gradient-brand text-white text-[11px] font-black shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                    {status === 'connected' ? 'Re-validar Conexión' : 'Conectar y Generar QR'}
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-card-border my-8" />

            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue">
                <Cpu size={16} />
              </div>
              <h2 className="text-lg font-bold font-outfit">Motor de IA Conversacional</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-purple/20 text-brand-purple">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h5 className="text-[12px] font-bold">Activar Respuesta Automática</h5>
                    <p className="text-[10px] text-muted">El bot responderá usando GPT-4 y tus datos.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-brand-purple/20 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-brand-purple rounded-full shadow-lg" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Prompt / Instrucciones del Sistema</label>
                  <span className="text-[9px] text-brand-purple font-bold">Personalizado</span>
                </div>
                <textarea 
                  rows={4} 
                  placeholder="Eres un asesor experto de PrexUp. Tu objetivo es calificar leads inmobiliarios de forma amable y eficiente..." 
                  className="w-full rounded-lg p-3 text-[11px] focus:outline-none focus:border-brand-purple/40 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-foreground/10 text-foreground text-[10px] font-black hover:bg-foreground/20 transition-all uppercase tracking-widest">
                  <Save size={14} />
                  Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
