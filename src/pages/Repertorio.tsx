import { RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AccountButton } from '@/components/layout/AccountButton';
import { FiltrosRepertorio } from '@/components/repertorio/FiltrosRepertorio';
import { RepertorioCard } from '@/components/repertorio/RepertorioCard';
import { RepertorioDetalheSheet } from '@/components/repertorio/RepertorioDetalheSheet';
import { RepertorioSkeleton } from '@/components/repertorio/RepertorioSkeleton';
import { Button } from '@/components/ui/Button';
import { useMacroeixos, useRepertorios } from '@/hooks/useRepertorios';
import { ApiError } from '@/lib/api';
import {
  filtrosParaParams,
  FUNCAO_ARGUMENTATIVA_LABELS,
  lerFiltros,
  TIPO_ENTIDADE_LABELS,
  type FiltrosRepertorio as Filtros,
} from '@/lib/repertorio';
import type { Macroeixo } from '@/types/api';

const filtrosVazios: Filtros = {
  macroeixo: null,
  problema: null,
  tipo: null,
  funcao: null,
  q: '',
};

export function Repertorio() {
  const { codigo } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const filtros = useMemo(() => lerFiltros(searchParams), [searchParams]);
  const [busca, setBusca] = useState(filtros.q);
  const macroeixosQuery = useMacroeixos();
  const repertoriosQuery = useRepertorios(filtros);
  const queryAtual = filtrosParaParams(filtros).toString();
  const itens =
    repertoriosQuery.data?.pages.flatMap((pagina) => pagina.itens) ?? [];
  const total = repertoriosQuery.data?.pages[0]?.totalItens;

  useEffect(() => {
    setBusca((atual) =>
      atual.trim().slice(0, 100) === filtros.q ? atual : filtros.q,
    );
  }, [filtros.q]);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const q = busca.trim().slice(0, 100);
      if (q !== filtros.q) {
        setSearchParams(filtrosParaParams({ ...filtros, q }), {
          replace: true,
        });
      }
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [busca, filtros, setSearchParams]);

  function atualizarFiltros(novos: Filtros) {
    setSearchParams(filtrosParaParams(novos), { replace: true });
  }

  function limparFiltros() {
    setBusca('');
    atualizarFiltros(filtrosVazios);
  }

  async function carregarMais() {
    try {
      await repertoriosQuery.fetchNextPage({ cancelRefetch: false });
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.detail
          : 'Não foi possível carregar mais repertórios.',
      );
    }
  }

  return (
    <div className="px-5 pt-5 pb-4 lg:px-0 lg:pt-0">
      <header>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-text text-[22px] font-bold tracking-[-0.02em] lg:text-[28px]">
              Repertório
            </h1>
            <p className="text-text-2 mt-1.5 text-sm leading-relaxed lg:max-w-3xl lg:text-[15px]">
              <span className="lg:hidden">
                Pensadores, obras, leis e dados para seus argumentos.
              </span>
              <span className="hidden lg:inline">
                Pensadores, obras, leis e dados para fundamentar seus argumentos
                — com o que lembrar na prova e o erro que você deve evitar.
              </span>
            </p>
          </div>
          <AccountButton className="ml-auto" />
        </div>
        {total !== undefined && (
          <p className="text-text-3 mt-3 text-sm font-semibold tabular-nums">
            {total} {total === 1 ? 'repertório' : 'repertórios'}
          </p>
        )}
      </header>

      <div className="mt-5 flex items-center gap-2 lg:mt-6">
        <div className="relative min-w-0 flex-1 lg:max-w-[330px]">
          <Search
            className="text-text-3 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            size={18}
            aria-hidden="true"
          />
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            type="search"
            maxLength={100}
            aria-label="Buscar repertório"
            placeholder="Buscar por nome, ideia ou tema"
            className="focus-ring bg-surface border-control text-text placeholder:text-text-3 rounded-input h-11 w-full border pr-11 pl-11 text-base outline-none lg:text-sm"
          />
          {busca && (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => setBusca('')}
              className="focus-ring text-text-3 hover:text-text absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-full"
            >
              <X size={17} aria-hidden="true" />
            </button>
          )}
        </div>
        <FiltrosRepertorio
          filtros={filtros}
          macroeixos={macroeixosQuery.data}
          areasFalharam={macroeixosQuery.isError}
          onChange={atualizarFiltros}
          onClear={limparFiltros}
        />
      </div>

      <ChipsAtivos
        filtros={filtros}
        macroeixos={macroeixosQuery.data}
        onChange={atualizarFiltros}
        onClear={limparFiltros}
      />

      <div className="lg:flex lg:items-start lg:gap-6">
        <div className="min-w-0 flex-1">
          {repertoriosQuery.isLoading ? (
            <RepertorioSkeleton />
          ) : repertoriosQuery.isError && itens.length === 0 ? (
            <div className="bg-surface rounded-card mt-5 p-8 text-center">
              <h2 className="text-text text-lg font-bold">
                Não foi possível carregar os repertórios
              </h2>
              <Button
                onClick={() => void repertoriosQuery.refetch()}
                variant="secondary"
                className="mt-5"
              >
                <RotateCcw size={16} aria-hidden="true" /> Tentar novamente
              </Button>
            </div>
          ) : itens.length === 0 ? (
            <div className="bg-surface rounded-card mt-5 p-8 text-center">
              <p className="text-text-2">
                Nenhum repertório encontrado com esses filtros.
              </p>
              <Button
                variant="secondary"
                className="mt-5"
                onClick={limparFiltros}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div>
              <div
                className={`mt-5 grid gap-3 ${codigo ? 'grid-cols-1' : 'lg:grid-cols-2'}`}
              >
                {itens.map((repertorio) => (
                  <RepertorioCard
                    key={repertorio.codigo}
                    repertorio={repertorio}
                    query={queryAtual}
                  />
                ))}
              </div>
              {repertoriosQuery.hasNextPage && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="secondary"
                    disabled={repertoriosQuery.isFetchingNextPage}
                    onClick={() => void carregarMais()}
                  >
                    {repertoriosQuery.isFetchingNextPage
                      ? 'Carregando…'
                      : 'Carregar mais'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <RepertorioDetalheSheet codigo={codigo} query={queryAtual} />
      </div>
    </div>
  );
}

function ChipsAtivos({
  filtros,
  macroeixos,
  onChange,
  onClear,
}: {
  filtros: Filtros;
  macroeixos: Macroeixo[] | undefined;
  onChange: (filtros: Filtros) => void;
  onClear: () => void;
}) {
  const area = macroeixos?.find((item) => item.slug === filtros.macroeixo);
  const problema = macroeixos
    ?.flatMap((item) => item.problemas)
    .find((item) => item.slug === filtros.problema);
  const chips = [
    filtros.macroeixo && {
      key: 'macroeixo',
      label: area?.nome ?? filtros.macroeixo,
      remove: () => onChange({ ...filtros, macroeixo: null, problema: null }),
    },
    filtros.problema && {
      key: 'problema',
      label: problema?.nome ?? filtros.problema,
      remove: () => onChange({ ...filtros, problema: null }),
    },
    filtros.tipo && {
      key: 'tipo',
      label: TIPO_ENTIDADE_LABELS[filtros.tipo],
      remove: () => onChange({ ...filtros, tipo: null }),
    },
    filtros.funcao && {
      key: 'funcao',
      label: FUNCAO_ARGUMENTATIVA_LABELS[filtros.funcao],
      remove: () => onChange({ ...filtros, funcao: null }),
    },
  ].filter(Boolean) as { key: string; label: string; remove: () => void }[];

  if (chips.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          aria-label={`Remover filtro ${chip.label}`}
          className="focus-ring bg-control text-text-2 rounded-pill flex min-h-11 items-center gap-1.5 px-3 text-[13px] font-semibold"
        >
          {chip.label} <X size={14} aria-hidden="true" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="focus-ring text-accent-text hover:text-accent-text-hover min-h-11 px-2 text-sm font-semibold"
      >
        Limpar filtros
      </button>
    </div>
  );
}
