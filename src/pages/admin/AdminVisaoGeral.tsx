import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  OverviewContent,
  OverviewError,
  OverviewSkeleton,
} from '@/components/admin/AdminOverview';
import { useAdminVisaoGeral } from '@/hooks/useAdmin';
import { periodoAdminFromSearch } from '@/lib/admin';
import type { PeriodoAdmin } from '@/types/admin';

const periods = [7, 30, 90] as const;

function capitalize(value: string) {
  return value.charAt(0).toLocaleUpperCase('pt-BR') + value.slice(1);
}

function Header({
  generatedAt,
  period,
  onPeriodChange,
}: {
  generatedAt?: string;
  period: PeriodoAdmin;
  onPeriodChange: (period: PeriodoAdmin) => void;
}) {
  const date = generatedAt ? parseISO(generatedAt) : null;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : null;

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-text-3 min-h-4 font-mono text-[11px] leading-4">
          {validDate
            ? `${capitalize(format(validDate, "EEEE, dd 'de' MMMM", { locale: ptBR }))} · atualizado às ${format(validDate, 'HH:mm')}`
            : 'Visão consolidada da operação'}
        </p>
        <h1 className="text-text mt-2 font-display text-[34px] leading-tight font-light tracking-[-0.03em]">
          Visão geral
        </h1>
      </div>
      <div
        role="group"
        aria-label="Período da visão geral"
        className="bg-surface border-border-subtle rounded-pill flex w-full self-start border p-1 sm:w-auto sm:self-auto"
      >
        {periods.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={period === value}
            onClick={() => onPeriodChange(value)}
            className={`focus-ring rounded-pill min-h-10 flex-1 px-3.5 text-xs font-semibold transition-colors sm:flex-none ${
              period === value
                ? 'bg-nav-active text-accent-text'
                : 'text-text-2 hover:text-text'
            }`}
          >
            {value} dias
          </button>
        ))}
      </div>
    </header>
  );
}

export function AdminVisaoGeral() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawPeriod = searchParams.get('periodo');
  const period = periodoAdminFromSearch(rawPeriod);
  const query = useAdminVisaoGeral(period);

  useEffect(() => {
    if (rawPeriod === String(period)) return;
    const next = new URLSearchParams(searchParams);
    next.set('periodo', String(period));
    setSearchParams(next, { replace: true });
  }, [period, rawPeriod, searchParams, setSearchParams]);

  function changePeriod(nextPeriod: PeriodoAdmin) {
    const next = new URLSearchParams(searchParams);
    next.set('periodo', String(nextPeriod));
    setSearchParams(next);
  }

  return (
    <div className="min-w-0 pb-8">
      <Header
        generatedAt={query.data?.geradoEm}
        period={period}
        onPeriodChange={changePeriod}
      />
      {query.isPending ? <OverviewSkeleton /> : null}
      {query.isError && !query.data ? (
        <OverviewError onRetry={() => void query.refetch()} />
      ) : null}
      {query.data ? (
        <OverviewContent
          data={query.data}
          periodo={period}
          dimmed={query.isPlaceholderData}
        />
      ) : null}
    </div>
  );
}
