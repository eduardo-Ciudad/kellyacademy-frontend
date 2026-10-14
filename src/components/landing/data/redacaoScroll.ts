export type Competencia = 'C1' | 'C2' | 'C3' | 'C4' | 'C5';

export type RedacaoSegment = {
  text: string;
  competencia?: Competencia;
};

export type RedacaoParagraph = {
  segments: RedacaoSegment[];
};

export type PanelNote = {
  competencia: Competencia;
  lead: string;
  text: string;
};

export type ChecklistItem = {
  status: 'warning' | 'missing' | 'complete';
  label: string;
  text: string;
};

export type RedacaoStep = {
  label: string;
  title: string;
  titleMuted: string;
  supportingText?: string;
  notes?: PanelNote[];
  checklist?: ChecklistItem[];
  x: number;
  contentY: number;
  panelLeft: number;
  panelWidth: number;
};

export const redacaoParagraphs: RedacaoParagraph[] = [
  {
    segments: [
      { text: 'Na ' },
      { text: 'Constituição Federal de 1988', competencia: 'C2' },
      {
        text: ', a cultura é assegurada como direito de todos os brasileiros. Entretanto, o acesso ao cinema ainda é privilégio de poucos, uma vez que as salas de exibição ',
      },
      { text: 'se concentra', competencia: 'C1' },
      {
        text: ' nas capitais e nos bairros mais ricos. Diante disso, é preciso discutir os entraves econômicos e estruturais que afastam grande parte da população do audiovisual.',
      },
    ],
  },
  {
    segments: [
      { text: 'Em primeiro lugar, ' },
      {
        text: 'o preço do ingresso pesa no orçamento das famílias de baixa renda, que precisam escolher entre o lazer e as despesas básicas',
        competencia: 'C3',
      },
      { text: '. ' },
      { text: 'Assim,', competencia: 'C4' },
      {
        text: ' o cinema deixa de ser um espaço de encontro coletivo e passa a ser um consumo restrito a quem pode pagar.',
      },
    ],
  },
  {
    segments: [
      {
        text: 'Além disso, existem outros motivos também.',
        competencia: 'C3',
      },
      { text: ' A falta de salas no interior e nas periferias é um problema. ' },
      { text: 'Assim, o problema persiste.', competencia: 'C4' },
    ],
  },
  {
    segments: [
      { text: 'Portanto, ' },
      {
        text: 'o governo deve fazer algo para mudar isso',
        competencia: 'C5',
      },
      { text: ', para que todos tenham acesso à cultura.' },
    ],
  },
];

export const redacaoSteps: RedacaoStep[] = [
  {
    label: 'Introdução',
    title: 'A introdução apresenta a tese.',
    titleMuted: 'E já mostra seu repertório.',
    supportingText:
      'A Kelly lê o primeiro parágrafo como a banca: procura o tema, o ponto de vista e a referência que vai sustentar o texto.',
    notes: [
      {
        competencia: 'C2',
        lead: 'Repertório legitimado.',
        text: 'A Constituição de 1988 abre o tema com uma referência válida.',
      },
      {
        competencia: 'C1',
        lead: '“se concentra” → se concentram.',
        text: 'O verbo concorda com “salas”.',
      },
    ],
    x: 0,
    contentY: 0,
    panelLeft: 600,
    panelWidth: 600,
  },
  {
    label: 'Desenvolvimento 1',
    title: 'Um argumento desenvolvido.',
    titleMuted: 'Causa, consequência, conexão.',
    notes: [
      {
        competencia: 'C3',
        lead: 'Argumento completo.',
        text: 'A causa (o preço) leva a uma consequência clara (o cinema vira privilégio).',
      },
      {
        competencia: 'C4',
        lead: '“Assim” faz o texto andar.',
        text: 'O conectivo retoma a ideia anterior e leva à conclusão do parágrafo.',
      },
    ],
    x: 200,
    contentY: -150,
    panelLeft: 800,
    panelWidth: 400,
  },
  {
    label: 'Desenvolvimento 2',
    title: 'Aqui a nota cai.',
    titleMuted: 'O argumento é anunciado e abandonado.',
    notes: [
      {
        competencia: 'C3',
        lead: '“Outros motivos” não é argumento.',
        text: 'Faltam explicação, exemplo ou dado. É aqui que sua C3 perde 40 pontos.',
      },
      {
        competencia: 'C4',
        lead: 'O mesmo “Assim”, sem ligação.',
        text: 'O conectivo aparece, mas não retoma nada do que veio antes.',
      },
    ],
    x: 480,
    contentY: -290,
    panelLeft: 0,
    panelWidth: 400,
  },
  {
    label: 'Conclusão',
    title: 'A proposta precisa estar completa.',
    titleMuted: 'Agente, ação, meio e finalidade.',
    checklist: [
      { status: 'warning', label: 'Agente', text: '“o governo” — vago: qual órgão?' },
      { status: 'missing', label: 'Ação', text: '“fazer algo” não diz o que fazer' },
      { status: 'missing', label: 'Meio ou modo', text: 'falta o “por meio de…”' },
      { status: 'complete', label: 'Finalidade', text: '“para que todos tenham acesso à cultura”' },
      { status: 'missing', label: 'Detalhamento', text: 'nenhum elemento explicado' },
    ],
    x: 680,
    contentY: -330,
    panelLeft: 0,
    panelWidth: 600,
  },
];

export const competenciaStyles: Record<
  Competencia,
  { highlight: string; underline: string; badgeBg: string; badgeText: string }
> = {
  C1: { highlight: 'rgba(125,184,255,0.38)', underline: '#4a90e2', badgeBg: '#e3efff', badgeText: '#1f5fbf' },
  C2: { highlight: 'rgba(185,162,251,0.30)', underline: '#8b6fe0', badgeBg: '#ece6ff', badgeText: '#6a4fd1' },
  C3: { highlight: 'rgba(79,209,181,0.30)', underline: '#2fae92', badgeBg: '#ddf5ef', badgeText: '#1d8a72' },
  C4: { highlight: 'rgba(245,185,74,0.30)', underline: '#d99a22', badgeBg: '#fbefd6', badgeText: '#a8700f' },
  C5: { highlight: 'rgba(245,141,176,0.30)', underline: '#d9628b', badgeBg: '#fde5ee', badgeText: '#b8436b' },
};
