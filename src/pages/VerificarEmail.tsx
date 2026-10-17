import { useEffect, useRef, useState } from 'react';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ReenviarVerificacao } from '@/components/auth/ReenviarVerificacao';
import { Button } from '@/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { consumeVerificationToken } from '@/lib/emailVerification';
import { usePageMeta } from '@/lib/usePageMeta';

type Estado = 'carregando' | 'sucesso' | 'invalido' | 'limite' | 'erro';

const titleClass =
  'font-display text-text text-[36px] leading-[1.08] font-light tracking-[-0.03em] lg:text-[40px]';

function StatusIcon({ type }: { type: 'success' | 'warning' }) {
  const success = type === 'success';
  return (
    <div
      className={
        success
          ? 'bg-success-subtle border-success-subtle-border flex size-16 items-center justify-center rounded-2xl border'
          : 'bg-warning-subtle border-warning-subtle-border flex size-16 items-center justify-center rounded-2xl border'
      }
    >
      {success ? (
        <CircleCheck
          className="text-success"
          size={30}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ) : (
        <TriangleAlert
          className="text-warning"
          size={30}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export function VerificarEmail() {
  const [token] = useState(() =>
    consumeVerificationToken(window.location, window.history),
  );
  usePageMeta({ title: 'Confirmar e-mail — Kelly Academy', noindex: true });
  const enviadoRef = useRef(false);
  const [estado, setEstado] = useState<Estado>(
    token ? 'carregando' : 'invalido',
  );
  const [podeTentarNovamente, setPodeTentarNovamente] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!token || enviadoRef.current) return;
    enviadoRef.current = true;
    setEstado('carregando');
    setPodeTentarNovamente(false);

    void api<void>('/auth/verificar-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then(() => setEstado('sucesso'))
      .catch((error: unknown) => {
        if (error instanceof ApiError) {
          if (error.status === 400 && error.codigo === 'TOKEN_INVALIDO')
            return setEstado('invalido');
          if (error.status === 429) return setEstado('limite');
          setPodeTentarNovamente(error.status === 0);
        } else {
          setPodeTentarNovamente(error instanceof TypeError);
        }
        setEstado('erro');
      });
  }, [tentativa, token]);

  const tentarNovamente = () => {
    enviadoRef.current = false;
    setTentativa((valor) => valor + 1);
  };

  return (
    <AuthLayout variant="login" showMobileIntro={false}>
      <section className="my-auto flex w-full flex-col gap-7 lg:w-[420px]">
        {estado === 'carregando' && (
          <div
            role="status"
            aria-live="polite"
            className="text-text flex flex-col items-center gap-7 text-center"
          >
            <span
              className="border-control border-t-accent size-14 animate-spin rounded-full border-4"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-[32px] leading-[1.1] font-light tracking-[-0.03em] lg:text-[36px]">
                Confirmando seu e-mail…
              </h1>
              <p className="text-text-2 text-base leading-[1.55]">
                Só um instante. Não feche esta página.
              </p>
            </div>
          </div>
        )}

        {estado === 'sucesso' && (
          <>
            <StatusIcon type="success" />
            <div className="flex flex-col gap-3.5">
              <h1 className={titleClass}>E-mail confirmado</h1>
              <p className="text-text-2 text-base leading-[1.55]">
                Sua conta está ativa. Entre e envie sua primeira redação para
                descobrir onde ela perde pontos.
              </p>
            </div>
            <Link
              to="/entrar"
              className="focus-ring bg-accent hover:bg-accent-hover rounded-pill flex h-[52px] items-center justify-center text-base font-semibold text-white transition-colors"
            >
              Entrar na Kelly Academy
            </Link>
            <p className="border-border-subtle text-text-3 border-t pt-5 text-[13px] leading-[1.5]">
              <span className="lg:hidden">
                O link usado já não vale mais. Se precisar, é só entrar com seu
                e-mail e senha.
              </span>
              <span className="hidden lg:inline">
                O link usado já não vale mais. Daqui em diante, é só entrar com
                seu e-mail e senha.
              </span>
            </p>
          </>
        )}

        {estado === 'invalido' && (
          <>
            <StatusIcon type="warning" />
            <div className="flex flex-col gap-3.5">
              <h1 className={titleClass}>Este link não vale mais</h1>
              <p className="text-text-2 text-base leading-[1.55]">
                Ele pode ter expirado, já ter sido usado ou estar incompleto.
                Peça um novo link e use o último e-mail que chegar.
              </p>
            </div>
            <ReenviarVerificacao
              pedirEmail
              buttonLabel="Enviar novo link"
              buttonVariant="primary"
            />
            <p className="border-border-subtle text-text-3 border-t pt-5 text-sm">
              Já confirmou antes?{' '}
              <Link
                to="/entrar"
                className="focus-ring text-accent-text hover:text-accent-text-hover rounded-sm font-medium"
              >
                Entrar
              </Link>
            </p>
          </>
        )}

        {estado === 'limite' && (
          <>
            <StatusIcon type="warning" />
            <div className="flex flex-col gap-3.5">
              <h1 className={titleClass}>Muitas tentativas</h1>
              <p className="text-text-2 text-base leading-[1.55]">
                Muitas tentativas, tente novamente em alguns minutos.
              </p>
            </div>
          </>
        )}

        {estado === 'erro' && (
          <>
            <StatusIcon type="warning" />
            <div className="flex flex-col gap-3.5">
              <h1 className={titleClass}>Não foi possível confirmar</h1>
              <p className="text-text-2 text-base leading-[1.55]">
                Tivemos um problema ao confirmar seu e-mail. Tente novamente em
                instantes.
              </p>
            </div>
            {podeTentarNovamente && (
              <Button
                type="button"
                onClick={tentarNovamente}
                className="h-[52px] w-full text-base"
              >
                Tentar de novo
              </Button>
            )}
          </>
        )}
      </section>
    </AuthLayout>
  );
}
