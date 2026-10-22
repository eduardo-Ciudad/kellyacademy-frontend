// @vitest-environment jsdom

import { act, createElement, Fragment, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { JuliaMarca } from '@/components/julia/JuliaMarca';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const montagens: { container: HTMLDivElement; root: Root }[] = [];

function render(element: ReactNode) {
  const container = document.createElement('div');
  const root = createRoot(container);
  document.body.append(container);
  act(() => root.render(element));
  montagens.push({ container, root });
  return container;
}

afterEach(() => {
  for (const { container, root } of montagens.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }
});

describe('JuliaMarca', () => {
  it('usa um id seguro e liga os dois paths ao gradiente', () => {
    const container = render(
      createElement(JuliaMarca, { variante: 'principal', tamanho: 40 }),
    );
    const gradient = container.querySelector('linearGradient')!;
    const gradientId = gradient.getAttribute('id');
    expect(gradientId).toMatch(/^[a-zA-Z0-9_-]+$/);
    for (const path of container.querySelectorAll('path'))
      expect(path.getAttribute('fill')).toBe(`url(#${gradientId})`);
  });

  it('usa as cores literais nos stops', () => {
    const container = render(
      createElement(JuliaMarca, { variante: 'principal', tamanho: 40 }),
    );
    const stops = [...container.querySelectorAll('stop')];
    expect(stops.map((stop) => stop.getAttribute('stop-color'))).toEqual([
      '#e3e6ff',
      '#5468ff',
    ]);
  });

  it.each(['principal', 'mono', 'escura'] as const)(
    'não usa var() nos atributos SVG da variante %s',
    (variante) => {
      const container = render(
        createElement(JuliaMarca, { variante, tamanho: 40 }),
      );
      for (const element of container.querySelectorAll(
        '[fill], [stop-color]',
      )) {
        expect(element.getAttribute('fill') ?? '').not.toContain('var(');
        expect(element.getAttribute('stop-color') ?? '').not.toContain('var(');
      }
    },
  );

  it('gera ids de gradiente diferentes para duas instâncias', () => {
    const container = render(
      createElement(
        Fragment,
        null,
        createElement(JuliaMarca, { variante: 'principal', tamanho: 40 }),
        createElement(JuliaMarca, { variante: 'principal', tamanho: 40 }),
      ),
    );
    const ids = [...container.querySelectorAll('linearGradient')].map(
      (gradient) => gradient.id,
    );
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('usa role e nome acessível quando recebe título', () => {
    const container = render(
      createElement(JuliaMarca, {
        variante: 'principal',
        tamanho: 40,
        titulo: 'Marca da Júlia',
      }),
    );
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Marca da Júlia');
    expect(svg.hasAttribute('aria-hidden')).toBe(false);
  });

  it('é ocultada da árvore acessível sem título', () => {
    const container = render(
      createElement(JuliaMarca, { variante: 'mono', tamanho: 40 }),
    );
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });
});
