import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CorrecoesHoje } from '@/types/api';

export const correcoesHojeQueryKey = [
  'usuarios',
  'me',
  'correcoes-hoje',
] as const;

export function useCorrecoesHoje() {
  const query = useQuery({
    queryKey: correcoesHojeQueryKey,
    queryFn: ({ signal }) =>
      api<CorrecoesHoje>('/usuarios/me/correcoes-hoje', { signal }),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: (query) =>
      query.state.data?.restantes === 0 ? 60_000 : false,
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
