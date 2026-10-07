import {
  BarChart3,
  BookOpenText,
  FileText,
  LogOut,
  Plus,
  Route,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '@/assets/studymind-logo-escuro.svg';
import { useAuth } from '@/lib/auth';
import { CorrecoesHojeCard } from '@/components/redacao/CorrecoesHojeCard';
import { useUsuario } from '@/hooks/useUsuario';
import { isNavActive } from '@/components/layout/navMatch';

const navItems = [
  { to: '/', label: 'Suas redações', icon: FileText },
  { to: '/temas', label: 'Temas', icon: BookOpenText },
  { to: '/evolucao', label: 'Evolução', icon: BarChart3 },
] as const;

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { nome, iniciais } = useUsuario();

  function handleLogout() {
    logout();
    void navigate('/entrar', { replace: true });
  }

  return (
    <aside className="border-border-subtle bg-bg fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r px-4 py-5 lg:flex">
      <img
        src={logo}
        alt="StudyMind Redação"
        className="ml-2 h-8 w-auto self-start"
      />

      <NavLink
        to="/temas"
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
      </div>

      <div className="border-border-subtle mt-3 flex min-h-16 items-center gap-3 border-t pt-3">
        <span className="bg-control text-text flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
          {iniciais}
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-text block truncate text-sm font-semibold">
            {nome}
          </span>
          <span className="text-text-3 mt-0.5 block text-xs">
            Plano gratuito
          </span>
        </span>
        <button
          onClick={handleLogout}
          className="focus-ring text-text-3 hover:bg-control hover:text-text flex size-11 items-center justify-center rounded-full"
          aria-label="Sair"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

function SoonItem({
  icon: Icon,
  label,
}: {
  icon: typeof BarChart3;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => toast('Disponível em breve')}
      className="focus-ring rounded-input text-text-3 hover:bg-surface-2 flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm font-semibold transition-colors"
    >
      <Icon size={20} aria-hidden="true" />
      <span className="flex-1">{label}</span>
      <span className="rounded-pill bg-control text-text-2 px-2 py-1 text-[10px] font-semibold">
        Em breve
      </span>
    </button>
  );
}
