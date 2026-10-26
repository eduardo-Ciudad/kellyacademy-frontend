export const Y_DOMAIN_TOTAL = [0, 1000] as const;
export const Y_TICKS_TOTAL = [0, 250, 500, 750, 1000] as const;
export const Y_DOMAIN_COMPETENCIA = [0, 200] as const;
export const Y_TICKS_COMPETENCIA = [0, 40, 80, 120, 160, 200] as const;

export function rotuloOrdinal(index: number) {
  return `${index + 1}ª`;
}

export function rotuloMediaRecente(value: number) {
  return `média das últimas 3 · ${value}`;
}
