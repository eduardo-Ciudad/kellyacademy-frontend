import {
  differenceInHours,
  format,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  competenciaMaisFraca,
  corAlertaStripe,
  focoDaSerie,
  percentualSeguro,
  rotuloFaixa,
} from '@/lib/admin';
import { chartTheme } from '@/lib/chartTheme';
import type {
  AdminUsuarioResumo,
  AdminVisaoGeral,
  PeriodoAdmin,
  RecursoIAAdmin,
} from '@/types/admin';

const cardClass =
  'bg-surface border-border-subtle rounded-[18px] border min-w-0';

const numberFormatter = new Intl.NumberFormat('pt-BR');
const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
});
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});
const compactFormatter = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-text font-display text-[19px] leading-tight font-normal tracking-[-0.015em]">
      {children}
    </h2>
  );
}

export function OverviewSkeleton() {
  return (
    <div aria-label="Carregando visão geral" className="mt-7 space-y-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`${cardClass} p-5`}>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-5 h-10 w-20" />
            <Skeleton className="mt-4 h-3 w-36" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <Skeleton className="h-[390px] rounded-[18px]" />
        <Skeleton className="h-[390px] rounded-[18px]" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-[300px] rounded-[18px]" />
        ))}
      </div>
    </div>
  );
}

export function OverviewError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className={`${cardClass} mt-7 px-6 py-10 text-center`}>
      <SectionTitle>Não foi possível carregar a visão geral</SectionTitle>
      <p className="text-text-2 mt-2 text-sm">
        Verifique sua conexão e tente novamente.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="focus-ring border-control text-text hover:bg-surface-2 rounded-pill mt-5 inline-flex min-h-11 items-center gap-2 border px-5 text-sm font-semibold"
      >
        <RotateCcw size={16} aria-hidden="true" /> Tentar de novo
      </button>
    </section>
  );
}

export function OverviewContent({
  data,
  periodo,
  dimmed,
}: {
  data: AdminVisaoGeral;
  periodo: PeriodoAdmin;
  dimmed: boolean;
}) {
  return (
    <div
      aria-busy={dimmed}
      className={`mt-7 space-y-5 transition-opacity ${dimmed ? 'opacity-50' : 'opacity-100'}`}
    >
      <KpiGrid data={data} periodo={periodo} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <DailyChart data={data.serieDiaria} />
        <AiUsage data={data} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <ScoreDistribution data={data.distribuicaoNotas} />
        <CompetencyAverages data={data.mediaPorCompetencia} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <RecentUsers users={data.ultimosCadastros} />
        <Attention alerts={data.alertas} />
      </div>
    </div>
  );
}

function KpiGrid({ data, periodo }: { data: AdminVisaoGeral; periodo: number }) {
  const proShare = percentualSeguro(data.assinantesPro, data.totalUsuarios);
  const kpis = [
    {
      label: 'Usuários cadastrados',
      value: numberFormatter.format(data.totalUsuarios),
      detail: (
        <>
          <span className="text-success">+{data.novosNoPeriodo}</span> nos
          últimos {periodo} dias
        </>
      ),
      to: '/admin/usuarios',
    },
    {
      label: 'Usuários ativos',
      value: numberFormatter.format(data.ativosNoPeriodo),
      detail: `enviaram redação nos últimos ${periodo} dias`,
    },
    {
      label: 'Redações corrigidas',
      value: numberFormatter.format(data.correcoesNoPeriodo),
      detail: `nota média ${data.notaMediaNoPeriodo === null ? '—' : decimalFormatter.format(data.notaMediaNoPeriodo)}`,
    },
    {
      label: 'Assinantes Pro',
      value: numberFormatter.format(data.assinantesPro),
      detail: `${currencyFormatter.format(data.receitaMensalCentavos / 100)}/mês · ${decimalFormatter.format(proShare)}% dos usuários`,
    },
  ];

  return (
    <section
      aria-label="Indicadores principais"
      className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4"
    >
      {kpis.map((kpi) => {
        const content = (
          <>
            <div className="flex items-start justify-between gap-3">
              <span className="text-text-2 text-sm font-medium">{kpi.label}</span>
              {kpi.to ? (
                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                  className="text-text-3 shrink-0"
                />
              ) : null}
            </div>
            <strong className="text-text mt-5 block font-display text-[38px] leading-none font-light tracking-[-0.035em]">
              {kpi.value}
            </strong>
            <p className="text-text-3 mt-4 min-h-10 text-[13px] leading-5">
              {kpi.detail}
            </p>
          </>
        );
        return kpi.to ? (
          <Link
            key={kpi.label}
            to={kpi.to}
            className={`${cardClass} focus-ring hover:border-border-hover p-5 transition-colors`}
          >
            {content}
          </Link>
        ) : (
          <article key={kpi.label} className={`${cardClass} p-5`}>
            {content}
          </article>
        );
      })}
    </section>
  );
}

