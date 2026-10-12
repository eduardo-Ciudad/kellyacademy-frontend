import * as Dialog from '@radix-ui/react-dialog';
import { RotateCcw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RepertorioDetalhe } from '@/components/repertorio/RepertorioDetalhe';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRepertorio } from '@/hooks/useRepertorios';
import { ApiError } from '@/lib/api';

export function RepertorioDetalheSheet({
  codigo,
  query,
}: {
  codigo: string | undefined;
  query: string;
}) {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const detalhe = useRepertorio(codigo);
  const fechar = () => {
    void navigate(`/repertorio${query ? `?${query}` : ''}`);
  };
  const notFound =
    detalhe.error instanceof ApiError && detalhe.error.status === 404;
  const conteudo = detalhe.isLoading ? (
    <DetalheSkeleton />
  ) : detalhe.isError ? (
    <EstadoErro
      notFound={notFound}
      onBack={fechar}
      onRetry={() => void detalhe.refetch()}
    />
  ) : detalhe.data ? (
    <RepertorioDetalhe repertorio={detalhe.data} />
  ) : null;

  if (isDesktop) {
    if (!codigo) return null;
    return (
      <aside className="bg-surface rounded-card sticky top-8 max-h-[calc(100dvh-64px)] w-[420px] shrink-0 overflow-y-auto p-6">
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="focus-ring bg-control text-text-2 flex size-11 items-center justify-center rounded-full"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        {conteudo}
      </aside>
    );
  }

  return (
    <Dialog.Root open={!!codigo} onOpenChange={(open) => !open && fechar()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Dialog.Content className="bg-bg fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-[28px] px-5 pt-3 pb-[calc(28px+env(safe-area-inset-bottom))] outline-none">
          <div className="bg-control rounded-pill mx-auto h-1.5 w-10" />
          <div className="my-4 flex items-center justify-between gap-3">
            <Dialog.Title className="text-text truncate text-lg font-bold">
              {detalhe.data?.nome ?? 'Detalhes do repertório'}
            </Dialog.Title>
            <Dialog.Close
              className="focus-ring bg-surface flex size-11 shrink-0 items-center justify-center rounded-full"
              aria-label="Fechar"
            >
              <X size={19} aria-hidden="true" />
            </Dialog.Close>
          </div>
          {conteudo}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
      <h2 className="text-text text-lg font-bold">
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
