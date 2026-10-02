import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { temasQueryKey } from '@/hooks/useTemas';
import { api, ApiError } from '@/lib/api';
import type { TemaPossivel } from '@/types/api';

export const temasPossiveisQueryKey = ['temas', 'possiveis'] as const;
export const alternarTemaPossivelMutationKey = [
  'temas',
  'possiveis',
  'alternar',
] as const;

export function useTemasPossiveis() {
  return useQuery({
    queryKey: temasPossiveisQueryKey,
    queryFn: ({ signal }) =>
      api<TemaPossivel[]>('/temas/possiveis', { signal }),
  });
}

type AlternarTemaPossivel = { temaId: string; adicionar: boolean };

export function useAlternarTemaPossivel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: alternarTemaPossivelMutationKey,
    mutationFn: ({ temaId, adicionar }: AlternarTemaPossivel) =>
      api<void>(`/usuarios/me/temas/${temaId}`, {
        method: adicionar ? 'PUT' : 'DELETE',
      }),
    onMutate: async ({ temaId, adicionar }) => {
      await queryClient.cancelQueries({ queryKey: temasPossiveisQueryKey });
      queryClient.setQueryData<TemaPossivel[]>(
        temasPossiveisQueryKey,
        (temas) =>
          temas?.map((tema) =>
            tema.id === temaId ? { ...tema, adicionado: adicionar } : tema,
          ),
      );
    },
    onError: (error, variables) => {
      queryClient.setQueryData<TemaPossivel[]>(
        temasPossiveisQueryKey,
        (temas) =>
          temas?.map((tema) =>
            tema.id === variables.temaId
              ? { ...tema, adicionado: !variables.adicionar }
              : tema,
          ),
      );
      toast.error(
        error instanceof ApiError
          ? error.detail
          : 'Não foi possível atualizar sua lista.',
      );
    },
    onSettled: () => {
      if (
        queryClient.isMutating({
          mutationKey: alternarTemaPossivelMutationKey,
        }) === 1
      ) {
        void queryClient.invalidateQueries({
          queryKey: temasPossiveisQueryKey,
        });
        void queryClient.invalidateQueries({ queryKey: temasQueryKey });
      }
    },
  });
}
