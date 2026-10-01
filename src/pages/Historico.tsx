import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import icon from '@/assets/studymind-icon.svg';
import { CorrecoesHojeCard } from '@/components/redacao/CorrecoesHojeCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRedacoes } from '@/hooks/useRedacoes';
import { useTemas } from '@/hooks/useTemas';
import { useUsuario } from '@/hooks/useUsuario';
import type { ResumoRedacao, Tema } from '@/types/api';

function shortDate(value: string) {
  return format(new Date(value), 'dd MMM', { locale: ptBR }).replace('.', '');
}

function typeLabel(type: ResumoRedacao['tipo']) {
  return type === 'PRATICA' ? 'Prática' : 'Diagnóstica';
}

export function Historico() {
  const redacoesQuery = useRedacoes();
  const temasQuery = useTemas();
  const { iniciais } = useUsuario();
  const redacoes = redacoesQuery.data ?? [];
  const temasById = new Map(
    (temasQuery.data ?? []).map((tema) => [tema.id, tema]),
  );
  const avaliadas = redacoes.filter(
    (redacao) => redacao.status === 'AVALIADA' && redacao.notaTotal !== null,
  );
  const average = avaliadas.length
    ? Math.round(
        avaliadas.reduce(
          (total, redacao) => total + (redacao.notaTotal ?? 0),
          0,
        ) / avaliadas.length,
      )
    : null;
  const best = avaliadas.length
    ? Math.max(...avaliadas.map((redacao) => redacao.notaTotal ?? 0))
    : null;
  const isLoading = redacoesQuery.isLoading || temasQuery.isLoading;
  const hasError = redacoesQuery.isError || temasQuery.isError;

  function refetch() {
    void Promise.all([redacoesQuery.refetch(), temasQuery.refetch()]);
  }

  return (
    <div>
      <header className="flex items-center justify-between px-5 pt-5 pb-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <img src={icon} alt="" className="size-8 rounded-[9px]" />
          <h1 className="text-text text-[22px] font-bold tracking-[-0.02em]">
            Suas redações
          </h1>
        </div>
        <span className="bg-control text-text flex size-9 items-center justify-center rounded-full text-[13px] font-semibold">
          {iniciais}
        </span>
      </header>

      <div className="hidden items-end justify-between lg:flex">
        <div>
          <h1 className="text-text text-[28px] font-bold tracking-[-0.02em]">
            Suas redações
          </h1>
          <p className="text-text-2 mt-1.5 text-[15px]">
            Acompanhe cada correção e volte ao que precisa treinar.
          </p>
        </div>
        <Link
          to="/temas"
          className="focus-ring bg-accent hover:bg-accent-hover rounded-pill flex min-h-11 items-center gap-2 px-5 text-[15px] font-semibold text-white"
        >
          <Plus size={16} strokeWidth={2.4} aria-hidden="true" /> Nova redação
        </Link>
      </div>

      <div className="px-5 pt-1 pb-4 lg:hidden">
        <CorrecoesHojeCard mobile />
      </div>

      {isLoading ? (
        <HistoricoSkeleton />
      ) : hasError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <Metrics corrected={avaliadas.length} average={average} best={best} />
          {redacoes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="lg:rounded-card lg:bg-surface flex flex-col gap-2 px-5 lg:mt-6 lg:p-2">
              <div className="text-text-3 hidden grid-cols-[minmax(0,1fr)_110px_120px_120px_170px] gap-4 px-[18px] py-3 text-[13px] font-semibold lg:grid">
                <span>Tema</span>
                <span>Tipo</span>
                <span>Enviada</span>
                <span>Status</span>
                <span className="text-right">Nota</span>
              </div>
              {redacoes.map((redacao) => (
                <RedacaoItem
                  key={redacao.id}
                  redacao={redacao}
                  tema={temasById.get(redacao.temaId)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Metrics({
  corrected,
  average,
  best,
}: {
  corrected: number;
  average: number | null;
  best: number | null;
}) {
  const metrics = [
    ['Redações corrigidas', 'Corrigidas', corrected.toString()],
    ['Média', 'Média', average?.toString() ?? '—'],
    ['Melhor nota', 'Melhor', best?.toString() ?? '—'],
  ];
  return (
    <div className="grid grid-cols-3 gap-2 px-5 pb-4 lg:mt-6 lg:gap-4 lg:px-0 lg:pb-0">
      {metrics.map(([desktopLabel, mobileLabel, value]) => (
        <div
          key={desktopLabel}
          className="bg-surface rounded-inner flex flex-col gap-0.5 p-3 lg:gap-1.5 lg:rounded-[18px] lg:px-[22px] lg:py-5"
        >
          <span className="text-text-2 text-xs lg:text-sm lg:font-medium">
            <span className="lg:hidden">{mobileLabel}</span>
            <span className="hidden lg:inline">{desktopLabel}</span>
          </span>
          <span className="tabular text-text text-[22px] font-bold lg:text-[32px]">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function RedacaoItem({
  redacao,
  tema,
}: {
  redacao: ResumoRedacao;
  tema?: Tema;
}) {
  const evaluated = redacao.status === 'AVALIADA' && redacao.notaTotal !== null;
  const failed = redacao.status === 'ERRO';
  const year = tema
    ? tema.origem === 'AUTORAL'
      ? 'Autoral'
      : tema.ano !== null
        ? `ENEM ${tema.ano}`
        : 'ENEM'
    : null;
  const content = (
    <>
      <div className="min-w-0 flex-1 lg:flex-initial">
        <span className="text-text block text-[15px] leading-[1.35] font-semibold lg:truncate">
          {redacao.temaTitulo}
        </span>
        <span
          className={
            failed
              ? 'text-danger lg:text-text-3 mt-1 block text-[13px]'
              : 'text-text-3 mt-1 block text-[13px]'
          }
        >
          <span className="lg:hidden">
            {failed
              ? `Falhou · ${shortDate(redacao.enviadaEm)}`
              : [year, typeLabel(redacao.tipo), shortDate(redacao.enviadaEm)]
                  .filter(Boolean)
                  .join(' · ')}
          </span>
          <span className="hidden lg:inline">{year ?? ''}</span>
        </span>
      </div>
      <span className="text-text-body hidden text-sm lg:block">
        {typeLabel(redacao.tipo)}
      </span>
      <span className="text-text-2 hidden text-sm lg:block">
        {shortDate(redacao.enviadaEm)}
      </span>
      <StatusChip status={redacao.status} />
      <div className="flex justify-end">
        {evaluated ? (
          <div className="flex items-center gap-3">
            <div className="bg-control rounded-pill hidden h-1.5 w-20 overflow-hidden lg:block">
              <div
                className="bg-accent rounded-pill h-full"
                style={{ width: `${(redacao.notaTotal! / 1000) * 100}%` }}
              />
            </div>
            <span className="tabular text-text w-10 text-right text-xl font-bold lg:text-base">
              {redacao.notaTotal}
            </span>
          </div>
        ) : failed ? (
          <Link
            to={`/temas/${redacao.temaId}/escrever`}
            onClick={(event) => event.stopPropagation()}
            className="focus-ring bg-control text-text rounded-pill px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap lg:py-2"
          >
            Tentar<span className="hidden lg:inline"> de novo</span>
          </Link>
        ) : null}
      </div>
    </>
  );

  const classes =
    'bg-surface hover:bg-surface-2 flex items-center gap-3.5 rounded-[16px] px-4 py-3.5 transition-colors lg:grid lg:grid-cols-[minmax(0,1fr)_110px_120px_120px_170px] lg:gap-4 lg:rounded-inner lg:px-[18px]';
  return evaluated ? (
    <Link to={`/redacoes/${redacao.id}`} className={classes}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}

function StatusChip({ status }: { status: ResumoRedacao['status'] }) {
  if (status === 'AVALIADA')
    return (
      <span className="bg-success-bg text-success rounded-pill hidden justify-self-start px-2.5 py-1 text-xs font-semibold lg:inline">
        Avaliada
      </span>
    );
  if (status === 'ERRO')
    return (
      <span className="bg-danger-bg text-danger rounded-pill hidden justify-self-start px-2.5 py-1 text-xs font-semibold lg:inline">
        Falhou
      </span>
    );
  return (
    <span className="bg-control text-text-2 rounded-pill justify-self-start px-2.5 py-1 text-xs font-semibold">
      Corrigindo
    </span>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface rounded-card mx-5 mt-2 flex flex-col items-center px-6 py-12 text-center lg:mx-0 lg:mt-6">
      <img src={icon} alt="" className="rounded-inner size-12" />
      <h2 className="text-text mt-5 text-lg font-bold">
        Escreva sua primeira redação
      </h2>
      <p className="text-text-2 mt-2 max-w-md text-sm leading-6">
        A IA corrige seu texto nas 5 competências do ENEM e mostra o que treinar
        primeiro.
      </p>
      <Link
        to="/temas"
        className="focus-ring bg-accent rounded-pill mt-6 px-6 py-3 text-sm font-semibold text-white"
      >
        Escolher tema
      </Link>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-surface rounded-card mx-5 mt-4 p-8 text-center lg:mx-0 lg:mt-6">
      <h2 className="text-text text-lg font-bold">
        Não foi possível carregar suas redações
      </h2>
      <p className="text-text-2 mt-2 text-sm">
        Verifique sua conexão e tente novamente.
      </p>
      <Button onClick={onRetry} variant="secondary" className="mt-5">
        <RotateCcw size={16} /> Tentar novamente
      </Button>
    </div>
  );
}

function HistoricoSkeleton() {
  return (
    <div className="px-5 lg:px-0">
      <div className="grid grid-cols-3 gap-2 lg:mt-6 lg:gap-4">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-20 lg:h-[102px]" />
        ))}
      </div>
      <Skeleton className="mt-4 h-72 lg:mt-6" />
    </div>
  );
}
