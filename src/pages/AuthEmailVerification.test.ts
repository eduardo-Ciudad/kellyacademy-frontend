// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/lib/auth';
import { CriarConta } from '@/pages/CriarConta';
import { Entrar } from '@/pages/Entrar';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function setValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function renderPage(root: Root, page: 'cadastro' | 'login') {
  const component =
    page === 'cadastro' ? createElement(CriarConta) : createElement(Entrar);
  root.render(
    createElement(
      QueryClientProvider,
      {
        client: new QueryClient({
          defaultOptions: { mutations: { retry: false } },
        }),
      },
      createElement(
        AuthProvider,
        null,
        createElement(
          MemoryRouter,
          {
            initialEntries: [page === 'cadastro' ? '/criar-conta' : '/entrar'],
          },
          createElement(
            Routes,
            null,
            createElement(Route, {
              path: page === 'cadastro' ? '/criar-conta' : '/entrar',
              element: component,
            }),
            createElement(Route, {
              path: '/',
              element: createElement('p', null, 'Início autenticado'),
            }),
          ),
        ),
      ),
    ),
  );
}

async function submit(container: HTMLElement, fields: Record<string, string>) {
  act(() => {
    Object.entries(fields).forEach(([id, value]) =>
      setValue(container.querySelector<HTMLInputElement>(`#${id}`)!, value),
    );
  });
  await act(async () => {
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await Promise.resolve();
  });
}

describe('cadastro com verificação de e-mail', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  it('mostra Confira seu e-mail e não faz login quando emailVerificado é false', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ emailVerificado: false }, 201));
    act(() => renderPage(root, 'cadastro'));
    await submit(container, {
      nome: 'Kelly',
      email: 'aluna@exemplo.com',
      senha: 'senha-segura',
    });

    expect(container.textContent).toContain('Confira seu e-mail');
    expect(container.textContent).toContain('aluna@exemplo.com');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const restartButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Criar a conta de novo',
    );
    act(() => restartButton?.click());
    expect(container.querySelector<HTMLInputElement>('#nome')?.value).toBe('');
    expect(container.querySelector<HTMLInputElement>('#email')?.value).toBe('');
  });

  it('mantém login automático quando emailVerificado é true', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ emailVerificado: true }, 201))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            accessToken: 'jwt',
            tipo: 'Bearer',
            expiraEm: new Date(Date.now() + 60_000).toISOString(),
          },
          200,
        ),
      );
    act(() => renderPage(root, 'cadastro'));
    await submit(container, {
      nome: 'Kelly',
      email: 'aluna@exemplo.com',
      senha: 'senha-segura',
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[0]).toBe('/auth/login');
    expect(container.textContent).toContain('Início autenticado');
  });
});

describe('login com e-mail não verificado', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  it('mostra reenvio com o e-mail digitado para EMAIL_NAO_VERIFICADO', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse(
        {
          codigo: 'EMAIL_NAO_VERIFICADO',
          detail: 'Confirme seu e-mail para entrar.',
        },
        403,
      ),
    );
    act(() => renderPage(root, 'login'));
    await submit(container, {
      email: 'aluna@exemplo.com',
      senha: 'senha-segura',
    });

    expect(container.textContent).toContain('Confirme seu e-mail para entrar.');
    expect(container.textContent).toContain('Reenviar link de confirmação');
    expect(container.querySelectorAll('[role="alert"]')).toHaveLength(1);
    expect(container.querySelector('.bg-accent-subtle')).toBeTruthy();
    expect(container.querySelector('.bg-danger-bg')).toBeNull();
  });

  it('mantém o tratamento antigo para 403 sem o código', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ detail: 'Cadastro fechado.' }, 403),
    );
    act(() => renderPage(root, 'login'));
    await submit(container, {
      email: 'aluna@exemplo.com',
      senha: 'senha-segura',
    });

    expect(container.textContent).toContain('Cadastro fechado.');
    expect(container.textContent).not.toContain('Reenviar link de confirmação');
    expect(container.querySelector('.bg-danger-bg')).toBeTruthy();
  });
});
