export type RecursoIA = 'CORRECAO' | 'TRANSCRICAO';
export type MotivoImagemInvalida =
  'VAZIA' | 'GRANDE_DEMAIS' | 'TIPO_INVALIDO' | 'QUANTIDADE_INVALIDA';

export type ProblemDetail = {
  title?: string;
  status?: number;
  detail?: string;
  codigo?: string;
  instance?: string;
  erros?: Record<string, string | string[]>;
  limite?: number;
  recurso?: RecursoIA;
  motivo?: MotivoImagemInvalida;
};

export type PapelMensagemJulia = 'USUARIO' | 'JULIA';

export type MensagemJulia = {
  id: string;
  papel: PapelMensagemJulia;
  conteudo: string;
  criadaEm: string;
};

export type JuliaConversaResponse = {
  mensagens: MensagemJulia[];
  restantesConversa: number;
  restantesHoje: number;
};

export type EnviarPerguntaJuliaRequest = { pergunta: string };

export type EnviarPerguntaJuliaResponse = {
  pergunta: MensagemJulia;
  resposta: MensagemJulia;
  restantesConversa: number;
  restantesHoje: number;
};

export type LoginRequest = { email: string; senha: string };

export type CadastroRequest = {
  nome: string;
  email: string;
  senha: string;
};

export type CadastroResponse = {
  emailVerificado: boolean;
};

export type ReenviarVerificacaoResponse = {
  mensagem: string;
};

export type SolicitarRedefinicaoResponse = { mensagem: string };

export type AlterarSenhaResponse = LoginResponse;

export type LoginResponse = {
  accessToken: string;
  tipo: string;
  expiraEm: string;
};

export type Usuario = { id: string; email: string; role: string };

export type UsoHoje = {
  usadas: number;
  limite: number;
  restantes: number;
  renovaEm: string;
};

export type Tema = {
  id: string;
  titulo: string;
  textosMotivadores: string | null;
  origem: 'ENEM_OFICIAL' | 'AUTORAL' | 'PREVISAO';
  ano: number | null;
};

export type ForcaEvidencia = 'MUITO_FORTE' | 'FORTE' | 'VALE_TREINAR';

export type TemaPossivel = {
  id: string;
  titulo: string;
  ano: number;
  forca: ForcaEvidencia;
  eixo: string;
  grupoSocial: string;
  justificativa: string;
  argumentos: string[];
  marcosLegais: string[];
  agentesIntervencao: string[];
  adicionado: boolean;
};

export type TipoRedacao = 'PRATICA' | 'DIAGNOSTICA';
export type OrigemRedacao = 'DIGITADO' | 'MANUSCRITO';
export type StatusRedacao = 'ENVIADA' | 'EM_AVALIACAO' | 'AVALIADA' | 'ERRO';

export type ResumoRedacao = {
  id: string;
  temaId: string;
  temaTitulo: string;
  tipo: TipoRedacao;
  origem: OrigemRedacao;
  status: StatusRedacao;
  enviadaEm: string;
  notaTotal: number | null;
};

export type Competencia = {
  numero: 1 | 2 | 3 | 4 | 5;
  nota: 0 | 40 | 80 | 120 | 160 | 200;
  nivelReferencia: string;
  resumo: string;
  problemas: string[];
};

export type Avaliacao = {
  notaTotal: number;
  anulada: boolean;
  motivoAnulacao: string | null;
  competencias: Competencia[];
  pontosFortes: string[];
  pontosDesenvolvimento: string[];
  diagnostico: string;
  avaliadoEm: string;
};

export type RedacaoResponse = {
  id: string;
  tema: Tema | null;
  tipo: TipoRedacao;
  origem: OrigemRedacao;
  status: StatusRedacao;
  texto: string;
  enviadaEm: string;
  avaliacao: Avaliacao | null;
};

export type TranscricaoResponse = {
  texto: string;
  linhas: string[];
  linhasComTrechoIlegivel: number[];
  qtdLinhas: number;
};

