import type { OrigemRedacao, Pagina, StatusRedacao } from '@/types/api';

export type PeriodoAdmin = 7 | 30 | 90;
export type PlanoUsuario = 'GRATIS' | 'PRO';
export type RecursoIAAdmin = 'CORRECAO' | 'TRANSCRICAO' | 'JULIA';

export type AdminUsuarioResumo = {
  id: string;
  nome: string;
  email: string;
  role: 'ALUNO' | 'ADMIN';
  plano: PlanoUsuario;
  emailVerificado: boolean;
  totalRedacoes: number;
  notaMedia: number | null;
  ultimaRedacaoEm: string | null;
  criadoEm: string;
};

export type AdminVisaoGeral = {
  periodo: PeriodoAdmin;
  geradoEm: string;
  totalUsuarios: number;
  novosNoPeriodo: number;
  ativosNoPeriodo: number;
  correcoesNoPeriodo: number;
  notaMediaNoPeriodo: number | null;
  assinantesPro: number;
  serieDiaria: { data: string; cadastros: number; correcoes: number }[];
  usoIaHoje: { recurso: RecursoIAAdmin; usados: number; teto: number }[];
  tokensHoje: number;
  usuariosNoLimiteHoje: number;
  distribuicaoNotas: { min: number; max: number; quantidade: number }[];
  mediaPorCompetencia: {
    competencia: 1 | 2 | 3 | 4 | 5;
    media: number | null;
  }[];
  ultimosCadastros: AdminUsuarioResumo[];
  alertas: {
    correcoesComErro24h: number;
    contasSemVerificacao48h: number;
    ultimoEventoStripeEm: string | null;
  };
};

export type ConcessaoPro = {
  id: string;
  inicio: string;
  fim: string;
  vigente: boolean;
  motivo: string;
  concedidaPor: string;
  revogadaEm: string | null;
  revogadaPor: string | null;
  motivoRevogacao: string | null;
};

export type AdminUsuarioDetalhe = {
  usuario: AdminUsuarioResumo;
  melhorNota: number | null;
  competenciaMaisFraca: {
    competencia: 1 | 2 | 3 | 4 | 5;
    media: number;
  } | null;
  assinatura: {
    status: string;
    ciclo: 'MENSAL' | 'ANUAL';
    periodoAtualFim: string;
    cancelarNoFimDoPeriodo: boolean;
    stripeCustomerId: string | null;
  } | null;
  concessaoPro: ConcessaoPro | null;
  concessoes: ConcessaoPro[];
  usoHoje: { recurso: RecursoIAAdmin; usados: number; limite: number }[];
  julia: { conversas: number; mensagens: number };
  redacoes: {
    id: string;
    enviadaEm: string;
    tema: string;
    origem: OrigemRedacao;
    status: StatusRedacao;
    nota: number | null;
  }[];
};

export type AdminUsuariosFiltros = {
  busca?: string;
  plano?: PlanoUsuario | '';
  email?: 'VERIFICADO' | 'PENDENTE' | '';
  pagina: number;
  tamanho: number;
};

export type AdminUsuariosPagina = Pagina<AdminUsuarioResumo>;
