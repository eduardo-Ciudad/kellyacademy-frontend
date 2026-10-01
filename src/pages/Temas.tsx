import { ArrowLeft, ArrowRight, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRedacoes } from '@/hooks/useRedacoes';
import { useTemas } from '@/hooks/useTemas';
import type { ResumoRedacao, Tema } from '@/types/api';

type Filter = 'todos' | 'nao-praticados' | 'praticados';

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function Temas() {
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
        (filter === 'praticados' ? practiced : !practiced);
      return matchesSearch && matchesFilter;
    });
  }, [attemptsByTema, filter, search, temasQuery.data]);
  const isLoading = temasQuery.isLoading || redacoesQuery.isLoading;
  const hasError = temasQuery.isError || redacoesQuery.isError;

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
            <h1 className="text-text text-[22px] font-bold tracking-[-0.02em] lg:text-[28px]">
              Escolha um tema
            </h1>
            <p className="text-text-2 mt-1.5 hidden text-[15px] lg:block">
              Temas oficiais do ENEM, do mais recente ao mais antigo.
            </p>
          </div>
        </div>

        <div className="mt-3.5 flex flex-col gap-3 lg:mt-6 lg:flex-row lg:items-center">
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
          <h2 className="text-text text-lg font-bold">
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
        <span className="tabular text-accent-text-hover lg:text-text text-[22px] font-bold lg:text-[30px]">
          {tema.origem === 'AUTORAL' ? 'Autoral' : (tema.ano ?? 'ENEM')}
        </span>
        <span className="bg-accent-tint text-accent-text-hover rounded-pill ml-3 hidden px-2.5 py-1 text-xs font-semibold lg:inline">
          {tema.origem === 'ENEM_OFICIAL' ? 'ENEM oficial' : 'Autoral'}
        </span>
      </div>
      <div className="min-w-0 flex-1 lg:flex lg:flex-col">
        <span className="text-[15px] leading-[1.35] font-semibold lg:text-base lg:leading-[1.4]">
          {tema.titulo}
        </span>
        <div className="text-text-3 mt-1 flex items-center justify-between text-[13px] lg:mt-auto">
          <span>
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
