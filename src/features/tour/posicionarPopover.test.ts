import { describe, expect, it } from 'vitest';
import { posicionarPopover } from './posicionarPopover';

const desktop = { largura: 1440, altura: 900 };
const mobile = { largura: 390, altura: 844 };
const popoverDesktop = { largura: 380, altura: 310 };
const popoverMobile = { largura: 358, altura: 300 };

function validarDentroDaViewport(
  resultado: ReturnType<typeof posicionarPopover>,
  viewport: typeof desktop,
  popover: typeof popoverDesktop,
  alvo: { top: number; left: number; width: number; height: number },
) {
  expect(resultado.left).toBeGreaterThanOrEqual(16);
  expect(resultado.top).toBeGreaterThanOrEqual(16);
  expect(resultado.left! + popover.largura).toBeLessThanOrEqual(
    viewport.largura - 16,
  );
  expect(resultado.top! + popover.altura).toBeLessThanOrEqual(
    viewport.altura - 16,
  );
  expect(resultado.setaOffset).toBeGreaterThanOrEqual(20);
  const dimensao =
    resultado.lado === 'direita' || resultado.lado === 'esquerda'
      ? popover.altura
      : popover.largura;
  expect(resultado.setaOffset).toBeLessThanOrEqual(dimensao - 20);
  const centroRelativo =
    resultado.lado === 'direita' || resultado.lado === 'esquerda'
      ? alvo.top + alvo.height / 2 - resultado.top!
      : alvo.left + alvo.width / 2 - resultado.left!;
  const offsetEsperado = Math.min(
    Math.max(centroRelativo, 20),
    dimensao - 20,
  );
  expect(resultado.setaOffset).toBe(offsetEsperado);
}

describe('posicionarPopover', () => {
  it('posiciona à direita de um alvo da sidebar no desktop', () => {
    const alvo = { top: 180, left: 28, width: 200, height: 44 };
    const resultado = posicionarPopover({
      alvo,
      viewport: desktop,
      popover: popoverDesktop,
      mobile: false,
      ancoradoNaBarraInferior: false,
    });
    expect(resultado.lado).toBe('direita');
    expect(resultado.left).toBeGreaterThanOrEqual(264);
    validarDentroDaViewport(resultado, desktop, popoverDesktop, alvo);
  });

  it('posiciona à esquerda do botão flutuante no desktop e sobe o balão', () => {
    const alvo = { top: 804, left: 1344, width: 64, height: 64 };
    const resultado = posicionarPopover({
      alvo,
      viewport: desktop,
      popover: popoverDesktop,
      mobile: false,
      ancoradoNaBarraInferior: false,
    });
    expect(resultado.lado).toBe('esquerda');
    expect(resultado.left! + popoverDesktop.largura).toBeLessThanOrEqual(1424);
    expect(resultado.top! + popoverDesktop.altura).toBeLessThanOrEqual(884);
    validarDentroDaViewport(resultado, desktop, popoverDesktop, alvo);
  });

  it('prefere a direita para um alvo no meio da página com espaço', () => {
    const alvo = { top: 360, left: 500, width: 180, height: 48 };
    const resultado = posicionarPopover({
      alvo,
      viewport: desktop,
      popover: popoverDesktop,
      mobile: false,
      ancoradoNaBarraInferior: false,
    });
    expect(resultado.lado).toBe('direita');
    validarDentroDaViewport(resultado, desktop, popoverDesktop, alvo);
  });

  it('mantém acima um alvo da barra inferior no mobile', () => {
    const alvo = { top: 780, left: 150, width: 60, height: 48 };
    const resultado = posicionarPopover({
      alvo,
      viewport: mobile,
      popover: popoverMobile,
      mobile: true,
      ancoradoNaBarraInferior: true,
    });
    expect(resultado.lado).toBe('acima');
    validarDentroDaViewport(resultado, mobile, popoverMobile, alvo);
  });

  it('fica acima do botão flutuante mobile sem sobrepor o alvo', () => {
    const alvo = { top: 700, left: 310, width: 64, height: 64 };
    const resultado = posicionarPopover({
      alvo,
      viewport: mobile,
      popover: popoverMobile,
      mobile: true,
      ancoradoNaBarraInferior: false,
    });
    expect(resultado.lado).toBe('acima');
    expect(resultado.top! + popoverMobile.altura).toBeLessThanOrEqual(alvo.top);
    validarDentroDaViewport(resultado, mobile, popoverMobile, alvo);
  });

  it('fica abaixo de um alvo no topo no mobile', () => {
    const alvo = { top: 50, left: 24, width: 120, height: 44 };
    const resultado = posicionarPopover({
      alvo,
      viewport: mobile,
      popover: popoverMobile,
      mobile: true,
      ancoradoNaBarraInferior: false,
    });
    expect(resultado.lado).toBe('abaixo');
    validarDentroDaViewport(resultado, mobile, popoverMobile, alvo);
  });
});
