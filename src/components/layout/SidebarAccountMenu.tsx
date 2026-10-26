import {
  ChevronsUpDown,
  Crown,
  KeyRound,
  LogOut,
  RotateCcw,
  Shield,
} from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useMe';

type SidebarAccountMenuProps = {
  name: string;
  email: string;
  initials: string;
  onLogout: () => void;
  onOpenTour: () => void;
};

export function SidebarAccountMenu({
  name,
  email,
  initials,
  onLogout,
  onOpenTour,
}: SidebarAccountMenuProps) {
  const { isAdmin } = useIsAdmin();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (!open) return;

    itemRefs.current[0]?.focus();
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  function closeMenu({ restoreFocus = false } = {}) {
    setOpen(false);
    if (restoreFocus) window.setTimeout(() => buttonRef.current?.focus(), 0);
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    event.preventDefault();
    const items = itemRefs.current.filter(Boolean) as HTMLElement[];
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + direction + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  function setItemRef(index: number) {
    return (element: HTMLElement | null) => {
      itemRefs.current[index] = element;
    };
  }

  return (
    <div ref={rootRef} className="relative mt-3">
      {open ? (
        <div
          role="menu"
          aria-label="Menu da conta"
          onKeyDown={handleMenuKeyDown}
          className="bg-surface border-control shadow-raised absolute right-0 bottom-[calc(100%+8px)] left-0 z-30 rounded-[14px] border p-1.5"
        >
          <div className="min-w-0 px-2.5 py-2">
            <p className="text-text truncate text-[13px] font-semibold">
              {name}
            </p>
            <p className="text-text-3 mt-0.5 truncate text-xs">{email}</p>
          </div>
          <div className="bg-control my-1 h-px" />
          <MenuLink
            ref={setItemRef(0)}
            to="/planos"
            onClick={() => closeMenu()}
          >
            <Crown size={17} aria-hidden="true" />
            <span className="flex-1">Planos</span>
            <span className="bg-control text-text-3 rounded-md px-2 py-1 text-[11px] font-semibold">
              Grátis
            </span>
          </MenuLink>
          {isAdmin ? (
            <MenuLink
              ref={setItemRef(1)}
              to="/admin"
              onClick={() => closeMenu()}
            >
              <Shield size={17} aria-hidden="true" /> Painel admin
            </MenuLink>
          ) : null}
          <MenuLink
            ref={setItemRef(isAdmin ? 2 : 1)}
            to="/conta/senha"
            onClick={() => closeMenu()}
          >
            <KeyRound size={17} aria-hidden="true" /> Alterar senha
          </MenuLink>
          <MenuButton
            ref={setItemRef(isAdmin ? 3 : 2)}
            onClick={() => {
              closeMenu();
              window.setTimeout(onOpenTour, 0);
            }}
          >
            <RotateCcw size={17} aria-hidden="true" /> Rever tour
          </MenuButton>
          <div className="bg-control my-1 h-px" />
          <MenuButton
            ref={setItemRef(isAdmin ? 4 : 3)}
            onClick={() => {
              closeMenu();
              onLogout();
            }}
          >
            <LogOut size={17} aria-hidden="true" /> Sair
          </MenuButton>
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`focus-ring border-border-subtle hover:bg-surface flex min-h-14 w-full items-center gap-3 rounded-[14px] border px-2.5 text-left transition-colors ${open ? 'bg-surface' : ''}`}
      >
        <span className="bg-nav-active text-accent-text-hover flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-text block truncate text-sm font-semibold">
            {name}
          </span>
          <span className="text-text-3 mt-0.5 block text-xs">
            Plano gratuito
          </span>
        </span>
        <ChevronsUpDown
          className="text-text-3 shrink-0"
          size={18}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

const itemClassName =
  'focus-ring text-text-2 hover:bg-surface-2 hover:text-text flex min-h-10 w-full items-center gap-2.5 rounded-[10px] px-2.5 text-left text-[13px] font-medium transition-colors';

function MenuLink({
  ref,
  to,
  onClick,
  children,
}: {
  ref: (element: HTMLAnchorElement | null) => void;
  to: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      ref={ref}
      to={to}
      role="menuitem"
      onClick={onClick}
      className={itemClassName}
    >
      {children}
    </Link>
  );
}

function MenuButton({
  ref,
  onClick,
  children,
}: {
  ref: (element: HTMLButtonElement | null) => void;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      onClick={onClick}
      className={itemClassName}
    >
      {children}
    </button>
  );
}
