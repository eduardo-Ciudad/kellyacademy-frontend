export type Ciclo = 'mensal' | 'anual';

export type ValorComparativo = boolean | string;

export type LinhaComparativo = {
  nome: string;
  gratis: ValorComparativo;
  pro: ValorComparativo;
};

export const DESCONTO_ANUAL = 0.3;
export const PRECO_PRO_MENSAL = 30;

export function calcularPrecoAnual(precoMensal: number, desconto: number) {
  const mensalComDesconto = precoMensal * (1 - desconto);
  return { mensalComDesconto, totalAnual: mensalComDesconto * 12 };
}

export const PRECO_PRO_ANUAL = calcularPrecoAnual(
  PRECO_PRO_MENSAL,
  DESCONTO_ANUAL,
);

export const formatarPreco = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(valor);

export const textosPlanos = {
  tituloInicio: 'Comece de graça.',
  tituloFim: 'Evolua quando quiser.',
  descricao:
    'Sem cartão para começar. O Pro libera mais correções, o repertório completo e a assistente Júlia.',
  seletor: {
    rotulo: 'Ciclo de cobrança',
    mensal: 'Mensal',
    anual: 'Anual',
    desconto: '−30%',
  },
  comparativo: {
    titulo: 'Comparar em detalhe',
    recurso: 'Recurso',
    incluido: 'Incluído',
    naoIncluido: 'Não incluído',
    gratis: 'Grátis',
    pro: 'Pro',
  },
} as const;

export const planos = {
  gratis: {
    nome: 'Grátis',
    descricao: 'Para conhecer a correção e criar o hábito.',
    preco: 0,
    sufixo: '/sempre',
    botao: 'Começar grátis',
    destino: '/criar-conta',
    itens: [
      '3 correções por dia',
      '1 transcrição de redação por foto por dia',
      'Banco de temas oficiais do ENEM',
      'Repertório essencial',
      'Histórico e evolução por competência',
    ],
  },
  pro: {
    nome: 'Pro',
    descricao: 'Para quem quer treinar todo dia até a prova.',
    selo: 'Mais recursos',
    sufixo: '/mês',
    detalheMensal: 'cancele quando quiser',
    detalheAnual: 'cobrado anualmente',
    itens: [
      'Tudo do plano Grátis',
      '10 correções por dia',
      '10 transcrições por foto por dia',
      'Repertório completo, em todos os eixos',
      'Possíveis temas do ENEM 2026',
      'Assistente Júlia: tire dúvidas sobre cada correção',
    ],
  },
} as const;

export const linhasComparativo: readonly LinhaComparativo[] = [
  { nome: 'Correções por dia', gratis: '3 por dia', pro: '10 por dia' },
  {
    nome: 'Transcrição de redação por foto',
    gratis: '1 por dia',
    pro: '10 por dia',
  },
  { nome: 'Banco de temas oficiais do ENEM', gratis: true, pro: true },
  { nome: 'Possíveis temas do ENEM 2026', gratis: false, pro: true },
  { nome: 'Repertório', gratis: 'Essencial', pro: 'Completo' },
  { nome: 'Histórico e evolução por competência', gratis: true, pro: true },
  { nome: 'Assistente Júlia', gratis: false, pro: true },
];
