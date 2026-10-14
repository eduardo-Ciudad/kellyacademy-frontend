import { ArrowLeft, Info, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TemaPossivelCard } from '@/components/temas/TemaPossivelCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTemasPossiveis } from '@/hooks/useTemasPossiveis';
import type { ForcaEvidencia } from '@/types/api';

const grupos: Array<{
  forca: ForcaEvidencia;
  titulo: string;
  barras: 1 | 2 | 3;
}> = [
  { forca: 'MUITO_FORTE', titulo: 'Evidências muito fortes', barras: 3 },
  { forca: 'FORTE', titulo: 'Evidências fortes', barras: 2 },
  { forca: 'VALE_TREINAR', titulo: 'Vale treinar', barras: 1 },
];

export function TemasPossiveis() {
  const query = useTemasPossiveis();
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const temas = query.data ?? [];
  const adicionados = temas.filter((tema) => tema.adicionado).length;
  const temasPorGrupo = grupos.map((grupo) => ({
    ...grupo,
    temas: temas.filter((tema) => tema.forca === grupo.forca),
  }));

  return (
    <div className="mx-auto max-w-[980px] px-5 pt-5 pb-5 lg:px-0 lg:pt-0">
      <Link
        to="/temas"
        aria-label="Voltar para temas"
        className="focus-ring bg-surface text-text-2 hover:text-text flex size-11 items-center justify-center rounded-full lg:h-9 lg:w-fit lg:gap-1.5 lg:bg-transparent lg:text-sm lg:font-semibold"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        <span className="hidden lg:inline">Temas</span>
      </Link>

      <header className="mt-4 flex items-end justify-between gap-6 lg:mt-3">
        <div>
        <h1 className="text-text text-[24px] leading-tight font-normal tracking-[-0.02em] lg:text-[28px]">
            Possíveis temas do ENEM 2026
          </h1>
          <p className="text-text-2 mt-2 max-w-[680px] text-sm leading-[1.55] lg:text-[15px]">
            Recortes selecionados por uma pesquisa que cruzou o histórico das
            provas, leis recentes e dados oficiais. Adicione os que quiser
            treinar e eles aparecem na sua lista de temas.
            <span className="mt-2 block font-semibold lg:hidden">
              {rotuloQuantidade(adicionados, 'na sua lista')}
            </span>
          </p>
        </div>
        <span className="bg-surface text-text-body tabular rounded-pill hidden shrink-0 px-3.5 py-2 text-sm font-semibold lg:block">
          {rotuloQuantidade(adicionados, 'na sua lista')}
        </span>
      </header>

      <div
        role="note"
        className="bg-surface mt-5 flex items-start gap-3 rounded-2xl px-4 py-3.5 lg:px-[18px]"
      >
        <Info
          className="text-text-2 mt-px shrink-0"
          size={20}
          aria-hidden="true"
        />
        <p className="text-text-body text-sm leading-[1.55]">
          <span className="lg:hidden">
            Isto não é uma previsão. A força mostra apenas o quanto as
            evidências apontam para cada recorte.
          </span>
          <span className="hidden lg:inline">
            Isto não é uma previsão de que algum tema vai cair. A força indica o
            quanto as evidências apontam para cada recorte. Treinar eixos
            diferentes é o que prepara você para qualquer tema.
          </span>
        </p>
      </div>

      {query.isLoading ? (
        <TemasPossiveisSkeleton />
      ) : query.isError ? (
        <div className="bg-surface rounded-card mt-6 p-8 text-center">
        <h2 className="text-text text-lg font-normal">
            Não foi possível carregar os temas possíveis
          </h2>
          <Button
            onClick={() => void query.refetch()}
            variant="secondary"
            className="mt-5"
          >
            <RotateCcw size={16} aria-hidden="true" /> Tentar novamente
          </Button>
        </div>
      ) : temas.length === 0 ? (
        <p className="text-text-2 mt-10 text-center text-sm">
          Nenhum tema possível disponível no momento.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-7">
          {temasPorGrupo.map(
            (grupo) =>
              grupo.temas.length > 0 && (
                <section key={grupo.forca} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <SinalForca acesas={grupo.barras} />
        <h2 className="text-text text-lg font-normal tracking-[-0.01em]">
                      {grupo.titulo}
                    </h2>
                    <span className="text-text-3 text-[13px]">
                      {rotuloQuantidade(grupo.temas.length, 'tema')}
                    </span>
                  </div>
                  {grupo.temas.map((tema) => (
                    <TemaPossivelCard
                      key={tema.id}
                      tema={tema}
                      aberto={abertoId === tema.id}
                      onAlternarAberto={() =>
                        setAbertoId((atual) =>
                          atual === tema.id ? null : tema.id,
                        )
                      }
                    />
                  ))}
                </section>
              ),
          )}
        </div>
      )}
    </div>
  );
}

function rotuloQuantidade(quantidade: number, sufixo: string) {
  if (sufixo === 'tema') {
    return `${quantidade} ${quantidade === 1 ? 'tema' : 'temas'}`;
  }
  return `${quantidade} ${sufixo}`;
}

function SinalForca({ acesas }: { acesas: 1 | 2 | 3 }) {
  const alturas = ['h-[7px]', 'h-[11px]', 'h-4'] as const;
  return (
    <span className="inline-flex h-4 items-end gap-[3px]" aria-hidden="true">
      {alturas.map((altura, index) => (
        <span
          key={altura}
          className={`${altura} w-1 rounded-sm ${index < acesas ? 'bg-accent-text' : 'bg-control'}`}
        />
      ))}
    </span>
  );
}

function TemasPossiveisSkeleton() {
  const cardsPorGrupo = [2, 1, 1];
  return (
    <div
      className="mt-6 flex flex-col gap-7"
      role="status"
      aria-label="Carregando temas possíveis"
    >
      {cardsPorGrupo.map((quantidade, grupo) => (
        <div key={grupo} className="space-y-3">
          <Skeleton className="h-6 w-56" />
          {Array.from({ length: quantidade }, (_, index) => (
            <Skeleton key={index} className="h-[116px] lg:h-[112px]" />
          ))}
        </div>
      ))}
      <span className="sr-only">Carregando temas possíveis…</span>
    </div>
  );
}
