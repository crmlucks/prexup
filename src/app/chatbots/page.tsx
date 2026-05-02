"use client";

import React, { useState, useEffect } from 'react';
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
  Save,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export default function ChatbotsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'evolution' | 'meta'>('evolution');
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [loading, setLoading] = useState(false);
  
  // Estados para la conexión
  const [serverUrl, setServerUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [instanceName, setInstanceName] = useState('PrexUp_Main');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!serverUrl || !apiKey || !instanceName) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    setLoading(true);
    setQrCode(null);

    try {
      const response = await fetch('/api/evolution/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverUrl, apiKey, instanceName })
      });

      const data = await response.json();

      if (data.success && data.qrcode) {
        setQrCode(data.qrcode);
        showToast('Código QR generado. Escanéalo en tu WhatsApp.', 'info');
      } else {
        showToast(data.error || 'Error al conectar con Evolution API', 'error');
      }
    } catch (error) {
      showToast('Error de red al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold font-outfit tracking-tight">Configuración de Chatbots</h1>
        <p className="text-muted text-[11px] mt-0.5">Vincula tu WhatsApp y activa el motor de IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {/* Opciones de Conexión */}
          <div className="space-y-3">
            <div 
              onClick={() => setActiveTab('evolution')}
              className={cn(
                "glass p-4 rounded-2xl cursor-pointer border-thin transition-all",
                activeTab === 'evolution' ? "border-brand-purple bg-brand-purple/5 shadow-lg shadow-brand-purple/10" : "hover:border-white/10"
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><QrCode size={18} /></div>
                <h3 className="font-bold text-[13px]">Evolution API (QR)</h3>
              </div>
              <p className="text-[10px] text-muted">Ideal para VPS y automatización rápida.</p>
            </div>

            <div className="glass p-4 rounded-2xl opacity-50 border-thin">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Globe size={18} /></div>
                <h3 className="font-bold text-[13px]">Meta API (Oficial)</h3>
              </div>
              <p className="text-[10px] text-muted">Próximamente disponible.</p>
            </div>
          </div>

          {/* QR Display Area */}
          <AnimatePresence>
            {qrCode && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 rounded-2xl border-primary-brand bg-white flex flex-col items-center justify-center gap-4"
              >
                <p className="text-[10px] text-black font-black uppercase tracking-widest">Escanea el código</p>
                <div className="bg-white p-2 rounded-xl shadow-inner border border-gray-100">
                  <img src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`} alt="WhatsApp QR" className="w-48 h-48" />
                </div>
                <button onClick={() => setQrCode(null)} className="text-[10px] text-red-500 font-bold hover:underline">Cancelar</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Estado */}
          <div className="glass p-5 rounded-2xl border-thin bg-foreground/[0.01]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">Estado del Sistema</h4>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                status === 'connected' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {status === 'connected' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <p className="font-bold text-[13px]">{status === 'connected' ? 'WhatsApp Activo' : 'Desconectado'}</p>
                <p className="text-[10px] text-muted">Instancia: {instanceName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Configuración */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl border-thin">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple"><LinkIcon size={16} /></div>
              <h2 className="text-lg font-bold font-outfit">Credenciales de Integración</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">URL de Evolution API</label>
                <input 
                  type="text" 
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="https://evolve.tuservidor.com" 
                  className="w-full rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">API Key Global</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Tu_Key_Secreta" 
                  className="w-full rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Nombre de Instancia</label>
                <input 
                  type="text" 
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-brand-purple/40"
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleConnect}
                  disabled={loading}
                  className="w-full py-2 rounded-lg bg-gradient-brand text-white text-[11px] font-black shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                  Vincular WhatsApp
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-card-border my-8" />

            {/* Motor de IA */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue"><Cpu size={16} /></div>
              <h2 className="text-lg font-bold font-outfit">Motor de IA Chatbot</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-foreground/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-purple/20 text-brand-purple"><Bot size={18} /></div>
                  <div>
                    <h5 className="text-[12px] font-bold">IA Conversacional</h5>
                    <p className="text-[10px] text-muted">Activa respuestas automáticas con GPT-4.</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-brand-purple/20 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-0.5 w-4 h-4 bg-brand-purple rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">Instrucciones del Sistema (Prompt)</label>
                <textarea 
                  rows={4} 
                  placeholder="Eres un experto asesor inmobiliario de PrexUp..." 
                  className="w-full rounded-lg p-3 text-[11px] focus:outline-none focus:border-brand-purple/40 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-foreground/10 text-foreground text-[10px] font-black hover:bg-foreground/20 transition-all uppercase tracking-widest">
                  <Save size={14} />
                  Guardar Todo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
