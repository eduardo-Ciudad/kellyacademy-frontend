import * as Dialog from '@radix-ui/react-dialog';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Clock3, Copy, X } from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useAdminUsuario,
  useConcederPro,
  useReenviarVerificacao,
  useRevogarPro,
  useZerarCotaHoje,
} from '@/hooks/useAdmin';
import { ApiError } from '@/lib/api';
import {
  erroConcessao,
  fimConcessao,
  mensagemErroAdmin,
  mensagemReenvio429,
  percentualSeguro,
  proPelaAssinatura,
  traduzirStatusAssinatura,
} from '@/lib/admin';
import type {
  AdminUsuarioDetalhe as Detalhe,
  ConcessaoPro,
  RecursoIAAdmin,
} from '@/types/admin';

const cardClass =
  'bg-surface border-border-subtle rounded-[18px] border min-w-0';
const numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const dataCurta = (value: string) => format(parseISO(value), 'dd/MM/yyyy');
type Feedback = { tipo: 'sucesso' | 'erro'; texto: string };

export function AdminUsuarioDetalhe() {
  const { id = '' } = useParams();
  const location = useLocation();
  const query = useAdminUsuario(id);
  const navigationState = location.state as { from?: unknown } | null;
  const from = navigationState?.from;
  const voltar =
    typeof from === 'string' && from.startsWith('/admin/usuarios')
      ? from
      : '/admin/usuarios';
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const reenviar = useReenviarVerificacao();

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 6_000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  if (query.isPending) return <DetalheSkeleton />;
  if (query.error instanceof ApiError && query.error.status === 404)
    return <Estado titulo="Usuário não encontrado" voltar={voltar} />;
  if (query.isError || !query.data)
    return (
      <Estado
        titulo={
          query.error instanceof ApiError && query.error.status === 403
            ? 'Sua conta não tem mais acesso de administrador.'
            : 'Não foi possível carregar o usuário.'
        }
        voltar={voltar}
        onRetry={() => void query.refetch()}
      />
    );
  const data = query.data;
  const usuario = data.usuario;

  async function reenviarEmail() {
    try {
      await reenviar.mutateAsync(usuario.id);
      setFeedback({
        tipo: 'sucesso',
        texto: 'E-mail de verificação reenviado.',
      });
    } catch (error) {
      setFeedback({
        tipo: 'erro',
        texto:
          error instanceof ApiError && error.status === 429
            ? mensagemReenvio429(error.retryAfter)
            : mensagemErroAdmin(error),
      });
    }
  }

  return (
    <div>
      <Link
        to={voltar}
        className="focus-ring text-text-2 hover:text-text rounded-md text-sm"
      >
        ← Usuários
      </Link>
      <header className="mt-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-text font-display truncate text-[34px] leading-tight font-light tracking-[-0.03em]">
              {usuario.nome}
            </h1>
            <p className="text-text-2 mt-1 text-sm break-all">
              {usuario.email}
            </p>
          </div>
          <p className="text-text-3 text-xs">
            cliente desde {dataCurta(usuario.criadoEm)}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge accent={usuario.plano === 'PRO'}>
            {usuario.plano === 'PRO' ? 'Pro' : 'Grátis'}
          </Badge>
          <Badge tone={usuario.emailVerificado ? 'success' : 'warning'}>
            {usuario.emailVerificado ? (
              <CheckCircle2 size={14} />
            ) : (
              <Clock3 size={14} />
            )}
            {usuario.emailVerificado ? 'E-mail verificado' : 'E-mail pendente'}
          </Badge>
          {usuario.role === 'ADMIN' ? <Badge accent>ADMIN</Badge> : null}
        </div>
      </header>
      {feedback ? (
        <div
          role={feedback.tipo === 'sucesso' ? 'status' : 'alert'}
          className={`mt-5 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            feedback.tipo === 'sucesso'
              ? 'bg-success-subtle border-success-subtle-border text-success'
              : 'border-danger/30 bg-danger/10 text-danger'
          }`}
        >
          <span>{feedback.texto}</span>
          <button
            type="button"
            aria-label="Fechar aviso"
            onClick={() => setFeedback(null)}
            className="focus-ring shrink-0 rounded-md p-1"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <div className="mt-7 grid gap-5 xl:grid-cols-2">
        <Desempenho data={data} />
        <Plano
          data={data}
          onFeedback={(texto) => setFeedback({ tipo: 'sucesso', texto })}
        />
        <UsoHoje
          data={data}
          onFeedback={(texto) => setFeedback({ tipo: 'sucesso', texto })}
        />
        <section className={`${cardClass} p-5 sm:p-6`}>
          <Titulo>Júlia</Titulo>
          <dl className="mt-6 grid grid-cols-2 gap-5">
            <Metrica label="Conversas" value={data.julia.conversas} />
            <Metrica label="Perguntas" value={data.julia.mensagens} />
          </dl>
        </section>
        <Redacoes data={data} />
        {!usuario.emailVerificado ? (
          <section className={`${cardClass} p-5 sm:p-6`}>
            <Titulo>Ações da conta</Titulo>
            <p className="text-text-3 mt-2 text-sm">
              Envie um novo link para confirmar o endereço de e-mail.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              loading={reenviar.isPending}
              onClick={() => void reenviarEmail()}
            >
              Reenviar verificação de e-mail
            </Button>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function Titulo({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-text font-display text-[19px] font-normal tracking-[-0.015em]">
      {children}
    </h2>
  );
}
function Badge({
  children,
  accent,
  tone,
}: {
  children: ReactNode;
  accent?: boolean;
  tone?: 'success' | 'warning';
}) {
  return (
    <span
      className={`rounded-pill inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${accent ? 'bg-nav-active text-accent-text' : tone === 'success' ? 'bg-success-subtle text-success' : tone === 'warning' ? 'bg-warning-subtle text-warning' : 'bg-control text-text-2'}`}
    >
      {children}
    </span>
  );
}
function Metrica({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-text-3 text-xs">{label}</dt>
      <dd className="text-text font-display mt-2 text-3xl font-light">
        {value}
      </dd>
    </div>
  );
}

function Desempenho({ data }: { data: Detalhe }) {
  return (
    <section className={`${cardClass} p-5 sm:p-6`}>
      <Titulo>Desempenho</Titulo>
      <dl className="mt-6 grid grid-cols-2 gap-6">
        <Metrica label="Redações" value={data.usuario.totalRedacoes} />
        <Metrica
          label="Nota média"
          value={
            data.usuario.notaMedia === null
              ? '—'
              : numero.format(data.usuario.notaMedia)
          }
        />
        <Metrica
          label="Melhor nota"
          value={
            data.melhorNota === null ? '—' : numero.format(data.melhorNota)
          }
        />
        <Metrica
          label="Competência mais fraca"
          value={
            data.competenciaMaisFraca
              ? `C${data.competenciaMaisFraca.competencia} · ${numero.format(data.competenciaMaisFraca.media)}`
              : '—'
          }
        />
      </dl>
    </section>
  );
}

function Plano({
  data,
  onFeedback,
}: {
  data: Detalhe;
  onFeedback: (value: string) => void;
}) {
  const assinaturaPro = proPelaAssinatura(data.assinatura);
  return (
    <section className={`${cardClass} p-5 sm:p-6`}>
      <Titulo>Plano e assinatura</Titulo>
      {data.assinatura ? (
        <div className="border-border-subtle mt-5 border-b pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong className="text-text text-sm">
              Assinatura {traduzirStatusAssinatura(data.assinatura.status)}
            </strong>
            <Badge>
              {data.assinatura.ciclo === 'MENSAL' ? 'Mensal' : 'Anual'}
            </Badge>
          </div>
          <p className="text-text-2 mt-2 text-sm">
            {data.assinatura.cancelarNoFimDoPeriodo
              ? 'acesso até'
              : 'renova em'}{' '}
            {dataCurta(data.assinatura.periodoAtualFim)}
          </p>
          {data.assinatura.stripeCustomerId ? (
            <button
              type="button"
              className="focus-ring text-text-3 hover:text-text mt-3 inline-flex items-center gap-2 rounded-md font-mono text-xs"
              onClick={() =>
                void navigator.clipboard.writeText(
                  data.assinatura!.stripeCustomerId!,
                )
              }
            >
              <Copy size={14} /> {data.assinatura.stripeCustomerId}
            </button>
          ) : null}
        </div>
      ) : (
        <p className="text-text-3 mt-4 text-sm">Nunca assinou o Pro.</p>
      )}
      <div className="mt-5">
        {data.concessaoPro?.vigente ? (
          <>
            <p className="text-text text-sm font-semibold">
              Pro manual até {dataCurta(data.concessaoPro.fim)}
            </p>
            <p className="text-text-3 mt-1 text-sm">
              {data.concessaoPro.motivo}
            </p>
            <RevogarDialog id={data.usuario.id} onFeedback={onFeedback} />
          </>
        ) : assinaturaPro ? (
          <p className="text-text-2 text-sm">Já é Pro pela assinatura</p>
        ) : data.usuario.plano !== 'PRO' ? (
          <>
            {data.concessaoPro ? (
              <p className="text-text-2 text-sm">
                Concessão vencida em {dataCurta(data.concessaoPro.fim)}
              </p>
            ) : null}
            <ConcederDialog id={data.usuario.id} onFeedback={onFeedback} />
          </>
        ) : data.concessaoPro ? (
          <p className="text-text-2 text-sm">
            Concessão vencida em {dataCurta(data.concessaoPro.fim)}
          </p>
        ) : null}
      </div>
      {data.concessoes.length ? (
        <details className="border-border-subtle mt-5 border-t pt-4">
          <summary className="focus-ring text-text cursor-pointer rounded-md text-sm font-semibold">
            Histórico de concessões ({data.concessoes.length})
          </summary>
          <div className="mt-4 space-y-4">
            {data.concessoes.map((item) => (
              <ConcessaoHistorico key={item.id} item={item} />
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}

function ConcessaoHistorico({ item }: { item: ConcessaoPro }) {
  return (
    <div className="border-border-subtle border-l-2 pl-3 text-xs">
      <p className="text-text">
        {dataCurta(item.inicio)} → {dataCurta(item.fim)}
      </p>
      <p className="text-text-3 mt-1">{item.motivo}</p>
      {item.revogadaEm ? (
        <p className="text-warning mt-1">
          revogada em {format(parseISO(item.revogadaEm), 'dd/MM')} ·{' '}
          {item.motivoRevogacao}
        </p>
      ) : null}
    </div>
  );
}

const recursoLabel: Record<RecursoIAAdmin, string> = {
  CORRECAO: 'Correções',
  TRANSCRICAO: 'Transcrições',
  JULIA: 'Perguntas à Júlia',
};
function UsoHoje({
  data,
  onFeedback,
}: {
  data: Detalhe;
  onFeedback: (value: string) => void;
}) {
  return (
    <section className={`${cardClass} p-5 sm:p-6`}>
      <Titulo>Uso de hoje</Titulo>
      <div className="mt-6 space-y-5">
        {data.usoHoje.map((item) => {
          const p = Math.min(100, percentualSeguro(item.usados, item.limite));
          return (
            <div key={item.recurso}>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-text">{recursoLabel[item.recurso]}</span>
                <span className="text-text-2 font-mono text-xs">
                  {item.usados} / {item.limite}
                </span>
              </div>
              <div className="bg-control mt-2 h-1.5 overflow-hidden rounded-full">
                <div
                  className="bg-accent h-full rounded-full"
                  style={{ width: `${p}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <ZerarDialog id={data.usuario.id} onFeedback={onFeedback} />
    </section>
  );
}

function Redacoes({ data }: { data: Detalhe }) {
  const origem = { DIGITADO: 'Digitada', MANUSCRITO: 'Foto' };
  const status = {
    AVALIADA: 'Corrigida',
    ENVIADA: 'Na fila',
    EM_AVALIACAO: 'Corrigindo',
    ERRO: 'Erro',
  };
  return (
    <section className={`${cardClass} overflow-hidden xl:col-span-2`}>
      <div className="p-5 sm:p-6">
        <Titulo>Últimas redações</Titulo>
      </div>
      {data.redacoes.length ? (
        <div className="divide-border-subtle divide-y">
          {data.redacoes.map((redacao) => (
            <div
              key={redacao.id}
              className="grid gap-2 px-5 py-4 text-sm sm:grid-cols-[95px_minmax(0,1fr)_80px_90px_55px] sm:px-6"
            >
              <span className="text-text-3 text-xs">
                {dataCurta(redacao.enviadaEm)}
              </span>
              <span title={redacao.tema} className="text-text truncate">
                {redacao.tema}
              </span>
              <span className="text-text-2 text-xs">
                {origem[redacao.origem]}
              </span>
              <span className="text-text-2 text-xs">
                {status[redacao.status]}
              </span>
              <span className="text-text text-xs">{redacao.nota ?? '—'}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-3 px-6 pb-8 text-sm">
          Nenhuma redação enviada.
        </p>
      )}
    </section>
  );
}

function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Dialog.Content className="bg-surface border-border-subtle fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[min(92vw,480px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[18px] border p-6 outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-text font-display text-2xl font-light">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-text-3 mt-2 text-sm">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="focus-ring text-text-2 rounded-md p-1"
              aria-label="Fechar"
            >
              <X size={20} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ConcederDialog({
  id,
  onFeedback,
}: {
  id: string;
  onFeedback: (v: string) => void;
}) {
  const mutation = useConcederPro();
  const [open, setOpen] = useState(false);
  const [dias, setDias] = useState(30);
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');
  const validacao = erroConcessao(dias, motivo);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (validacao) {
      setErro(validacao);
      return;
    }
    try {
      await mutation.mutateAsync({ id, dias, motivo: motivo.trim() });
      setOpen(false);
      setMotivo('');
      setErro('');
      onFeedback('Pro concedido com sucesso.');
    } catch (error) {
      setErro(mensagemErroAdmin(error));
    }
  }
  return (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Conceder Pro
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Conceder Pro"
        description="Libere o acesso Pro manualmente por um período."
      >
        <form
          onSubmit={(event) => void submit(event)}
          className="mt-5 space-y-5"
        >
          <div>
            <label
              className="text-text mb-2 block text-sm font-semibold"
              htmlFor="dias-pro"
            >
              Dias
            </label>
            <Input
              id="dias-pro"
              type="number"
              min={1}
              max={365}
              value={dias}
              invalid={Boolean(erro && (dias < 1 || dias > 365))}
              onChange={(e) => {
                setDias(Number(e.target.value));
                setErro('');
              }}
            />
            <div className="mt-2 flex gap-2">
              {[7, 30, 90].map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setDias(v)}
                  className="focus-ring bg-control text-text-2 rounded-pill px-3 py-1.5 text-xs"
                >
                  {v} dias
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              className="text-text mb-2 block text-sm font-semibold"
              htmlFor="motivo-pro"
            >
              Motivo
            </label>
            <textarea
              id="motivo-pro"
              maxLength={300}
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                setErro('');
              }}
              className="focus-ring bg-surface border-control text-text rounded-input min-h-28 w-full resize-y border p-3 text-sm"
            />
            <p className="text-text-3 mt-1 text-right text-xs">
              {motivo.length}/300
            </p>
          </div>
          <p className="text-text-2 text-sm">
            Pro até {dataCurta(fimConcessao(Number.isFinite(dias) ? dias : 0))}
          </p>
          {erro ? (
            <p role="alert" className="text-danger text-sm">
              {erro}
            </p>
          ) : null}
          <Button
            type="submit"
            className="w-full"
            loading={mutation.isPending}
            disabled={Boolean(validacao)}
          >
            Conceder
          </Button>
        </form>
      </Modal>
    </>
  );
}

function RevogarDialog({
  id,
  onFeedback,
}: {
  id: string;
  onFeedback: (v: string) => void;
}) {
  const mutation = useRevogarPro();
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');
  const invalido = motivo.trim().length < 5 || motivo.trim().length > 300;
  function onOpenChange(nextOpen: boolean) {
    if (nextOpen) setErro('');
    setOpen(nextOpen);
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (invalido) {
      setErro('O motivo deve ter entre 5 e 300 caracteres.');
      return;
    }
    try {
      await mutation.mutateAsync({ id, motivo: motivo.trim() });
      setOpen(false);
      onFeedback('Concessão Pro revogada.');
    } catch (error) {
      setErro(mensagemErroAdmin(error));
    }
  }
  return (
    <>
      <Button
        variant="outline"
        className="border-danger text-danger mt-4"
        onClick={() => onOpenChange(true)}
      >
        Revogar Pro
      </Button>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Revogar Pro"
        description="O acesso Pro termina na hora."
      >
        <form onSubmit={(event) => void submit(event)} className="mt-5">
          <textarea
            aria-label="Motivo da revogação"
            maxLength={300}
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              setErro('');
            }}
            className="focus-ring bg-surface border-control text-text rounded-input min-h-28 w-full border p-3 text-sm"
          />
          <p className="text-text-3 mt-1 text-right text-xs">
            {motivo.length}/300
          </p>
          {erro ? (
            <p role="alert" className="text-danger mt-2 text-sm">
              {erro}
            </p>
          ) : null}
          <Button
            type="submit"
            className="bg-danger hover:bg-danger mt-5 w-full"
            loading={mutation.isPending}
            disabled={invalido}
          >
            Revogar agora
          </Button>
        </form>
      </Modal>
    </>
  );
}

function ZerarDialog({
  id,
  onFeedback,
}: {
  id: string;
  onFeedback: (v: string) => void;
}) {
  const mutation = useZerarCotaHoje();
  const [open, setOpen] = useState(false);
  const [erro, setErro] = useState('');
  function onOpenChange(nextOpen: boolean) {
    if (nextOpen) setErro('');
    setOpen(nextOpen);
  }
  async function confirmar() {
    try {
      await mutation.mutateAsync(id);
      setOpen(false);
      onFeedback('Cota de hoje zerada.');
    } catch (error) {
      setErro(mensagemErroAdmin(error));
    }
  }
  return (
    <>
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => onOpenChange(true)}
      >
        Zerar cota de hoje
      </Button>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Zerar cota de hoje"
        description="As correções, transcrições e perguntas à Júlia de hoje voltam a zero. O teto global do sistema não muda."
      >
        {erro ? (
          <p role="alert" className="text-danger mt-4 text-sm">
            {erro}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <Dialog.Close asChild>
            <Button variant="secondary">Cancelar</Button>
          </Dialog.Close>
          <Button loading={mutation.isPending} onClick={() => void confirmar()}>
            Confirmar
          </Button>
        </div>
      </Modal>
    </>
  );
}

function Estado({
  titulo,
  voltar,
  onRetry,
}: {
  titulo: string;
  voltar: string;
  onRetry?: () => void;
}) {
  return (
    <section className={`${cardClass} px-6 py-12 text-center`}>
      <h1 className="text-text font-display text-2xl font-light">{titulo}</h1>
      <div className="mt-6 flex justify-center gap-3">
        {onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            Tentar de novo
          </Button>
        ) : null}
        <Link
          to={voltar}
          className="focus-ring bg-control text-text rounded-pill inline-flex min-h-11 items-center px-5 text-sm font-semibold"
        >
          Voltar para usuários
        </Link>
      </div>
    </section>
  );
}
function DetalheSkeleton() {
  return (
    <div aria-label="Carregando usuário" className="space-y-5">
      <Skeleton className="h-24 rounded-[18px]" />
      <div className="grid gap-5 md:grid-cols-2">
        <Skeleton className="h-72 rounded-[18px]" />
        <Skeleton className="h-72 rounded-[18px]" />
        <Skeleton className="h-72 rounded-[18px]" />
        <Skeleton className="h-72 rounded-[18px]" />
      </div>
    </div>
  );
}
