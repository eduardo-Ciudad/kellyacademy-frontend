import type { AdminVisaoGeral, PeriodoAdmin } from '@/types/admin';

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
