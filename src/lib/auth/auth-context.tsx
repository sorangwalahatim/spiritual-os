'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types/domain';
import { initialUsers } from '@/lib/services/mock-data';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoUser: (userId: string) => void;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
  canViewConfidentialNotes: () => boolean;
  canAccessFinances: () => boolean;
  canManageSettings: () => boolean;
  allDemoUsers: User[];
}

const AUTH_STORAGE_KEY = 'spiritual_os_auth_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from storage or default to Owner
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default to lead practitioner/owner for immediate demo continuity
        setUser(initialUsers[0]);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(initialUsers[0]));
      }
    } catch (e) {
      setUser(initialUsers[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string) => {
    const found = initialUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'User not found. Use one of the registered practitioner accounts.' };
  };

  const loginAsDemoUser = (userId: string) => {
    const target = initialUsers.find(u => u.id === userId) || initialUsers[0];
    setUser(target);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(target));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push('/login');
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canViewConfidentialNotes = (): boolean => {
    if (!user) return false;
    return user.role === 'OWNER' || user.role === 'PRACTITIONER';
  };

  const canAccessFinances = (): boolean => {
    if (!user) return false;
    return user.role === 'OWNER' || user.role === 'FINANCE';
  };

  const canManageSettings = (): boolean => {
    if (!user) return false;
    return user.role === 'OWNER';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemoUser,
        logout,
        hasRole,
        canViewConfidentialNotes,
        canAccessFinances,
        canManageSettings,
        allDemoUsers: initialUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
