import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  EnviarPerguntaJuliaResponse,
  JuliaConversaResponse,
} from '@/types/api';

export const juliaQueryKey = (redacaoId: string) =>
  ['julia', redacaoId] as const;

export function useJuliaConversa(redacaoId: string, aberto: boolean) {
  return useQuery({
    queryKey: juliaQueryKey(redacaoId),
    queryFn: ({ signal }) =>
      api<JuliaConversaResponse>(`/redacoes/${redacaoId}/julia`, { signal }),
    enabled: aberto && Boolean(redacaoId),
  });
}

export function useEnviarPerguntaJulia(redacaoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pergunta: string) =>
      api<EnviarPerguntaJuliaResponse>(
        `/redacoes/${redacaoId}/julia/mensagens`,
        { method: 'POST', body: JSON.stringify({ pergunta }) },
      ),
    onSuccess: (data) => {
      queryClient.setQueryData<JuliaConversaResponse>(
        juliaQueryKey(redacaoId),
        (atual) => ({
          mensagens: [
            ...(atual?.mensagens ?? []),
            data.pergunta,
            data.resposta,
          ],
          restantesConversa: data.restantesConversa,
          restantesHoje: data.restantesHoje,
        }),
      );
    },
  });
}
