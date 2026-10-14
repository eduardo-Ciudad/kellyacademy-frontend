import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, Camera, Lock, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CapturaFoto,
  type AvisoCaptura,
} from '@/components/transcricao/CapturaFoto';
import type { Foto } from '@/components/transcricao/foto';
import { RevisaoTranscricao } from '@/components/transcricao/RevisaoTranscricao';
import { EtapasProgresso } from '@/components/redacao/EtapasProgresso';
import { LimiteDiarioDialog } from '@/components/redacao/LimiteDiarioDialog';
import { Button } from '@/components/ui/Button';
import { useTranscricao } from '@/hooks/useTranscricao';
import { useUsoHoje } from '@/hooks/useUsoHoje';
import { carregarRascunho, gravarRascunho } from '@/hooks/useRascunho';
import { useTemas } from '@/hooks/useTemas';
import { useUsuario } from '@/hooks/useUsuario';
import { ApiError } from '@/lib/api';
import { comprimirImagem, FotoInvalidaError, MAX_FOTOS } from '@/lib/imagem';
import { rotuloTema } from '@/lib/temas';

const ETAPAS_LEITURA = [
  'Fotos enviadas',
  'Lendo a sua letra',
  'Organizando as linhas da folha',
] as const;
const AVANCOS_LEITURA = [6000] as const;
type Etapa = 'captura' | 'lendo' | 'revisao';

