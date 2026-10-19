// @vitest-environment jsdom

import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AvisoEntregaEmail } from '@/components/auth/AvisoEntregaEmail';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe('AvisoEntregaEmail', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('mostra o prazo e a orientação sobre spam sem a instrução de reenvio', () => {
    act(() => root.render(createElement(AvisoEntregaEmail)));

    expect(container.textContent).toContain(
      'O e-mail pode levar até 2 minutos para chegar.',
    );
    expect(container.textContent).toContain(
      'Se estiver no spam, marque como “Não é spam”.',
    );
    expect(container.textContent).not.toContain('use sempre o e-mail mais recente');
    expect(container.querySelector('[role="note"]')).toBeTruthy();
  });

  it('mostra a instrução do e-mail mais recente após reenvio', () => {
    act(() => root.render(createElement(AvisoEntregaEmail, { reenviado: true })));

    expect(container.textContent).toContain(
      'use sempre o e-mail mais recente: os anteriores deixam de valer.',
    );
  });
});
