import { useEffect, useState, type ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, ApiError } from '@/lib/api';
import type { ReenviarVerificacaoResponse } from '@/types/api';

type ReenviarVerificacaoProps = {
  email?: string;
  pedirEmail?: boolean;
  buttonLabel?: string;
  buttonVariant?: 'primary' | 'outline' | 'compact';
  secondaryAction?: ReactNode;
  embedded?: boolean;
};

export function ReenviarVerificacao({
  email = '',
  pedirEmail = false,
  buttonLabel = 'Reenviar e-mail',
  buttonVariant = 'outline',
  secondaryAction,
  embedded = false,
}: ReenviarVerificacaoProps) {
  const [emailDigitado, setEmailDigitado] = useState(email);
  const [mensagem, setMensagem] = useState<string>();
  const [erro, setErro] = useState<string>();
  const [segundos, setSegundos] = useState(0);
  const mutation = useMutation({
    mutationFn: (destino: string) =>
      api<ReenviarVerificacaoResponse>('/auth/reenviar-verificacao', {
        method: 'POST',
        body: JSON.stringify({ email: destino }),
      }),
  });

  useEffect(() => {
    if (segundos <= 0) return;
    const timer = window.setInterval(
      () => setSegundos((valor) => Math.max(0, valor - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [segundos]);

  const reenviar = async () => {
    setMensagem(undefined);
    setErro(undefined);
    try {
      const response = await mutation.mutateAsync(
        (pedirEmail ? emailDigitado : email).trim(),
      );
      setMensagem(response.mensagem);
      setSegundos(60);
    } catch (error) {
      if (!(error instanceof ApiError)) return;
      if (error.status === 429) {
        setErro(
          error.retryAfter
            ? `Limite atingido. Tente novamente em ${error.retryAfter} segundos.`
            : 'Limite atingido. Tente novamente mais tarde.',
        );
      } else if (error.status === 400) {
        setErro('Informe um e-mail válido.');
      } else {
        setErro(error.detail);
      }
    }
  };

  const contador = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;
  const botao = (
    <Button
      type={embedded ? 'button' : 'submit'}
      onClick={embedded ? () => void reenviar() : undefined}
      variant={buttonVariant === 'primary' ? 'primary' : 'outline'}
      loading={mutation.isPending}
      disabled={
        segundos > 0 || !(pedirEmail ? emailDigitado.trim() : email.trim())
      }
      className={
        buttonVariant === 'compact'
          ? 'border-accent-outline text-accent-outline-text h-11 self-start px-[18px] text-sm'
          : 'h-[52px] w-full text-base'
      }
    >
      {segundos > 0 ? (
        <>
          Reenviar em <span className="tabular font-mono">{contador}</span>
        </>
      ) : (
        buttonLabel
      )}
    </Button>
  );

  const content = (
    <>
      {pedirEmail && (
        <div>
          <label
            htmlFor="email-reenvio"
            className="text-text mb-2 block text-sm font-medium"
          >
            Seu e-mail
          </label>
          <Input
            id="email-reenvio"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={emailDigitado}
            onChange={(event) => setEmailDigitado(event.target.value)}
            placeholder="voce@email.com"
          />
        </div>
      )}
      {mensagem && (
        <div
          role="status"
          className="bg-success-subtle border-success-subtle-border text-success-subtle-text flex gap-3 rounded-xl border px-4 py-3.5 text-sm leading-[1.5]"
        >
          <CircleCheck
            className="text-success mt-px shrink-0"
            size={20}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <p>{mensagem}</p>
        </div>
      )}
      {secondaryAction ? (
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="order-2 flex-1 lg:order-1">{secondaryAction}</div>
          <div className="order-1 flex-1 lg:order-2">{botao}</div>
        </div>
      ) : (
        botao
      )}
      {erro && (
        <p role="alert" className="text-danger text-sm leading-5">
          {erro}
        </p>
      )}
    </>
  );

  if (embedded) return <div className="flex flex-col gap-3">{content}</div>;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void reenviar();
      }}
      className="flex flex-col gap-3"
    >
      {content}
    </form>
  );
}