function Confirmacao({
  open,
  onOpenChange,
  titulo,
  texto,
  confirmar,
  rotuloConfirmar,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: string;
  texto: string;
  confirmar: () => void;
  rotuloConfirmar: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/65" />
        <Dialog.Content className="bg-surface fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] p-6 outline-none">
          <Dialog.Title className="text-text text-xl font-bold">
            {titulo}
          </Dialog.Title>
          <Dialog.Description className="text-text-2 mt-2 text-sm leading-[1.5]">
            {texto}
          </Dialog.Description>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <Button onClick={confirmar}>{rotuloConfirmar}</Button>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {titulo.startsWith('Descartar')
                ? 'Continuar revisando'
                : 'Cancelar'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Transcricao() {
  const { temaId = '' } = useParams();
  const navigate = useNavigate();
  const { email } = useUsuario();
  const temas = useTemas();
  const tema = temas.data?.find((item) => item.id === temaId);
  const uso = useUsoHoje('TRANSCRICAO');
  const transcricao = useTranscricao();
  const [etapa, setEtapa] = useState<Etapa>('captura');
  const [fotos, setFotos] = useState<Foto[]>([]);
  const fotosRef = useRef(fotos);
  fotosRef.current = fotos;
  const [preparando, setPreparando] = useState(false);
  const [aviso, setAviso] = useState<AvisoCaptura>();
  const [texto, setTexto] = useState('');
  const [limiteOpen, setLimiteOpen] = useState(false);
  const [limiteData, setLimiteData] = useState({ limite: 3, retryAfter: 0 });
  const [descartarOpen, setDescartarOpen] = useState(false);
  const [substituirOpen, setSubstituirOpen] = useState(false);
  const allowNavigation = useRef(false);
  const editor = `/temas/${temaId}/escrever`;
  useEffect(
    () => () => fotosRef.current.forEach(({ url }) => URL.revokeObjectURL(url)),
    [],
  );

  const blocker = useBlocker(
    () =>
      !allowNavigation.current && (etapa === 'lendo' || etapa === 'revisao'),
  );
  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (etapa === 'lendo') {
      toast.info('Aguarde a leitura terminar antes de sair.');
      blocker.reset();
    } else setDescartarOpen(true);
  }, [blocker, etapa]);
  useEffect(() => {
    if (etapa === 'captura') return;
    const prevent = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', prevent);
    return () => window.removeEventListener('beforeunload', prevent);
  }, [etapa]);

  const processar = useCallback(
    async (arquivos: File[], substituir?: number) => {
      const espaco =
        substituir === undefined ? MAX_FOTOS - fotosRef.current.length : 1;
      const selecionados = arquivos.slice(0, espaco);
      if (arquivos.length > espaco)
        toast.info('Máximo de 2 fotos por redação.');
      if (!selecionados.length) return;
      setAviso(undefined);
      setPreparando(true);
      try {
        const comprimidas = await Promise.all(
          selecionados.map(comprimirImagem),
        );
        const novas = comprimidas.map((arquivo) => ({
          id: crypto.randomUUID(),
          arquivo,
          url: URL.createObjectURL(arquivo),
        }));
        setFotos((atuais) => {
          if (substituir === undefined) return [...atuais, ...novas];
          if (!atuais[substituir]) {
            novas.forEach(({ url }) => URL.revokeObjectURL(url));
            return atuais;
          }
          URL.revokeObjectURL(atuais[substituir].url);
          return atuais.map((foto, i) => (i === substituir ? novas[0] : foto));
        });
      } catch (error) {
        setAviso({
          tipo: 'erro',
          mensagem:
            error instanceof FotoInvalidaError
              ? error.message
              : 'Não foi possível preparar esta foto. Tente outra.',
        });
      } finally {
        setPreparando(false);
      }
    },
    [],
  );
  function remover(indice: number) {
    setAviso(undefined);
    setFotos((atuais) => {
      URL.revokeObjectURL(atuais[indice].url);
      return atuais.filter((_, i) => i !== indice);
    });
  }

  async function ler() {
    if (!fotos.length || fotos.length > 2 || uso.atingido) return;
    setAviso(undefined);
    setEtapa('lendo');
    try {
      const resposta = await transcricao.mutateAsync(
        fotos.map(({ arquivo }) => arquivo),
      );
      setTexto(resposta.texto);
      setEtapa('revisao');
    } catch (error) {
      setEtapa('captura');
      if (!(error instanceof ApiError) || error.status === 401) return;
      if (error.status === 422)
        setAviso({ tipo: 'recusada', mensagem: error.detail });
      else if (error.status === 429) {
        setLimiteData({
          limite: error.limite ?? uso.limite ?? 3,
          retryAfter: error.retryAfter ?? 0,
        });
        setLimiteOpen(true);
      } else if (error.status === 503)
        setAviso({
          tipo: 'indisponivel',
          mensagem:
            'A leitura de fotos está indisponível hoje. Você ainda pode digitar o texto e enviar para correção.',
        });
      else if (error.status === 502)
        setAviso({ tipo: 'erro', mensagem: error.detail, repetir: true });
      else if (error.code === 'TIMEOUT')
        setAviso({
          tipo: 'erro',
          mensagem: 'A leitura demorou mais que o esperado. Tente de novo.',
          repetir: true,
        });
      else if (error.code === 'NETWORK')
        setAviso({
          tipo: 'erro',
          mensagem: 'Sem conexão com o servidor. Suas fotos continuam aqui.',
          repetir: true,
        });
      else setAviso({ tipo: 'erro', mensagem: error.detail });
    }
  }
  function voltarFotos() {
    setDescartarOpen(true);
  }
  function descartar() {
    setDescartarOpen(false);
    if (blocker.state === 'blocked') {
      allowNavigation.current = true;
      blocker.proceed();
    } else {
      setTexto('');
      setEtapa('captura');
    }
  }
  function concluir() {
    const atual = carregarRascunho(email, temaId);
    if (atual?.texto.trim()) setSubstituirOpen(true);
    else salvar();
  }
  function salvar() {
    const atual = carregarRascunho(email, temaId);
    gravarRascunho(email, temaId, {
      texto,
      tipo: atual?.tipo ?? 'PRATICA',
      origem: 'MANUSCRITO',
    });
    allowNavigation.current = true;
    void navigate(editor, { replace: true });
  }

  if (temas.isLoading)
    return (
      <main className="bg-bg flex min-h-screen items-center justify-center">
        <span className="text-text-2">Carregando tema…</span>
      </main>
    );
  if (!tema && temas.isError)
    return (
      <main className="bg-bg flex min-h-screen items-center justify-center px-5 text-center">
        <div>
          <h1 className="text-text text-[28px] font-normal">
            Não foi possível carregar o tema
          </h1>
          <p className="text-text-2 mt-2">
            Verifique sua conexão e tente novamente.
          </p>
          <Button
            variant="secondary"
            onClick={() => void temas.refetch()}
            className="mt-5"
          >
            <RotateCcw size={16} />
            Tentar novamente
          </Button>
        </div>
      </main>
    );
  if (!tema)
    return (
      <main className="bg-bg flex min-h-screen items-center justify-center px-5 text-center">
        <div>
          <h1 className="text-text text-[28px] font-normal">
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
  if (etapa === 'lendo')
    return (
      <EtapasProgresso
        tema={tema}
        icone={<Camera size={30} />}
        titulo="Lendo sua redação"
        duracao="Costuma levar de 10 a 20 segundos."
        rotuloCabecalho="Lendo…"
        etapas={[
          `${fotos.length} ${fotos.length === 1 ? 'foto enviada' : 'fotos enviadas'}`,
          ...ETAPAS_LEITURA.slice(1),
        ]}
        avancosMs={AVANCOS_LEITURA}
        rodape={
          <>
            <Lock size={15} />
            Se a leitura falhar, as fotos continuam aqui e a tentativa não é
            descontada.
          </>
        }
      />
    );
  if (etapa === 'revisao')
    return (
      <>
        <RevisaoTranscricao
          tema={tema}
          fotos={fotos}
          texto={texto}
          onTextoChange={setTexto}
          onVoltar={voltarFotos}
          onUsar={concluir}
        />
        <Confirmacao
          open={descartarOpen}
          onOpenChange={(open) => {
            setDescartarOpen(open);
            if (!open && blocker.state === 'blocked') blocker.reset();
          }}
          titulo="Descartar o texto lido?"
          texto="Esta transcrição já contou no seu limite de hoje."
          confirmar={descartar}
          rotuloConfirmar="Descartar"
        />
        <Confirmacao
          open={substituirOpen}
          onOpenChange={setSubstituirOpen}
          titulo="Substituir o texto do editor?"
          texto="O que você tinha digitado neste tema será trocado pelo texto da foto."
          confirmar={salvar}
          rotuloConfirmar="Substituir"
        />
      </>
    );
  return (
    <main className="bg-bg flex min-h-[100svh] flex-col">
      <header className="border-border-subtle flex h-[68px] items-center gap-3 border-b px-4 lg:px-8">
        <Link
          to={editor}
          aria-label="Voltar para o editor"
          className="focus-ring bg-surface flex size-10 items-center justify-center rounded-full"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <span className="text-text block font-semibold">
            Enviar foto da redação
          </span>
          <span className="text-text-3 block truncate text-xs">
            {rotuloTema(tema)} · {tema.titulo}
          </span>
        </div>
        <div className="hidden lg:block">
          <span className="text-text-2 text-sm">
            <strong className="text-text">{uso.restantes ?? '—'}</strong>{' '}
            transcrições restantes hoje
          </span>
        </div>
      </header>
      <CapturaFoto
        fotos={fotos}
        preparando={preparando}
        aviso={aviso}
        restantes={uso.restantes}
        atingido={uso.atingido}
        linkEditor={editor}
        onAdicionar={(files) => void processar(files)}
        onTrocar={(i, file) => void processar([file], i)}
        onRemover={remover}
        onLer={() => void ler()}
      />
      <LimiteDiarioDialog
        open={limiteOpen}
        onOpenChange={setLimiteOpen}
        limite={limiteData.limite}
        retryAfter={limiteData.retryAfter}
        recurso="TRANSCRICAO"
        onDigitar={() => {
          allowNavigation.current = true;
          void navigate(editor);
        }}
      />
    </main>
  );
}
