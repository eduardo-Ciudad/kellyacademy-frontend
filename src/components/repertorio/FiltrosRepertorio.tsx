import * as Dialog from '@radix-ui/react-dialog';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  contarFiltrosAtivos,
  FUNCAO_ARGUMENTATIVA_LABELS,
  FUNCOES_ARGUMENTATIVAS,
  TIPOS_FILTRO,
  TIPO_ENTIDADE_LABELS,
  type FiltrosRepertorio as Filtros,
} from '@/lib/repertorio';
import type { Macroeixo } from '@/types/api';

type Props = {
  filtros: Filtros;
  macroeixos: Macroeixo[] | undefined;
  areasFalharam: boolean;
  onChange: (filtros: Filtros) => void;
  onClear: () => void;
};

export function FiltrosRepertorio(props: Props) {
  return (
    <>
      <div className="hidden min-w-0 flex-1 grid-cols-4 gap-2 lg:grid">
        <CamposFiltros
          {...props}
          filtros={props.filtros}
          onChange={props.onChange}
        />
      </div>
      <FiltrosMobile {...props} />
    </>
  );
}

function FiltrosMobile(props: Props) {
  const [open, setOpen] = useState(false);
  const [rascunho, setRascunho] = useState(props.filtros);
  const quantidade = contarFiltrosAtivos(props.filtros);

  function abrir(openState: boolean) {
    if (openState) setRascunho(props.filtros);
    setOpen(openState);
  }

  return (
    <Dialog.Root open={open} onOpenChange={abrir}>
      <Dialog.Trigger asChild>
        <Button variant="secondary" className="shrink-0 px-4 lg:hidden">
          <SlidersHorizontal size={17} aria-hidden="true" /> Filtros
          {quantidade > 0 && (
            <span className="bg-accent rounded-pill flex size-5 items-center justify-center text-[11px] text-white">
              {quantidade}
            </span>
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
        <Dialog.Content className="bg-bg fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-[28px] px-5 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))] outline-none lg:hidden">
          <div className="bg-control rounded-pill mx-auto h-1.5 w-10" />
          <div className="my-4 flex items-center justify-between">
            <Dialog.Title className="text-text text-xl font-bold">
              Filtrar repertórios
            </Dialog.Title>
            <Dialog.Close
              aria-label="Fechar"
              className="focus-ring bg-surface flex size-11 items-center justify-center rounded-full"
            >
              <X size={19} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="space-y-4">
            <CamposFiltros
              {...props}
              filtros={rascunho}
              onChange={setRascunho}
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() =>
                setRascunho({
                  macroeixo: null,
                  problema: null,
                  tipo: null,
                  funcao: null,
                  q: props.filtros.q,
                })
              }
            >
              Limpar
            </Button>
            <Button
              onClick={() => {
                props.onChange(rascunho);
                setOpen(false);
              }}
            >
              Ver resultados
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CamposFiltros({
  filtros,
  macroeixos,
  areasFalharam,
  onChange,
}: Props) {
  const area = macroeixos?.find((item) => item.slug === filtros.macroeixo);
  const disabled = areasFalharam || !macroeixos;
  const selectClass =
    'focus-ring bg-surface border-control text-text rounded-input min-h-11 w-full border px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <>
      <label className="block">
        <span className="text-text-2 mb-1.5 block text-xs font-semibold lg:sr-only">
          Área
        </span>
        <select
          aria-label="Área"
          className={selectClass}
          disabled={disabled}
          value={filtros.macroeixo ?? ''}
          onChange={(event) => {
            const macroeixo = event.target.value || null;
            const novaArea = macroeixos?.find(
              (item) => item.slug === macroeixo,
            );
            const problema = novaArea?.problemas.some(
              (item) => item.slug === filtros.problema,
            )
              ? filtros.problema
              : null;
            onChange({ ...filtros, macroeixo, problema });
          }}
        >
          <option value="">
            {areasFalharam
              ? 'Não foi possível carregar as áreas'
              : 'Todas as áreas'}
          </option>
          {macroeixos?.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.nome}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-text-2 mb-1.5 block text-xs font-semibold lg:sr-only">
          Problema social
        </span>
        <select
          aria-label="Problema social"
          className={selectClass}
          disabled={disabled || !area}
          value={filtros.problema ?? ''}
          onChange={(event) =>
            onChange({ ...filtros, problema: event.target.value || null })
          }
        >
          <option value="">
            {areasFalharam
              ? 'Não foi possível carregar as áreas'
              : 'Todos os problemas'}
          </option>
          {area?.problemas.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.nome}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-text-2 mb-1.5 block text-xs font-semibold lg:sr-only">
          Tipo
        </span>
        <select
          aria-label="Tipo"
          className={selectClass}
          value={filtros.tipo ?? ''}
          onChange={(event) =>
            onChange({
              ...filtros,
              tipo: (event.target.value || null) as Filtros['tipo'],
            })
          }
        >
          <option value="">Todos os tipos</option>
          {TIPOS_FILTRO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {TIPO_ENTIDADE_LABELS[tipo]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-text-2 mb-1.5 block text-xs font-semibold lg:sr-only">
          Para que serve
        </span>
        <select
          aria-label="Para que serve"
          className={selectClass}
          value={filtros.funcao ?? ''}
          onChange={(event) =>
            onChange({
              ...filtros,
              funcao: (event.target.value || null) as Filtros['funcao'],
            })
          }
        >
          <option value="">Todas as funções</option>
          {FUNCOES_ARGUMENTATIVAS.map((funcao) => (
            <option key={funcao} value={funcao}>
              {FUNCAO_ARGUMENTATIVA_LABELS[funcao]}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
