import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export type UsuarioMe = {
  id: string;
  email: string;
  role: 'ALUNO' | 'ADMIN';
};

export const meQueryKey = ['usuarios', 'me', 'auth'] as const;

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: ({ signal }) => api<UsuarioMe>('/usuarios/me', { signal }),
    staleTime: 10 * 60 * 1000,
  });
}

export function useIsAdmin() {
  const query = useMe();
  return { ...query, isAdmin: query.data?.role === 'ADMIN' };
}
