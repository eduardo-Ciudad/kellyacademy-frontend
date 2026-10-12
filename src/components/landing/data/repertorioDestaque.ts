import type { FuncaoArgumentativa, TipoEntidade } from '@/types/api';

export const REPERTORIO_STATS = [
  { value: 63, label: 'repertórios curados' },
  { value: 13, label: 'eixos temáticos do ENEM' },
  { value: 52, label: 'problemas sociais mapeados' },
  { value: 12, label: 'artigos da Constituição explicados' },
] as const;

export const EIXOS = [
  'Saúde',
  'Educação',
  'Infância e adolescência',
  'Juventude',
  'Tecnologia e sociedade',
  'Trabalho e cuidado',
  'PcD e neurodiversidade',
  'Invisibilidade social',
  'Raça e gênero',
  'Cidades e clima',
  'Envelhecimento',
  'Violência e segurança',
  'Povos indígenas e comunidades tradicionais',
] as const;

export type FichaRepertorio = {
  tipo: Extract<
    TipoEntidade,
    'PERSON' | 'LEGAL_SOURCE' | 'EVIDENCE' | 'CULTURAL_WORK'
  >;
  iniciais: string;
  nome: string;
  subtitulo?: string;
  typeLabel: string;
  eixo: string;
  ideiaCentral: string;
  lembre?: string;
  comoUsar?: string;
  evite?: string;
  exemplo?: string;
  funcoes: FuncaoArgumentativa[];
};

