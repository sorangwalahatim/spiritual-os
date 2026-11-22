'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Compass,
  KeyRound
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { initialUsers } from '@/lib/services/mock-data';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const { login, loginAsDemoUser } = useAuth();
  const [email, setEmail] = useState('raghavendra@astroveda.com');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push(redirectPath);
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleDemoSelect = (userId: string) => {
    loginAsDemoUser(userId);
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between selection:bg-amber-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-stone-800 bg-stone-950/60 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-500 font-serif font-bold text-xl shadow-inner">
            ॐ
          </div>
          <div>
            <span className="font-bold text-stone-100 text-sm tracking-tight">Spiritual Practice OS</span>
            <p className="text-[10px] text-amber-400 font-medium">Practitioner Authentication Portal</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/book/astroveda"
            target="_blank"
            className="text-stone-400 hover:text-amber-400 flex items-center gap-1 font-medium transition-colors"
          >
            <span>Client Booking Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="max-w-4xl mx-auto w-full px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Form & Trust */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role-Based Access Control (RBAC) Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-white tracking-tight">
              Sign in to Practitioner Workspace
            </h1>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              Confidential, HIPAA & Section-13 privacy compliant workspace for Vedic Astrologers, Tarot Readers, and Spiritual Mentors.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 bg-stone-800/60 p-6 rounded-2xl border border-stone-700/70 shadow-xl">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Practitioner Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@astroveda.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Password
                </label>
                <span className="text-[10px] text-amber-400">Encrypted</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: 1-Click Demo Profiles */}
        <div className="md:col-span-5 bg-stone-800/40 border border-stone-700/60 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-700/60">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Demo Profiles</span>
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Click any account to test RBAC live:</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {initialUsers.map((u) => {
              const isOwner = u.role === 'OWNER';
              const isPractitioner = u.role === 'PRACTITIONER';
              return (
                <button
                  key={u.id}
                  onClick={() => handleDemoSelect(u.id)}
                  className="w-full text-left p-3.5 rounded-xl bg-stone-900/80 border border-stone-700/70 hover:border-amber-500/80 hover:bg-stone-900 transition-all group flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-200 group-hover:text-amber-400 transition-colors">
                        {u.name}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isOwner
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isPractitioner
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">{u.title}</p>
                    <p className="text-[10px] text-stone-400 font-mono">{u.email}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all mt-1" />
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-700/60 text-[10px] text-stone-400 space-y-1">
            <p className="flex items-center gap-1.5 text-stone-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Owner: Full ledger, confidential notes, settings.</span>
            </p>
            <p className="flex items-center gap-1.5 text-stone-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Practitioner: Clinical notes, Tarot/Vedic sessions.</span>
            </p>
            <p className="flex items-center gap-1.5 text-stone-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Assistant: Scheduling & leads (confidential notes masked).</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-4 px-6 text-center text-xs text-stone-400">
        Spiritual Practice OS • Enterprise Multi-Tenant Jyotish & Intuitive Architecture
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-900" />}>
      <LoginForm />
    </Suspense>
  );
}
