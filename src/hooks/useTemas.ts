import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Tema } from '@/types/api';

export const temasQueryKey = ['temas'] as const;

export function useTemas() {
  return useQuery({
    queryKey: temasQueryKey,
    queryFn: ({ signal }) => api<Tema[]>('/temas', { signal }),
    staleTime: 30 * 60 * 1000,
  });
}
