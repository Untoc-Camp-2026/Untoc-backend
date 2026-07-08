import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchCurrentUser, login as loginRequest } from '@/api/auth';
import type { AuthSession, AuthRole } from '@/types/auth';
import { AUTH_STORAGE_KEY, readStoredSession } from '@/utils/authStorage';

const resolveRole = (role: string | undefined, adminStatus: boolean): AuthRole => {
  if (adminStatus) return 'ADMIN';
  if (role === 'BACKEND' || role === 'FRONTEND') return 'MEMBER';
  return 'MEMBER';
};

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
    const hydrateSession = async () => {
      const storedSession = readStoredSession();
      if (!storedSession?.accessToken) {
        setSession(null);
        setIsHydrated(true);
        return;
      }

      try {
        const profile = await fetchCurrentUser(storedSession.accessToken);
        const refreshedSession: AuthSession = {
          ...storedSession,
          userId: profile.user_id || storedSession.userId,
          name: profile.name ?? storedSession.name,
          role: resolveRole(profile.role, Boolean(profile.admin_status)),
          adminStatus: Boolean(profile.admin_status),
          profileImageUrl: profile.profile_image_url ?? storedSession.profileImageUrl,
          introduction: profile.introduction ?? storedSession.introduction,
        };
        setSession(refreshedSession);
        persistSession(refreshedSession);
      } catch {
        persistSession(null);
        setSession(null);
      } finally {
        setIsHydrated(true);
      }
    };

    void hydrateSession();
  }, []);

  const updateSession = useCallback((nextSession: AuthSession | null) => {
    setSession(nextSession);
    persistSession(nextSession);
  }, []);

  const logout = useCallback(() => updateSession(null), [updateSession]);

  const login = useCallback(async (loginId: string, password: string) => {
    const nextSession = await loginRequest(loginId, password);
    updateSession(nextSession);
    return nextSession;
  }, [updateSession]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isHydrated,
    isLoggedIn: Boolean(session?.accessToken),
    isAdmin: Boolean(session?.adminStatus),
    login,
    logout,
    updateSession,
  }), [isHydrated, session, login, logout, updateSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}