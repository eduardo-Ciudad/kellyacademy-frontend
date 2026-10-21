import { BarChart3, BookOpenText, FileText, Library, Plus } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { isNavActive, type NavDestination } from '@/components/layout/navMatch';
import { useAuth } from '@/lib/auth';

const editorRoutePattern = /^\/temas\/[^/]+\/(?:escrever|foto)\/?$/;

export function BottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || editorRoutePattern.test(location.pathname))
    return null;

  return (
    <nav
      aria-label="Navegação principal"
      className="border-border-subtle bg-bg fixed inset-x-0 bottom-0 z-20 grid h-[var(--bottom-nav-h)] grid-cols-5 border-t px-1 pt-2 pb-[calc(12px+env(safe-area-inset-bottom))] lg:hidden"
    >
      <MobileLink
        to="/"
        label="Redações"
        icon={FileText}
        pathname={location.pathname}
      />
      <MobileLink
        to="/temas"
        label="Temas"
        icon={BookOpenText}
        pathname={location.pathname}
      />
      <Link
        to="/temas"
        data-tour="nova-redacao"
        aria-label="Nova redação"
        className="focus-ring bg-accent border-bg relative top-[-14px] mx-auto flex size-14 items-center justify-center self-start rounded-full border-4 text-white transition-[transform,filter] duration-150 active:scale-96 active:brightness-90 motion-reduce:transition-none"
      >
        <Plus size={24} strokeWidth={2.2} aria-hidden="true" />
      </Link>
      <MobileLink
        to="/repertorio"
        label="Repertório"
        icon={Library}
        pathname={location.pathname}
      />
      <MobileLink
        to="/evolucao"
        label="Evolução"
        icon={BarChart3}
        pathname={location.pathname}
      />
    </nav>
  );
}

function MobileLink({
  to,
  label,
  icon: Icon,
  pathname,
}: {
  to: NavDestination;
  label: string;
  icon: typeof FileText;
  pathname: string;
}) {
  const active = isNavActive(to, pathname);

  return (
    <NavLink
      to={to}
      data-tour={
        to === '/temas'
          ? 'temas'
          : to === '/repertorio'
            ? 'repertorio'
            : to === '/evolucao'
              ? 'evolucao'
              : undefined
      }
      aria-current={active ? 'page' : undefined}
      className={`focus-ring rounded-input flex min-h-11 flex-col items-center justify-center gap-1 text-[11px] ${active ? 'text-accent-text font-semibold' : 'text-text-3 font-medium'}`}
    >
      <Icon size={22} strokeWidth={1.8} aria-hidden="true" /> {label}
    </NavLink>
  );
}
