import { clearStoredSession, getStoredSession } from '@/lib/session';
import type {
  MotivoImagemInvalida,
  ProblemDetail,
  RecursoIA,
  RecursoPro,
} from '@/types/api';

const DEFAULT_TIMEOUT_MS = 20_000;
export const JULIA_TIMEOUT_MS = 75_000;
// pior caso do backend: 2 tentativas × (10s conexão + 60s leitura)
const IA_TIMEOUT_MS = 180_000;

export function timeoutPara(method: string, path: string) {
  const normalizedMethod = method.toUpperCase();
  if (
    normalizedMethod === 'POST' &&
    /^\/redacoes\/[^/]+\/julia\/mensagens\/?$/.test(path)
  )
    return JULIA_TIMEOUT_MS;
  if (
    normalizedMethod === 'POST' &&
    /^\/(?:redacoes|transcricoes)\/?$/.test(path)
  )
    return IA_TIMEOUT_MS;
  return DEFAULT_TIMEOUT_MS;
}

export type ApiErrorCode = 'HTTP' | 'TIMEOUT' | 'NETWORK';

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  detail: string;
  codigo?: string;
  erros?: Record<string, string | string[]>;
  retryAfter?: number;
  limite?: number;
  recurso?: RecursoIA | RecursoPro;
  motivo?: MotivoImagemInvalida;

  constructor(options: {
    code: ApiErrorCode;
    status: number;
    detail: string;
    codigo?: string;
    erros?: Record<string, string | string[]>;
    retryAfter?: number;
    limite?: number;
    recurso?: RecursoIA | RecursoPro;
    motivo?: MotivoImagemInvalida;
  }) {
    super(options.detail);
    this.name = 'ApiError';
    this.code = options.code;
    this.status = options.status;
    this.detail = options.detail;
    this.codigo = options.codigo;
    this.erros = options.erros;
    this.retryAfter = options.retryAfter;
    this.limite = options.limite;
    this.recurso = options.recurso;
    this.motivo = options.motivo;
  }
}

export function recursoProDoErro(erro: unknown): RecursoPro | null {
  if (
    erro instanceof ApiError &&
    erro.status === 403 &&
    erro.codigo === 'PLANO_PRO_NECESSARIO' &&
    (erro.recurso === 'JULIA' ||
      erro.recurso === 'TEMAS_POSSIVEIS' ||
      erro.recurso === 'REPERTORIO_COMPLETO')
  )
    return erro.recurso;
  return null;
}

function fallbackMessage(status: number, isAuthRoute: boolean) {
  if (status === 400) return 'Não foi possível processar os dados enviados.';
  if (status === 401)
    return isAuthRoute
      ? 'E-mail ou senha inválidos.'
      : 'Sua sessão expirou. Entre novamente.';
  if (status === 403) return 'Você não tem permissão para realizar esta ação.';
  if (status === 404) return 'O conteúdo solicitado não foi encontrado.';
  if (status === 409) return 'Já existe um cadastro com estes dados.';
  if (status === 429)
    return 'Você atingiu o limite de solicitações. Tente novamente mais tarde.';
  if (status >= 500)
    return 'O servidor encontrou um problema. Tente novamente em instantes.';
  return 'Não foi possível concluir a solicitação.';
}

async function parseProblem(response: Response): Promise<ProblemDetail> {
  if (!response.headers.get('content-type')?.includes('json')) return {};
  try {
    return (await response.json()) as ProblemDetail;
  } catch {
    return {};
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const method = options.method?.toUpperCase() ?? 'GET';
  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(
    () =>
      timeoutController.abort(
        new DOMException('Tempo limite excedido.', 'TimeoutError'),
      ),
    timeoutPara(method, path),
  );
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeoutController.signal])
    : timeoutController.signal;
  const headers = new Headers(options.headers);
  const token = getStoredSession()?.accessToken;
  const isAuthRoute = /^\/auth(?:\/|$)/.test(path);

  // FormData precisa ficar sem Content-Type para o navegador incluir o boundary.
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  )
    headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL ?? ''}${path}`,
      {
        ...options,
        headers,
        signal,
      },
    );

    if (response.status === 401 && !isAuthRoute) clearStoredSession('expired');

    if (!response.ok) {
      const problem = await parseProblem(response);
      const retryAfterValue = response.headers.get('Retry-After');
      const retryAfter = retryAfterValue
        ? Number.parseInt(retryAfterValue, 10)
        : undefined;
      throw new ApiError({
        code: 'HTTP',
        status: response.status,
        detail: problem.detail || fallbackMessage(response.status, isAuthRoute),
        codigo: problem.codigo,
        erros: problem.erros,
        retryAfter: Number.isNaN(retryAfter) ? undefined : retryAfter,
        limite: problem.limite,
        recurso: problem.recurso,
        motivo: problem.motivo,
      });
    }

    if (
      response.status === 204 ||
      response.headers.get('content-length') === '0'
    )
      return undefined as T;
    const text = await response.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (options.signal?.aborted) {
      throw (
        options.signal.reason ??
        new DOMException('Solicitação cancelada.', 'AbortError')
      );
    }
    if (timeoutController.signal.aborted) {
      throw new ApiError({
        code: 'TIMEOUT',
        status: 0,
        detail: 'A solicitação demorou mais que o esperado.',
      });
    }
    throw new ApiError({
      code: 'NETWORK',
      status: 0,
      detail:
        'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}
