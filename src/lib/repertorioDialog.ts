export function detalheRepertorioAberto(codigo: string | undefined) {
  return Boolean(codigo);
}

export function caminhoListaRepertorio(query: string) {
  return `/repertorio${query ? `?${query}` : ''}`;
}
