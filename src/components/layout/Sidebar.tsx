"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Home, 
  PieChart, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  TrendingUp,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Clientes CRM', icon: Users, href: '/crm' },
    { name: 'Chat AI', icon: MessageSquare, href: '/chat' },
    { name: 'Chatbots', icon: Zap, href: '/chatbots' },
    { name: 'Propiedades', icon: Home, href: '/properties' },
    { name: 'Finanzas', icon: PieChart, href: '/finance' },
    { name: 'Ventas', icon: TrendingUp, href: '/sales' },
  ];

  return (
    <aside
      className={cn(
        "glass border-primary-subtle z-50 flex transition-all duration-300 sticky top-0",
        "md:flex-col md:h-screen md:border-r md:border-b-0 border-b",
        "flex-row w-full h-auto overflow-x-hidden md:overflow-visible items-center px-1 py-1 md:p-0",
        isCollapsed ? "md:w-[80px]" : "md:w-[240px]"
      )}
    >
      {/* Header */}
      <div className="p-2 md:p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold">P</span>
          </div>
          <span className={cn(
            "font-outfit font-bold text-xl tracking-tight hidden md:block transition-all overflow-hidden whitespace-nowrap",
            isCollapsed ? "w-0 opacity-0" : "w-[80px] opacity-100"
          )}>
            PrexUp
          </span>
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-row md:flex-col md:flex-1 px-1 md:px-3 md:py-4 gap-1 md:space-y-1 overflow-x-auto custom-scrollbar flex-nowrap shrink-0 md:shrink">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20" 
                  : "text-slate-500 dark:text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white"
              )}>
                <item.icon size={20} className={cn("min-w-[20px]", isActive ? "text-white" : "group-hover:text-brand-purple")} />
                
                <span className={cn(
                  "text-sm font-medium whitespace-nowrap transition-all hidden md:block overflow-hidden",
                  isCollapsed ? "w-0 opacity-0" : "w-[120px] opacity-100"
                )}>
                  {item.name}
                </span>
                
                {isCollapsed && (
                  <div className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-slate-800 dark:bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="flex flex-row md:flex-col p-1 md:p-3 md:border-t border-primary-subtle gap-1 md:space-y-1 shrink-0 ml-auto md:ml-0 border-l md:border-l-0 border-primary-subtle pl-2 md:pl-3">
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-muted hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className={cn(
            "text-sm font-medium whitespace-nowrap transition-all hidden md:block overflow-hidden text-left",
            isCollapsed ? "w-0 opacity-0" : "w-[120px] opacity-100"
          )}>
            Modo {theme === 'dark' ? 'Claro' : 'Oscuro'}
          </span>
        </button>

        <button className="flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-all">
          <LogOut size={20} />
          <span className={cn(
            "text-sm font-medium whitespace-nowrap transition-all hidden md:block overflow-hidden text-left",
            isCollapsed ? "w-0 opacity-0" : "w-[120px] opacity-100"
          )}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
};
