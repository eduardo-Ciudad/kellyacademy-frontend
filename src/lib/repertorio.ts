import type {
  Dificuldade,
  FuncaoArgumentativa,
  Nivel,
  PapelRepertorio,
  TipoEntidade,
  TipoEvidencia,
  TipoFonte,
} from '@/types/api';

export const TIPO_ENTIDADE_LABELS: Record<TipoEntidade, string> = {
  PERSON: 'Pessoa',
  CONCEPT: 'Conceito',
  CULTURAL_WORK: 'Obra',
  LEGAL_SOURCE: 'Lei ou norma',
  EVIDENCE: 'Dado ou pesquisa',
  INSTITUTION: 'Instituição',
  EVENT: 'Fato histórico',
};

export const FUNCAO_ARGUMENTATIVA_LABELS: Record<FuncaoArgumentativa, string> =
  {
    EXPLAIN_CAUSE: 'Explicar a causa',
    EXPLAIN_CONSEQUENCE: 'Explicar consequências',
    SHOW_INEQUALITY: 'Mostrar desigualdade',
    SHOW_INVISIBILITY: 'Mostrar invisibilidade',
    DEFINE_CONCEPT: 'Definir um conceito',
    SOCIAL_CRITIQUE: 'Fazer crítica social',
    HISTORICAL_CONTEXT: 'Dar contexto histórico',
    PROVE_PROBLEM: 'Provar o problema',
    LEGAL_GAP: 'Lei × realidade',
    COMPARE_REALITY: 'Comparar realidades',
    EXAMPLE: 'Exemplo concreto',
    SUPPORT_INTERVENTION: 'Apoiar a proposta de intervenção',
  };

export const DIFICULDADE_LABELS: Record<Dificuldade, string> = {
  BASIC: 'Básico',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
};

export const PAPEL_REPERTORIO_LABELS: Record<PapelRepertorio, string> = {
  REPERTOIRE: 'Repertório sociocultural',
  EVIDENCE: 'Evidência',
  BOTH: 'Repertório e evidência',
};

export const TIPO_FONTE_LABELS: Record<TipoFonte, string> = {
  PROFILE: 'Perfil',
  CONCEPT: 'Conceito',
  GENERAL: 'Fonte',
};

export const TIPO_EVIDENCIA_LABELS: Record<TipoEvidencia, string> = {
  OFFICIAL_STATISTICS: 'Estatística oficial',
  NATIONAL_SURVEY: 'Pesquisa nacional',
  OFFICIAL_HEALTH_SURVEILLANCE: 'Vigilância oficial de saúde',
  ACADEMIC_RESEARCH: 'Pesquisa acadêmica',
  SCIENTIFIC_STUDY: 'Estudo científico',
  SCOPING_REVIEW: 'Revisão de escopo',
  SYSTEMATIC_REVIEW: 'Revisão sistemática',
  INTEGRATIVE_REVIEW: 'Revisão integrativa',
  INSTITUTIONAL_REPORT: 'Relatório institucional',
  INSTITUTIONAL_SUMMARY: 'Síntese institucional',
  ADMINISTRATIVE_DATA: 'Dados administrativos',
  TIME_SERIES: 'Série histórica',
  CROSS_SECTIONAL: 'Estudo transversal',
  CONTENT_ANALYSIS: 'Análise de conteúdo',
};

export const TIPOS_FILTRO = [
  'PERSON',
  'CONCEPT',
  'CULTURAL_WORK',
  'LEGAL_SOURCE',
  'EVIDENCE',
] as const satisfies readonly TipoEntidade[];

export const FUNCOES_ARGUMENTATIVAS = Object.keys(
  FUNCAO_ARGUMENTATIVA_LABELS,
) as FuncaoArgumentativa[];

export type FiltrosRepertorio = {
  macroeixo: string | null;
  problema: string | null;
  tipo: TipoEntidade | null;
  funcao: FuncaoArgumentativa | null;
  q: string;
};

const tipos = new Set<TipoEntidade>(
  Object.keys(TIPO_ENTIDADE_LABELS) as TipoEntidade[],
);
const funcoes = new Set<FuncaoArgumentativa>(FUNCOES_ARGUMENTATIVAS);
const slugValido = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function lerSlug(valor: string | null) {
  return valor && valor.length <= 60 && slugValido.test(valor) ? valor : null;
}

export function lerFiltros(params: URLSearchParams): FiltrosRepertorio {
  const tipo = params.get('tipo') as TipoEntidade | null;
  const funcao = params.get('funcao') as FuncaoArgumentativa | null;
  return {
    macroeixo: lerSlug(params.get('macroeixo')),
    problema: lerSlug(params.get('problema')),
    tipo: tipo && tipos.has(tipo) ? tipo : null,
    funcao: funcao && funcoes.has(funcao) ? funcao : null,
    q: (params.get('q') ?? '').trim().slice(0, 100),
  };
}

export function filtrosParaParams(filtros: FiltrosRepertorio) {
  const params = new URLSearchParams();
  if (filtros.macroeixo) params.set('macroeixo', filtros.macroeixo);
  if (filtros.problema) params.set('problema', filtros.problema);
  if (filtros.tipo) params.set('tipo', filtros.tipo);
  if (filtros.funcao) params.set('funcao', filtros.funcao);
  if (filtros.q) params.set('q', filtros.q);
  return params;
}

export function contarFiltrosAtivos(filtros: FiltrosRepertorio) {
  return [
    filtros.macroeixo,
    filtros.problema,
    filtros.tipo,
    filtros.funcao,
  ].filter(Boolean).length;
}

export function seloSaturacao(nivel: Nivel | null) {
  if (nivel === 'HIGH') return 'Muito usado';
  if (nivel === 'LOW') return 'Pouco usado';
  return null;
}

export function seloRisco(nivel: Nivel | null) {
  return nivel === 'HIGH' ? 'Cuidado ao usar' : null;
}

export function dadoAntigo(ano: number | null, anoAtual: number) {
  return ano !== null && anoAtual - ano > 2;
}
