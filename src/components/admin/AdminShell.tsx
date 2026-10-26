import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowLeft,
  Bot,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  Newspaper,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { KellyLogo } from '@/components/brand/KellyLogo';
import { SoonItem } from '@/components/layout/SoonItem';
import { useUsuario } from '@/hooks/useUsuario';

const navItems = [
  { to: '/admin', label: 'Visão geral', icon: LayoutDashboard, exact: true },
  { to: '/admin/usuarios', label: 'Usuários', icon: Users, exact: false },
] as const;

const soonItems = [
  { label: 'Redações', icon: FileText },
  { label: 'Uso de IA', icon: Bot },
  { label: 'Assinaturas', icon: CreditCard },
  { label: 'Conteúdo', icon: Newspaper },
] as const;

function AdminBadge() {
  return (
    <span className="bg-nav-active text-accent-text rounded-[6px] px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.12em]">
      ADMIN
    </span>
  );
}

function AdminNavLink({
  to,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  to: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
  onClick?: () => void;
}) {
  const pathname = useLocation().pathname;
  const active = exact ? pathname === to : pathname.startsWith(to);
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
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
}

function AdminNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Navegação administrativa" className="space-y-1">
      {navItems.map((item) => (
        <AdminNavLink key={item.to} {...item} onClick={onNavigate} />
      ))}
      <div className="border-border-subtle my-3 border-t" />
      {soonItems.map((item) => (
        <SoonItem key={item.label} {...item} />
      ))}
    </nav>
  );
}

function AdminIdentity() {
  const { nome, iniciais } = useUsuario();
  return (
    <div className="border-border-subtle flex min-h-14 items-center gap-3 rounded-[14px] border px-2.5">
      <span className="bg-nav-active text-accent-text-hover flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold">
        {iniciais}
      </span>
      <span className="min-w-0">
        <span className="text-text block truncate text-sm font-semibold">
          {nome}
        </span>
        <span className="text-text-3 mt-0.5 block text-xs">Administrador</span>
      </span>
    </div>
  );
}

function AdminMobileHeader() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <header className="border-border-subtle bg-bg sticky top-0 z-20 flex min-h-16 items-center justify-between border-b px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <KellyLogo size={24} />
          <AdminBadge />
        </div>
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label="Abrir menu administrativo"
            className="focus-ring text-text hover:bg-surface-2 rounded-input flex size-11 items-center justify-center"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </Dialog.Trigger>
      </header>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
        <Dialog.Content className="bg-bg border-border-subtle fixed inset-y-0 right-0 z-50 flex w-[min(88vw,340px)] flex-col border-l p-4 outline-none lg:hidden">
          <div className="flex min-h-12 items-center justify-between">
            <Dialog.Title className="flex items-center gap-3">
              <KellyLogo size={24} />
              <AdminBadge />
            </Dialog.Title>
            <Dialog.Close
              className="focus-ring text-text-2 hover:bg-surface-2 rounded-input flex size-11 items-center justify-center"
              aria-label="Fechar menu"
            >
              <X size={21} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Navegação do painel administrativo
          </Dialog.Description>
          <div className="mt-6">
            <AdminNavigation onNavigate={() => setOpen(false)} />
          </div>
          <div className="mt-auto space-y-3 pt-6">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="focus-ring border-control text-text hover:bg-surface rounded-input flex min-h-11 items-center justify-center gap-2 border px-4 text-sm font-semibold"
            >
              <ArrowLeft size={18} aria-hidden="true" /> Voltar ao app
            </Link>
            <AdminIdentity />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AdminShell() {
  return (
    <div className="bg-bg min-h-screen font-sans">
      <aside className="border-border-subtle bg-bg fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r px-4 py-5 lg:flex">
        <div className="ml-2 flex items-center gap-3">
          <KellyLogo size={26} />
          <AdminBadge />
        </div>
        <div className="mt-8">
          <AdminNavigation />
        </div>
        <div className="mt-auto space-y-3">
          <Link
            to="/"
            className="focus-ring border-control text-text hover:bg-surface rounded-input flex min-h-11 items-center justify-center gap-2 border px-4 text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={18} aria-hidden="true" /> Voltar ao app
          </Link>
          <AdminIdentity />
        </div>
      </aside>
      <AdminMobileHeader />
      <main className="min-h-screen px-4 py-7 lg:ml-[248px] lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1240px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
