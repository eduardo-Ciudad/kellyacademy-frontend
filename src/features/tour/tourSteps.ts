export type TourTarget =
  | 'temas'
  | 'nova-redacao'
  | 'repertorio'
  | 'evolucao'
  | 'correcoes-hoje'
  | 'julia-botao'
  | 'julia-competencia'
  | 'nova-redacao-lista'
  | 'nova-redacao-meu-tema'
  | 'nova-redacao-etapas';

export type TourId = 'principal' | 'julia' | 'nova-redacao';

export type TourStep = {
  target: TourTarget;
  title: string;
  text: { desktop: string; mobile?: string };
  radius: number;
  mobileRadius?: number;
};

const principalSteps: TourStep[] = [
  {
    target: 'temas',
    title: 'Aqui ficam os temas',
    text: {
      desktop:
        'Todos os temas oficiais do ENEM e os possíveis temas de 2026, com argumentos e repertório para cada um.',
    },
    radius: 14,
  },
  {
    target: 'nova-redacao',
    title: 'Escreva sua redação',
    text: {
      desktop:
        'Comece por aqui a qualquer momento. Você escolhe o tema, escreve no editor e a IA corrige nas 5 competências.',
      mobile:
        'Toque no + para começar. Você escolhe o tema, escreve no editor e a IA corrige nas 5 competências do ENEM.',
    },
    radius: 999,
  },
  {
    target: 'repertorio',
    title: 'Repertório pronto para usar',
    text: {
      desktop:
        'Pensadores, leis, dados e obras separados por eixo do ENEM, com a ideia central e como encaixar no seu texto.',
    },
    radius: 14,
  },
  {
    target: 'evolucao',
    title: 'Veja sua nota evoluir',
    text: {
      desktop:
        'Depois da primeira correção aparecem aqui sua média, a evolução por competência e o próximo passo para treinar.',
    },
    radius: 14,
  },
  {
    target: 'correcoes-hoje',
    title: 'Suas correções do dia',
    text: {
      desktop:
        'O contador mostra quantas correções você ainda tem hoje e renova à meia-noite.',
      mobile:
        'O contador mostra quantas correções você ainda tem hoje e renova à meia-noite.',
    },
    radius: 14,
  },
];

const juliaSteps: TourStep[] = [
  {
    target: 'julia-botao',
    title: 'Conheça a Júlia',
    text: {
      desktop:
        'Ficou com dúvida na correção? A Júlia, assistente da Kelly Academy, explica por que você perdeu pontos em cada competência. Ela só fala desta redação e não altera sua nota.',
      mobile:
        'Ficou com dúvida na correção? Toque aqui e a Júlia explica por que você perdeu pontos em cada competência. Ela não altera sua nota.',
    },
    radius: 999,
  },
  {
    target: 'julia-competencia',
    title: 'Pergunte direto na competência',
    text: {
      desktop:
        'Use "Perguntar à Júlia" em qualquer competência e ela já abre focada nela, com a pergunta pronta.',
      mobile:
        'Toque em "Perguntar à Júlia" na competência e ela já abre focada nela, com a pergunta pronta.',
    },
    radius: 14,
  },
];

const novaRedacaoSteps: TourStep[] = [
  {
    target: 'nova-redacao-lista',
    title: 'Escolha um tema pronto',
    text: {
      desktop:
        'Aqui estão os temas oficiais do ENEM, os possíveis temas de 2026 e os temas que você já escreveu.',
      mobile:
        'Temas oficiais do ENEM, possíveis temas de 2026 e os temas que você já escreveu.',
    },
    radius: 20,
  },
  {
    target: 'nova-redacao-meu-tema',
    title: 'Ou traga o seu tema',
    text: {
      desktop:
        'Recebeu uma proposta na escola ou no cursinho? Digite o título e a Kelly corrige do mesmo jeito. O tema fica salvo para você praticar de novo.',
      mobile:
        'Recebeu uma proposta na escola ou no cursinho? Digite o título e a Kelly corrige do mesmo jeito.',
    },
    radius: 20,
  },
  {
    target: 'nova-redacao-etapas',
    title: 'Depois, é só escrever',
    text: {
      desktop:
        'Com o tema escolhido, você decide se digita a redação no editor ou envia uma foto dela escrita à mão.',
      mobile:
        'Com o tema escolhido, você digita a redação no editor ou envia uma foto dela escrita à mão.',
    },
    radius: 999,
    mobileRadius: 12,
  },
];

export const tours: Record<TourId, TourStep[]> = {
  principal: principalSteps,
  julia: juliaSteps,
  'nova-redacao': novaRedacaoSteps,
};

export const tourSteps = tours.principal;
