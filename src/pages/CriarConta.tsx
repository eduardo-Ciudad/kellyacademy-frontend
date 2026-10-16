import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, type FieldPath } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FieldError, FormBanner } from '@/components/auth/FormFeedback';
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { usePageMeta } from '@/lib/usePageMeta';
import type { CadastroRequest, LoginResponse } from '@/types/api';

const cadastroSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'Informe seu nome.')
    .max(150, 'O nome deve ter no máximo 150 caracteres.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .max(150, 'O e-mail deve ter no máximo 150 caracteres.')
    .email('Informe um e-mail válido.'),
  senha: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .max(72, 'A senha deve ter no máximo 72 caracteres.'),
});

type CadastroForm = z.infer<typeof cadastroSchema>;
const fieldNames: FieldPath<CadastroForm>[] = ['nome', 'email', 'senha'];

function firstMessage(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function CriarConta() {
  usePageMeta({
    title: 'Criar conta grátis — Kelly Academy',
    description:
      'Crie sua conta grátis na Kelly Academy e treine redação para o ENEM com correção por IA.',
    path: '/criar-conta',
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { nome: '', email: '', senha: '' },
  });

  const cadastroMutation = useMutation({
    mutationFn: (payload: CadastroRequest) =>
      api<void>('/auth/cadastro', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(undefined);
    const payload = {
      nome: values.nome.trim(),
      email: values.email.trim(),
      senha: values.senha,
    };

    try {
      await cadastroMutation.mutateAsync(payload);
    } catch (error) {
      if (!(error instanceof ApiError)) return;
      if (error.status === 400 && error.erros) {
        fieldNames.forEach((field) => {
          const message = error.erros?.[field];
          if (message)
            setError(field, { type: 'server', message: firstMessage(message) });
        });
        return;
      }
      if (error.status === 409) {
        setError('email', {
          type: 'server',
          message: 'Este e-mail já tem uma conta.',
        });
        return;
      }
      setFormError(error.detail);
      return;
    }

    try {
      const response = await api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: payload.email, senha: payload.senha }),
      });
      login(
        {
          accessToken: response.accessToken,
          expiraEm: response.expiraEm,
          email: payload.email,
        },
        payload.nome,
      );
      void navigate('/', { replace: true });
    } catch {
      toast.success('Conta criada. Entre para continuar.');
      void navigate('/entrar', {
        replace: true,
        state: { email: payload.email },
      });
    }
  });

  return (
    <AuthLayout variant="cadastro">
      <form
        onSubmit={(event) => void onSubmit(event)}
        noValidate
        className="mt-6 flex flex-1 flex-col lg:my-auto lg:w-[400px] lg:flex-none"
      >
        <div className="hidden flex-col gap-2 lg:flex">
          <h1 className="text-text text-[32px] font-normal tracking-[-0.02em]">
            Crie sua conta
          </h1>
          <p className="text-text-2 text-base leading-[1.5]">
            Grátis, com 3 correções por dia.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:mt-[18px] lg:gap-[18px]">
          <div>
            <label
              htmlFor="nome"
              className="text-text-body mb-2 block text-sm font-semibold"
            >
              Nome
            </label>
            <Input
              {...register('nome')}
              id="nome"
              autoComplete="name"
              placeholder="Como podemos chamar você?"
              invalid={Boolean(errors.nome)}
              aria-describedby={errors.nome ? 'nome-error' : undefined}
            />
            <FieldError id="nome-error" message={errors.nome?.message} />
          </div>
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
              aria-describedby={
                errors.email ? 'cadastro-email-error' : undefined
              }
            />
            {errors.email?.type === 'server' &&
            errors.email.message === 'Este e-mail já tem uma conta.' ? (
              <p
                id="cadastro-email-error"
                role="alert"
                className="text-danger mt-1.5 text-[13px]"
              >
                Este e-mail já tem uma conta.{' '}
                <Link
                  to="/entrar"
                  className="focus-ring text-danger rounded-sm font-semibold underline"
                >
                  Entrar
                </Link>
              </p>
            ) : (
              <FieldError
                id="cadastro-email-error"
                message={errors.email?.message}
              />
            )}
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
              autoComplete="new-password"
              invalid={Boolean(errors.senha)}
              describedBy={errors.senha ? 'cadastro-senha-error' : 'senha-dica'}
              placeholder="Crie uma senha segura"
            />
            <FieldError
              id="cadastro-senha-error"
              message={errors.senha?.message}
            />
            {!errors.senha && (
              <span
                id="senha-dica"
                className="text-text-3 mt-1.5 block text-[13px]"
              >
                Entre 8 e 72 caracteres.
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3.5 pt-5 lg:mt-1 lg:gap-[18px] lg:pt-0">
          <FormBanner message={formError} />
          <Button
            type="submit"
            loading={isSubmitting}
            className="h-[52px] w-full text-base"
          >
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </Button>
          <Link
            to="/entrar"
            className="focus-ring bg-control text-text rounded-pill flex h-[52px] items-center justify-center text-base font-semibold lg:hidden"
          >
            Entrar
          </Link>
          <p className="text-text-2 hidden text-center text-[15px] lg:block">
            Já tem conta?{' '}
            <Link
              to="/entrar"
              className="focus-ring text-accent-text hover:text-accent-text-hover rounded-sm font-semibold"
            >
              Entrar
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
