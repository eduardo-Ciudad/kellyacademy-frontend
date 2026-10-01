import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { correcoesHojeQueryKey } from '@/hooks/useCorrecoesHoje';
import { redacoesQueryKey } from '@/hooks/useRedacoes';
import { api } from '@/lib/api';
import type { RedacaoResponse } from '@/types/api';

export function redacaoQueryKey(id: string) {
  return ['redacoes', id] as const;
}

export function useRedacao(id: string) {
  const queryClient = useQueryClient();
  const previousStatus = useRef<RedacaoResponse['status'] | undefined>(
    undefined,
  );
  const query = useQuery({
    queryKey: redacaoQueryKey(id),
    queryFn: ({ signal }) =>
      api<RedacaoResponse>(`/redacoes/${id}`, { signal }),
    enabled: Boolean(id),
    staleTime: 5_000,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'ENVIADA' || status === 'EM_AVALIACAO' ? 5_000 : false;
    },
  });

  useEffect(() => {
    const currentStatus = query.data?.status;
    const previousWasPending =
      previousStatus.current === 'ENVIADA' ||
      previousStatus.current === 'EM_AVALIACAO';
    const currentIsPending =
      currentStatus === 'ENVIADA' || currentStatus === 'EM_AVALIACAO';

    if (currentStatus && previousWasPending && !currentIsPending) {
      void queryClient.invalidateQueries({ queryKey: redacoesQueryKey });
      void queryClient.invalidateQueries({ queryKey: correcoesHojeQueryKey });
    }

    previousStatus.current = currentStatus;
  }, [query.data?.status, queryClient]);

  return query;
}
