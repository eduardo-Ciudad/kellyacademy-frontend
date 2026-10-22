export type Lado = 'direita' | 'esquerda' | 'acima' | 'abaixo';

type Retangulo = { top: number; left: number; width: number; height: number };

const MARGEM = 16;
const ESPACO_DESKTOP = 18;
const ESPACO_MOBILE = 14;
const SETA_MINIMA = 20;

function limitar(valor: number, minimo: number, maximo: number) {
  return Math.min(Math.max(valor, minimo), Math.max(minimo, maximo));
}

export function posicionarPopover({
  alvo,
  viewport,
  popover,
  mobile,
  ancoradoNaBarraInferior,
}: {
  alvo: Retangulo;
  viewport: { largura: number; altura: number };
  popover: { largura: number; altura: number };
  mobile: boolean;
  ancoradoNaBarraInferior: boolean;
}): {
  top?: number;
  left?: number;
  bottom?: number;
  lado: Lado;
  setaOffset: number;
} {
  const maxLeft = viewport.largura - popover.largura - MARGEM;
  const maxTop = viewport.altura - popover.altura - MARGEM;
  const centroX = alvo.left + alvo.width / 2;
  const centroY = alvo.top + alvo.height / 2;

  if (!mobile) {
    const cabeADireita =
      alvo.left + alvo.width + ESPACO_DESKTOP + popover.largura <=
      viewport.largura - MARGEM;
    const lado: Lado = cabeADireita ? 'direita' : 'esquerda';
    const leftDesejado = cabeADireita
      ? Math.max(264, alvo.left + alvo.width + ESPACO_DESKTOP)
      : alvo.left - ESPACO_DESKTOP - popover.largura;
    const left = limitar(leftDesejado, MARGEM, maxLeft);
    const top = limitar(alvo.top - 20, MARGEM, maxTop);
    return {
      top,
      left,
      lado,
      setaOffset: limitar(
        centroY - top,
        SETA_MINIMA,
        popover.altura - SETA_MINIMA,
      ),
    };
  }

  const left = limitar(MARGEM, MARGEM, maxLeft);
  const cabeAbaixo =
    !ancoradoNaBarraInferior &&
    alvo.top + alvo.height + ESPACO_MOBILE + popover.altura <=
      viewport.altura - MARGEM;
  const lado: Lado = cabeAbaixo ? 'abaixo' : 'acima';
  const topDesejado = cabeAbaixo
    ? alvo.top + alvo.height + ESPACO_MOBILE
    : alvo.top - ESPACO_MOBILE - popover.altura;
  const top = limitar(topDesejado, MARGEM, maxTop);

  return {
    top,
    left,
    lado,
    setaOffset: limitar(
      centroX - left,
      SETA_MINIMA,
      popover.largura - SETA_MINIMA,
    ),
  };
}
