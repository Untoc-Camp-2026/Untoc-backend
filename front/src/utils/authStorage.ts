import type { AuthSession } from '@/types/auth';

export const AUTH_STORAGE_KEY = 'untoc_auth_session';

export const readStoredSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

export const getAccessToken = (): string | null => readStoredSession()?.accessToken ?? null;
