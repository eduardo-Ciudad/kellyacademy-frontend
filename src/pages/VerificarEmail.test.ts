// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, createElement, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VerificarEmail } from '@/pages/VerificarEmail';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const jsonResponse = (body: unknown, status: number, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/problem+json', ...headers },
  });

describe('VerificarEmail', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    window.history.replaceState(null, '', '/verificar-email');
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  async function renderPage(hash = '#token=segredo') {
    window.history.replaceState(null, '', `/verificar-email${hash}`);
    const replaceState = vi.spyOn(window.history, 'replaceState');
    act(() => {
      root.render(
        createElement(
          StrictMode,
          null,
          createElement(
            QueryClientProvider,
            {
              client: new QueryClient({
                defaultOptions: {
                  queries: { retry: false },
                  mutations: { retry: false },
                },
              }),
            },
            createElement(MemoryRouter, null, createElement(VerificarEmail)),
          ),
        ),
      );
    });
    await act(async () => Promise.resolve());
    return replaceState;
  }

  it('lê e limpa o hash e chama a API uma única vez em StrictMode', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));
    const replaceState = await renderPage();

    expect(replaceState).toHaveBeenCalledWith(null, '', '/verificar-email');
    expect(window.location.hash).toBe('');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/auth/verificar-email');
    const body = fetchMock.mock.calls[0]?.[1]?.body;
    expect(typeof body).toBe('string');
    if (typeof body !== 'string')
      throw new Error('Corpo da requisição ausente.');
    expect(JSON.parse(body)).toEqual({
      token: 'segredo',
    });
  });

  it('mostra sucesso e o botão de entrar no 204', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    await renderPage();
    expect(container.textContent).toContain('E-mail confirmado');
    expect(container.textContent).toContain('Entrar na Kelly Academy');
    expect(container.querySelector('a[href="/entrar"]')).toBeTruthy();
  });

  it('mostra link inválido e formulário de reenvio no TOKEN_INVALIDO', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ codigo: 'TOKEN_INVALIDO', detail: 'Inválido.' }, 400),
    );
    await renderPage();
    expect(container.textContent).toContain('Este link não vale mais');
    expect(container.querySelector('#email-reenvio')).toBeTruthy();
  });

  it('sem token mostra erro e não chama a API', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    await renderPage('');
    expect(container.textContent).toContain('Este link não vale mais');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('mostra a mensagem de limite no 429', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({}, 429, { 'Retry-After': '120' }),
    );
    await renderPage();
    expect(container.textContent).toContain(
      'Muitas tentativas, tente novamente em alguns minutos',
    );
  });

  it('permite tentar novamente somente quando o fetch falha sem resposta', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new TypeError('Falha de rede'))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    await renderPage();

    const retryButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Tentar de novo',
    );
    expect(retryButton).toBeTruthy();
    act(() => retryButton?.click());
    await act(async () => Promise.resolve());

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const secondBody = fetchMock.mock.calls[1]?.[1]?.body;
    expect(secondBody).toBe(JSON.stringify({ token: 'segredo' }));
    expect(container.textContent).toContain('E-mail confirmado');
  });

  it('não permite reenviar a confirmação quando o servidor respondeu com erro', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ detail: 'Erro interno.' }, 500),
    );
    await renderPage();

    expect(container.textContent).toContain('Não foi possível confirmar');
    expect(container.textContent).not.toContain('Tentar de novo');
  });
});