export type NotasCompetencias = {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
};

export type MediaRecente = NotasCompetencias & {
  total: number;
};

export type PontoEvolucao = {
  redacaoId: string;
  enviadaEm: string;
  temaTitulo: string;
  anulada: boolean;
  notaTotal: number | null;
  notas: NotasCompetencias | null;
};

export type Evolucao = {
  totalCorrigidas: number;
  melhorNota: number | null;
  mediaRecente: MediaRecente | null;
  competenciaFoco: 1 | 2 | 3 | 4 | 5 | null;
  serie: PontoEvolucao[];
};

export type TipoEntidade =
  | 'PERSON'
  | 'CONCEPT'
  | 'CULTURAL_WORK'
  | 'LEGAL_SOURCE'
  | 'EVIDENCE'
  | 'INSTITUTION'
  | 'EVENT';

export type FuncaoArgumentativa =
  | 'EXPLAIN_CAUSE'
  | 'EXPLAIN_CONSEQUENCE'
  | 'SHOW_INEQUALITY'
  | 'SHOW_INVISIBILITY'
  | 'DEFINE_CONCEPT'
  | 'SOCIAL_CRITIQUE'
  | 'HISTORICAL_CONTEXT'
  | 'PROVE_PROBLEM'
  | 'LEGAL_GAP'
  | 'COMPARE_REALITY'
  | 'EXAMPLE'
  | 'SUPPORT_INTERVENTION';

export type Nivel = 'LOW' | 'MEDIUM' | 'HIGH';
export type Dificuldade = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type PapelRepertorio = 'REPERTOIRE' | 'EVIDENCE' | 'BOTH';
export type TipoEvidencia =
  | 'OFFICIAL_STATISTICS'
  | 'NATIONAL_SURVEY'
  | 'OFFICIAL_HEALTH_SURVEILLANCE'
  | 'ACADEMIC_RESEARCH'
  | 'SCIENTIFIC_STUDY'
  | 'SCOPING_REVIEW'
  | 'SYSTEMATIC_REVIEW'
  | 'INTEGRATIVE_REVIEW'
  | 'INSTITUTIONAL_REPORT'
  | 'INSTITUTIONAL_SUMMARY'
  | 'ADMINISTRATIVE_DATA'
  | 'TIME_SERIES'
  | 'CROSS_SECTIONAL'
  | 'CONTENT_ANALYSIS';
export type TipoFonte = 'PROFILE' | 'CONCEPT' | 'GENERAL';

export type ProblemaSocial = {
  slug: string;
  nome: string;
  macroeixo: string;
};

export type Macroeixo = {
  slug: string;
  nome: string;
  problemas: ProblemaSocial[];
};

export type RepertorioResumo = {
  codigo: string;
  nome: string;
  subtitulo: string | null;
  tipo: TipoEntidade;
  tipoDescricao: string | null;
  lembreNaProva: string | null;
  saturacao: Nivel | null;
  riscoUso: Nivel | null;
  problemas: ProblemaSocial[];
};

export type FonteRepertorio = {
  tipo: TipoFonte;
  descricao: string;
  url: string | null;
};

export type EvidenciaRepertorio = {
  tipos: TipoEvidencia[];
  populacao: string | null;
  ano: number | null;
};

export type Repertorio = RepertorioResumo & {
  papel: PapelRepertorio;
  area: string | null;
  pais: string | null;
  ideiaCentral: string | null;
  comoUsar: string | null;
  exemploAplicacao: string | null;
  erroComum: string | null;
  dificuldade: Dificuldade | null;
  funcoesArgumentativas: FuncaoArgumentativa[];
  fontes: FonteRepertorio[];
  evidencia: EvidenciaRepertorio | null;
};

export type Pagina<T> = {
  itens: T[];
  pagina: number;
  tamanho: number;
  totalItens: number;
  totalPaginas: number;
  temProxima: boolean;
};
