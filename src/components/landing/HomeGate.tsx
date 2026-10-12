import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth, useSessionExpiryNotice } from '@/lib/auth';

const Landing = lazy(() => import('@/pages/Landing'));

export function HomeGate() {
  const { isAuthenticated } = useAuth();
  const sessionExpired = useSessionExpiryNotice();

  if (sessionExpired) return <Navigate replace to="/entrar" />;

  return isAuthenticated ? (
    <AppShell />
  ) : (
    <Suspense fallback={<div className="bg-bg min-h-screen" />}>
      <Landing />
    </Suspense>
  );
}
