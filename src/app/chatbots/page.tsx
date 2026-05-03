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
  
  const [serverUrl, setServerUrl] = useState('https://evolution.chatprex.com');
  const [apiKey, setApiKey] = useState('IzWc2QxgWeO70VnJcRb9eiZfvkhoyiNg');
  const [instanceName, setInstanceName] = useState('chatprex');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [prompt, setPrompt] = useState('Eres un experto asesor inmobiliario de PrexUp. Tu objetivo es responder consultas de forma amable y profesional.');
  const [isChatbotActive, setIsChatbotActive] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    // Load settings from API
    fetch('/api/chatbots/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          if (data.webhook_url) setN8nWebhookUrl(data.webhook_url);
          if (data.prompt) setPrompt(data.prompt);
          if (data.is_active !== undefined) setIsChatbotActive(data.is_active === 1);
          if (data.evolution_instance) setInstanceName(data.evolution_instance);
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const response = await fetch('/api/chatbots/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          webhook_url: n8nWebhookUrl, 
          prompt: prompt, 
          is_active: isChatbotActive, 
          evolution_instance: instanceName 
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast('Configuraciones guardadas correctamente', 'success');
      } else {
        showToast(data.error || 'Error al guardar configuraciones', 'error');
      }
    } catch (error) {
      showToast('Error de conexión', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

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

      if (data.success) {
        if (data.status === 'connected') {
          setStatus('connected');
          showToast('¡WhatsApp ya está conectado correctamente!', 'success');
        } else if (data.qrcode) {
          setQrCode(data.qrcode);
          setStatus('disconnected');
          showToast('Nuevo código QR generado.', 'info');
        }
      } else {
        showToast(data.error || 'Error al conectar con Evolution API', 'error');
      }
    } catch (error) {
      showToast('Error de conexión', 'error');
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
          <div className="space-y-3">
            <div onClick={() => setActiveTab('evolution')} className={cn("glass p-4 rounded-2xl cursor-pointer border-thin transition-all", activeTab === 'evolution' ? "border-brand-purple bg-brand-purple/5" : "")}>
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

          <AnimatePresence>
            {qrCode && status === 'disconnected' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl border-primary-brand bg-white flex flex-col items-center gap-4">
                <p className="text-[10px] text-black font-black uppercase tracking-widest">ESCANEA EL CÓDIGO</p>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xl">
                  <img src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`} alt="WhatsApp QR" className="w-56 h-56" />
                </div>
                <button onClick={() => setQrCode(null)} className="text-[10px] text-red-500 font-bold">Cancelar</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass p-5 rounded-2xl border-thin bg-foreground/[0.01]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">Estado del Sistema</h4>
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-full", status === 'connected' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                {status === 'connected' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                <p className="font-bold text-[13px]">{status === 'connected' ? 'WhatsApp Vinculado' : 'Esperando Conexión'}</p>
                <p className="text-[10px] text-muted">Instancia: {instanceName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl border-thin">
            <div className="flex items-center gap-2 mb-6"><div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple"><LinkIcon size={16} /></div><h2 className="text-lg font-bold font-outfit">Credenciales de Integración</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">URL DE EVOLUTION API</label>
                <input type="text" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} className="w-full rounded-lg px-3 py-2 text-[11px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-brand-purple/40 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">API KEY GLOBAL</label>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full rounded-lg px-3 py-2 text-[11px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-brand-purple/40 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">NOMBRE DE INSTANCIA</label>
                <input type="text" value={instanceName} onChange={(e) => setInstanceName(e.target.value)} className="w-full rounded-lg px-3 py-2 text-[11px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-brand-purple/40 outline-none" />
              </div>
              <div className="flex items-end">
                <button onClick={handleConnect} disabled={loading} className="w-full py-2 rounded-lg bg-brand-purple text-white text-[11px] font-black shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                  VINCULAR WHATSAPP
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-card-border my-8" />
            
            <div className="flex items-center gap-2 mb-6"><div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue"><Cpu size={16} /></div><h2 className="text-lg font-bold font-outfit">Motor de IA Chatbot (n8n)</h2></div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-purple/20 text-brand-purple"><Bot size={18} /></div>
                  <div><h5 className="text-[12px] font-bold text-slate-800 dark:text-white">IA Conversacional Automática</h5><p className="text-[10px] text-slate-500 dark:text-muted">Desviar mensajes entrantes a n8n para respuestas IA.</p></div>
                </div>
                <div onClick={() => setIsChatbotActive(!isChatbotActive)} className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-all", isChatbotActive ? "bg-brand-purple" : "bg-slate-300 dark:bg-white/10")}>
                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", isChatbotActive ? "right-1" : "left-1")} />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">WEBHOOK URL DE N8N (RECEPCIÓN)</label>
                <input type="text" placeholder="https://tu-n8n.com/webhook/..." value={n8nWebhookUrl} onChange={(e) => setN8nWebhookUrl(e.target.value)} className="w-full rounded-lg px-3 py-2 text-[11px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-brand-purple/40 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-0.5">INSTRUCCIONES DEL SISTEMA (PROMPT)</label>
                <textarea rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Eres un experto asesor inmobiliario de PrexUp..." className="w-full rounded-lg p-3 text-[11px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-brand-purple/40 outline-none resize-none" />
              </div>
              
              <div className="flex justify-end pt-2">
                <button onClick={handleSaveSettings} disabled={savingSettings} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white text-[10px] font-black hover:bg-slate-300 dark:hover:bg-white/20 transition-all uppercase tracking-widest disabled:opacity-50">
                  {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
                  GUARDAR TODO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
