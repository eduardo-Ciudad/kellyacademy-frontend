import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api';
import {
  deveIniciarTourJulia,
  formatarRespostaJulia,
  limiteAtingido,
  mensagemDeErroJulia,
  perguntaDaCompetencia,
  sugestoesIniciais,
  textoRestantes,
  tipoErroJulia,
} from '@/lib/julia';
import type { Avaliacao, Competencia } from '@/types/api';

const competencia = (
  numero: Competencia['numero'],
  nota: Competencia['nota'],
): Competencia => ({
  numero,
  nota,
  nivelReferencia: '',
  resumo: '',
  problemas: [],
});

const avaliacao = (notas: Competencia['nota'][]): Avaliacao => ({
  notaTotal: notas.reduce<number>((total, nota) => total + nota, 0),
  anulada: false,
  motivoAnulacao: null,
  competencias: notas.map((nota, index) =>
    competencia((index + 1) as Competencia['numero'], nota),
  ),
  pontosFortes: [],
  pontosDesenvolvimento: [],
  diagnostico: '',
  avaliadoEm: '',
});

describe('tour da Júlia', () => {
  const corrigida = avaliacao([120, 160, 200, 80, 40]);
  const base = {
    habilitada: true,
    avaliacao: corrigida,
    concluido: false,
    chatAberto: false,
    tourAtivo: false,
  };

  it('inicia quando todas as condições são atendidas', () => {
    expect(deveIniciarTourJulia(base)).toBe(true);
  });

  it.each([
    ['flag desligada', { habilitada: false }],
    ['sem avaliação', { avaliacao: null }],
    ['avaliação anulada', { avaliacao: { ...corrigida, anulada: true } }],
    ['já concluído', { concluido: true }],
    ['chat aberto', { chatAberto: true }],
    ['outro tour ativo', { tourAtivo: true }],
  ])('não inicia com %s', (_cenario, alteracao) => {
    expect(deveIniciarTourJulia({ ...base, ...alteracao })).toBe(false);
  });
});

describe('sugestões da Júlia', () => {
  it('prioriza a menor nota, usa a próxima menor, pula 200 e limita a três', () => {
    expect(sugestoesIniciais(avaliacao([160, 80, 200, 40, 120]))).toEqual([
      'Por que fiquei com 40 na C4?',
      'O que faltou para 200 na C2?',
      'Me explica o diagnóstico',
    ]);
  });

  it('desempata pelo número da competência', () => {
    expect(
      sugestoesIniciais(avaliacao([80, 80, 120, 200, 200])).slice(0, 2),
    ).toEqual(['Por que fiquei com 80 na C1?', 'O que faltou para 200 na C2?']);
  });

  it('mantém apenas o diagnóstico quando todas têm 200', () => {
    expect(sugestoesIniciais(avaliacao([200, 200, 200, 200, 200]))).toEqual([
      'Me explica o diagnóstico',
    ]);
  });
});

it('monta a pergunta de uma competência', () => {
  expect(perguntaDaCompetencia(competencia(3, 120))).toBe(
    'Por que fiquei com 120 na C3?',
  );
});

describe('mensagens de erro', () => {
  const erro = (
    status: number,
    codigo?: string,
    code: 'HTTP' | 'TIMEOUT' | 'NETWORK' = 'HTTP',
  ) => new ApiError({ status, codigo, code, detail: '' });

  it.each([
    [
      erro(429, 'JULIA_LIMITE_CONVERSA'),
      'Você usou as 10 perguntas desta conversa.',
    ],
    [
      erro(429, 'JULIA_LIMITE_DIARIO'),
      'Você chegou ao limite de perguntas à Júlia hoje. Volte amanhã.',
    ],
    [
      erro(503, 'JULIA_LIMITE_GLOBAL'),
      'A Júlia atingiu o limite de atendimentos de hoje. Tente novamente amanhã.',
    ],
    [erro(403, 'JULIA_PLANO'), 'A Júlia está disponível no plano Pro.'],
    [
      erro(409, 'JULIA_SEM_CORRECAO'),
      'A Júlia só explica redações que já foram corrigidas.',
    ],
    [erro(409), 'Não foi possível enviar sua pergunta. Tente novamente.'],
    [
      erro(503),
      'A Júlia não conseguiu responder agora. Sua pergunta não foi descontada.',
    ],
    [
      erro(0, undefined, 'TIMEOUT'),
      'A Júlia não conseguiu responder agora. Sua pergunta não foi descontada.',
    ],
    [
      erro(0, undefined, 'NETWORK'),
      'A Júlia não conseguiu responder agora. Sua pergunta não foi descontada.',
    ],
    [new Error('x'), 'Não foi possível enviar sua pergunta. Tente novamente.'],
  ])('mapeia %#', (entrada, mensagem) => {
    expect(mensagemDeErroJulia(entrada)).toBe(mensagem);
  });
});

describe('tipo de erro da Júlia', () => {
  const erro = (
    status: number,
    codigo?: string,
    code: 'HTTP' | 'TIMEOUT' | 'NETWORK' = 'HTTP',
  ) => new ApiError({ status, codigo, code, detail: '' });

  it.each([
    [erro(503, 'JULIA_LIMITE_GLOBAL'), 'limite'],
    [erro(503, 'JULIA_INDISPONIVEL'), 'indisponivel'],
    [erro(503), 'indisponivel'],
    [erro(409, 'JULIA_SEM_CORRECAO'), 'semCorrecao'],
    [erro(409), 'outro'],
    [erro(0, undefined, 'TIMEOUT'), 'indisponivel'],
    [erro(0, undefined, 'NETWORK'), 'indisponivel'],
    [new Error('x'), 'outro'],
  ])('classifica %#', (entrada, esperado) => {
    expect(tipoErroJulia(entrada)).toBe(esperado);
  });
});

describe('limite antecipado', () => {
  const conversa = (restantesConversa: number, restantesHoje: number) => ({
    mensagens: [],
    restantesConversa,
    restantesHoje,
  });

  it('prioriza o limite da conversa', () => {
    expect(limiteAtingido(conversa(0, 0))).toBe('conversa');
  });

  it('identifica o limite diário', () => {
    expect(limiteAtingido(conversa(4, 0))).toBe('diario');
  });

  it('não bloqueia quando ainda há perguntas ou dados', () => {
    expect(limiteAtingido(conversa(1, 1))).toBeNull();
    expect(limiteAtingido(undefined)).toBeNull();
  });
});

describe('formatação segura', () => {
  it('formata parágrafos, listas, numeração e negrito', () => {
    const blocos = formatarRespostaJulia(
      'Um **trecho**.\n\n- A\n- B\n\n1. C\n2. D',
    );
    expect(blocos.map((bloco) => bloco.tipo)).toEqual([
      'paragrafo',
      'lista',
      'listaNumerada',
    ]);
    expect(blocos[0].trechos).toContainEqual({
      texto: 'trecho',
      negrito: true,
    });
  });

  it('mantém tags como texto puro', () => {
    expect(
      formatarRespostaJulia('<script>alert(1)</script>')[0].trechos[0].texto,
    ).toBe('<script>alert(1)</script>');
  });
});

it.each([
  [undefined, '10 perguntas nesta conversa'],
  [1, '1 de 10 pergunta restante'],
  [10, '10 de 10 perguntas restantes'],
])('formata restantes (%s)', (valor, esperado) => {
  expect(textoRestantes(valor)).toBe(esperado);
});
