import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  clearStoredSession,
  consumeSessionEndReason,
  getStoredSession,
  SESSION_CHANGED_EVENT,
  storeSession,
  type SessionEndReason,
  type StoredSession,
} from '@/lib/session';
import { queryClient } from '@/lib/queryClient';
import { usePageMeta } from '@/lib/usePageMeta';

type AuthContextValue = {
  session: StoredSession | null;
  isAuthenticated: boolean;
  login: (session: StoredSession, nome?: string) => void;
  logout: () => void;
  sessionEndReason: SessionEndReason | null;
  clearSessionEndReason: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<StoredSession | null>(() =>
    getStoredSession(),
  );
  const [sessionEndReason, setSessionEndReason] =
    useState<SessionEndReason | null>(() => consumeSessionEndReason());
  const logout = useCallback(() => {
    queryClient.clear();
    clearStoredSession('manual');
  }, []);
  const expireSession = useCallback(() => {
    queryClient.clear();
    clearStoredSession('expired');
  }, []);
  const login = useCallback(
    (nextSession: StoredSession, nome?: string) =>
      storeSession(nextSession, nome),
    [],
  );

  useEffect(() => {
    const syncSession = () => {
      const nextSession = getStoredSession();
      if (!nextSession) queryClient.clear();
      setSession(nextSession);
      setSessionEndReason(consumeSessionEndReason());
    };
    window.addEventListener(SESSION_CHANGED_EVENT, syncSession);
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    const remaining = new Date(session.expiraEm).getTime() - Date.now();
    if (remaining <= 0) return expireSession();
    const timeoutId = window.setTimeout(expireSession, remaining);
    return () => window.clearTimeout(timeoutId);
  }, [expireSession, session]);

  useEffect(() => {
    const revalidateSession = () => {
      if (document.visibilityState !== 'visible') return;
      const nextSession = getStoredSession();
      if (!nextSession) queryClient.clear();
      setSession(nextSession);
    };
    document.addEventListener('visibilitychange', revalidateSession);
    return () =>
      document.removeEventListener('visibilitychange', revalidateSession);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login,
      logout,
      sessionEndReason,
      clearSessionEndReason: () => setSessionEndReason(null),
    }),
    [login, logout, session, sessionEndReason],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// O hook fica junto do provider para manter a API de autenticação coesa.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}

// Mantém o aviso de expiração consistente em qualquer gate autenticado.
// eslint-disable-next-line react-refresh/only-export-components
export function useSessionExpiryNotice() {
  const { isAuthenticated, sessionEndReason, clearSessionEndReason } =
    useAuth();
  const sessionExpired = !isAuthenticated && sessionEndReason === 'expired';

  useEffect(() => {
    if (!sessionExpired) return;
    toast.error('Sua sessão expirou. Entre novamente.');
    clearSessionEndReason();
  }, [clearSessionEndReason, sessionExpired]);

  return sessionExpired;
}

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  useSessionExpiryNotice();
  usePageMeta({ title: 'Kelly Academy', noindex: true });

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate replace state={{ from: location }} to="/entrar" />
  );
}

export function PublicOnlyRoute() {
  return useAuth().isAuthenticated ? <Navigate replace to="/" /> : <Outlet />;
}