type ChartMetric = 'correcoes' | 'cadastros';

function DailyChart({ data }: { data: AdminVisaoGeral['serieDiaria'] }) {
  const [metric, setMetric] = useState<ChartMetric>('correcoes');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const focused = focoDaSerie(data, activeIndex);
  const maxValue = Math.max(1, ...data.map((item) => item[metric]));
  const topTick = Math.max(2, Math.ceil(maxValue));
  const middleTick = Math.ceil(topTick / 2);

  return (
    <section className={`${cardClass} overflow-hidden p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionTitle>Atividade diária</SectionTitle>
          <p className="text-text-2 mt-1.5 min-h-5 font-mono text-xs">
            {focused
              ? `${format(parseISO(focused.data), 'dd/MM')} · ${focused[metric]} ${metric === 'correcoes' ? 'correções' : 'cadastros'}`
              : 'Sem atividade no período'}
          </p>
        </div>
        <div
          className="bg-surface-2 rounded-pill flex p-1"
          role="group"
          aria-label="Métrica do gráfico"
        >
          {(
            [
              ['correcoes', 'Correções'],
              ['cadastros', 'Cadastros'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={metric === value}
              onClick={() => {
                setMetric(value);
                setActiveIndex(null);
              }}
              className={`focus-ring rounded-pill min-h-9 px-3 text-xs font-semibold transition-colors sm:px-4 ${
                metric === value ? 'bg-control text-text' : 'text-text-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 h-[270px] min-w-0" onMouseLeave={() => setActiveIndex(null)}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, bottom: 0, left: -22 }}
            onMouseMove={(state) => {
              if (typeof state?.activeTooltipIndex === 'number') {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
          >
            <CartesianGrid vertical={false} stroke={chartTheme.grid} />
            <XAxis
              dataKey="data"
              axisLine={false}
              tickLine={false}
              interval={0}
              minTickGap={0}
              tickFormatter={(value: string, index: number) =>
                index === 0 || index === data.length - 1
                  ? format(parseISO(value), 'dd/MM')
                  : ''
              }
              tick={{
                fill: chartTheme.text3,
                fontFamily: 'Geist Mono Variable, Geist Mono, monospace',
                fontSize: 11,
              }}
            />
            <YAxis
              domain={[0, topTick]}
              ticks={[0, middleTick, topTick]}
              axisLine={false}
              tickLine={false}
              width={42}
              tick={{
                fill: chartTheme.text3,
                fontFamily: 'Geist Mono Variable, Geist Mono, monospace',
                fontSize: 11,
              }}
            />
            <Bar dataKey={metric} radius={[5, 5, 2, 2]} isAnimationActive={false}>
              {data.map((item, index) => (
                <Cell
                  key={item.data}
                  fill={
                    (activeIndex ?? data.length - 1) === index
                      ? '#a3b6ff'
                      : chartTheme.accent
                  }
                  tabIndex={0}
                  role="button"
                  aria-label={`${format(parseISO(item.data), 'dd/MM')}, ${item[metric]} ${metric}`}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Atividade diária no período</caption>
        <thead>
          <tr>
            <th>Data</th>
            <th>Correções</th>
            <th>Cadastros</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.data}>
              <td>{item.data}</td>
              <td>{item.correcoes}</td>
              <td>{item.cadastros}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const aiLabels: Record<RecursoIAAdmin, string> = {
  CORRECAO: 'Correções',
  TRANSCRICAO: 'Transcrições',
  JULIA: 'Júlia',
};

function AiUsage({ data }: { data: AdminVisaoGeral }) {
  return (
    <section className={`${cardClass} flex flex-col p-5 sm:p-6`}>
      <SectionTitle>Uso de IA hoje</SectionTitle>
      <p className="text-text-3 mt-1.5 text-xs">
        Teto global por recurso · zera à meia-noite
      </p>
      <div className="mt-7 space-y-6">
        {data.usoIaHoje.map((item) => {
          const percentage = Math.min(100, percentualSeguro(item.usados, item.teto));
          const warning = percentage > 80;
          return (
            <div key={item.recurso}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-text font-semibold">
                  {aiLabels[item.recurso]}
                </span>
                <span className="text-text-2 font-mono text-xs">
                  {numberFormatter.format(item.usados)} /{' '}
                  {numberFormatter.format(item.teto)}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`Uso de ${aiLabels[item.recurso]}`}
                aria-valuenow={item.usados}
                aria-valuemax={item.teto}
                className="bg-control mt-2.5 h-1.5 overflow-hidden rounded-full"
              >
                <div
                  className={`h-full rounded-full ${warning ? 'bg-warning' : 'bg-accent'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <dl className="border-border-subtle mt-auto grid grid-cols-2 gap-4 border-t pt-5 sm:gap-6">
        <div>
          <dt className="text-text-3 text-xs">Tokens Gemini hoje</dt>
          <dd className="text-text mt-2 font-mono text-sm">
            {compactFormatter.format(data.tokensHoje)}
          </dd>
        </div>
        <div>
          <dt className="text-text-3 text-xs">Usuários que bateram a cota</dt>
          <dd className="text-text mt-2 font-mono text-sm">
            {numberFormatter.format(data.usuariosNoLimiteHoje)}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function ScoreDistribution({
  data,
}: {
  data: AdminVisaoGeral['distribuicaoNotas'];
}) {
  const max = Math.max(1, ...data.map((item) => item.quantidade));
  return (
    <section className={`${cardClass} p-5 sm:p-6`}>
      <SectionTitle>Distribuição das notas</SectionTitle>
      <div className="mt-6 space-y-4">
        {data.map((item) => (
          <div
            key={`${item.min}-${item.max}`}
            className="grid grid-cols-[60px_minmax(0,1fr)_36px] items-center gap-3"
          >
            <span className="text-text-2 font-mono text-xs">
              {rotuloFaixa(item)}
            </span>
            <div className="bg-control h-2 overflow-hidden rounded-full">
              <div
                className="bg-accent h-full rounded-full"
                style={{ width: `${(item.quantidade / max) * 100}%` }}
              />
            </div>
            <span className="text-text text-right font-mono text-xs">
              {item.quantidade}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CompetencyAverages({
  data,
}: {
  data: AdminVisaoGeral['mediaPorCompetencia'];
}) {
  const weakest = competenciaMaisFraca(data);
  return (
    <section className={`${cardClass} p-5 sm:p-6`}>
      <SectionTitle>Média por competência</SectionTitle>
      <p className="text-text-3 mt-1.5 text-xs">de 0 a 200</p>
      <div className="mt-5 space-y-3.5">
        {data.map((item) => {
          const highlighted = item.competencia === weakest?.competencia;
          return (
            <div
              key={item.competencia}
              className="grid grid-cols-[30px_minmax(0,1fr)_34px] items-center gap-3"
            >
              <span
                className={`font-mono text-xs ${highlighted ? 'text-warning' : 'text-text-2'}`}
              >
                C{item.competencia}
              </span>
              <div className="bg-control h-2 overflow-hidden rounded-full">
                {item.media !== null ? (
                  <div
                    className={`h-full rounded-full ${highlighted ? 'bg-warning' : 'bg-accent'}`}
                    style={{ width: `${Math.min(100, (item.media / 200) * 100)}%` }}
                  />
                ) : null}
              </div>
              <span className="text-text text-right font-mono text-xs">
                {item.media === null ? '—' : decimalFormatter.format(item.media)}
              </span>
            </div>
          );
        })}
      </div>
      {weakest ? (
        <p className="text-warning mt-5 text-sm">
          C{weakest.competencia} é a mais baixa.
        </p>
      ) : null}
    </section>
  );
}

function shortRelativeDate(value: string) {
  const date = parseISO(value);
  if (isToday(date)) return 'hoje';
  if (isYesterday(date)) return 'ontem';
  return format(date, 'dd/MM');
}

function RecentUsers({ users }: { users: AdminUsuarioResumo[] }) {
  return (
    <section className={`${cardClass} overflow-hidden`}>
      <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-3 sm:px-6 sm:pt-6">
        <SectionTitle>Últimos cadastros</SectionTitle>
        <Link
          to="/admin/usuarios"
          className="focus-ring text-accent-text hover:text-accent-text-hover rounded-md text-sm font-semibold"
        >
          Ver todos
        </Link>
      </div>
      <div className="px-2 pb-2 sm:px-3 sm:pb-3">
        {users.map((user) => (
          <Link
            key={user.id}
            to={`/admin/usuarios/${encodeURIComponent(user.id)}`}
            className="focus-ring hover:bg-surface-2 rounded-inner grid min-h-[68px] grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 transition-colors"
          >
            <span className="bg-nav-active text-accent-text flex size-10 items-center justify-center rounded-full font-display text-sm font-medium">
              {user.nome.trim().charAt(0).toUpperCase() || '?'}
            </span>
            <span className="min-w-0">
              <span className="text-text block truncate text-sm font-semibold">
                {user.nome}
              </span>
              <span className="text-text-3 mt-0.5 block truncate text-xs">
                {user.email}
              </span>
            </span>
            <span className="flex flex-col items-end gap-1.5">
              <span
                className={`rounded-pill px-2 py-0.5 text-[10px] font-semibold ${
                  user.emailVerificado
                    ? 'bg-success-subtle text-success'
                    : 'bg-warning-subtle text-warning'
                }`}
              >
                {user.emailVerificado ? 'Verificado' : 'Pendente'}
              </span>
              <span className="text-text-3 font-mono text-[10px]">
                {shortRelativeDate(user.criadoEm)}
              </span>
            </span>
          </Link>
        ))}
        {!users.length ? (
          <p className="text-text-3 px-3 py-8 text-center text-sm">
            Nenhum cadastro no período.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function stripeDescription(value: string | null) {
  if (!value) return 'Nenhum evento recebido recentemente';
  const hours = Math.max(0, differenceInHours(new Date(), parseISO(value)));
  if (hours < 1) return 'Último evento recebido há menos de 1 h';
  if (hours < 24) return `Último evento recebido há ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Último evento recebido há ${days} ${days === 1 ? 'dia' : 'dias'}`;
}

function Attention({ alerts }: { alerts: AdminVisaoGeral['alertas'] }) {
  const counterItems = [
    alerts.correcoesComErro24h > 0
      ? {
          title: 'Correções com erro',
          description: `${alerts.correcoesComErro24h} nas últimas 24 h`,
        }
      : null,
    alerts.contasSemVerificacao48h > 0
      ? {
          title: 'E-mails pendentes',
          description: `${alerts.contasSemVerificacao48h} contas há mais de 48 h`,
        }
      : null,
  ].filter((item): item is { title: string; description: string } => !!item);
  const stripeTone = corAlertaStripe(alerts.ultimoEventoStripeEm);

  return (
    <section className={`${cardClass} p-5 sm:p-6`}>
      <SectionTitle>Precisa de atenção</SectionTitle>
      <div className="mt-5 space-y-1">
        {counterItems.length ? (
          counterItems.map((item) => (
            <AttentionRow key={item.title} tone="warning" {...item} />
          ))
        ) : (
          <div className="flex min-h-14 items-center gap-3 px-1">
            <span className="bg-success size-2.5 shrink-0 rounded-full" />
            <p className="text-text-2 text-sm">Nada pendente por aqui.</p>
          </div>
        )}
        <AttentionRow
          tone={stripeTone}
          title="Webhook do Stripe"
          description={stripeDescription(alerts.ultimoEventoStripeEm)}
        />
      </div>
    </section>
  );
}

function AttentionRow({
  tone,
  title,
  description,
}: {
  tone: 'success' | 'warning';
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[62px] items-start gap-3 rounded-xl px-1 py-2.5">
      <span
        className={`mt-1.5 size-2.5 shrink-0 rounded-full ${tone === 'success' ? 'bg-success' : 'bg-warning'}`}
      />
      <span className="min-w-0">
        <strong className="text-text block text-sm font-semibold">{title}</strong>
        <span className="text-text-3 mt-1 block text-xs">{description}</span>
      </span>
    </div>
  );
}
