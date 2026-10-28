import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { PlanoUsuario, RecursoPro } from '@/types/api';

export const planoQueryKey = ['usuarios', 'me', 'plano'] as const;

export function planoLibera(
  plano: PlanoUsuario | undefined,
  recurso: RecursoPro,
) {
  return plano?.plano === 'PRO' && plano.recursos.includes(recurso);
}

export function usePlano() {
  const query = useQuery({
    queryKey: planoQueryKey,
    queryFn: ({ signal }) =>
      api<PlanoUsuario>('/usuarios/me/plano', { signal }),
    staleTime: 30_000,
  });

  return {
    dados: query.data,
    plano: query.data?.plano,
    ehPro: query.data?.plano === 'PRO',
    libera: (recurso: RecursoPro) => planoLibera(query.data, recurso),
    limites: query.data?.limites,
    assinatura: query.data?.assinatura,
    origem: query.data?.origem,
    concessao: query.data?.concessao,
    isLoading: query.isLoading,
  };
}
