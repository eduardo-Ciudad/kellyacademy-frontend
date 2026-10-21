// @vitest-environment jsdom

import { createElement } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComoFunciona } from '@/components/landing/ComoFunciona';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [0.2];
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this,
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

function mockReducedMotion(reduced: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('ComoFunciona', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    mockReducedMotion(false);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renderiza quatro etapas sem marcador numérico duplicado', () => {
    const { container } = render(createElement(ComoFunciona));
    const list = container.querySelector('ol');
    expect(list?.classList.contains('list-none')).toBe(true);
    expect(list?.querySelectorAll(':scope > li')).toHaveLength(4);
    expect(screen.getByText('01')).toBeTruthy();
    expect(container.textContent).not.toContain('1. 01');
  });

  it('começa na etapa 01 com aria-current step', () => {
    render(createElement(ComoFunciona));
    expect(
      screen.getByText('01').closest('li')?.getAttribute('aria-current'),
    ).toBe('step');
  });

  it('avança no animationend e volta da etapa 04 para a 01', async () => {
    render(createElement(ComoFunciona));
    for (const expected of ['02', '03', '04', '01']) {
      fireEvent.animationEnd(screen.getByTestId('step-progress'));
      await waitFor(() =>
        expect(
          screen
            .getByText(expected)
            .closest('li')
            ?.getAttribute('aria-current'),
        ).toBe('step'),
      );
    }
  });

  it('seleciona uma etapa ao clicar', () => {
    render(createElement(ComoFunciona));
    fireEvent.click(screen.getByRole('button', { name: /03\s*prática/i }));
    expect(
      screen.getByText('03').closest('li')?.getAttribute('aria-current'),
    ).toBe('step');
  });

  it('pausa e continua a barra de progresso', () => {
    render(createElement(ComoFunciona));
    fireEvent.click(screen.getByRole('button', { name: 'Pausar' }));
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeTruthy();
    expect(screen.getByTestId('step-progress').style.animationPlayState).toBe(
      'paused',
    );
  });

  it('não pausa a barra ao receber pointerenter por toque', () => {
    const { container } = render(createElement(ComoFunciona));
    const section = container.querySelector('section');
    fireEvent.pointerEnter(section!, { pointerType: 'touch' });
    expect(screen.getByTestId('step-progress').style.animationPlayState).toBe(
      'running',
    );
  });

  it('pausa a barra ao receber pointerenter do mouse', () => {
    const { container } = render(createElement(ComoFunciona));
    const section = container.querySelector('section');
    fireEvent.pointerEnter(section!, { pointerType: 'mouse' });
    expect(screen.getByTestId('step-progress').style.animationPlayState).toBe(
      'paused',
    );
  });

  it('não exibe barra animada nem avança automaticamente com movimento reduzido', () => {
    mockReducedMotion(true);
    render(createElement(ComoFunciona));
    expect(screen.queryByTestId('step-progress')).toBeNull();
    expect(
      screen.getByText('01').closest('li')?.getAttribute('aria-current'),
    ).toBe('step');
  });

  it('atualiza o aria-label do palco conforme a etapa', () => {
    render(createElement(ComoFunciona));
    expect(screen.getByRole('img').getAttribute('aria-label')).toMatch(
      /redação é analisada/i,
    );
    fireEvent.click(screen.getByRole('button', { name: /02\s*estudo/i }));
    expect(screen.getByRole('img').getAttribute('aria-label')).toMatch(
      /Paulo Freire/i,
    );
  });
});
