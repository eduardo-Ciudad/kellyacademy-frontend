import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { iniciarCheckout, type CicloCheckout } from '@/lib/assinatura';
import { ApiError } from '@/lib/api';
import { retryMessage } from '@/lib/password';

export function useIniciarCheckout() {
  const [redirecionando, setRedirecionando] = useState(false);
  const mutation = useMutation({
    mutationFn: (ciclo: CicloCheckout) => iniciarCheckout(ciclo),
    onSuccess: ({ url }) => {
      setRedirecionando(true);
      window.location.assign(url);
    },
    onError: (error) => {
      if (
        error instanceof ApiError &&
        error.status === 409 &&
        error.codigo === 'ASSINATURA_EXISTENTE'
      )
        return;

      if (error instanceof ApiError && error.status === 429) {
        toast.error(retryMessage(error.detail, error.retryAfter));
        return;
      }

      toast.error(
        error instanceof ApiError
          ? error.detail
          : 'Não foi possível iniciar o pagamento. Tente novamente.',
      );
    },
  });

  const jaAssinante =
    mutation.error instanceof ApiError &&
    mutation.error.status === 409 &&
    mutation.error.codigo === 'ASSINATURA_EXISTENTE';

  return {
    ...mutation,
    jaAssinante,
    isLoading: mutation.isPending || redirecionando,
  };
}
