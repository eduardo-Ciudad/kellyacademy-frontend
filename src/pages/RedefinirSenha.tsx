import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FieldError } from '@/components/auth/FormFeedback';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordRules } from '@/components/auth/PasswordRules';
import {
  PasswordStatusIcon,
  passwordTitleClass,
} from '@/components/auth/PasswordStatus';
import { ReenviarVerificacao } from '@/components/auth/ReenviarVerificacao';
import { Button } from '@/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { consumeVerificationToken } from '@/lib/emailVerification';
import {
  isPasswordLengthValid,
  passwordByteLength,
  retryMessage,
} from '@/lib/password';
import { clearStoredSession, getStoredSession } from '@/lib/session';
import { usePageMeta } from '@/lib/usePageMeta';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';

type Form = { novaSenha: string; confirmarSenha: string };
type Estado = 'form' | 'sucesso' | 'invalido' | 'email';

export function RedefinirSenha() {
  usePageMeta({ title: 'Redefinir senha — Kelly Academy', noindex: true });
  const [token] = useState(() =>
    consumeVerificationToken(window.location, window.history),
  );
  const [estado, setEstado] = useState<Estado>(token ? 'form' : 'invalido');
  const [fieldError, setFieldError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState('');
  const [mensagemEnvio, setMensagemEnvio] = useState('');
  const submitting = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { register, handleSubmit, watch } = useForm<Form>({
    defaultValues: { novaSenha: '', confirmarSenha: '' },
  });
  const novaSenha = watch('novaSenha');
  const confirmarSenha = watch('confirmarSenha');
  const lengthOk = isPasswordLengthValid(novaSenha);
  const matchOk = Boolean(novaSenha) && novaSenha === confirmarSenha;

  function changeState(next: Estado) {
    setEstado(next);
    requestAnimationFrame(() => titleRef.current?.focus());
  }

  const submit = handleSubmit(async ({ novaSenha: senha }) => {
    if (!token || submitting.current || !lengthOk || !matchOk) return;
    submitting.current = true;
    setPending(true);
    setFieldError(undefined);
    setFormError(undefined);
    try {
      await api<void>('/auth/redefinir-senha', {
        method: 'POST',
        body: JSON.stringify({ token, novaSenha: senha }),
      });
      if (getStoredSession()) clearStoredSession('manual');
      changeState('sucesso');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400 && error.codigo === 'TOKEN_INVALIDO')
          changeState('invalido');
        else if (error.status === 400) setFieldError(error.detail);
        else
          setFormError(
            error.status === 429
              ? retryMessage(error.detail, error.retryAfter)
              : error.detail,
          );
      }
    } finally {
      submitting.current = false;
      setPending(false);
    }
  });

  if (estado === 'sucesso')
    return (
      <StateLayout icon="success" title="Senha alterada" titleRef={titleRef}>
        <p className="text-text-2 text-base leading-[1.55]">
          Por segurança, saímos da sua conta em todos os aparelhos. Entre com a
          senha nova. Enviamos um aviso para o seu e-mail.
        </p>
        <Link
          to="/entrar"
          className="focus-ring bg-accent hover:bg-accent-hover rounded-pill flex h-[52px] items-center justify-center font-semibold text-white"
        >
          Entrar
        </Link>
      </StateLayout>
    );

  if (estado === 'invalido')
    return (
      <StateLayout
        icon="warning"
        title="Este link não vale mais"
        titleRef={titleRef}
      >
        <p className="text-text-2 text-base leading-[1.55]">
          O link de redefinição vale por 30 minutos e só uma vez. Ele pode ter
          expirado, já ter sido usado ou estar incompleto. Peça um novo e use o
          último e-mail que chegar.
        </p>
        <ReenviarVerificacao
          pedirEmail
          endpoint="/auth/esqueci-senha"
          buttonLabel="Enviar novo link"
          buttonVariant="primary"
          onSuccess={(mensagem, email) => {
            setMensagemEnvio(mensagem);
            setEmailEnviado(email);
            changeState('email');
          }}
        />
        <p className="border-border-subtle text-text-3 border-t pt-5 text-sm">
          Lembrou a senha?{' '}
          <Link
            to="/entrar"
            className="focus-ring text-accent-text rounded-sm font-semibold"
          >
            Entrar
          </Link>
        </p>
      </StateLayout>
    );

  if (estado === 'email')
    return (
      <StateLayout icon="mail" title="Confira seu e-mail" titleRef={titleRef}>
        <p className="text-text-2 text-base leading-[1.55]">{mensagemEnvio}</p>
        <p className="text-text-2 text-sm leading-[1.55]">
          Enviado para:{' '}
          <strong className="text-text font-semibold">{emailEnviado}</strong>
        </p>
        <div className="bg-surface border-control text-text-2 rounded-inner border p-4 text-sm leading-6">
          <p>
            O link vale por <strong className="text-text">30 minutos</strong> e
            só pode ser usado uma vez.
          </p>
          <p>Não chegou? Confira a caixa de spam.</p>
        </div>
        <ReenviarVerificacao
          email={emailEnviado}
          endpoint="/auth/esqueci-senha"
          initialSeconds={60}
          embedded
        />
        <Link
          to="/entrar"
          className="focus-ring bg-control text-text rounded-pill flex h-[52px] items-center justify-center font-semibold"
        >
          Voltar para o login
        </Link>
      </StateLayout>
    );

  return (
    <AuthLayout variant="login" showMobileIntro={false}>
      <section className="my-auto flex w-full flex-col gap-7 lg:w-[420px]">
        <PasswordStatusIcon type="lock" />
        <div className="flex flex-col gap-3.5">
          <h1 className={passwordTitleClass}>Crie uma senha nova</h1>
          <p className="text-text-2 text-base leading-[1.55]">
            Depois de salvar, encerramos as sessões abertas em todos os
            aparelhos.
          </p>
        </div>
        <form
          onSubmit={(event) => void submit(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <PasswordInput
            id="nova-senha"
            label="Nova senha"
            registration={register('novaSenha')}
            error={fieldError}
          />
          <PasswordInput
            id="confirmar-senha"
            label="Confirmar nova senha"
            registration={register('confirmarSenha')}
          />
          <PasswordRules lengthOk={lengthOk} matchOk={matchOk} />
          {passwordByteLength(novaSenha) > 72 && (
            <p
              id="nova-senha-client-error"
              role="alert"
              className="text-danger text-sm"
            >
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
            loading={pending}
            disabled={!lengthOk || !matchOk}
            className="h-[52px] w-full text-base"
          >
            {pending ? 'Salvando…' : 'Salvar nova senha'}
          </Button>
        </form>
      </section>
    </AuthLayout>
  );
}

function PasswordInput({
  id,
  label,
  registration,
  error,
}: {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
}) {
  const errorId = error ? `${id}-error` : undefined;
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
        autoComplete="new-password"
        invalid={Boolean(error)}
        describedBy={errorId}
      />
      <FieldError id={errorId ?? `${id}-error`} message={error} />
    </div>
  );
}

function StateLayout({
  icon,
  title,
  titleRef,
  children,
}: {
  icon: 'success' | 'warning' | 'mail';
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  children: React.ReactNode;
}) {
  return (
    <AuthLayout variant="login" showMobileIntro={false}>
      <section className="my-auto flex w-full flex-col gap-7 lg:w-[420px]">
        <PasswordStatusIcon type={icon} />
        <div className="flex flex-col gap-3.5">
          <h1 ref={titleRef} tabIndex={-1} className={passwordTitleClass}>
            {title}
          </h1>
        </div>
        {children}
      </section>
    </AuthLayout>
  );
}
