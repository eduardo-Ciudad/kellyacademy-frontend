import type { AdminVisaoGeral, PeriodoAdmin } from '@/types/admin';
import type { ApiError } from '@/lib/api';

type SerieDiaria = AdminVisaoGeral['serieDiaria'];
type MediaCompetencia = AdminVisaoGeral['mediaPorCompetencia'][number];

export function periodoAdminFromSearch(value: string | null): PeriodoAdmin {
  const parsed = Number(value);
  return parsed === 7 || parsed === 30 || parsed === 90 ? parsed : 30;
}

export function percentualSeguro(parte: number, total: number) {
  if (total <= 0 || parte <= 0) return 0;
  return (parte / total) * 100;
}

export function focoDaSerie(serie: SerieDiaria, indice?: number | null) {
  if (!serie.length) return null;
  if (indice === undefined || indice === null || !serie[indice]) {
    return serie[serie.length - 1];
  }
  return serie[indice];
}

export function rotuloFaixa({ min, max }: { min: number; max: number }) {
  return `${min}\u2013${max}`;
}

export function competenciaMaisFraca(medias: MediaCompetencia[]) {
  return medias.reduce<MediaCompetencia | null>((maisFraca, item) => {
    if (item.media === null) return maisFraca;
    if (maisFraca?.media === null || maisFraca === null) return item;
    return item.media < maisFraca.media ? item : maisFraca;
  }, null);
}

export function corAlertaStripe(
  ultimoEventoEm: string | null,
  agora = new Date(),
): 'success' | 'warning' {
  if (!ultimoEventoEm) return 'warning';
  const evento = new Date(ultimoEventoEm);
  if (Number.isNaN(evento.getTime())) return 'warning';
  const horas = (agora.getTime() - evento.getTime()) / 3_600_000;
  return horas >= 0 && horas < 24 ? 'success' : 'warning';
}

const statusAssinatura: Record<string, string> = {
  ACTIVE: 'Ativa',
  TRIALING: 'Em teste',
  PAST_DUE: 'Pagamento atrasado',
  CANCELED: 'Cancelada',
  UNPAID: 'Não paga',
  INCOMPLETE: 'Incompleta',
  INCOMPLETE_EXPIRED: 'Expirada',
  PAUSED: 'Pausada',
};

export function traduzirStatusAssinatura(status: string) {
  return statusAssinatura[status] ?? status;
}

export function fimConcessao(dias: number, agora = new Date()) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(agora);
  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    Number(partes.find((parte) => parte.type === tipo)?.value);
  const data = new Date(Date.UTC(valor('year'), valor('month') - 1, valor('day')));
  data.setUTCDate(data.getUTCDate() + dias);
  return `${data.toISOString().slice(0, 10)}T23:59:59-03:00`;
}

export function erroConcessao(dias: number, motivo: string) {
  if (!Number.isInteger(dias) || dias < 1 || dias > 365)
    return 'Informe um período entre 1 e 365 dias.';
  const tamanho = motivo.trim().length;
  if (tamanho < 5 || tamanho > 300)
    return 'O motivo deve ter entre 5 e 300 caracteres.';
  return null;
}

export function mensagemReenvio429(retryAfter?: number) {
  const minutos = Math.max(1, Math.ceil((retryAfter ?? 60) / 60));
  return `Um link foi enviado há pouco. Tente de novo em ${minutos} min`;
}

export function proPelaAssinatura(
  assinatura: { status: string; periodoAtualFim: string } | null,
  agora = new Date(),
) {
  return Boolean(
    assinatura &&
      (assinatura.status === 'ACTIVE' || assinatura.status === 'TRIALING') &&
      new Date(assinatura.periodoAtualFim).getTime() > agora.getTime(),
  );
}

export function mensagemErroAdmin(error: unknown) {
  const apiError = error as ApiError | undefined;
  if (apiError?.status === 403)
    return 'Sua conta não tem mais acesso de administrador.';
  return apiError?.detail || 'Não foi possível concluir a ação.';
}
