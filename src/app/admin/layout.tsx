'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { AuthProvider } from '@/lib/auth/auth-context';
import { AdminAuthGuard } from '@/lib/auth/admin-auth-guard';
import { LiveDataProvider } from '@/lib/data/live-data-context';

function AdminContent({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <LiveDataProvider>
        <div className="flex min-h-screen bg-stone-100/60 font-sans">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </div>
      </LiveDataProvider>
    </AdminAuthGuard>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminContent>{children}</AdminContent>
    </AuthProvider>
  );
}
