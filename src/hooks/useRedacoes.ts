import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ResumoRedacao } from '@/types/api';

export const redacoesQueryKey = ['redacoes'] as const;

export function useRedacoes() {
  return useQuery({
    queryKey: redacoesQueryKey,
    queryFn: ({ signal }) => api<ResumoRedacao[]>('/redacoes', { signal }),
  });
}
