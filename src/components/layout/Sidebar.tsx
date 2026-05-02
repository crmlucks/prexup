"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Home, 
  TrendingUp, 
  Settings, 
  Wallet,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'CRM', href: '/crm' },
  { icon: MessageSquare, label: 'Chat', href: '/chat' },
  { icon: Home, label: 'Properties', href: '/properties' },
  { icon: Wallet, label: 'Finance', href: '/finance' },
  { icon: TrendingUp, label: 'Sales', href: '/sales' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen glass border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-purple/20">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Prex<span className="text-brand-purple">Up</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-brand-purple/10 text-white border border-brand-purple/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-brand-purple" : "group-hover:text-brand-purple"
                )} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="w-1.5 h-1.5 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(192,0,255,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">Alex Agent</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Premium Plan</span>
          </div>
        </div>
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
