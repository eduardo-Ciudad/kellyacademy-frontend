export type TourTarget =
  | 'temas'
  | 'nova-redacao'
  | 'repertorio'
  | 'evolucao'
  | 'correcoes-hoje'
  | 'julia-botao'
  | 'julia-competencia';

export type TourId = 'principal' | 'julia';

export type TourStep = {
  target: TourTarget;
  title: string;
  text: { desktop: string; mobile?: string };
  radius: number;
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
    title: '3 correções por dia',
    text: {
      desktop:
        'No plano gratuito você tem 3 correções por dia. O contador fica aqui e renova à meia-noite.',
      mobile:
        'No plano gratuito você tem 3 correções por dia. O contador fica aqui e renova à meia-noite.',
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

export const tours: Record<TourId, TourStep[]> = {
  principal: principalSteps,
  julia: juliaSteps,
};

export const tourSteps = tours.principal;
