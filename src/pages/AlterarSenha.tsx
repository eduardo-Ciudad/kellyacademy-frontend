import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { CircleCheck } from 'lucide-react';
import { FieldError } from '@/components/auth/FormFeedback';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { Button } from '@/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  isPasswordLengthValid,
  passwordByteLength,
  retryMessage,
} from '@/lib/password';
import { usePageMeta } from '@/lib/usePageMeta';
import type { AlterarSenhaResponse } from '@/types/api';

type Form = { senhaAtual: string; novaSenha: string; confirmarSenha: string };

export function AlterarSenha() {
  usePageMeta({ title: 'Alterar senha — Kelly Academy', noindex: true });
  const { login, session } = useAuth();
  const [currentError, setCurrentError] = useState<string>();
  const [newError, setNewError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const submitting = useRef(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<Form>({
    defaultValues: { senhaAtual: '', novaSenha: '', confirmarSenha: '' },
  });
  const novaSenha = watch('novaSenha');
  const confirmarSenha = watch('confirmarSenha');
  const lengthOk = isPasswordLengthValid(novaSenha);
  const matchOk = Boolean(novaSenha) && novaSenha === confirmarSenha;

  const submit = handleSubmit(async ({ senhaAtual, novaSenha: senha }) => {
    if (!session || submitting.current || !lengthOk || !matchOk) return;
    submitting.current = true;
    setCurrentError(undefined);
    setNewError(undefined);
    setFormError(undefined);
    setSuccess(false);
    try {
      const response = await api<AlterarSenhaResponse>('/usuarios/me/senha', {
        method: 'PUT',
        body: JSON.stringify({ senhaAtual, novaSenha: senha }),
      });
      login({
        accessToken: response.accessToken,
        expiraEm: response.expiraEm,
        email: session.email,
      });
      reset();
      setSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400 && error.codigo === 'SENHA_ATUAL_INCORRETA')
          setCurrentError('Senha atual incorreta.');
        else if (error.status === 400) setNewError(error.detail);
        else
          setFormError(
            error.status === 429
              ? retryMessage(error.detail, error.retryAfter)
              : error.detail,
          );
      }
    } finally {
      submitting.current = false;
    }
  });

  return (
    <div className="px-6 py-8 lg:px-0 lg:py-12">
      <section className="bg-surface border-control rounded-card mx-auto max-w-[480px] border p-6 lg:p-8">
        <h1 className="font-display text-text text-[32px] leading-tight font-light tracking-[-0.03em]">
          Alterar senha
        </h1>
        <p className="text-text-2 mt-3 text-[15px] leading-6">
          Você continua conectado neste aparelho. Nos outros, será preciso
          entrar de novo.
        </p>
        {success && (
          <div
            role="status"
            className="bg-success-subtle border-success-subtle-border text-success-subtle-text rounded-inner mt-6 flex gap-3 border p-4 text-sm"
          >
            <CircleCheck
              className="text-success shrink-0"
              size={20}
              aria-hidden="true"
            />
            Senha alterada. Os outros aparelhos foram desconectados.
          </div>
        )}
        <form
          onSubmit={(event) => void submit(event)}
          className="mt-7 flex flex-col gap-4"
          noValidate
        >
          <Field
            id="senha-atual"
            label="Senha atual"
            registration={register('senhaAtual')}
            autoComplete="current-password"
            error={currentError}
          />
          <Field
            id="nova-senha"
            label="Nova senha"
            registration={register('novaSenha')}
            autoComplete="new-password"
            error={newError}
          />
          <Field
            id="confirmar-senha"
            label="Confirmar nova senha"
            registration={register('confirmarSenha')}
            autoComplete="new-password"
          />
          <PasswordRules lengthOk={lengthOk} matchOk={matchOk} />
          {passwordByteLength(novaSenha) > 72 && (
            <p role="alert" className="text-danger text-sm">
              A senha pode ter no máximo 72 bytes em UTF-8.
            </p>
          )}
          {formError && (
            <p role="alert" className="text-danger text-sm leading-5">
              {formError}
            </p>
          )}
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!lengthOk || !matchOk}
            className="mt-1 h-[52px] w-full text-base"
          >
            {isSubmitting ? 'Salvando…' : 'Salvar nova senha'}
          </Button>
        </form>
        <Link
          to="/esqueci-senha"
          className="focus-ring text-accent-text hover:text-accent-text-hover mt-5 flex min-h-11 items-center justify-center rounded-sm text-center text-sm font-semibold"
        >
          Não lembra a senha atual? Redefinir pelo e-mail
        </Link>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  registration,
  autoComplete,
  error,
}: {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  autoComplete: 'current-password' | 'new-password';
  error?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="text-text-body mb-2 block text-sm font-semibold"
      >
        {label}
      </label>
      <PasswordField
        id={id}
        registration={registration}
        autoComplete={autoComplete}
        invalid={Boolean(error)}
        describedBy={error ? errorId : undefined}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
