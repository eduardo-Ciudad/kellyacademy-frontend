import { ApiError } from '@/lib/api';
import type {
  Avaliacao,
  Competencia,
  JuliaConversaResponse,
} from '@/types/api';

export const juliaHabilitada = import.meta.env.VITE_JULIA_HABILITADA === 'true';

export const RESULTADO_CONTENT_CLASS =
  'flex flex-col gap-4 px-4 pt-4 pb-28 lg:gap-5 lg:px-0 lg:pt-0 lg:pb-28';

export function rotaTemBotaoJulia(pathname: string) {
  return /^\/redacoes\/[^/]+\/?$/.test(pathname);
}

export function deveIniciarTourJulia({
  habilitada,
  avaliacao,
  concluido,
  chatAberto,
  tourAtivo,
}: {
  habilitada: boolean;
  avaliacao: Avaliacao | null | undefined;
  concluido: boolean;
  chatAberto: boolean;
  tourAtivo: boolean;
}) {
  return (
    habilitada &&
    Boolean(avaliacao) &&
    !avaliacao?.anulada &&
    !concluido &&
    !chatAberto &&
    !tourAtivo
  );
}

export type TrechoJulia = { texto: string; negrito: boolean };
export type BlocoRespostaJulia = {
  tipo: 'paragrafo' | 'lista' | 'listaNumerada';
  trechos: TrechoJulia[];
};

export function perguntaDaCompetencia(competencia: Competencia) {
  return `Por que fiquei com ${competencia.nota} na C${competencia.numero}?`;
}

export function sugestoesIniciais(avaliacao: Avaliacao) {
  const abaixoDeDuzentos = [...avaliacao.competencias]
    .filter((item) => item.nota < 200)
    .sort((a, b) => a.nota - b.nota || a.numero - b.numero);
  const sugestoes: string[] = [];
  if (abaixoDeDuzentos[0])
    sugestoes.push(perguntaDaCompetencia(abaixoDeDuzentos[0]));
  if (abaixoDeDuzentos[1])
    sugestoes.push(`O que faltou para 200 na C${abaixoDeDuzentos[1].numero}?`);
  sugestoes.push('Me explica o diagnóstico');
  return sugestoes.slice(0, 3);
}

export function mensagemDeErroJulia(erro: unknown) {
  if (erro instanceof ApiError) {
    if (erro.codigo === 'JULIA_LIMITE_CONVERSA')
      return 'Você usou as 10 perguntas desta conversa.';
    if (erro.codigo === 'JULIA_LIMITE_DIARIO')
      return 'Você chegou ao limite de perguntas à Júlia hoje. Volte amanhã.';
    if (erro.codigo === 'JULIA_LIMITE_GLOBAL')
      return 'A Júlia atingiu o limite de atendimentos de hoje. Tente novamente amanhã.';
    if (erro.codigo === 'JULIA_PLANO')
      return 'A Júlia está disponível no plano Pro.';
    if (erro.codigo === 'JULIA_SEM_CORRECAO')
      return 'A Júlia só explica redações que já foram corrigidas.';
    if (
      erro.status === 503 ||
      erro.code === 'TIMEOUT' ||
      erro.code === 'NETWORK'
    )
      return 'A Júlia não conseguiu responder agora. Sua pergunta não foi descontada.';
  }
  return 'Não foi possível enviar sua pergunta. Tente novamente.';
}

export type TipoErroJulia =
  'limite' | 'plano' | 'semCorrecao' | 'indisponivel' | 'outro';

export function tipoErroJulia(erro: unknown): TipoErroJulia {
  if (!(erro instanceof ApiError)) return 'outro';
  if (erro.codigo?.startsWith('JULIA_LIMITE')) return 'limite';
  if (erro.codigo === 'JULIA_PLANO') return 'plano';
  if (erro.codigo === 'JULIA_SEM_CORRECAO') return 'semCorrecao';
  if (
    erro.codigo === 'JULIA_INDISPONIVEL' ||
    erro.status === 503 ||
    erro.code === 'TIMEOUT' ||
    erro.code === 'NETWORK'
  )
    return 'indisponivel';
  return 'outro';
}

export type LimiteJuliaAtingido = 'conversa' | 'diario' | null;

export function limiteAtingido(
  conversa: JuliaConversaResponse | undefined,
): LimiteJuliaAtingido {
  if (conversa?.restantesConversa === 0) return 'conversa';
  if (conversa?.restantesHoje === 0) return 'diario';
  return null;
}

function formatarTrechos(texto: string): TrechoJulia[] {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return partes.map((parte) => ({
    texto:
      parte.startsWith('**') && parte.endsWith('**')
        ? parte.slice(2, -2)
        : parte,
    negrito: parte.startsWith('**') && parte.endsWith('**'),
  }));
}

export function formatarRespostaJulia(texto: string): BlocoRespostaJulia[] {
  const linhas = texto.replace(/\r\n/g, '\n').split('\n');
  const blocos: BlocoRespostaJulia[] = [];
  let paragrafo: string[] = [];
  let lista: string[] = [];
  let tipoLista: 'lista' | 'listaNumerada' | null = null;
  const flushParagrafo = () => {
    if (paragrafo.length)
      blocos.push({
        tipo: 'paragrafo',
        trechos: formatarTrechos(paragrafo.join(' ')),
      });
    paragrafo = [];
  };
  const flushLista = () => {
    if (lista.length && tipoLista)
      blocos.push({
        tipo: tipoLista,
        trechos: formatarTrechos(lista.join('\n')),
      });
    lista = [];
    tipoLista = null;
  };

  for (const linha of linhas) {
    const bullet = linha.match(/^\s*-\s+(.+)/);
    const numbered = linha.match(/^\s*\d+\.\s+(.+)/);
    if (bullet || numbered) {
      flushParagrafo();
      const novoTipo = bullet ? 'lista' : 'listaNumerada';
      if (tipoLista && tipoLista !== novoTipo) flushLista();
      tipoLista = novoTipo;
      lista.push((bullet ?? numbered)![1]);
    } else if (!linha.trim()) {
      flushParagrafo();
      flushLista();
    } else {
      flushLista();
      paragrafo.push(linha.trim());
    }
  }
  flushParagrafo();
  flushLista();
  return blocos;
}

export function textoRestantes(restantesConversa: number | undefined) {
  if (restantesConversa === undefined) return '10 perguntas nesta conversa';
  return `${restantesConversa} de 10 pergunta${restantesConversa === 1 ? '' : 's'} restante${restantesConversa === 1 ? '' : 's'}`;
}
