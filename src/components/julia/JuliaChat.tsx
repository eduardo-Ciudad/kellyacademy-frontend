import * as Dialog from '@radix-ui/react-dialog';
import { AlertCircle, FileText, Send, X } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { JuliaMarca } from '@/components/julia/JuliaMarca';
import {
  useEnviarPerguntaJulia,
  useJuliaConversa,
} from '@/hooks/useJuliaConversa';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { competencias } from '@/lib/competencias';
import {
  formatarRespostaJulia,
  limiteAtingido,
  mensagemDeErroJulia,
  sugestoesIniciais,
  textoRestantes,
  tipoErroJulia,
} from '@/lib/julia';
import { cn } from '@/lib/utils';
import type { Avaliacao, Competencia, RedacaoResponse } from '@/types/api';

const competenceStyles = {
  1: { text: 'text-c1', bg: 'bg-c1-bg' },
  2: { text: 'text-c2', bg: 'bg-c2-bg' },
  3: { text: 'text-c3', bg: 'bg-c3-bg' },
  4: { text: 'text-c4', bg: 'bg-c4-bg' },
  5: { text: 'text-c5', bg: 'bg-c5-bg' },
} as const;

export type FocoJulia = { competencia: Competencia; pergunta: string } | null;

export function JuliaChat({
  redacao,
  avaliacao,
  aberto,
  foco,
  onFechar,
}: {
  redacao: RedacaoResponse;
  avaliacao: Avaliacao;
  aberto: boolean;
  foco: FocoJulia;
  onFechar: () => void;
}) {
  const desktop = useMediaQuery('(min-width: 60rem)');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const [pergunta, setPergunta] = useState('');
  const [perguntaPendente, setPerguntaPendente] = useState<string | null>(null);
  const conversa = useJuliaConversa(redacao.id, aberto);
  const enviar = useEnviarPerguntaJulia(redacao.id);
  const resetarEnvio = enviar.reset;

  useEffect(() => {
    resetarEnvio();
    if (!aberto) return;
    if (foco) setPergunta(foco.pergunta);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [aberto, foco, resetarEnvio]);

  useEffect(() => {
    finalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [conversa.data?.mensagens.length, enviar.isPending, enviar.error]);

  useEffect(() => {
    const campo = inputRef.current;
    if (!campo) return;
    campo.style.height = 'auto';
    campo.style.height = `${Math.min(campo.scrollHeight, 104)}px`;
  }, [pergunta]);

  const erro = enviar.error ?? conversa.error;
  const tipoErro = tipoErroJulia(erro);
  const limiteAntecipado = limiteAtingido(conversa.data);
  const limite = tipoErro === 'limite' || limiteAntecipado !== null;
  const plano = tipoErro === 'plano';
  const semCorrecao = tipoErro === 'semCorrecao';
  const indisponivel = tipoErro === 'indisponivel';
  const mensagemLimite = limiteAntecipado
    ? limiteAntecipado === 'conversa'
      ? 'Você usou as 10 perguntas desta conversa.'
      : 'Você chegou ao limite de perguntas à Júlia hoje. Volte amanhã.'
    : mensagemDeErroJulia(erro);

  async function enviarPergunta(valor = pergunta) {
    const limpa = valor.trim();
    if (!limpa || limpa.length > 500 || enviar.isPending || limite) return;
    setPerguntaPendente(limpa);
    try {
      await enviar.mutateAsync(limpa);
      setPergunta('');
      setPerguntaPendente(null);
    } catch {
      setPergunta(limpa);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void enviarPergunta();
    }
  }

  const conteudo = (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-border-subtle flex shrink-0 items-center gap-3 border-b px-4 py-3.5">
        <JuliaMarca variante="principal" tamanho={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold">Júlia</span>
            <span className="bg-accent-tint text-accent-text-hover rounded-pill px-2 py-0.5 text-[11px] font-semibold">
              Assistente IA
            </span>
          </div>
          <p className="text-text-3 mt-0.5 text-[12.5px]">
            Explica a correção desta redação
          </p>
        </div>
        <button
          type="button"
          onClick={onFechar}
          className="focus-ring hover:bg-control flex size-11 shrink-0 items-center justify-center rounded-full"
          aria-label="Fechar conversa"
        >
          <X size={19} />
        </button>
      </header>

      <Contexto redacao={redacao} avaliacao={avaliacao} foco={foco} />

      <div
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {plano ? (
          <EstadoBloqueado texto={mensagemDeErroJulia(erro)}>
            <Link className="text-accent-text font-semibold" to="/planos">
              Conhecer o plano Pro
            </Link>
          </EstadoBloqueado>
        ) : semCorrecao ? (
          <EstadoBloqueado texto={mensagemDeErroJulia(erro)} />
        ) : (
          <>
            <Bolha papel="JULIA">
              Olá, eu sou a Júlia, assistente virtual da Kelly Academy. Em que
              posso ajudar você?
            </Bolha>
            {(conversa.data?.mensagens ?? []).map((mensagem) => (
              <Bolha
                key={mensagem.id}
                papel={mensagem.papel}
                formatada={mensagem.papel === 'JULIA'}
              >
                {mensagem.conteudo}
              </Bolha>
            ))}
            {!conversa.isLoading &&
              (conversa.data?.mensagens.length ?? 0) === 0 &&
              !enviar.isPending &&
              !erro && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {sugestoesIniciais(avaliacao).map((sugestao) => (
                    <button
                      type="button"
                      key={sugestao}
                      onClick={() => void enviarPergunta(sugestao)}
                      disabled={limite}
                      className="focus-ring border-control hover:bg-surface-2 rounded-pill min-h-11 border px-3.5 py-2 text-left text-[13px] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sugestao}
                    </button>
                  ))}
                </div>
              )}
            {enviar.isPending && perguntaPendente && (
              <>
                <Bolha papel="USUARIO">{perguntaPendente}</Bolha>
                <div className="bg-surface-2 text-text-body mr-auto flex max-w-[88%] items-center gap-2 rounded-[16px_16px_16px_4px] px-4 py-3 text-[14.5px]">
                  Lendo sua correção…
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2].map((item) => (
                      <span
                        key={item}
                        className="bg-text-3 size-1 animate-pulse rounded-full motion-reduce:animate-none"
                        style={{ animationDelay: `${item * 160}ms` }}
                      />
                    ))}
                  </span>
                </div>
              </>
            )}
            {indisponivel && (
              <div className="bg-danger-banner text-danger-text rounded-inner flex gap-2.5 p-3.5 text-sm leading-5">
                <AlertCircle
                  className="text-danger mt-0.5 shrink-0"
                  size={18}
                />
                <div>
                  <p>{mensagemDeErroJulia(erro)}</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (perguntaPendente)
                        void enviarPergunta(perguntaPendente);
                      else void conversa.refetch();
                    }}
                    className="text-danger mt-2 font-semibold"
                  >
                    Tentar de novo
                  </button>
                </div>
              </div>
            )}
            {limite && (
              <div className="bg-warning-subtle border-warning-subtle-border rounded-inner border p-3.5 text-sm leading-5">
                {mensagemLimite}
              </div>
            )}
            {erro && !plano && !semCorrecao && !indisponivel && !limite && (
              <div className="bg-danger-banner text-danger-text rounded-inner p-3.5 text-sm">
                {mensagemDeErroJulia(erro)}
              </div>
            )}
          </>
        )}
        <div ref={finalRef} />
      </div>

      {!plano && !semCorrecao && (
        <footer className="border-border-subtle shrink-0 border-t px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:pb-3">
          <div className="flex items-end gap-2">
            <label className="sr-only" htmlFor="pergunta-julia">
              Sua pergunta para a Júlia
            </label>
            <textarea
              id="pergunta-julia"
              ref={inputRef}
              value={pergunta}
              onChange={(event) => setPergunta(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre esta correção…"
              maxLength={500}
              rows={1}
              disabled={Boolean(limite)}
              className="focus-ring bg-surface-2 border-control max-h-[104px] min-h-11 min-w-0 flex-1 resize-none overflow-y-auto rounded-[14px] border px-3.5 py-[11px] text-sm leading-5 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => void enviarPergunta()}
              disabled={!pergunta.trim() || enviar.isPending || Boolean(limite)}
              className="focus-ring bg-accent hover:bg-accent-hover flex size-11 shrink-0 items-center justify-center rounded-full text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Enviar pergunta"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-text-3 mt-2 flex items-start justify-between gap-3 text-xs">
            <span>{textoRestantes(conversa.data?.restantesConversa)}</span>
            <span className="text-right">
              {pergunta.length > 400 && `${pergunta.length}/500 · `}A Júlia não
              altera sua nota
            </span>
          </div>
        </footer>
      )}
    </div>
  );

  if (desktop)
    return aberto ? (
      <section
        role="dialog"
        aria-label="Conversa com a Júlia"
        onKeyDown={(event) => event.key === 'Escape' && onFechar()}
        className="bg-surface border-border-subtle shadow-raised rounded-card fixed right-8 bottom-28 z-40 h-[min(600px,calc(100dvh-140px))] w-[400px] overflow-hidden border"
      >
        {conteudo}
      </section>
    ) : null;

  return (
    <Dialog.Root open={aberto} onOpenChange={(open) => !open && onFechar()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
        <Dialog.Content className="bg-surface fixed inset-x-0 bottom-0 z-50 h-[92dvh] overflow-hidden rounded-t-[28px] pt-3 outline-none lg:hidden">
          <div className="bg-control rounded-pill mx-auto mb-1 h-1 w-10" />
          <Dialog.Title className="sr-only">Conversa com a Júlia</Dialog.Title>
          <Dialog.Description className="sr-only">
            Tire dúvidas sobre a correção desta redação
          </Dialog.Description>
          {conteudo}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Contexto({
  redacao,
  avaliacao,
  foco,
}: {
  redacao: RedacaoResponse;
  avaliacao: Avaliacao;
  foco: FocoJulia;
}) {
  if (foco) {
    const style = competenceStyles[foco.competencia.numero];
    return (
      <div className="px-4 pt-3">
        <div
          className={cn(
            'rounded-inner flex items-center gap-2 px-3 py-2 text-xs',
            style.bg,
          )}
        >
          <span className={cn('font-bold', style.text)}>
            C{foco.competencia.numero}
          </span>
          <span className="min-w-0 flex-1 truncate">
            {competencias[foco.competencia.numero - 1].nomeCurto}
          </span>
          <span className="font-mono">{foco.competencia.nota}/200</span>
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 pt-3">
      <div className="bg-surface-2 rounded-inner flex items-center gap-2 px-3 py-2 text-xs">
        <FileText className="text-text-3 shrink-0" size={16} />
        <span className="min-w-0 flex-1 truncate">
          {redacao.tema?.titulo ?? 'Tema indisponível'}
        </span>
        <span className="font-mono">{avaliacao.notaTotal}</span>
      </div>
    </div>
  );
}

function EstadoBloqueado({
  texto,
  children,
}: {
  texto: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center text-sm">
      <p className="text-text-body leading-6">{texto}</p>
      {children}
    </div>
  );
}

function Bolha({
  papel,
  children,
  formatada = false,
}: {
  papel: 'USUARIO' | 'JULIA';
  children: string;
  formatada?: boolean;
}) {
  return (
    <div
      className={cn(
        'max-w-[88%] px-4 py-3 text-[14.5px] leading-[1.6]',
        papel === 'USUARIO'
          ? 'bg-accent ml-auto rounded-[16px_16px_4px_16px] text-white'
          : 'bg-surface-2 text-text-body mr-auto rounded-[16px_16px_16px_4px]',
      )}
    >
      {formatada ? <RespostaFormatada texto={children} /> : children}
    </div>
  );
}

function RespostaFormatada({ texto }: { texto: string }) {
  return (
    <div className="space-y-2.5">
      {formatarRespostaJulia(texto).map((bloco, index) => {
        if (bloco.tipo === 'paragrafo')
          return <p key={index}>{renderTrechos(bloco.trechos)}</p>;
        const Tag = bloco.tipo === 'lista' ? 'ul' : 'ol';
        return (
          <Tag
            key={index}
            className={cn(
              'space-y-1 pl-5',
              bloco.tipo === 'lista' ? 'list-disc' : 'list-decimal',
            )}
          >
            {separarItens(bloco.trechos).map((item, itemIndex) => (
              <li key={itemIndex}>{renderTrechos(item)}</li>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}

function separarItens(trechos: { texto: string; negrito: boolean }[]) {
  const itens: { texto: string; negrito: boolean }[][] = [[]];
  for (const trecho of trechos) {
    trecho.texto.split('\n').forEach((parte, index) => {
      if (index) itens.push([]);
      if (parte) itens.at(-1)!.push({ ...trecho, texto: parte });
    });
  }
  return itens;
}

function renderTrechos(trechos: { texto: string; negrito: boolean }[]) {
  return trechos.map((trecho, index) =>
    trecho.negrito ? (
      <strong key={index}>{trecho.texto}</strong>
    ) : (
      <span key={index}>{trecho.texto}</span>
    ),
  );
}
