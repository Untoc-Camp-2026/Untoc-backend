import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { login as loginRequest } from '@/api/auth';
import type { AuthSession } from '@/types/auth';

const AUTH_STORAGE_KEY = 'untoc_auth_session';

type AuthContextValue = {
  session: AuthSession | null;
  isHydrated: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (loginId: string, password: string) => Promise<AuthSession>;
  logout: () => void;
  updateSession: (session: AuthSession | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const readSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    return null;
  }
};

const persistSession = (session: AuthSession | null) => {
  if (typeof window === 'undefined') return;

  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setIsHydrated(true);
  }, []);

  const updateSession = (nextSession: AuthSession | null) => {
    setSession(nextSession);
    persistSession(nextSession);
  };

  const logout = () => updateSession(null);

  const login = async (loginId: string, password: string) => {
    const nextSession = await loginRequest(loginId, password);
    updateSession(nextSession);
    return nextSession;
  };

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isHydrated,
    isLoggedIn: Boolean(session?.accessToken),
    isAdmin: Boolean(session?.adminStatus),
    login,
    logout,
    updateSession,
  }), [isHydrated, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}