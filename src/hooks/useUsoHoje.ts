import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { RecursoIA, UsoHoje } from '@/types/api';

export function usoHojeQueryKey(recurso: RecursoIA) {
  return [
    'usuarios',
    'me',
    recurso === 'CORRECAO' ? 'correcoes-hoje' : 'transcricoes-hoje',
  ] as const;
}

export function useUsoHoje(recurso: RecursoIA) {
  const endpoint =
    recurso === 'CORRECAO' ? 'correcoes-hoje' : 'transcricoes-hoje';
  const query = useQuery({
    queryKey: usoHojeQueryKey(recurso),
    queryFn: ({ signal }) =>
      api<UsoHoje>(`/usuarios/me/${endpoint}`, { signal }),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: (state) =>
      state.state.data?.restantes === 0 ? 60_000 : false,
  });
  return {
    usadas: query.data?.usadas,
    limite: query.data?.limite,
    restantes: query.data?.restantes,
    renovaEm: query.data?.renovaEm,
    atingido: query.data?.restantes === 0,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
