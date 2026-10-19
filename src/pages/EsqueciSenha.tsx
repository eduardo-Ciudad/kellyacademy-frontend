import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AvisoEntregaEmail } from '@/components/auth/AvisoEntregaEmail';
import { FieldError } from '@/components/auth/FormFeedback';
import {
  PasswordStatusIcon,
  passwordTitleClass,
} from '@/components/auth/PasswordStatus';
import {
  ESPERA_REENVIO_SEGUNDOS,
  ReenviarVerificacao,
} from '@/components/auth/ReenviarVerificacao';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, ApiError } from '@/lib/api';
import { retryMessage } from '@/lib/password';
import { usePageMeta } from '@/lib/usePageMeta';
import type { SolicitarRedefinicaoResponse } from '@/types/api';

type LocationState = { email?: string };
type Estado =
  | { kind: 'form' }
  | { kind: 'enviado'; email: string; mensagem: string; wait: number };

export function EsqueciSenha() {
  usePageMeta({ title: 'Esqueci minha senha — Kelly Academy', noindex: true });
  const location = useLocation();
  const initialEmail = (location.state as LocationState | null)?.email ?? '';
  const [email, setEmail] = useState(initialEmail);
  const [estado, setEstado] = useState<Estado>({ kind: 'form' });
  const [erro, setErro] = useState<string>();
  const [pending, setPending] = useState(false);
  const [emailReenviado, setEmailReenviado] = useState(false);
  const submitting = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    const destino = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(destino))
      return setErro('Informe um e-mail válido.');
    submitting.current = true;
    setPending(true);
    setErro(undefined);
    try {
      const response = await api<SolicitarRedefinicaoResponse>(
        '/auth/esqueci-senha',
        { method: 'POST', body: JSON.stringify({ email: destino }) },
      );
      setEstado({
        kind: 'enviado',
        email: destino,
        mensagem: response.mensagem,
        wait: ESPERA_REENVIO_SEGUNDOS,
      });
      requestAnimationFrame(() => titleRef.current?.focus());
    } catch (error) {
      if (error instanceof ApiError)
        setErro(
          error.status === 429
            ? retryMessage(error.detail, error.retryAfter)
            : error.detail,
        );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <AuthLayout variant="login" showMobileIntro={false}>
      <section className="my-auto flex w-full flex-col gap-7 lg:w-[420px]">
        {estado.kind === 'form' ? (
          <>
            <PasswordStatusIcon type="key" />
            <div className="flex flex-col gap-3.5">
              <h1 className={passwordTitleClass}>Esqueceu a senha?</h1>
              <p className="text-text-2 text-base leading-[1.55]">
                Informe o e-mail da sua conta. Se ele estiver cadastrado,
                enviamos um link para você criar uma senha nova.
              </p>
            </div>
            <form
              onSubmit={(event) => void submit(event)}
              noValidate
              className="flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="text-text-body mb-2 block text-sm font-semibold"
                >
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  invalid={Boolean(erro)}
                  aria-describedby={erro ? 'email-error' : undefined}
                />
                <FieldError id="email-error" message={erro} />
              </div>
              <Button
                type="submit"
                loading={pending}
                className="h-[52px] w-full text-base"
              >
                {pending ? 'Enviando…' : 'Enviar link'}
              </Button>
            </form>
            <p className="border-border-subtle text-text-3 border-t pt-5 text-sm">
              Lembrou a senha?{' '}
              <Link
                to="/entrar"
                className="focus-ring text-accent-text rounded-sm font-semibold"
              >
                Entrar
              </Link>
            </p>
          </>
        ) : (
          <>
            <PasswordStatusIcon type="mail" />
            <div className="flex flex-col gap-3.5">
              <h1 ref={titleRef} tabIndex={-1} className={passwordTitleClass}>
                Confira seu e-mail
              </h1>
              <p className="text-text-2 text-base leading-[1.55]">
                {estado.mensagem}
              </p>
              <p className="text-text-2 text-sm leading-[1.55]">
                Enviado para:{' '}
                <strong className="text-text font-semibold">
                  {estado.email}
                </strong>
              </p>
            </div>
            <div className="bg-surface border-control text-text-2 rounded-inner border p-4 text-sm leading-6">
              <p>
                O link vale por{' '}
                <strong className="text-text">30 minutos</strong> e só pode ser
                usado uma vez.
              </p>
            </div>
            <AvisoEntregaEmail reenviado={emailReenviado} />
            <ReenviarVerificacao
              email={estado.email}
              endpoint="/auth/esqueci-senha"
              initialSeconds={estado.wait}
              buttonVariant="outline"
              embedded
              onSuccess={() => setEmailReenviado(true)}
            />
            <Link
              to="/entrar"
              className="focus-ring bg-control text-text rounded-pill flex h-[52px] items-center justify-center font-semibold"
            >
              Voltar para o login
            </Link>
          </>
        )}
      </section>
    </AuthLayout>
  );
}
