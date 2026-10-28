import * as Dialog from '@radix-ui/react-dialog';
import {
  Crown,
  KeyRound,
  LogOut,
  RotateCcw,
  Route,
  Shield,
} from 'lucide-react';
import { useRef, useState, type PointerEvent } from 'react';
import { SoonItem } from '@/components/layout/SoonItem';
import { CorrecoesHojeCard } from '@/components/redacao/CorrecoesHojeCard';
import { Button } from '@/components/ui/Button';
import { useLogout } from '@/hooks/useLogout';
import { useUsuario } from '@/hooks/useUsuario';
import { Link } from 'react-router-dom';
import { useTour } from '@/features/tour/TourProvider';
import { useIsAdmin } from '@/hooks/useMe';
import { usePlano } from '@/hooks/usePlano';
import { rotuloPlano } from '@/lib/rotuloPlano';

export function AccountSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { nome, iniciais } = useUsuario();
  const logout = useLogout();
  const { openTour } = useTour();
  const { isAdmin } = useIsAdmin();
  const { dados } = usePlano();
  const contentRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((contentRef.current?.scrollTop ?? 0) > 0) return;
    dragStartRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragStartRef.current === null) return;
    setDragOffset(Math.max(0, event.clientY - dragStartRef.current));
  }

  function finishDrag() {
    if (dragStartRef.current === null) return;
    dragStartRef.current = null;
    if (dragOffset > 80) onOpenChange(false);
    setDragOffset(0);
  }

  function handleLogout() {
    onOpenChange(false);
    logout();
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
        <Dialog.Content
          ref={contentRef}
          className="bg-surface fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-[28px] px-5 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))] outline-none lg:hidden"
          style={{
            transform: `translateY(${dragOffset}px)`,
            transition:
              dragStartRef.current === null ? 'transform 180ms' : 'none',
          }}
        >
          <div
            className="touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
          >
            <div className="bg-control rounded-pill mx-auto h-1.5 w-10" />
            <Dialog.Title className="mt-5 flex min-w-0 items-center gap-3 text-left">
              <span className="bg-control text-text flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                {iniciais}
              </span>
              <span className="min-w-0">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-text truncate font-semibold">
                    {nome}
                  </span>
                  {dados?.plano === 'PRO' ? (
                    <span className="bg-accent-tint border-accent-outline text-accent-outline-text shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] leading-none font-semibold">
                      PRO
                    </span>
                  ) : null}
                </span>
                <span className="text-text-3 mt-0.5 block text-xs">
                  {rotuloPlano(dados)}
                </span>
              </span>
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Informações da conta e opção de sair
            </Dialog.Description>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <CorrecoesHojeCard mobile />
            <SoonItem icon={Route} label="Plano de estudo" />
            <Link
              to="/planos"
              onClick={() => onOpenChange(false)}
              className="focus-ring bg-control text-text rounded-pill flex h-12 w-full items-center justify-center gap-2 text-sm font-semibold"
            >
              <Crown size={18} aria-hidden="true" /> Planos
            </Link>
            <Link
              to="/conta/senha"
              onClick={() => onOpenChange(false)}
              className="focus-ring bg-control text-text rounded-pill flex h-12 w-full items-center justify-center gap-2 text-sm font-semibold"
            >
              <KeyRound size={18} aria-hidden="true" /> Alterar senha
            </Link>
            {isAdmin ? (
              <Link
                to="/admin"
                onClick={() => onOpenChange(false)}
                className="focus-ring bg-control text-text rounded-pill flex h-12 w-full items-center justify-center gap-2 text-sm font-semibold"
              >
                <Shield size={18} aria-hidden="true" /> Painel admin
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                window.setTimeout(openTour, 0);
              }}
              className="focus-ring bg-control text-text rounded-pill flex min-h-12 w-full items-center justify-center gap-2 px-4 text-sm font-semibold"
            >
              <RotateCcw size={18} aria-hidden="true" /> Rever tour de
              boas-vindas
            </button>
            <Button
              type="button"
              variant="secondary"
              className="h-12 w-full"
              onClick={handleLogout}
            >
              <LogOut size={18} aria-hidden="true" /> Sair
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
