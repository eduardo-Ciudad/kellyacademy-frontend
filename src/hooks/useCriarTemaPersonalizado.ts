import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { temasQueryKey } from '@/hooks/useTemas';
import { api, ApiError } from '@/lib/api';
import { inserirTemaNoCache } from '@/lib/temaPersonalizado';
import type { Tema } from '@/types/api';

export function useCriarTemaPersonalizado() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (titulo: string) =>
      api<Tema>('/temas/personalizados', {
        method: 'POST',
        body: JSON.stringify({ titulo }),
      }),
    onSuccess: (tema) => {
      queryClient.setQueryData<Tema[]>(temasQueryKey, (prev) =>
        inserirTemaNoCache(prev, tema),
      );
    },
    onError: (error) => {
      if (
        error instanceof ApiError &&
        ((error.status === 429 &&
          error.codigo === 'LIMITE_TEMAS_PERSONALIZADOS') ||
          error.status === 400)
      )
        return;
      toast.error(
        error instanceof ApiError
          ? error.detail
          : 'Não foi possível criar o tema. Tente novamente.',
      );
    },
  });

  return {
    ...mutation,
    limiteAtingido:
      mutation.error instanceof ApiError &&
      mutation.error.status === 429 &&
      mutation.error.codigo === 'LIMITE_TEMAS_PERSONALIZADOS',
    erroCampo:
      mutation.error instanceof ApiError && mutation.error.status === 400
        ? mutation.error.detail
        : null,
  };
}
