import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FieldError, FormBanner } from '@/components/auth/FormFeedback';
import { PasswordField } from '@/components/auth/PasswordField';
import { ReenviarVerificacao } from '@/components/auth/ReenviarVerificacao';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { usePageMeta } from '@/lib/usePageMeta';
import type { LoginRequest, LoginResponse } from '@/types/api';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .max(150, 'O e-mail deve ter no máximo 150 caracteres.')
    .email('Informe um e-mail válido.'),
  senha: z.string().min(1, 'Informe sua senha.'),
});

type LoginForm = z.infer<typeof loginSchema>;
type LoginLocationState = {
  from?: { pathname: string; search?: string; hash?: string };
  email?: string;
};

export function Entrar() {
  usePageMeta({
    title: 'Entrar — Kelly Academy',
    description:
      'Entre na Kelly Academy e continue seu treino de redação do ENEM.',
    path: '/entrar',
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const state = location.state as LoginLocationState | null;
  const [formError, setFormError] = useState<string>();
  const [emailNaoVerificado, setEmailNaoVerificado] = useState<string>();
  const [emailNaoVerificadoDetail, setEmailNaoVerificadoDetail] =
    useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: state?.email ?? '', senha: '' },
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) =>
      api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(undefined);
    setEmailNaoVerificado(undefined);
    setEmailNaoVerificadoDetail(undefined);
    const email = values.email.trim();
    try {
      const response = await loginMutation.mutateAsync({
        email,
        senha: values.senha,
      });
      login({
        accessToken: response.accessToken,
        expiraEm: response.expiraEm,
        email,
      });
      const from = state?.from;
      const destination = from
        ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
        : '/';
      void navigate(destination, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 403 && error.codigo === 'EMAIL_NAO_VERIFICADO') {
          setEmailNaoVerificado(email);
          setEmailNaoVerificadoDetail(error.detail);
        } else {
          setFormError(error.detail);
        }
      }
    }
  });

  return (
    <AuthLayout variant="login" showMobileIntro={false}>
      <form
        onSubmit={(event) => void onSubmit(event)}
        noValidate
        className="mt-8 flex flex-1 flex-col lg:my-auto lg:w-[420px] lg:flex-none"
      >
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-text text-[36px] leading-[1.08] font-light tracking-[-0.03em] lg:text-[40px]">
            Entrar
          </h1>
          <p className="text-text-2 text-base leading-[1.55]">
            Continue de onde parou.
          </p>
        </div>

        {emailNaoVerificado && (
          <div
            role="alert"
            className="bg-accent-subtle border-accent-subtle-border mt-6 flex flex-col gap-3.5 rounded-[14px] border p-4"
          >
            <div className="flex items-start gap-3">
              <Mail
                className="text-accent-text mt-px shrink-0"
                size={20}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1">
                <p className="text-text text-[15px] font-semibold">
                  Falta confirmar seu e-mail
                </p>
                <p className="text-accent-subtle-text text-sm leading-[1.5]">
                  {emailNaoVerificadoDetail}
                </p>
              </div>
            </div>
            <ReenviarVerificacao
              email={emailNaoVerificado}
              buttonLabel="Reenviar link de confirmação"
              buttonVariant="compact"
              embedded
            />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="text-text-body mb-2 block text-sm font-semibold"
            >
              E-mail
            </label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            <FieldError id="email-error" message={errors.email?.message} />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="text-text-body mb-2 block text-sm font-semibold"
            >
              Senha
            </label>
            <PasswordField
              id="senha"
              registration={register('senha')}
              autoComplete="current-password"
              invalid={Boolean(errors.senha)}
              describedBy={errors.senha ? 'senha-error' : undefined}
            />
            <FieldError id="senha-error" message={errors.senha?.message} />
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3.5 pt-6 lg:mt-5 lg:gap-5 lg:pt-0">
          <FormBanner message={formError} />
          <Button
            type="submit"
            loading={loginMutation.isPending}
            className="h-[52px] w-full text-base"
          >
            {loginMutation.isPending ? 'Entrando…' : 'Entrar'}
          </Button>
          <Link
            to="/criar-conta"
            className="focus-ring bg-control text-text rounded-pill flex h-[52px] items-center justify-center text-base font-semibold lg:hidden"
          >
            Criar conta grátis
          </Link>
          <p className="text-text-2 hidden text-center text-[15px] lg:block">
            Ainda não tem conta?{' '}
            <Link
              to="/criar-conta"
              className="focus-ring text-accent-text hover:text-accent-text-hover rounded-sm font-semibold"
            >
              Criar conta grátis
            </Link>
          </p>
          <span className="text-text-3 text-center text-[13px] lg:hidden">
            3 correções grátis por dia
          </span>
        </div>
      </form>
    </AuthLayout>
  );
}
