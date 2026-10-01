import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Check,
  Info,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { SparkIcon } from '@/components/ui/SparkIcon';
import { EtapasCorrecao } from '@/components/redacao/EtapasCorrecao';
import { LimiteDiarioDialog } from '@/components/redacao/LimiteDiarioDialog';
import { TemaInfo } from '@/components/redacao/TemaInfo';
import { TemaInfoSheet } from '@/components/redacao/TemaInfoSheet';
import {
  marcarLimiteAtingido,
  useCorrecoesHoje,
} from '@/hooks/useCorrecoesHoje';
import { carregarRascunho, useRascunho } from '@/hooks/useRascunho';
import { redacoesQueryKey } from '@/hooks/useRedacoes';
import { useTemas } from '@/hooks/useTemas';
import { useUsuario } from '@/hooks/useUsuario';
import { api, ApiError } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type { RedacaoResponse, TipoRedacao } from '@/types/api';

type EditorMode = 'editing' | 'submitting';
type EditorBanner = {
  kind: 'danger' | 'warning';
  message: string;
  linkTo?: string;
  linkLabel?: string;
  retry?: boolean;
};

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function firstMessage(value?: string | string[]) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export function Editor() {
  const { temaId = '' } = useParams();
  const navigate = useNavigate();
  const { email } = useUsuario();
  const temasQuery = useTemas();
  const tema = temasQuery.data?.find((item) => item.id === temaId);
  const initialDraftRef = useRef(carregarRascunho(email, temaId));
  const [texto, setTexto] = useState(initialDraftRef.current?.texto ?? '');
  const [tipo, setTipo] = useState<TipoRedacao>(
    initialDraftRef.current?.tipo ?? 'PRATICA',
  );
  const [mode, setMode] = useState<EditorMode>('editing');
  const [banner, setBanner] = useState<EditorBanner>();
  const [infoOpen, setInfoOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [limitData, setLimitData] = useState({ limite: 3, retryAfter: 0 });
  const sendingRef = useRef(false);
  const allowNavigationRef = useRef(false);
  const { atingido } = useCorrecoesHoje();
  const rascunho = useRascunho({ email, temaId, texto, tipo });
  const words = countWords(texto);
  const characters = texto.length;
  const empty = !texto.trim();
  const overLimit = characters > 5000;
  const submitReason = empty
    ? 'Escreva sua redação antes de enviar.'
    : overLimit
      ? 'Reduza o texto para no máximo 5.000 caracteres.'
      : null;

  const blocker = useBlocker(
    () => sendingRef.current && !allowNavigationRef.current,
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      toast.info('Aguarde a correção terminar antes de sair.');
      blocker.reset();
    }
  }, [blocker]);

  useEffect(() => {
    if (mode !== 'submitting') return;
    const preventUnload = (event: BeforeUnloadEvent) => {
      rascunho.salvarAgora();
      event.preventDefault();
    };
    window.addEventListener('beforeunload', preventUnload);
    return () => window.removeEventListener('beforeunload', preventUnload);
  }, [mode, rascunho]);

  async function submitRedacao() {
    if (!tema || empty || overLimit || sendingRef.current) return;
    sendingRef.current = true;
    allowNavigationRef.current = false;
    rascunho.salvarAgora();
    setBanner(undefined);
    setMode('submitting');

    try {
      const response = await api<RedacaoResponse>('/redacoes', {
        method: 'POST',
        body: JSON.stringify({ temaId: tema.id, tipo, texto }),
      });
      queryClient.setQueryData(['redacoes', response.id], response);
      rascunho.apagar();
      void queryClient.invalidateQueries({ queryKey: redacoesQueryKey });
      allowNavigationRef.current = true;
      sendingRef.current = false;
      void navigate(`/redacoes/${response.id}`, { replace: true });
      return;
    } catch (error) {
      if (!(error instanceof ApiError)) return;
      if (error.status === 401) {
        allowNavigationRef.current = true;
        return;
      }
      if (error.status === 429) {
        const retryAfter = error.retryAfter ?? 0;
        marcarLimiteAtingido(retryAfter);
        setLimitData({ limite: error.limite ?? 3, retryAfter });
        setLimitOpen(true);
      } else if (error.status === 502) {
        setBanner({ kind: 'danger', message: error.detail, retry: true });
      } else if (error.status === 400) {
        const textoError = firstMessage(error.erros?.texto);
        setBanner({
          kind: 'danger',
          message: [error.detail, textoError].filter(Boolean).join(' '),
        });
      } else if (error.status === 404) {
        setBanner({
          kind: 'danger',
          message: 'Este tema não está mais disponível',
          linkTo: '/temas',
          linkLabel: 'Escolher outro tema',
        });
      } else if (error.code === 'TIMEOUT') {
        setBanner({
          kind: 'warning',
          message:
            'A correção está demorando mais que o normal. Seu texto está salvo. Confira o histórico em instantes.',
          linkTo: '/',
          linkLabel: 'Ver histórico',
        });
        void queryClient.invalidateQueries({ queryKey: redacoesQueryKey });
      } else if (error.code === 'NETWORK') {
        setBanner({
          kind: 'danger',
          message: 'Sem conexão com o servidor. Seu texto está salvo.',
        });
      } else {
        setBanner({ kind: 'danger', message: error.detail });
      }
    } finally {
      sendingRef.current = false;
      setMode('editing');
    }
  }

  if (temasQuery.isLoading) {
    return (
      <main className="bg-bg flex min-h-screen items-center justify-center">
        <span className="text-text-2">Carregando tema…</span>
      </main>
    );
  }

  if (!tema) {
    return (
      <main className="bg-bg flex min-h-screen items-center justify-center px-5 text-center">
        <div>
          <h1 className="text-text text-[28px] font-bold">
            Tema não encontrado
          </h1>
          <Link
            to="/temas"
            className="text-accent-text mt-4 inline-block font-semibold"
          >
            Voltar para temas
          </Link>
        </div>
      </main>
    );
  }

  if (mode === 'submitting') return <EtapasCorrecao tema={tema} />;

  return (
    <main className="bg-bg flex h-[100svh] flex-col overflow-hidden">
      <header className="border-border-subtle flex shrink-0 items-center gap-3 border-b px-4 py-3 lg:h-[68px] lg:px-8 lg:py-0">
        <Link
          to="/temas"
          aria-label="Voltar para temas"
          className="focus-ring bg-surface flex size-11 shrink-0 items-center justify-center rounded-full lg:size-10"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1 leading-[1.25]">
          <span className="text-text-3 block text-xs font-semibold">
            {tema.origem === 'AUTORAL'
              ? 'Autoral'
              : tema.ano !== null
                ? `ENEM ${tema.ano}`
                : 'ENEM'}
            <span className="lg:hidden">
              {' '}
              · {tipo === 'PRATICA' ? 'Prática' : 'Diagnóstica'}
            </span>
          </span>
          <span className="text-text block truncate text-[15px] font-semibold lg:text-base">
            {tema.titulo}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          aria-label="Ver proposta"
          className="focus-ring bg-surface flex size-11 shrink-0 items-center justify-center rounded-full lg:hidden"
        >
          <Info size={20} />
        </button>
        {rascunho.salvo && (
          <span className="text-text-3 ml-auto hidden items-center gap-1.5 text-[13px] lg:flex">
            <Check className="text-success" size={15} />
            Rascunho salvo neste navegador
          </span>
        )}
        <Button
          onClick={() => void submitRedacao()}
          disabled={Boolean(submitReason)}
          className="hidden lg:flex"
        >
          <SparkIcon size={16} double={false} />
          Enviar para correção
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6 lg:px-8 lg:py-6">
        <section className="flex min-h-0 flex-1 flex-col lg:gap-4">
          <div className="border-border-subtle flex items-center justify-between border-b px-4 py-2 lg:border-0 lg:p-0">
            <div
              role="radiogroup"
              aria-label="Tipo de redação"
              className="bg-surface rounded-pill flex p-1"
            >
              {(['PRATICA', 'DIAGNOSTICA'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={tipo === option}
                  onClick={() => setTipo(option)}
                  className={`focus-ring rounded-pill px-4 py-2 text-sm font-semibold ${tipo === option ? 'bg-control text-white' : 'text-text-2'}`}
                >
                  {option === 'PRATICA' ? 'Prática' : 'Diagnóstica'}
                </button>
              ))}
            </div>
            <span className="text-text-3 hidden text-[13px] lg:block">
              Prática é para treinar. Diagnóstica mede seu nível atual.
            </span>
          </div>

          {banner && (
            <EditorAlert banner={banner} onRetry={() => void submitRedacao()} />
          )}

          <div className="bg-surface lg:rounded-card flex min-h-0 flex-1 flex-col">
            <label htmlFor="texto" className="sr-only">
              Texto da redação
            </label>
            <textarea
              id="texto"
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              className="text-text min-h-0 flex-1 resize-none border-0 bg-transparent p-5 text-base leading-[1.8] outline-none lg:px-10 lg:py-8 lg:text-[17px] lg:leading-[1.85]"
              placeholder="Comece a escrever sua redação…"
            />
            <div className="border-control text-text-2 tabular flex shrink-0 flex-col gap-2 border-t px-4 py-3 text-[13px] lg:flex-row lg:items-center lg:gap-5 lg:px-6 lg:py-3.5">
              <div className="flex items-center justify-between lg:contents">
                <span>
                  <strong className="text-text">{words}</strong> palavras
                  <span className="lg:hidden">
                    {' '}
                    · <strong className="text-text">{characters}</strong>/5.000
                  </span>
                </span>
                <span className="text-text-3 flex items-center gap-1.5 lg:hidden">
                  {rascunho.salvo && (
                    <>
                      <Check className="text-success" size={14} />
                      Rascunho salvo
                    </>
                  )}
                </span>
                <span className="hidden lg:inline">
                  <strong className={overLimit ? 'text-danger' : 'text-text'}>
                    {characters}
                  </strong>{' '}
                  / 5.000 caracteres
                </span>
              </div>
              <div className="bg-control hidden h-1 max-w-[220px] flex-1 overflow-hidden rounded-sm lg:block">
                <div
                  className={
                    overLimit ? 'bg-danger h-full' : 'bg-accent h-full'
                  }
                  style={{
                    width: `${Math.min((characters / 5000) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="text-text-3 ml-auto hidden lg:inline">
                Na folha oficial do ENEM, o limite é de 30 linhas
              </span>
            </div>
          </div>

          <div className="border-border-subtle flex shrink-0 flex-col gap-2.5 border-t px-4 pt-3 pb-5 lg:border-0 lg:p-0">
            {words < 80 && (
              <div className="bg-warning-bg rounded-input flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#E8D9B0]">
                <AlertTriangle className="text-warning shrink-0" size={15} />
                Faltam {80 - words} palavras para o mínimo de 80
              </div>
            )}
            {atingido && (
              <p className="text-warning text-center text-xs">
                Você já usou 3 correções hoje. O backend confirmará a
                disponibilidade ao enviar.
              </p>
            )}
            {submitReason && (
              <p role="alert" className="text-danger text-center text-xs">
                {submitReason}
              </p>
            )}
            <Button
              onClick={() => void submitRedacao()}
              disabled={Boolean(submitReason)}
              className="h-[52px] w-full text-base lg:hidden"
            >
              <SparkIcon size={17} double={false} />
              Enviar para correção
            </Button>
          </div>
        </section>

        <aside className="hidden overflow-y-auto lg:block">
          <TemaInfo tema={tema} />
        </aside>
      </div>

      <TemaInfoSheet tema={tema} open={infoOpen} onOpenChange={setInfoOpen} />
      <LimiteDiarioDialog
        open={limitOpen}
        onOpenChange={setLimitOpen}
        limite={limitData.limite}
        retryAfter={limitData.retryAfter}
      />
    </main>
  );
}

function EditorAlert({
  banner,
  onRetry,
}: {
  banner: EditorBanner;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className={`rounded-inner mx-4 flex items-start gap-3 px-4 py-3 text-sm lg:mx-0 ${banner.kind === 'danger' ? 'bg-danger-bg text-danger' : 'bg-warning-bg text-[#E8D9B0]'}`}
    >
      <AlertCircle className="mt-0.5 shrink-0" size={17} />
      <span className="flex-1 leading-5">
        {banner.message}{' '}
        {banner.linkTo && (
          <Link to={banner.linkTo} className="font-semibold underline">
            {banner.linkLabel}
          </Link>
        )}
      </span>
      {banner.retry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 font-semibold underline"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
