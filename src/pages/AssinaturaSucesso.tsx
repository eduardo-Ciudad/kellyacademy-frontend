import { useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { correcoesHojeQueryKey } from '@/hooks/useCorrecoesHoje';
import { usoHojeQueryKey } from '@/hooks/useUsoHoje';
import { planoQueryKey } from '@/hooks/usePlano';
import { repertoriosQueryKey } from '@/hooks/useRepertorios';
import { usuarioQueryKey } from '@/hooks/useUsuario';
import { usePageMeta } from '@/lib/usePageMeta';

export function AssinaturaSucesso() {
  const queryClient = useQueryClient();

  usePageMeta({
    title: 'Assinatura confirmada — Kelly Academy',
    noindex: true,
  });

  useEffect(() => {
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: usuarioQueryKey, exact: true }),
      queryClient.invalidateQueries({ queryKey: planoQueryKey }),
      queryClient.invalidateQueries({ queryKey: correcoesHojeQueryKey }),
      queryClient.invalidateQueries({
        queryKey: usoHojeQueryKey('TRANSCRICAO'),
      }),
      queryClient.invalidateQueries({ queryKey: repertoriosQueryKey }),
    ]);
  }, [queryClient]);

  return (
    <div className="flex min-h-[calc(100dvh-var(--bottom-nav-h)-48px)] items-center justify-center px-5 py-10 lg:min-h-[calc(100vh-64px)] lg:px-0">
      <section className="bg-surface border-control rounded-card shadow-soft w-full max-w-lg border px-6 py-10 text-center lg:px-10 lg:py-12">
        <span className="bg-success-bg text-success mx-auto flex size-14 items-center justify-center rounded-full">
          <Check size={28} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h1 className="text-text mt-5 text-[28px] leading-tight font-semibold tracking-[-0.025em]">
          Pagamento recebido!
        </h1>
        <p className="text-text-2 mx-auto mt-3 max-w-sm text-[15px] leading-6">
          Sua assinatura Pro está sendo ativada.
        </p>
        <Link
          to="/"
          className="focus-ring bg-accent hover:bg-accent-hover rounded-pill mt-7 inline-flex min-h-11 items-center justify-center px-6 text-sm font-semibold text-white"
        >
          Voltar ao início
        </Link>
      </section>
    </div>
  );
}
