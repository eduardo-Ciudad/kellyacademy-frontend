export type ProblemDetail = {
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  erros?: Record<string, string | string[]>;
  limite?: number;
};

export type LoginRequest = { email: string; senha: string };

export type CadastroRequest = {
  nome: string;
  email: string;
  senha: string;
};

export type LoginResponse = {
  accessToken: string;
  tipo: string;
  expiraEm: string;
};

export type Usuario = { id: string; email: string; role: string };

export type CorrecoesHoje = {
  usadas: number;
  limite: number;
  restantes: number;
  renovaEm: string;
};

export type Tema = {
  id: string;
  titulo: string;
  textosMotivadores: string | null;
  origem: 'ENEM_OFICIAL' | 'AUTORAL';
  ano: number | null;
};

export type TipoRedacao = 'PRATICA' | 'DIAGNOSTICA';
export type StatusRedacao = 'ENVIADA' | 'EM_AVALIACAO' | 'AVALIADA' | 'ERRO';

export type ResumoRedacao = {
  id: string;
  temaId: string;
  temaTitulo: string;
  tipo: TipoRedacao;
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
  status: StatusRedacao;
  texto: string;
  enviadaEm: string;
  avaliacao: Avaliacao | null;
};
