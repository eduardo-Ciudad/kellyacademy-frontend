export const MARCADOR_ILEGIVEL = '[ilegível]';

export type TrechoIlegivel = { inicio: number; fim: number; linha: number };

export function posicoesIlegiveis(texto: string): TrechoIlegivel[] {
  const regex = /\[\s*ileg[ií]vel\s*\]/giu;
  return Array.from(texto.matchAll(regex), (match) => ({
    inicio: match.index,
    fim: match.index + match[0].length,
    linha: texto.slice(0, match.index).split(/\r?\n/).length,
  }));
}

export function temTrechoIlegivel(texto: string) {
  return posicoesIlegiveis(texto).length > 0;
}

export function contarLinhasEscritas(texto: string) {
  return texto.split(/\r?\n/).filter((linha) => linha.trim()).length;
}

export function resumoIlegiveis(trechos: TrechoIlegivel[]) {
  if (!trechos.length) return '';
  const linhas = [...new Set(trechos.map(({ linha }) => linha))];
  const lista =
    linhas.length === 1
      ? String(linhas[0])
      : `${linhas.slice(0, -1).join(', ')} e ${linhas.at(-1)}`;
  return `${trechos.length} ${trechos.length === 1 ? 'trecho ilegível' : 'trechos ilegíveis'} · ${linhas.length === 1 ? 'linha' : 'linhas'} ${lista}`;
}
