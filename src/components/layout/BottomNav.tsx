import { BarChart3, BookOpenText, FileText, Plus } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  isNavActive,
  type NavDestination,
} from '@/components/layout/navMatch';

export function BottomNav() {
  const location = useLocation();
  return (
    <>
      {location.pathname === '/' && (
        <NavLink
          to="/temas"
          className="focus-ring rounded-pill bg-accent fixed right-5 bottom-[92px] z-30 inline-flex min-h-12 items-center gap-2 px-5 text-[15px] font-semibold text-white lg:hidden"
        >
          <Plus size={19} aria-hidden="true" /> Nova redação
        </NavLink>
      )}

      <nav
        aria-label="Navegação principal"
        className="border-border-subtle bg-surface fixed inset-x-0 bottom-0 z-20 grid h-[76px] grid-cols-3 border-t px-3 pt-2 pb-[max(14px,env(safe-area-inset-bottom))] lg:hidden"
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
        <MobileLink
          to="/evolucao"
          label="Evolução"
          icon={BarChart3}
          pathname={location.pathname}
        />
      </nav>
    </>
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
      aria-current={active ? 'page' : undefined}
      className={`focus-ring rounded-input flex min-h-11 flex-col items-center justify-center gap-1 text-xs font-medium ${active ? 'text-accent-text' : 'text-text-3'}`}
    >
      <Icon size={21} aria-hidden="true" /> {label}
    </NavLink>
  );
}
