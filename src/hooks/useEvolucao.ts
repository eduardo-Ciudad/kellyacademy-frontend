import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Evolucao } from '@/types/api';

export const evolucaoQueryKey = ['usuarios', 'me', 'evolucao'] as const;

export function useEvolucao() {
  return useQuery({
    queryKey: evolucaoQueryKey,
    queryFn: ({ signal }) => api<Evolucao>('/usuarios/me/evolucao', { signal }),
  });
}
