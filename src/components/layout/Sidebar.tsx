'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  UserCheck, 
  Calendar, 
  Sparkles, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  ExternalLink,
  ShieldCheck, 
  Compass, 
  Flame, 
  Bot, 
  Megaphone, 
  BarChart3,
  LogOut,
  ChevronDown,
  Lock,
  UserCheck2,
  RefreshCw
} from 'lucide-react';
import { getAppState } from '@/lib/services/store';
import { useAuth } from '@/lib/auth/auth-context';

export function Sidebar() {
  const pathname = usePathname();
  const state = getAppState();
  const { user, logout, loginAsDemoUser, allDemoUsers } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isAssistant = user?.role === 'ASSISTANT';

  const coreNavItems = [
    { label: 'Executive Pulse', href: '/admin', icon: LayoutDashboard },
    { label: 'My Day (Practitioner)', href: '/admin/today', icon: CalendarCheck, badge: 'Today' },
    { label: 'Lead Pipeline', href: '/admin/leads', icon: UserCheck },
    { label: 'Client 360', href: '/admin/clients', icon: Users },
    { label: 'Appointments & Calendar', href: '/admin/calendar', icon: Calendar },
    { label: 'Service Catalogue', href: '/admin/services', icon: Sparkles },
    { label: 'Specialist Tools', href: '/admin/specialist', icon: Flame, badge: 'Vedic' },
  ];

  const intelligenceNavItems = [
    { label: 'AI Studio & Knowledge', href: '/admin/ai', icon: Bot, badge: 'Copilot' },
    { label: 'Marketing & Workflows', href: '/admin/marketing', icon: Megaphone },
    { label: 'Unified Inbox', href: '/admin/inbox', icon: MessageSquare, badge: '1 AI' },
    { 
      label: 'Finance & Ledger', 
      href: '/admin/finance', 
      icon: CreditCard,
      badge: isAssistant ? 'Restricted' : undefined,
      locked: isAssistant 
    },
    { label: 'Analytics & Reports', href: '/admin/reports', icon: BarChart3 },
    { 
      label: 'Practice Settings', 
      href: '/admin/settings', 
      icon: Settings,
      badge: isAssistant ? 'Owner' : undefined,
      locked: isAssistant 
    },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AR';

  return (
    <aside className="w-64 bg-stone-900 text-stone-200 flex flex-col border-r border-stone-800 shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-500 font-serif font-bold text-xl shadow-inner">
            ॐ
          </div>
          <div className="overflow-hidden">
            <h1 className="font-semibold text-stone-100 text-sm truncate tracking-tight">
              {state.tenant.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-amber-400 capitalize">
                {state.tenant.configProfile.replace('_', ' ')} Edition
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-3 py-1.5">
          Practitioner Core
        </div>
        {coreNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-amber-800 text-amber-100' : 'bg-stone-800 text-amber-400 border border-amber-400/20'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-3 text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-3 py-1.5">
          Intelligence & Growth
        </div>
        {intelligenceNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
              } ${item.locked ? 'opacity-80' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                  item.locked 
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40' 
                    : isActive 
                    ? 'bg-amber-800 text-amber-100' 
                    : 'bg-stone-800 text-amber-400 border border-amber-400/20'
                }`}>
                  {item.locked && <Lock className="w-2.5 h-2.5" />}
                  <span>{item.badge}</span>
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-3 py-1.5">
          Client Surfaces
        </div>
        <Link
          href={`/book/${state.tenant.slug}`}
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-stone-300 hover:text-amber-400 hover:bg-stone-800/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-stone-400" />
            <span>Public Booking Page</span>
          </div>
          <ExternalLink className="w-3 h-3 text-stone-400" />
        </Link>
        <Link
          href="/portal"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-stone-300 hover:text-amber-400 hover:bg-stone-800/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-stone-400" />
            <span>Client Self-Service Portal</span>
          </div>
          <ExternalLink className="w-3 h-3 text-stone-400" />
        </Link>
      </nav>

      {/* Practitioner User Footer with RBAC Switcher */}
      <div className="p-3 border-t border-stone-800 bg-stone-950/60 relative">
        {isProfileOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
                Switch Role (Demo)
              </span>
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="text-[10px] text-stone-400 hover:text-stone-200"
              >
                Close
              </button>
            </div>

            <div className="space-y-1.5">
              {allDemoUsers.map((u) => {
                const isSelected = user?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      loginAsDemoUser(u.id);
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-amber-600/20 border border-amber-500/40 text-amber-300' 
                        : 'hover:bg-stone-800 text-stone-300'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs">{u.name}</p>
                      <p className="text-[10px] text-stone-400">{u.title}</p>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-amber-400 font-mono font-bold uppercase">
                      {u.role}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-800">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full py-1.5 text-center text-rose-400 hover:bg-rose-950/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-stone-800/40 hover:bg-stone-800/80 border border-stone-800 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-full bg-amber-700/30 border border-amber-600/40 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-stone-200 truncate group-hover:text-amber-400 transition-colors">
              {user?.name || 'Acharya Raghavendra'}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-stone-400 truncate capitalize font-medium">
                {user?.title || 'Owner & Astrologer'}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors shrink-0" />
        </button>
      </div>
    </aside>
  );
}