export const FICHAS: readonly FichaRepertorio[] = [
  {
    tipo: 'PERSON',
    iniciais: 'PF',
    nome: 'Paulo Freire',
    subtitulo: 'educação dialógica e autonomia',
    typeLabel: 'EDUCADOR / PENSADOR',
    eixo: 'Educação',
    ideiaCentral:
      'A educação deve formar sujeitos capazes de compreender criticamente a realidade e participar do processo educativo, em oposição a práticas meramente transmissivas.',
    lembre:
      'Freire é mais útil quando ligado a autonomia, diálogo, leitura crítica do mundo e participação do estudante — não como citação genérica sobre educação.',
    comoUsar:
      'Use quando a proposta argumentativa envolve formação crítica e participação ativa do estudante.',
    evite:
      'Não atribuir frases populares sem fonte; evitar “educação muda o mundo” como citação automática.',
    exemplo:
      'A pedagogia de Paulo Freire contribui para compreender que a educação cidadã não se limita à transmissão de conteúdos, pois exige diálogo e participação do estudante na construção do conhecimento.',
    funcoes: ['DEFINE_CONCEPT', 'SUPPORT_INTERVENTION', 'SOCIAL_CRITIQUE'],
  },
  {
    tipo: 'PERSON',
    iniciais: 'AH',
    nome: 'Axel Honneth',
    subtitulo: 'reconhecimento e invisibilidade social',
    typeLabel: 'FILÓSOFO / CONCEITO',
    eixo: 'Invisibilidade social',
    ideiaCentral:
      'A invisibilidade social pode ser compreendida como forma simbólica de desrespeito: alguém é fisicamente percebido, mas não reconhecido como sujeito moral e social válido.',
    lembre:
      'Para Honneth, invisibilidade social não significa ser literalmente invisível; significa não receber reconhecimento social e moral suficiente para ser tratado como sujeito plenamente válido.',
    comoUsar:
      'Use quando o problema envolve apagamento social e dignidade, combinando bem com Fernando Braga da Costa.',
    evite:
      'Não usar “reconhecimento” como sinônimo genérico de fama, atenção ou visibilidade midiática.',
    exemplo:
      'A teoria do reconhecimento de Axel Honneth ajuda a interpretar a invisibilidade social como forma de desrespeito, pois determinados indivíduos podem estar presentes no espaço público sem serem efetivamente reconhecidos como sujeitos de igual valor.',
    funcoes: ['DEFINE_CONCEPT', 'SHOW_INVISIBILITY', 'SOCIAL_CRITIQUE'],
  },
  {
    tipo: 'PERSON',
    iniciais: 'AK',
    nome: 'Ailton Krenak',
    typeLabel: 'INTELECTUAL / ESCRITOR INDÍGENA',
    eixo: 'Povos indígenas',
    ideiaCentral:
      'Intelectual Krenak e liderança histórica do movimento indígena, articulou direitos constitucionais e produz reflexão sobre modos de vida, natureza, desenvolvimento e diversidade cultural.',
    lembre:
      'Krenak ajuda a questionar a ideia de natureza como mero recurso e a relacionar território, cultura e continuidade da vida dos povos originários.',
    comoUsar:
      'Use em temas que envolvam território e ambiente quando for importante incorporar perspectiva indígena, e não apenas falar sobre indígenas a partir de fora.',
    evite:
      'Não transformar Krenak em “ambientalista genérico”; preserve a dimensão indígena, territorial, histórica e cultural de sua obra.',
    exemplo:
      'A reflexão de Ailton Krenak permite questionar modelos de desenvolvimento que separam sociedade e natureza, especialmente quando a exploração territorial ameaça modos de vida e continuidade cultural de povos originários.',
    funcoes: ['SOCIAL_CRITIQUE', 'DEFINE_CONCEPT', 'HISTORICAL_CONTEXT'],
  },
  {
    tipo: 'LEGAL_SOURCE',
    iniciais: '6º',
    nome: 'Constituição Federal, Art. 6º',
    subtitulo: 'direitos sociais',
    typeLabel: 'CONSTITUIÇÃO FEDERAL',
    eixo: 'Cidades e clima',
    ideiaCentral:
      'Garante os direitos sociais — entre eles educação, saúde, alimentação, trabalho, moradia e transporte.',
    comoUsar:
      'Excelente para mostrar distância entre direito social e acesso efetivo.',
    funcoes: ['LEGAL_GAP'],
  },
  {
    tipo: 'EVIDENCE',
    iniciais: 'AV',
    nome: 'Atlas da Violência 2025',
    typeLabel: 'ESTATÍSTICA OFICIAL',
    eixo: 'Violência e segurança',
    ideiaCentral:
      'Em 2023, uma pessoa negra tinha 2,7 vezes mais chance de ser vítima de homicídio do que uma pessoa não negra, segundo o Atlas.',
    evite:
      'Indicador é risco relativo em violência letal; não generalizar para toda forma de violência.',
    funcoes: ['PROVE_PROBLEM'],
  },
  {
    tipo: 'CULTURAL_WORK',
    iniciais: 'QH',
    nome: 'Que Horas Ela Volta?',
    subtitulo: 'Anna Muylaert',
    typeLabel: 'FILME',
    eixo: 'Trabalho e cuidado',
    ideiaCentral:
      'O filme acompanha uma trabalhadora doméstica e a chegada de sua filha à casa dos patrões, tensionando fronteiras de classe, trabalho de cuidado, acesso à universidade e desigualdades naturalizadas.',
    lembre:
      'Quem cuida dos filhos de outras famílias muitas vezes precisa se afastar dos próprios filhos e enfrenta limites sociais considerados “naturais”.',
    comoUsar:
      'Use como exemplo cultural para humanizar argumentos sobre trabalho doméstico e reprodução de desigualdades.',
    evite:
      'Não apresentar o filme como retrato estatístico de todas as trabalhadoras domésticas.',
    exemplo:
      'Em Que Horas Ela Volta?, a relação entre Val, sua filha e a família empregadora expõe fronteiras de classe que ultrapassam o salário e organizam também espaços, expectativas e oportunidades.',
    funcoes: ['EXAMPLE', 'SOCIAL_CRITIQUE', 'COMPARE_REALITY'],
  },
];

export const REPERTORIO_PILARES = [
  {
    titulo: 'Organizado por eixo e problema',
    descricao:
      'Do macroeixo ao problema social: você encontra o repertório pelo assunto do tema, não pelo nome que já precisa saber.',
  },
  {
    titulo: 'Com o erro comum de cada um',
    descricao:
      'Cada ficha mostra como o repertório costuma ser mal usado — o que separa um repertório produtivo de uma citação decorada.',
  },
  {
    titulo: 'Ligado ao seu tema',
    descricao:
      'Ao escolher um tema, a Kelly sugere os repertórios do eixo certo para você treinar.',
    emBreve: true,
  },
] as const;
