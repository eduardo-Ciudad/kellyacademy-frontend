import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart3, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { EvolucaoSkeleton } from '@/components/evolucao/EvolucaoSkeleton';
import { AccountButton } from '@/components/layout/AccountButton';
import { Button } from '@/components/ui/Button';
import { useEvolucao } from '@/hooks/useEvolucao';
import { chartTheme } from '@/lib/chartTheme';
import { competencias } from '@/lib/competencias';
import {
  rotuloMediaRecente,
  rotuloOrdinal,
  Y_DOMAIN_COMPETENCIA,
  Y_DOMAIN_TOTAL,
  Y_TICKS_COMPETENCIA,
  Y_TICKS_TOTAL,
} from '@/lib/evolucaoChart';
import type { MediaRecente, PontoEvolucao } from '@/types/api';

type ChartMode = 'total' | 'competencias';
export type ChartRow = PontoEvolucao & {
  dateLabel: string;
  orderLabel: string;
  anuladaY: number | null;
  c1: number | null;
  c2: number | null;
  c3: number | null;
  c4: number | null;
  c5: number | null;
};

function useDesktop() {
  const [desktop, setDesktop] = useState(
    () => window.matchMedia('(min-width: 1024px)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return desktop;
}

export function Evolucao() {
  const query = useEvolucao();
  const isDesktop = useDesktop();
  const [mode, setMode] = useState<ChartMode>('total');

  if (query.isLoading) return <EvolucaoSkeleton />;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;

  const evolucao = query.data;
  if (!evolucao || evolucao.serie.length === 0) return <EmptyState />;

  const recentCount = Math.min(3, evolucao.totalCorrigidas);
  const anuladas = evolucao.serie.filter((point) => point.anulada).length;
  const chartData: ChartRow[] = evolucao.serie.map((point, index) => ({
    ...point,
    dateLabel: format(new Date(point.enviadaEm), 'dd MMM', {
      locale: ptBR,
    }).replace('.', ''),
    orderLabel: rotuloOrdinal(index),
    anuladaY: point.anulada ? 0 : null,
    c1: point.notas?.c1 ?? null,
    c2: point.notas?.c2 ?? null,
    c3: point.notas?.c3 ?? null,
    c4: point.notas?.c4 ?? null,
    c5: point.notas?.c5 ?? null,
  }));
  const bestPoint = [...evolucao.serie]
    .reverse()
    .find((point) => point.notaTotal === evolucao.melhorNota);

  return (
    <div className="px-5 pt-5 lg:px-0 lg:pt-0">
      <PageHeader />
      <Metrics
        total={evolucao.totalCorrigidas}
        average={evolucao.mediaRecente?.total ?? null}
        best={evolucao.melhorNota}
        bestDate={bestPoint?.enviadaEm}
        anuladas={anuladas}
        recentCount={recentCount}
      />

      {evolucao.mediaRecente && evolucao.competenciaFoco !== null ? (
        <FocusCard
          media={evolucao.mediaRecente}
          focus={evolucao.competenciaFoco}
          recentCount={recentCount}
        />
      ) : null}

      {!evolucao.mediaRecente ? <OnlyCancelledNotice /> : null}

      <div className="mt-4 grid items-start gap-4 pb-2 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_344px] lg:gap-6">
        <ChartCard
          data={chartData}
          mode={isDesktop ? mode : 'total'}
          setMode={setMode}
          isDesktop={isDesktop}
          average={evolucao.mediaRecente?.total ?? null}
          focus={evolucao.competenciaFoco}
        />
        {evolucao.mediaRecente ? (
          <CompetencyAverages
            media={evolucao.mediaRecente}
            focus={evolucao.competenciaFoco}
            recentCount={recentCount}
          />
        ) : null}
      </div>

      {evolucao.mediaRecente ? (
        <p className="text-text-3 mt-1 mb-2 text-center text-[13px] leading-5 lg:hidden">
          No celular, o gráfico mostra só a nota total. A visão por competência
          fica na média acima.
        </p>
      ) : null}
    </div>
  );
}

function PageHeader() {
  return (
    <header className="flex items-end justify-between">
      <div>
        <h1 className="text-text text-[24px] font-normal tracking-[-0.02em] lg:text-[28px]">
          Sua evolução
        </h1>
        <p className="text-text-2 mt-1.5 text-sm lg:text-[15px]">
          Como suas notas mudaram redação a redação.
        </p>
      </div>
      <Link
        to="/nova-redacao"
        className="focus-ring bg-accent hover:bg-accent-hover rounded-pill hidden min-h-11 items-center gap-2 px-5 text-[15px] font-semibold text-white lg:flex"
      >
        <Plus size={16} strokeWidth={2.4} aria-hidden="true" /> Nova redação
      </Link>
      <AccountButton />
    </header>
  );
}

function Metrics({
  total,
  average,
  best,
  bestDate,
  anuladas,
  recentCount,
}: {
  total: number;
  average: number | null;
  best: number | null;
  bestDate?: string;
  anuladas: number;
  recentCount: number;
}) {
  const correctedHint =
    anuladas === 1
      ? '1 anulada fica fora da conta'
      : anuladas > 1
        ? `${anuladas} anuladas ficam fora da conta`
        : undefined;
  const averageHint =
    average === null
      ? undefined
      : recentCount === 1
        ? 'da sua última redação'
        : `das suas ${recentCount} últimas redações`;
  const bestHint = bestDate
    ? `em ${format(new Date(bestDate), "d 'de' MMMM", { locale: ptBR })}`
    : undefined;

  const cards = [
    {
      desktopLabel: 'Redações corrigidas',
      mobileLabel: 'Corrigidas',
      value: total,
      hint: correctedHint,
    },
    {
      desktopLabel: 'Média recente',
      mobileLabel: 'Média recente',
      value: average ?? '—',
      hint: averageHint,
    },
    {
      desktopLabel: 'Melhor nota',
      mobileLabel: 'Melhor',
      value: best ?? '—',
      hint: bestHint,
    },
  ];

  return (
    <section
      className="mt-5 grid grid-cols-3 gap-2 lg:mt-6 lg:gap-4"
      aria-label="Resumo da evolução"
    >
      {cards.map((card) => (
        <div
          key={card.desktopLabel}
          className="bg-surface rounded-inner flex min-w-0 flex-col gap-0.5 p-3 lg:rounded-[18px] lg:px-[22px] lg:py-5"
        >
          <span className="text-text-2 truncate text-xs lg:text-sm lg:font-medium">
            <span className="lg:hidden">{card.mobileLabel}</span>
            <span className="hidden lg:inline">{card.desktopLabel}</span>
          </span>
          <strong className="text-text tabular text-[22px] leading-tight lg:text-[32px]">
            {card.value}
          </strong>
          {card.hint ? (
            <span className="text-text-3 mt-0.5 hidden text-[13px] lg:block">
              {card.hint}
            </span>
          ) : null}
        </div>
      ))}
    </section>
  );
}

function FocusCard({
  media,
  focus,
  recentCount,
}: {
  media: MediaRecente;
  focus: 1 | 2 | 3 | 4 | 5;
  recentCount: number;
}) {
  const competency = competencias[focus - 1];
  const value = media[`c${focus}`];
  const nextLevel =
    [40, 80, 120, 160, 200].find((level) => level > value) ?? 200;
  const gain = Math.round(nextLevel - value);

  return (
    <section className="bg-accent-tint rounded-card mt-4 flex flex-col gap-3.5 px-[18px] py-4 lg:mt-6 lg:flex-row lg:items-center lg:gap-5 lg:px-6 lg:py-[22px]">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <span
          className="rounded-inner flex size-12 shrink-0 items-center justify-center text-base font-bold"
          style={{ color: competency.hex, background: competency.bgHex }}
        >
          {competency.codigo}
        </span>
        <div className="min-w-0">
          <span className="text-accent-text block text-[13px] font-semibold">
            Seu foco agora
          </span>
              <h2 className="text-text mt-1 text-lg font-normal tracking-[-0.01em] lg:text-xl">
            {competency.nomeCurto}: média {value} de 200
          </h2>
          <p className="text-text-body mt-1 text-sm leading-5 lg:leading-[1.5]">
            {recentCount === 1
              ? 'É a competência com a menor média na sua última redação.'
              : `É a competência com a menor média nas suas ${recentCount} últimas redações.`}{' '}
            Subir para {nextLevel} já soma cerca de {gain} pontos na nota.
          </p>
        </div>
      </div>
      <button
        disabled
        className="rounded-pill border-control text-text flex min-h-11 shrink-0 cursor-not-allowed items-center justify-center gap-2 border px-[18px] text-sm font-semibold opacity-70"
      >
        <Sparkles className="text-accent-text" size={16} aria-hidden="true" />{' '}
        Plano de estudo · em breve
      </button>
    </section>
  );
}

function ChartCard({
  data,
  mode,
  setMode,
  isDesktop,
  average,
  focus,
}: {
  data: ChartRow[];
  mode: ChartMode;
  setMode: (mode: ChartMode) => void;
  isDesktop: boolean;
  average: number | null;
  focus: number | null;
}) {
  const [activePoint, setActivePoint] = useState<ActiveChartPoint | null>(null);

  return (
    <section className="bg-surface lg:rounded-card rounded-[18px] p-4 lg:px-6 lg:py-[22px]">
      <div className="flex items-center justify-between gap-4">
      <h2 className="text-text text-base font-normal lg:text-lg">
          {isDesktop ? 'Notas por redação' : 'Nota total'}
        </h2>
        {isDesktop ? (
          <div
            role="tablist"
            aria-label="Visualização do gráfico"
            className="bg-surface-2 rounded-pill flex gap-1 p-1"
          >
            {(
              [
                ['total', 'Nota total'],
                ['competencias', 'Por competência'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => setMode(value)}
                className={`focus-ring rounded-pill min-h-9 px-3.5 text-[13px] font-semibold ${mode === value ? 'bg-control text-text' : 'text-text-2'}`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-text-3 text-xs">0 a 1000</span>
        )}
      </div>

      <div className="relative mt-3 h-[215px] w-full lg:mt-4 lg:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 24, right: 16, bottom: 0, left: -8 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
          >
            <CartesianGrid vertical={false} stroke={chartTheme.grid} />
            <XAxis
              dataKey="orderLabel"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={<OrderTick data={data} />}
              height={28}
            />
            <YAxis
              domain={mode === 'total' ? Y_DOMAIN_TOTAL : Y_DOMAIN_COMPETENCIA}
              ticks={mode === 'total' ? Y_TICKS_TOTAL : Y_TICKS_COMPETENCIA}
              axisLine={false}
              tickLine={false}
              width={42}
              tick={{
                fill: chartTheme.text3,
                fontFamily: 'Geist Mono Variable, Geist Mono, monospace',
                fontSize: 11,
              }}
            />
            {mode === 'total' ? (
              <>
                {average !== null ? (
                  <ReferenceLine
                    y={average}
                    stroke={chartTheme.average}
                    strokeDasharray="4 4"
                    label={
                      isDesktop
                        ? {
                            value: rotuloMediaRecente(average),
                            fill: chartTheme.average,
                            fontFamily:
                              'Geist Mono Variable, Geist Mono, monospace',
                            fontSize: 11,
                            position: 'insideTopRight',
                            dy: -8,
                          }
                        : undefined
                    }
                  />
                ) : null}
                <Line
                  type="linear"
                  dataKey="notaTotal"
                  connectNulls
                  stroke={chartTheme.accent}
                  strokeWidth={2.5}
                  dot={<AccessibleDot onActivate={setActivePoint} />}
                  activeDot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="linear"
                  dataKey="anuladaY"
                  stroke="transparent"
                  connectNulls={false}
                  dot={<CancelledDot onActivate={setActivePoint} />}
                  activeDot={false}
                  isAnimationActive={false}
                />
              </>
            ) : (
              competencias.map((competency) => {
                const highlighted = competency.numero === focus;
                return (
                  <Line
                    key={competency.numero}
                    type="linear"
                    dataKey={`c${competency.numero}`}
                    connectNulls
                    stroke={competency.hex}
                    strokeWidth={highlighted ? 3 : 2}
                    strokeOpacity={highlighted ? 1 : 0.45}
                    dot={
                      <AccessibleDot
                        color={competency.hex}
                        opacity={highlighted ? 1 : 0.55}
                        competency={competency.codigo}
                        competencyName={competency.nomeCurto}
                        onActivate={setActivePoint}
                      />
                    }
                    activeDot={false}
                    isAnimationActive={false}
                  />
                );
              })
            )}
            {mode === 'competencias' ? (
              <Legend content={<CompetencyLegend focus={focus} />} />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
        {activePoint ? <PointTooltip point={activePoint} /> : null}
      </div>

      {mode === 'total' ? (
        <div className="text-text-3 mt-2 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px]">
          {isDesktop ? (
            <LegendItem
              marker={<span className="bg-accent size-2.5 rounded-full" />}
              label="Nota total"
            />
          ) : null}
          <LegendItem
            marker={
              <span className="border-danger size-2.5 rounded-full border-2" />
            }
            label={isDesktop ? 'Anulada (fora da média)' : 'Anulada'}
          />
          {average !== null ? (
            <LegendItem
              marker={
                <span className="border-text-3 w-3.5 border-t border-dashed" />
              }
              label={isDesktop ? 'Média recente' : `Média recente ${average}`}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function OrderTick({
  x = 0,
  y = 0,
  payload,
  data,
}: {
  x?: number;
  y?: number;
  payload?: { index: number; value: string };
  data: ChartRow[];
}) {
  const cancelled = payload ? data[payload.index]?.anulada : false;
  return (
    <text
      x={x}
      y={y + 16}
      textAnchor="middle"
      fill={cancelled ? chartTheme.danger : chartTheme.text3}
      fontFamily="Geist Mono Variable, Geist Mono, monospace"
      fontSize={11}
    >
      {payload?.value}
    </text>
  );
}

export type ActiveChartPoint = {
  row: ChartRow;
  value: number | null;
  x: number;
  y: number;
  containerWidth: number;
  competency?: string;
  competencyName?: string;
};

type DotProps = {
  cx?: number;
  cy?: number;
  value?: number | null;
  payload?: ChartRow;
};

export function AccessibleDot(props: DotProps & {
  color?: string;
  opacity?: number;
  competency?: string;
  competencyName?: string;
  onActivate: (point: ActiveChartPoint | null) => void;
}) {
  if (
    props.cx === undefined ||
    props.cy === undefined ||
    props.value == null ||
    !props.payload
  )
    return <></>;
  const activate = (element: SVGGElement) =>
    props.onActivate({
      row: props.payload as ChartRow,
      value: props.value ?? null,
      x: props.cx as number,
      y: props.cy as number,
      containerWidth: element.ownerSVGElement?.clientWidth ?? 0,
      competency: props.competency,
      competencyName: props.competencyName,
    });
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${props.payload.orderLabel} redação, nota ${props.value}`}
      onMouseEnter={(event) => activate(event.currentTarget)}
      onMouseLeave={() => props.onActivate(null)}
      onFocus={(event) => activate(event.currentTarget)}
      onBlur={() => props.onActivate(null)}
      className="group outline-none"
    >
      <circle
        cx={props.cx}
        cy={props.cy}
        r={4.5}
        fill={props.color ?? chartTheme.accent}
        opacity={props.opacity}
      />
      <circle
        cx={props.cx}
        cy={props.cy}
        r={7}
        fill={chartTheme.surface}
        stroke={props.color ?? chartTheme.accent}
        strokeWidth={2}
        className="pointer-events-none opacity-0 group-focus:opacity-100"
      />
    </g>
  );
}

function CancelledDot(
  props: DotProps & {
    onActivate: (point: ActiveChartPoint | null) => void;
  },
) {
  if (props.cx === undefined || props.cy === undefined || !props.payload)
    return <></>;
  const activate = (element: SVGGElement) =>
    props.onActivate({
      row: props.payload as ChartRow,
      value: null,
      x: props.cx as number,
      y: props.cy as number,
      containerWidth: element.ownerSVGElement?.clientWidth ?? 0,
    });
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${props.payload.orderLabel} redação, anulada`}
      onMouseEnter={(event) => activate(event.currentTarget)}
      onMouseLeave={() => props.onActivate(null)}
      onFocus={(event) => activate(event.currentTarget)}
      onBlur={() => props.onActivate(null)}
      className="group outline-none"
    >
      <circle
        cx={props.cx}
        cy={props.cy}
        r={4.5}
        fill={chartTheme.surface}
        stroke={chartTheme.danger}
        strokeWidth={2}
      />
      <circle
        cx={props.cx}
        cy={props.cy}
        r={7}
        fill={chartTheme.surface}
        stroke={chartTheme.danger}
        strokeWidth={2}
        className="pointer-events-none opacity-0 group-focus:opacity-100"
      />
    </g>
  );
}

export function PointTooltip({ point }: { point: ActiveChartPoint }) {
  const placeOnLeft = point.x + 248 > point.containerWidth;
  return (
    <div
      role="tooltip"
      className="border-control bg-[#1b1d29] shadow-raised pointer-events-none absolute z-10 w-[232px] rounded-xl border px-3.5 py-3"
      style={{
        top: Math.max(0, point.y - 64),
        ...(placeOnLeft
          ? { right: Math.max(0, point.containerWidth - point.x + 12) }
          : { left: point.x + 12 }),
      }}
    >
      <p className="text-text-3 font-mono text-[11px]">
        {point.row.orderLabel} redação · {point.row.dateLabel}
      </p>
      <p className="text-text mt-1 font-display text-[22px] leading-none font-normal">
        {point.value ?? 'Anulada'}
      </p>
      {point.competency ? (
        <p className="text-text-2 mt-2 text-[13px] font-semibold">
          {point.competency} · {point.competencyName}
        </p>
      ) : null}
      <p className="text-text mt-2 text-[13px] leading-[1.4]">
        {point.row.temaTitulo}
      </p>
    </div>
  );
}

function CompetencyLegend({ focus }: { focus: number | null }) {
  return (
    <div className="text-text-3 mt-2 flex flex-wrap gap-x-[18px] gap-y-2 font-mono text-[11px]">
      {competencias.map((competency) => (
        <span
          key={competency.numero}
          className={`inline-flex items-center gap-1.5 ${competency.numero === focus ? 'text-text' : 'text-text-3'}`}
        >
          <span
            className="size-2.5 rounded-[3px]"
            style={{ background: competency.hex }}
          />
          {competency.codigo} {competency.nomeCurto}
        </span>
      ))}
    </div>
  );
}

function LegendItem({
  marker,
  label,
}: {
  marker: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {marker}
      {label}
    </span>
  );
}

function CompetencyAverages({
  media,
  focus,
  recentCount,
}: {
  media: MediaRecente;
  focus: number | null;
  recentCount: number;
}) {
  return (
    <section className="bg-surface lg:rounded-card rounded-[18px] px-1.5 pt-3.5 pb-1.5 lg:px-2.5 lg:pt-[18px] lg:pb-2.5">
      <div className="px-3 pb-1.5 lg:px-3.5 lg:pb-2">
      <h2 className="text-text text-base font-normal lg:text-lg">
          Média por competência
        </h2>
        <span className="text-text-3 mt-0.5 block text-xs">
          {recentCount === 1
            ? 'Última redação'
            : `Últimas ${recentCount} redações`}
        </span>
      </div>
      {competencias.map((competency) => {
        const value = media[`c${competency.numero}`];
        const highlighted = competency.numero === focus;
        return (
          <div
            key={competency.numero}
            className={`rounded-inner flex flex-col gap-2 px-3.5 py-3 ${highlighted ? 'bg-surface-2' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] text-xs font-bold"
                style={{ color: competency.hex, background: competency.bgHex }}
              >
                {competency.codigo}
              </span>
              <span className="text-text min-w-0 flex-1 text-sm font-semibold">
                {competency.nomeCurto}
              </span>
              {highlighted ? (
                <span className="bg-warning-bg text-warning rounded-pill px-2 py-0.5 text-[11px] font-bold">
                  Foco
                </span>
              ) : null}
              <strong className="text-text tabular text-[15px]">
                {value}
                <span className="text-text-3 text-xs font-medium">/200</span>
              </strong>
            </div>
            <div className="bg-control h-1.5 overflow-hidden rounded-sm">
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${(value / 200) * 100}%`,
                  background: competency.hex,
                }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}

function OnlyCancelledNotice() {
  return (
    <div
      role="status"
      className="bg-warning-bg text-text-body rounded-card mt-4 px-5 py-4 text-sm leading-6 lg:mt-6"
    >
      Suas redações corrigidas até aqui foram anuladas. Envie uma nova redação
      para ver sua média por competência.
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-5 pt-5 lg:px-0 lg:pt-0">
      <PageHeader />
      <section className="bg-surface rounded-card mt-6 flex min-h-[55vh] items-center justify-center px-8 py-12 lg:min-h-[620px]">
        <div className="flex max-w-[440px] flex-col items-center gap-3.5 text-center">
          <span className="bg-accent-tint rounded-inner flex size-14 items-center justify-center">
            <BarChart3 className="text-accent-text" size={28} />
          </span>
      <h2 className="text-text text-[22px] font-normal tracking-[-0.01em]">
            Sua evolução aparece aqui
          </h2>
          <p className="text-text-2 text-[15px] leading-6">
            Depois da primeira redação corrigida, você vê suas notas ao longo do
            tempo e qual competência treinar primeiro.
          </p>
          <Link
            to="/nova-redacao"
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill mt-1.5 inline-flex min-h-11 items-center gap-2 px-[22px] text-[15px] font-semibold text-white"
          >
            <Plus size={16} strokeWidth={2.4} /> Escrever a primeira redação
          </Link>
        </div>
      </section>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="px-5 pt-5 lg:px-0 lg:pt-0">
      <PageHeader />
      <section className="bg-surface rounded-card mt-6 p-8 text-center">
      <h2 className="text-text text-lg font-normal">
          Não foi possível carregar sua evolução
        </h2>
        <p className="text-text-2 mt-2 text-sm">
          Verifique sua conexão e tente novamente.
        </p>
        <Button onClick={onRetry} variant="secondary" className="mt-5">
          <RotateCcw size={16} /> Tentar novamente
        </Button>
      </section>
    </div>
  );
}
