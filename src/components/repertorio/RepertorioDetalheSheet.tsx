import * as Dialog from '@radix-ui/react-dialog';
import { RotateCcw, X } from 'lucide-react';
import type { RefObject, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { RepertorioDetalhe } from '@/components/repertorio/RepertorioDetalhe';
import { ConvitePro } from '@/components/planos/ConvitePro';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRepertorio } from '@/hooks/useRepertorios';
import { ApiError, recursoProDoErro } from '@/lib/api';
import {
  caminhoListaRepertorio,
  detalheRepertorioAberto,
} from '@/lib/repertorioDialog';

export function RepertorioDetalheSheet({
  codigo,
  query,
  openerRef,
}: {
  codigo: string | undefined;
  query: string;
  openerRef: RefObject<HTMLElement | null>;
}) {
  const navigate = useNavigate();
  const detalhe = useRepertorio(codigo);
  const fechar = () => {
    void navigate(caminhoListaRepertorio(query), {
      preventScrollReset: true,
    });
  };
  const notFound =
    detalhe.error instanceof ApiError && detalhe.error.status === 404;
  const bloqueado = recursoProDoErro(detalhe.error) === 'REPERTORIO_COMPLETO';
  const conteudo = detalhe.isLoading ? (
    <DetalheSkeleton />
  ) : bloqueado ? (
    <ConvitePro recurso="REPERTORIO_COMPLETO" variante="sheet" />
  ) : detalhe.isError ? (
    <EstadoErro
      notFound={notFound}
      onBack={fechar}
      onRetry={() => void detalhe.refetch()}
    />
  ) : detalhe.data ? (
    <RepertorioDetalhe repertorio={detalhe.data} />
  ) : null;

  return (
    <Dialog.Root
      open={detalheRepertorioAberto(codigo)}
      onOpenChange={(open) => !open && fechar()}
    >
      <Dialog.Portal>
        <RepertorioDialogFrame
          title={detalhe.data?.nome ?? 'Detalhes do repertório'}
          openerRef={openerRef}
        >
          {conteudo}
        </RepertorioDialogFrame>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function RepertorioDialogFrame({
  title,
  openerRef,
  children,
}: {
  title: string;
  openerRef: RefObject<HTMLElement | null>;
  children?: ReactNode;
}) {
  return (
    <>
      <Dialog.Overlay
        data-testid="repertorio-overlay"
        className="fixed inset-0 z-40 bg-[rgb(5_6_10_/_0.55)]"
      />
      <Dialog.Content
        aria-modal="true"
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          if (!openerRef.current) return;
          event.preventDefault();
          openerRef.current.focus({ preventScroll: true });
        }}
        className="repertorio-panel bg-surface border-control fixed inset-y-0 right-0 z-50 w-full overflow-y-auto overscroll-contain border-l px-8 py-7 outline-none min-[641px]:w-[460px]"
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        <div className="mb-5 flex justify-end">
          <Dialog.Close
            className="focus-ring bg-control text-text-2 hover:text-text flex size-11 shrink-0 items-center justify-center rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X size={19} aria-hidden="true" />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </>
  );
}

function EstadoErro({
  notFound,
  onBack,
  onRetry,
}: {
  notFound: boolean;
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="py-10 text-center">
      <h2 className="text-text text-lg font-normal">
        {notFound
          ? 'Repertório não encontrado.'
          : 'Não foi possível carregar o repertório.'}
      </h2>
      <Button
        className="mt-5"
        variant="secondary"
        onClick={notFound ? onBack : onRetry}
      >
        {notFound ? (
          'Voltar ao repertório'
        ) : (
          <>
            <RotateCcw size={16} aria-hidden="true" /> Tentar novamente
          </>
        )}
      </Button>
    </div>
  );
}

function DetalheSkeleton() {
  return (
    <div role="status" aria-label="Carregando repertório" className="space-y-4">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-8 w-4/5" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-24 w-full" />
      <span className="sr-only">Carregando repertório…</span>
    </div>
  );
}
