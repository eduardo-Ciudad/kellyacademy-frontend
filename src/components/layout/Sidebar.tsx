import {
  BarChart3,
  BookOpenText,
  FileText,
  Library,
  Plus,
  Route,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { KellyLogo } from '@/components/brand/KellyLogo';
import { SoonItem } from '@/components/layout/SoonItem';
import { CorrecoesHojeCard } from '@/components/redacao/CorrecoesHojeCard';
import { useLogout } from '@/hooks/useLogout';
import { useUsuario } from '@/hooks/useUsuario';
import { isNavActive } from '@/components/layout/navMatch';
import { useTour } from '@/features/tour/TourProvider';
import { SidebarAccountMenu } from '@/components/layout/SidebarAccountMenu';

const navItems = [
  { to: '/', label: 'Suas redações', icon: FileText },
  { to: '/temas', label: 'Temas', icon: BookOpenText },
  { to: '/repertorio', label: 'Repertório', icon: Library },
  { to: '/evolucao', label: 'Evolução', icon: BarChart3 },
] as const;

export function Sidebar() {
  const logout = useLogout();
  const location = useLocation();
  const { nome, iniciais, email } = useUsuario();
  const { openTour } = useTour();

  return (
    <aside className="border-border-subtle bg-bg fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r px-4 py-5 lg:flex">
      <KellyLogo size={26} className="ml-2 self-start" />

      <NavLink
        to="/temas"
        data-tour="nova-redacao"
        className="focus-ring rounded-pill border-control text-text hover:bg-surface mt-7 inline-flex min-h-12 items-center justify-center gap-2 border px-5 text-sm font-semibold transition-colors"
      >
        <Plus className="text-accent-text" size={19} aria-hidden="true" /> Nova
        redação
      </NavLink>

      <nav aria-label="Navegação principal" className="mt-6 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = isNavActive(to, location.pathname);

          return (
            <NavLink
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              data-tour={
                to === '/temas'
                  ? 'temas'
                  : to === '/repertorio'
                    ? 'repertorio'
                    : to === '/evolucao'
                      ? 'evolucao'
                      : undefined
              }
              className={`focus-ring rounded-input flex min-h-11 items-center gap-3 px-3 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-nav-active text-accent-text'
                  : 'text-text-2 hover:bg-surface-2 hover:text-text'
              }`}
            >
              <Icon size={20} aria-hidden="true" /> {label}
            </NavLink>
          );
        })}

        <SoonItem icon={Route} label="Plano de estudo" />
      </nav>

      <div className="mt-auto">
        <CorrecoesHojeCard />
        <SidebarAccountMenu
          name={nome}
          email={email}
          initials={iniciais}
          onLogout={logout}
          onOpenTour={openTour}
        />
      </div>
    </aside>
  );
}
