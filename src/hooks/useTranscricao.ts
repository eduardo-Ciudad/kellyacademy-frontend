import { useMutation } from '@tanstack/react-query';
import { usoHojeQueryKey } from '@/hooks/useUsoHoje';
import { api } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type { TranscricaoResponse } from '@/types/api';

export function useTranscricao() {
  return useMutation({
    mutationFn: (fotos: File[]) => {
      const body = new FormData();
      fotos.forEach((foto) => body.append('imagens', foto, foto.name));
      return api<TranscricaoResponse>('/transcricoes', {
        method: 'POST',
        body,
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: usoHojeQueryKey('TRANSCRICAO'),
      }),
  });
}
