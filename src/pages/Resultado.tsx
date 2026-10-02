import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  ArrowUpRight,
  Ban,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SparkIcon } from '@/components/ui/SparkIcon';
import { Skeleton } from '@/components/ui/Skeleton';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { useRedacao } from '@/hooks/useRedacao';
import { ApiError } from '@/lib/api';
import { competencias } from '@/lib/competencias';
import { rotuloTema } from '@/lib/temas';
import { cn } from '@/lib/utils';
import type { Avaliacao, Competencia, RedacaoResponse } from '@/types/api';

const competenceStyles = {
  1: { text: 'text-c1', bg: 'bg-c1-bg', bar: 'bg-c1' },
  2: { text: 'text-c2', bg: 'bg-c2-bg', bar: 'bg-c2' },
  3: { text: 'text-c3', bg: 'bg-c3-bg', bar: 'bg-c3' },
  4: { text: 'text-c4', bg: 'bg-c4-bg', bar: 'bg-c4' },
  5: { text: 'text-c5', bg: 'bg-c5-bg', bar: 'bg-c5' },
} as const;

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function formattedDate(value: string) {
  return format(new Date(value), 'dd MMM, HH:mm', { locale: ptBR }).replace(
    '.',
    '',
  );
}

function themeLabel(redacao: RedacaoResponse) {
  if (!redacao.tema) return null;
  return rotuloTema(redacao.tema);
}

export function Resultado() {
  const { id = '' } = useParams();
  const query = useRedacao(id);

  if (query.isLoading) return <ResultadoSkeleton />;

  if (query.isError) {
    const notFound =
      query.error instanceof ApiError && query.error.status === 404;
    return (
      <CenteredState
        title={
          notFound
            ? 'Redação não encontrada'
            : 'Não foi possível carregar a redação'
        }
        description={
          notFound
            ? 'Ela pode ter sido removida ou não estar disponível para esta conta.'
            : 'Verifique sua conexão e tente novamente.'
        }
      >
        {notFound ? (
          <Link
            className="text-accent-text hover:text-accent-text-hover font-semibold"
            to="/"
          >
            Suas redações
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => void query.refetch()}
            className="focus-ring bg-control hover:bg-surface-2 rounded-pill inline-flex min-h-11 items-center gap-2 px-5 text-sm font-semibold"
          >
            <RotateCcw size={16} aria-hidden="true" /> Tentar novamente
          </button>
        )}
      </CenteredState>
    );
  }

  if (!query.data) return null;
  const redacao = query.data;

  if (redacao.status === 'ENVIADA' || redacao.status === 'EM_AVALIACAO') {
    return (
      <CenteredState
        title="Esta redação ainda está sendo corrigida"
        description="A página será atualizada automaticamente assim que a avaliação terminar."
      >
        <span className="bg-accent-tint text-accent-text-hover rounded-pill inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
          <span className="bg-accent size-2 animate-pulse rounded-full" />{' '}
          Corrigindo
        </span>
      </CenteredState>
    );
  }

  if (redacao.status === 'ERRO') {
    return (
      <CenteredState
        title="A correção falhou. Esta tentativa não foi descontada do seu limite."
        description="Se você escreveu neste navegador, o rascunho continua salvo."
      >
        {redacao.tema ? (
          <Link
            to={`/temas/${redacao.tema.id}/escrever`}
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill inline-flex min-h-11 items-center px-6 text-sm font-semibold text-white"
          >
            Tentar de novo
          </Link>
        ) : (
          <Link className="text-accent-text font-semibold" to="/temas">
            Escolher outro tema
          </Link>
        )}
      </CenteredState>
    );
  }

  if (!redacao.avaliacao) {
    return (
      <CenteredState
        title="Avaliação indisponível"
        description="Não encontramos os dados desta correção."
      />
    );
  }

  return redacao.avaliacao.anulada ? (
    <Anulada redacao={redacao} avaliacao={redacao.avaliacao} />
  ) : (
    <ResultadoAvaliado redacao={redacao} avaliacao={redacao.avaliacao} />
  );
}

function PageTop({
  redacao,
  singleAction = false,
}: {
  redacao: RedacaoResponse;
  singleAction?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <Link
        to="/"
        aria-label="Voltar para suas redações"
        className="focus-ring bg-surface text-text-2 hover:text-text flex size-11 items-center justify-center rounded-full text-sm font-medium lg:h-auto lg:w-auto lg:gap-1.5 lg:bg-transparent"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        <span className="hidden lg:inline">Suas redações</span>
      </Link>
      {redacao.tema && (
        <div className="hidden gap-2 lg:flex">
          {!singleAction && (
            <Link
              to="/temas"
              className="focus-ring border-control hover:bg-surface rounded-pill flex min-h-10 items-center border px-4 text-sm font-semibold"
            >
              Escolher outro tema
            </Link>
          )}
          <RewriteLink temaId={redacao.tema.id} />
        </div>
      )}
    </div>
  );
}

