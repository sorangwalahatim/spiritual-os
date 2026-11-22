'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './auth-context';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-stone-200">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-500 flex items-center justify-center font-serif font-bold text-2xl mx-auto animate-pulse">
            ॐ
          </div>
          <p className="text-xs text-stone-400 font-medium">Verifying practitioner session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
