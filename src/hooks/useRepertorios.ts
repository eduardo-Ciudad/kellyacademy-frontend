import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { filtrosParaParams, type FiltrosRepertorio } from '@/lib/repertorio';
import type {
  Macroeixo,
  Pagina,
  Repertorio,
  RepertorioResumo,
} from '@/types/api';

const STALE_TIME = 30 * 60 * 1000;
export const repertoriosQueryKey = ['repertorios'] as const;

export function useRepertorios(filtros: FiltrosRepertorio) {
  return useInfiniteQuery({
    queryKey: [...repertoriosQueryKey, 'lista', filtros],
    queryFn: ({ signal, pageParam }) => {
      const params = filtrosParaParams(filtros);
      params.set('page', String(pageParam));
      params.set('size', '20');
      return api<Pagina<RepertorioResumo>>(`/repertorios?${params}`, {
        signal,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (ultima) =>
      ultima.temProxima ? ultima.pagina + 1 : undefined,
    staleTime: STALE_TIME,
  });
}

export function useRepertorio(codigo: string | undefined) {
  return useQuery({
    queryKey: [...repertoriosQueryKey, 'detalhe', codigo],
    queryFn: ({ signal }) =>
      api<Repertorio>(`/repertorios/${codigo}`, { signal }),
    enabled: !!codigo,
    staleTime: STALE_TIME,
  });
}

export function useMacroeixos() {
  return useQuery({
    queryKey: ['macroeixos'],
    queryFn: ({ signal }) => api<Macroeixo[]>('/macroeixos', { signal }),
    staleTime: STALE_TIME,
  });
}
