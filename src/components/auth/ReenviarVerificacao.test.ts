// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReenviarVerificacao } from '@/components/auth/ReenviarVerificacao';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function renderComponent(root: Root) {
  root.render(
    createElement(
      QueryClientProvider,
      {
        client: new QueryClient({
          defaultOptions: { mutations: { retry: false } },
        }),
      },
      createElement(ReenviarVerificacao, { email: 'aluna@exemplo.com' }),
    ),
  );
}

describe('ReenviarVerificacao', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    act(() => renderComponent(root));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('mostra exatamente a mensagem do 202 e bloqueia novos envios por 120 segundos', async () => {
    let concluir!: (response: Response) => void;
    vi.spyOn(globalThis, 'fetch').mockReturnValue(
      new Promise<Response>((resolve) => {
        concluir = resolve;
      }),
    );
    const response = new Response(
      JSON.stringify({
        mensagem: 'Se houver uma conta, enviaremos um novo link.',
      }),
      {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const button = container.querySelector('button')!;

    act(() => button.click());
    await act(async () => {
      vi.advanceTimersByTime(0);
      await Promise.resolve();
    });
    expect(button.disabled).toBe(true);
    act(() => concluir(response));
    await act(async () => Promise.resolve());

    expect(container.textContent).toContain(
      'Se houver uma conta, enviaremos um novo link.',
    );
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Reenviar em 2:00');

    for (let segundo = 0; segundo < 120; segundo += 1) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }
    expect(button.disabled).toBe(false);
    expect(button.textContent).toContain('Reenviar e-mail');
  });

  it('trata limite de reenvios no 429', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'limite' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/problem+json',
          'Retry-After': '90',
        },
      }),
    );

    act(() => container.querySelector('button')!.click());
    await act(async () => {
      vi.advanceTimersByTime(0);
      await Promise.resolve();
    });
    expect(container.textContent).toContain(
      'Limite atingido. Tente novamente em 90 segundos.',
    );
  });
});
