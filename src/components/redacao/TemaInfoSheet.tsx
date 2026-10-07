import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { TemaInfo } from '@/components/redacao/TemaInfo';
import type { Tema } from '@/types/api';

export function TemaInfoSheet({
  tema,
  open,
  onOpenChange,
}: {
  tema: Tema;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
        <Dialog.Content className="bg-bg fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-[28px] px-5 pt-3 pb-[calc(28px+env(safe-area-inset-bottom))] outline-none lg:hidden">
          <div className="bg-control rounded-pill mx-auto h-1.5 w-10" />
          <div className="my-4 flex items-center justify-between">
            <Dialog.Title className="text-text text-xl font-bold">
              Proposta do tema
            </Dialog.Title>
            <Dialog.Close
              className="focus-ring bg-surface flex size-11 items-center justify-center rounded-full"
              aria-label="Fechar"
            >
              <X size={19} />
            </Dialog.Close>
          </div>
          <TemaInfo tema={tema} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