function RewriteLink({
  temaId,
  className,
}: {
  temaId: string;
  className?: string;
}) {
  return (
    <Link
      to={`/temas/${temaId}/escrever`}
      className={cn(
        'focus-ring bg-accent hover:bg-accent-hover rounded-pill flex min-h-10 items-center justify-center px-[18px] text-sm font-semibold text-white transition-colors',
        className,
      )}
    >
      Reescrever com este tema
    </Link>
  );
}

function HeaderMeta({
  redacao,
  mobile = false,
}: {
  redacao: RedacaoResponse;
  mobile?: boolean;
}) {
  const label = themeLabel(redacao);
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        mobile && 'text-[13px]',
      )}
    >
      {!mobile && (
        <span className="bg-accent-tint text-accent-text-hover rounded-pill flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold">
          <SparkIcon size={13} double={false} /> Corrigida por IA
        </span>
      )}
      {label && (
        <span
          className={cn(
            !mobile &&
              'bg-control rounded-pill text-text-2 px-2.5 py-1 text-xs font-semibold',
          )}
        >
          {label}
        </span>
      )}
      <span
        className={cn(
          !mobile &&
            'bg-control rounded-pill text-text-2 px-2.5 py-1 text-xs font-semibold',
        )}
      >
        {redacao.tipo === 'PRATICA' ? 'Prática' : 'Diagnóstica'}
      </span>
      <span className="text-text-3">
        {formattedDate(redacao.avaliacao?.avaliadoEm ?? redacao.enviadaEm)}
      </span>
    </div>
  );
}

