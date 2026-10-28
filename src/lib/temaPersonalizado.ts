import type { Tema } from '@/types/api';

export function normalizarTitulo(texto: string): string {
  return texto.trim().replace(/\s+/g, ' ');
}

export function chaveTitulo(texto: string): string {
  return normalizarTitulo(texto)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export type ResolucaoTemaDigitado =
  | { tipo: 'vazio' }
  | { tipo: 'curto' }
  | { tipo: 'longo' }
  | { tipo: 'existente'; tema: Tema }
  | { tipo: 'novo'; titulo: string };

export function resolverTemaDigitado(
  texto: string,
  temas: Tema[],
): ResolucaoTemaDigitado {
  const titulo = normalizarTitulo(texto);
  if (!titulo) return { tipo: 'vazio' };
  if (titulo.length < 10) return { tipo: 'curto' };
  if (titulo.length > 200) return { tipo: 'longo' };
  const chave = chaveTitulo(titulo);
  const tema = temas.find((item) => chaveTitulo(item.titulo) === chave);
  return tema ? { tipo: 'existente', tema } : { tipo: 'novo', titulo };
}

export function inserirTemaNoCache(
  lista: Tema[] | undefined,
  tema: Tema,
): Tema[] {
  return [tema, ...(lista ?? []).filter((item) => item.id !== tema.id)];
}
