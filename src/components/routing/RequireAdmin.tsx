import { Outlet } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useMe';
import { usePageMeta } from '@/lib/usePageMeta';
import { NotFound } from '@/pages/NotFound';

export function RequireAdmin() {
  const { isAdmin, isPending, isError } = useIsAdmin();
  usePageMeta({ title: 'Admin — Kelly Academy', noindex: true });

  if (isPending) return <div className="bg-bg min-h-screen" />;
  if (isError || !isAdmin) return <NotFound />;
  return <Outlet />;
}
