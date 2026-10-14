import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FieldError, FormBanner } from '@/components/auth/FormFeedback';
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
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
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const state = location.state as LoginLocationState | null;
  const [formError, setFormError] = useState<string>();
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
      if (error instanceof ApiError) setFormError(error.detail);
    }
  });

  return (
    <AuthLayout variant="login">
      <form
        onSubmit={(event) => void onSubmit(event)}
        noValidate
        className="mt-8 flex flex-1 flex-col lg:my-auto lg:w-[400px] lg:flex-none"
      >
        <div className="hidden flex-col gap-2 lg:flex">
        <h1 className="text-text text-[32px] font-normal tracking-[-0.02em]">
            Entre na sua conta
          </h1>
          <p className="text-text-2 text-base leading-[1.5]">
            Continue treinando de onde parou.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:mt-5 lg:gap-5">
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
