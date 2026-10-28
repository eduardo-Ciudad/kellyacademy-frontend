import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Lock,
  RotateCcw,
  Search,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AccountButton } from '@/components/layout/AccountButton';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { SparkIcon } from '@/components/ui/SparkIcon';
import { useRedacoes } from '@/hooks/useRedacoes';
import { useTemas } from '@/hooks/useTemas';
import { usePlano } from '@/hooks/usePlano';
import type { ResumoRedacao, Tema } from '@/types/api';

type Filter = 'todos' | 'seus' | 'nao-praticados' | 'praticados';

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function Temas() {
  const plano = usePlano();
  const temasQuery = useTemas();
  const redacoesQuery = useRedacoes();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('todos');
  const redacoes = redacoesQuery.data;
  const attemptsByTema = useMemo(() => {
    const map = new Map<string, ResumoRedacao[]>();
    (redacoes ?? [])
      .filter((redacao) => redacao.status === 'AVALIADA')
      .forEach((redacao) =>
        map.set(redacao.temaId, [...(map.get(redacao.temaId) ?? []), redacao]),
      );
    return map;
  }, [redacoes]);
  const temas = useMemo(() => {
    const term = normalize(search.trim());
    return (temasQuery.data ?? []).filter((tema) => {
      const practiced = (attemptsByTema.get(tema.id)?.length ?? 0) > 0;
      const matchesSearch =
        !term ||
        normalize(tema.titulo).includes(term) ||
        tema.ano?.toString().includes(term);
      const matchesFilter =
        filter === 'todos' ||
        (filter === 'seus' && tema.origem === 'PERSONALIZADO') ||
        (filter === 'praticados' && practiced) ||
        (filter === 'nao-praticados' && !practiced);
      return matchesSearch && matchesFilter;
    });
  }, [attemptsByTema, filter, search, temasQuery.data]);
  const isLoading = temasQuery.isLoading || redacoesQuery.isLoading;
  const hasError = temasQuery.isError || redacoesQuery.isError;
  const temasPossiveisAdicionados =
    temasQuery.data?.filter((tema) => tema.origem === 'PREVISAO').length ?? 0;

  function refetch() {
    void Promise.all([temasQuery.refetch(), redacoesQuery.refetch()]);
  }

  return (
    <div>
      <header className="px-5 pt-5 pb-3 lg:p-0">
        <div className="flex items-center gap-3 lg:block">
          <Link
            to="/"
            aria-label="Voltar"
            className="focus-ring bg-surface flex size-11 shrink-0 items-center justify-center rounded-full lg:hidden"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-text text-[22px] font-normal tracking-[-0.02em] lg:text-[28px]">
              Escolha um tema
            </h1>
            <p className="text-text-2 mt-1.5 hidden text-[15px] lg:block">
              Temas oficiais do ENEM e os temas possíveis que você adicionou.
            </p>
          </div>
          <AccountButton className="ml-auto" />
        </div>

        <Link
          to="/temas/possiveis"
          className="focus-ring bg-accent-tint lg:rounded-card mt-3.5 flex min-h-11 items-center gap-3.5 rounded-[18px] px-4 py-3.5 lg:mt-6 lg:gap-[18px] lg:px-6 lg:py-5"
        >
          <span className="bg-accent lg:rounded-inner flex size-10 shrink-0 items-center justify-center rounded-xl text-white lg:size-12">
            <SparkIcon size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold lg:text-lg">
              Possíveis temas do ENEM 2026
              {!plano.isLoading && !plano.libera('TEMAS_POSSIVEIS') && (
                <span className="bg-surface text-accent-text rounded-pill ml-2 inline-flex items-center gap-1 px-2 py-0.5 align-middle text-[11px] font-bold">
                  <Lock size={11} aria-hidden="true" /> Pro
                  <span className="sr-only">Recurso do plano Pro</span>
                </span>
              )}
            </span>
            <span className="text-text-body mt-0.5 block text-[13px] leading-5 lg:text-sm lg:leading-[1.5]">
              <span className="hidden lg:inline">
                Recortes selecionados por força de evidências, com argumentos,
                leis e agentes de intervenção para treinar.
              </span>
              <span className="lg:hidden">
                {temasPossiveisAdicionados > 0
                  ? `${temasPossiveisAdicionados} na sua lista`
                  : 'Treine com recortes possíveis para 2026'}
              </span>
            </span>
          </span>
          {temasPossiveisAdicionados > 0 && (
            <span className="text-text-body tabular hidden shrink-0 text-[13px] font-semibold lg:block">
              {temasPossiveisAdicionados} na sua lista
            </span>
          )}
          <span className="bg-accent rounded-pill hidden min-h-11 shrink-0 items-center gap-2 px-5 text-[15px] font-semibold text-white lg:flex">
            Ver temas possíveis <ArrowRight size={16} aria-hidden="true" />
          </span>
          <ChevronRight
            className="text-possivel shrink-0 lg:hidden"
            size={18}
            aria-hidden="true"
          />
        </Link>

        <div className="mt-3 flex flex-col gap-3 lg:mt-6 lg:flex-row lg:items-center">
          <div className="relative lg:w-[380px]">
            <Search
              className="text-text-3 absolute top-[13px] left-4"
              size={18}
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              aria-label="Buscar tema"
              placeholder="Buscar por palavra ou ano"
              className="focus-ring bg-surface border-control text-text placeholder:text-text-3 rounded-pill focus:border-accent focus:ring-accent-ring h-11 w-full border pr-4 pl-11 text-base outline-none focus:ring-[3px] lg:text-[15px]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            <FilterButton
              active={filter === 'todos'}
              onClick={() => setFilter('todos')}
            >
              Todos
            </FilterButton>
            <FilterButton
              active={filter === 'seus'}
              onClick={() => setFilter('seus')}
            >
              Seus temas
            </FilterButton>
            <FilterButton
              active={filter === 'nao-praticados'}
              onClick={() => setFilter('nao-praticados')}
            >
              Não praticados
            </FilterButton>
            <FilterButton
              active={filter === 'praticados'}
              onClick={() => setFilter('praticados')}
            >
              <span className="lg:hidden">Praticados</span>
              <span className="hidden lg:inline">Já praticados</span>
            </FilterButton>
          </div>
        </div>
      </header>

      {isLoading ? (
        <TemasSkeleton />
      ) : hasError ? (
        <div className="bg-surface rounded-card mx-5 mt-4 p-8 text-center lg:mx-0 lg:mt-6">
          <h2 className="text-text text-lg font-normal">
            Não foi possível carregar os temas
          </h2>
          <Button onClick={refetch} variant="secondary" className="mt-5">
            <RotateCcw size={16} /> Tentar novamente
          </Button>
        </div>
      ) : temas.length === 0 ? (
        <div className="text-text-2 mx-5 mt-8 text-center text-sm lg:mx-0">
          Nenhum tema encontrado.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 px-5 pt-1 pb-5 lg:mt-6 lg:grid lg:grid-cols-4 lg:gap-4 lg:px-0 lg:pt-0">
          {temas.map((tema) => (
            <TemaCard
              key={tema.id}
              tema={tema}
              attempts={attemptsByTema.get(tema.id) ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring rounded-pill min-h-9 shrink-0 border px-3.5 text-sm font-semibold ${active ? 'border-accent bg-nav-active text-white' : 'border-control bg-surface text-text-body'}`}
    >
      {children}
    </button>
  );
}

function TemaCard({
  tema,
  attempts,
}: {
  tema: Tema;
  attempts: ResumoRedacao[];
}) {
  const evaluated = attempts.filter(
    (attempt) => attempt.status === 'AVALIADA' && attempt.notaTotal !== null,
  );
  const best = evaluated.length
    ? Math.max(...evaluated.map((attempt) => attempt.notaTotal ?? 0))
    : null;
  const practiced = attempts.length > 0;
  return (
    <Link
      to={`/temas/${tema.id}/escrever`}
      className="focus-ring bg-surface text-text lg:rounded-card flex items-center gap-4 rounded-[18px] px-[18px] py-4 lg:h-[260px] lg:flex-col lg:items-stretch lg:gap-3 lg:p-[22px]"
    >
      <div className="flex shrink-0 items-center justify-between lg:w-full">
        <span
          className={`tabular text-[22px] font-bold lg:text-[30px] ${tema.origem === 'PREVISAO' ? 'text-text-2' : 'text-accent-text-hover lg:text-text'}`}
        >
          {tema.origem === 'PERSONALIZADO'
            ? 'Meu tema'
            : tema.origem === 'AUTORAL'
              ? 'Autoral'
              : (tema.ano ?? 'ENEM')}
        </span>
        {tema.origem === 'PERSONALIZADO' ? (
          <span className="rounded-pill ml-3 hidden border border-[#2b4a7a] bg-[#1b2638] px-2.5 py-1 text-xs font-semibold text-[#b9c7dd] lg:inline">
            Meu tema
          </span>
        ) : tema.origem === 'PREVISAO' ? (
          <span className="text-possivel border-possivel-border rounded-pill ml-3 hidden items-center gap-1 border border-dashed px-2.5 py-1 text-xs font-semibold lg:inline-flex">
            <SparkIcon size={12} double={false} /> Possível
          </span>
        ) : (
          <span className="bg-accent-tint text-accent-text-hover rounded-pill ml-3 hidden px-2.5 py-1 text-xs font-semibold lg:inline">
            {tema.origem === 'ENEM_OFICIAL' ? 'ENEM oficial' : 'Autoral'}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 lg:flex lg:flex-col">
        <span className="text-[15px] leading-[1.35] font-semibold lg:text-base lg:leading-[1.4]">
          {tema.titulo}
        </span>
        <div className="text-text-3 mt-1 flex items-center justify-between text-[13px] lg:mt-auto">
          <span className="flex min-w-0 items-center gap-2">
            {tema.origem === 'PREVISAO' && (
              <span className="text-possivel border-possivel-border rounded-pill inline-flex shrink-0 items-center gap-1 border border-dashed px-2 py-0.5 text-[11px] font-semibold lg:hidden">
                <SparkIcon size={12} double={false} /> Possível
              </span>
            )}
            {tema.origem === 'PERSONALIZADO' && (
              <span className="rounded-pill inline-flex shrink-0 border border-[#2b4a7a] bg-[#1b2638] px-2 py-0.5 text-[11px] font-semibold text-[#b9c7dd] lg:hidden">
                Meu tema
              </span>
            )}
            {practiced ? (
              <>
                <span className="lg:hidden">Praticado</span>
                <span className="hidden lg:inline">
                  Praticado {attempts.length}{' '}
                  {attempts.length === 1 ? 'vez' : 'vezes'}
                </span>
              </>
            ) : (
              'Ainda não praticado'
            )}
          </span>
          {best !== null ? (
            <span className="tabular text-text font-bold">{best}</span>
          ) : (
            <span className="text-accent-text-hover hidden items-center gap-1 font-semibold lg:flex">
              Começar <ArrowRight size={14} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function TemasSkeleton() {
  return (
    <div className="grid gap-2.5 px-5 pt-1 lg:mt-6 lg:grid-cols-4 lg:gap-4 lg:px-0">
      {Array.from({ length: 8 }, (_, index) => (
        <Skeleton key={index} className="h-[86px] lg:h-[260px]" />
      ))}
    </div>
  );
}
