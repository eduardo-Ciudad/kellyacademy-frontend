import * as Dialog from '@radix-ui/react-dialog';
import { Check, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

function formatRemaining(seconds: number) {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${minutes} min`;
  return rest ? `${hours}h${rest}min` : `${hours}h`;
}

export function LimiteDiarioDialog({
  open,
  onOpenChange,
  limite,
  retryAfter,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limite: number;
  retryAfter: number;
}) {
  const navigate = useNavigate();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/65" />
        <Dialog.Content className="bg-surface fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col items-center gap-5 overflow-y-auto overscroll-contain rounded-t-[28px] px-6 pt-3 pb-[calc(32px+env(safe-area-inset-bottom))] outline-none sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[calc(100dvh-48px)] sm:w-[480px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:p-8">
          <span className="bg-control rounded-pill h-1.5 w-10 sm:hidden" />
          <span className="bg-accent-tint text-accent-text-hover rounded-card mt-2 flex size-16 items-center justify-center">
            <Timer size={30} />
          </span>
          <div className="text-center">
            <Dialog.Title className="text-text text-[22px] font-bold tracking-[-0.015em]">
              Você usou suas {limite} correções de hoje
            </Dialog.Title>
            <Dialog.Description className="text-text-2 mt-2 text-[15px] leading-[1.55]">
              Novas correções liberam em{' '}
              <strong className="text-text">
                {formatRemaining(retryAfter)}
              </strong>
              , à meia-noite.
            </Dialog.Description>
          </div>
          <div className="bg-surface-2 text-text-body flex w-full gap-3 rounded-[16px] px-4 py-3.5 text-sm leading-[1.5]">
            <Check className="text-success mt-0.5 shrink-0" size={18} />
            Seu rascunho continua salvo. Você pode seguir escrevendo e enviar
            amanhã.
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <Button
              className="h-[52px] w-full text-base"
              onClick={() => onOpenChange(false)}
            >
              Continuar escrevendo
            </Button>
            <Button
              variant="secondary"
              className="h-[52px] w-full text-base"
              onClick={() => void navigate('/')}
            >
              Revisar correções anteriores
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