function ResultadoAvaliado({
  redacao,
  avaliacao,
}: {
  redacao: RedacaoResponse;
  avaliacao: Avaliacao;
}) {
  const ordered = [...avaliacao.competencias].sort(
    (a, b) => a.numero - b.numero,
  );
  const priority =
    ordered.length && ordered.some((item) => item.nota < 200)
      ? ordered.reduce((lowest, item) =>
          item.nota < lowest.nota ? item : lowest,
        ).numero
      : null;
  const title = redacao.tema?.titulo ?? 'Tema indisponível';

  return (
    <article className="flex flex-col gap-4 px-4 pt-4 pb-8 lg:gap-5 lg:p-0">
      <PageTop redacao={redacao} />
      <div className="flex items-center justify-end lg:hidden">
        <span className="bg-accent-tint text-accent-text-hover rounded-pill flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold">
          <SparkIcon size={13} double={false} /> Corrigida por IA
        </span>
      </div>
      <div className="px-1 lg:hidden">
        <HeaderMeta redacao={redacao} mobile />
        <h1 className="text-text mt-1.5 text-2xl leading-tight font-bold tracking-[-0.015em]">
          {title}
        </h1>
      </div>

      <section className="bg-surface rounded-card flex flex-col items-center gap-5 p-[22px] lg:flex-row lg:gap-9 lg:px-8 lg:py-7">
        <ScoreRing
          valor={avaliacao.notaTotal}
          tamanho={148}
          espessura={10}
          mostrarMaximo
          rotulo={`Nota ${avaliacao.notaTotal} de 1000`}
        />
        <div className="w-full min-w-0 flex-1">
          <div className="hidden lg:block">
            <HeaderMeta redacao={redacao} />
            <h1 className="text-text mt-3 text-[28px] leading-tight font-bold tracking-[-0.015em]">
              {title}
            </h1>
          </div>
          <CompetenceStrip items={ordered} priority={priority} />
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="flex flex-col gap-5">
          <section className="bg-surface rounded-card flex gap-3.5 p-5 lg:px-6 lg:py-[22px]">
            <span className="bg-accent-tint text-accent-text-hover hidden size-10 shrink-0 items-center justify-center rounded-xl lg:flex">
              <SparkIcon size={20} />
            </span>
            <div>
              <h2 className="text-text flex items-center gap-2 text-base font-bold">
                <SparkIcon
                  className="text-accent-text-hover lg:hidden"
                  size={18}
                />{' '}
                Diagnóstico da IA
              </h2>
              <p className="text-text-body mt-2 text-[15px] leading-[1.65] whitespace-pre-wrap lg:text-base">
                {avaliacao.diagnostico}
              </p>
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-baseline justify-between px-1 lg:px-[18px]">
              <h2 className="text-text text-lg font-bold">
                Análise por competência
              </h2>
              <span className="text-text-3 hidden text-[13px] lg:block">
                Cada uma vale até 200
              </span>
            </div>
            <div className="bg-surface rounded-card flex flex-col p-1.5 lg:p-2">
              {ordered.map((item) => (
                <CompetenceCard
                  key={item.numero}
                  item={item}
                  priority={item.numero === priority}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          {avaliacao.pontosFortes.length > 0 && (
            <PointList
              title="Pontos fortes"
              items={avaliacao.pontosFortes}
              kind="strong"
            />
          )}
          {avaliacao.pontosDesenvolvimento.length > 0 && (
            <PointList
              title="Para desenvolver"
              items={avaliacao.pontosDesenvolvimento}
              kind="develop"
            />
          )}
          <EssayText
            text={redacao.texto}
            title="Seu texto"
            buttonLabel="Ver completo"
          />
        </aside>
      </div>

      {redacao.tema && (
        <div className="mt-1 flex flex-col gap-2.5 lg:hidden">
          <RewriteLink
            temaId={redacao.tema.id}
            className="min-h-[52px] text-base"
          />
          <Link
            to="/temas"
            className="focus-ring bg-control rounded-pill flex min-h-[52px] items-center justify-center text-base font-semibold"
          >
            Escolher outro tema
          </Link>
        </div>
      )}
    </article>
  );
}

function CompetenceStrip({
  items,
  priority,
}: {
  items: Competencia[];
  priority: number | null;
}) {
  return (
    <div className="mt-0 grid w-full grid-cols-5 gap-1.5 lg:mt-4 lg:gap-2.5">
      {items.map((item) => {
        const style = competenceStyles[item.numero];
        return (
          <div
            key={item.numero}
            className={cn(
              'bg-surface-2 rounded-xl px-1 py-2.5 lg:px-3 lg:py-2',
              item.numero === priority && 'ring-warning ring-[1.5px]',
            )}
          >
            <div className="flex flex-col items-center gap-0.5 lg:flex-row lg:justify-between">
              <span className={cn('text-xs font-bold', style.text)}>
                C{item.numero}
              </span>
              <span className="tabular text-[15px] font-bold lg:text-xs">
                {item.nota}
              </span>
            </div>
            <div className="bg-control mt-1.5 hidden h-1 overflow-hidden rounded-sm lg:block">
              <div
                className={cn('h-full rounded-sm', style.bar)}
                style={{ width: `${item.nota / 2}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CompetenceCard({
  item,
  priority,
}: {
  item: Competencia;
  priority: boolean;
}) {
  const metadata = competencias[item.numero - 1];
  const style = competenceStyles[item.numero];
  return (
    <article
      className={cn(
        'rounded-inner flex flex-col gap-2 px-3.5 py-4 lg:px-[18px]',
        priority && 'bg-surface-2',
      )}
    >
      <div className="flex items-center gap-2.5 lg:gap-3">
        <span
          className={cn(
            'flex size-[30px] shrink-0 items-center justify-center rounded-[9px] text-xs font-bold lg:size-8 lg:rounded-[10px] lg:text-[13px]',
            style.bg,
            style.text,
          )}
        >
          C{item.numero}
        </span>
        <span className="min-w-0 flex-1 text-[15px] font-semibold">
          {metadata.nomeCurto}
        </span>
        {priority && (
          <span className="bg-warning-bg text-warning rounded-pill hidden px-2 py-0.5 text-[11px] font-bold sm:inline">
            Prioridade
          </span>
        )}
        <span className="tabular text-[15px] font-bold lg:text-base">
          {item.nota}
          <span className="text-text-3 text-xs font-medium lg:text-[13px]">
            /200
          </span>
        </span>
      </div>
      {priority && (
        <span className="bg-warning-bg text-warning rounded-pill self-start px-2 py-0.5 text-[11px] font-bold sm:hidden">
          Prioridade
        </span>
      )}
      <p className="text-text-2 text-sm leading-[1.6] lg:ml-11 lg:text-[15px]">
        {item.resumo}
      </p>
      {item.problemas.length > 0 && (
        <ul className="flex list-none flex-col gap-1.5 p-0 lg:ml-11">
          {item.problemas.map((problem, index) => (
            <li
              key={index}
              className="bg-control/70 text-text-body rounded-[10px] px-3 py-2 text-sm leading-5"
            >
              {problem}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function PointList({
  title,
  items,
  kind,
}: {
  title: string;
  items: string[];
  kind: 'strong' | 'develop';
}) {
  return (
    <section className="bg-surface rounded-card p-5 lg:px-6 lg:py-[22px]">
      <h2 className="flex items-center gap-2 text-base font-bold">
        <span
          className={cn(
            'flex size-6 items-center justify-center rounded-full',
            kind === 'strong'
              ? 'bg-success-bg text-success'
              : 'bg-accent-tint text-accent-text-hover',
          )}
        >
          {kind === 'strong' ? (
            <Check size={14} strokeWidth={2.7} />
          ) : (
            <ArrowUpRight size={14} strokeWidth={2.7} />
          )}
        </span>
        {title}
      </h2>
      <ul className="text-text-body mt-3 list-disc space-y-1 pl-[18px] text-sm leading-[1.6] lg:text-[15px]">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function EssayText({
  text,
  title,
  buttonLabel,
}: {
  text: string;
  title: string;
  buttonLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="bg-surface rounded-card overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="focus-ring flex min-h-[60px] w-full items-center justify-between px-5 text-left text-[15px] font-semibold lg:px-6"
      >
        {title}
        <span className="bg-control rounded-pill flex items-center gap-1.5 px-3 py-2 text-[13px]">
          {expanded ? 'Recolher' : buttonLabel}{' '}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      {expanded && (
        <div className="border-control border-t px-5 py-5 lg:px-6">
          <p className="text-text-body text-[15px] leading-[1.75] whitespace-pre-wrap">
            {text}
          </p>
          <p className="text-text-3 tabular mt-4 text-xs">
            {countWords(text)} palavras · {text.length} caracteres
          </p>
        </div>
      )}
    </section>
  );
}

function Anulada({
  redacao,
  avaliacao,
}: {
  redacao: RedacaoResponse;
  avaliacao: Avaliacao;
}) {
  const title = redacao.tema?.titulo ?? 'Tema indisponível';
  return (
    <article className="flex flex-col gap-5 px-4 pt-4 pb-8 lg:p-0">
      <PageTop redacao={redacao} singleAction />
      <div>
        <HeaderMeta redacao={redacao} />
        <h1 className="text-text mt-2.5 text-2xl leading-tight font-bold tracking-[-0.015em] lg:text-[28px]">
          {title}
        </h1>
      </div>
      <section className="bg-danger-banner rounded-card flex gap-4 p-5 lg:px-7 lg:py-6">
        <span className="bg-danger-bg text-danger flex size-12 shrink-0 items-center justify-center rounded-[14px]">
          <Ban size={24} />
        </span>
        <div>
          <span className="text-danger text-[13px] font-bold">
            Redação anulada · nota 0
          </span>
          <h2 className="mt-1.5 text-[22px] font-bold">
            {avaliacao.motivoAnulacao ?? 'Redação anulada'}
          </h2>
          <p className="text-danger-text mt-2 text-base leading-[1.6] whitespace-pre-wrap">
            {avaliacao.diagnostico}
          </p>
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="O que isso significa">
          No ENEM, alguns problemas zeram a redação inteira, mesmo que o texto
          seja bem escrito. Por isso as competências não recebem nota nesta
          correção.
        </InfoCard>
        {avaliacao.pontosDesenvolvimento.length > 0 && (
          <InfoCard title="Antes de reescrever">
            <ul className="list-disc space-y-1 pl-[18px]">
              {avaliacao.pontosDesenvolvimento.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </InfoCard>
        )}
      </div>
      <EssayText
        text={redacao.texto}
        title="Seu texto enviado"
        buttonLabel="Mostrar texto"
      />
      {redacao.tema && (
        <RewriteLink
          temaId={redacao.tema.id}
          className="min-h-[52px] text-base lg:hidden"
        />
      )}
    </article>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-surface rounded-card p-5 lg:px-6 lg:py-[22px]">
      <h2 className="text-base font-bold">{title}</h2>
      <div className="text-text-body mt-3 text-[15px] leading-[1.65]">
        {children}
      </div>
    </section>
  );
}

function CenteredState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5 text-center">
      <div className="bg-surface rounded-card max-w-xl px-7 py-10">
        <h1 className="text-text text-2xl font-bold tracking-[-0.02em]">
          {title}
        </h1>
        <p className="text-text-2 mx-auto mt-2 max-w-md text-[15px] leading-6">
          {description}
        </p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}

function ResultadoSkeleton() {
  return (
    <div
      className="flex flex-col gap-5 px-4 pt-4 lg:p-0"
      role="status"
      aria-label="Carregando resultado"
    >
      <div className="flex justify-between">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-72" />
      </div>
      <Skeleton className="h-[270px] lg:h-[204px]" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="space-y-5">
          <Skeleton className="h-40" />
          <Skeleton className="h-[520px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-16" />
        </div>
      </div>
      <span className="sr-only">Carregando resultado…</span>
    </div>
  );
}
