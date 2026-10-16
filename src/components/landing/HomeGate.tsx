import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth, useSessionExpiryNotice } from '@/lib/auth';
import { usePageMeta } from '@/lib/usePageMeta';

const Landing = lazy(() => import('@/pages/Landing'));

function AuthenticatedHome() {
  usePageMeta({ title: 'Kelly Academy', noindex: true });
  return <AppShell />;
}

export function HomeGate() {
  const { isAuthenticated } = useAuth();
  const sessionExpired = useSessionExpiryNotice();

  if (sessionExpired) return <Navigate replace to="/entrar" />;

  return isAuthenticated ? (
    <AuthenticatedHome />
  ) : (
    <Suspense fallback={<div className="bg-bg min-h-screen" />}>
      <Landing />
    </Suspense>
  );
}
