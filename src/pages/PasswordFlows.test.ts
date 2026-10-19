// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, createElement, Fragment, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/lib/auth';
import { storeSession } from '@/lib/session';
import { AlterarSenha } from '@/pages/AlterarSenha';
import { Entrar } from '@/pages/Entrar';
import { EsqueciSenha } from '@/pages/EsqueciSenha';
import { RedefinirSenha } from '@/pages/RedefinirSenha';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const json = (
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

function setValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function StateView() {
  const location = useLocation();
  return createElement('p', null, JSON.stringify(location.state));
}

function LocationProbe() {
  return createElement('output', {
    'data-testid': 'location',
    value: useLocation().pathname,
  });
}

function render(
  root: Root,
  element: React.ReactElement,
  path: string,
  strict = false,
) {
  const tree = createElement(
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
        { initialEntries: [path] },
        createElement(
          Fragment,
          null,
          createElement(LocationProbe),
          createElement(
            Routes,
            null,
            createElement(Route, { path, element }),
            createElement(Route, {
              path: '/esqueci-senha',
              element: createElement(StateView),
            }),
            createElement(Route, {
              path: '/entrar',
              element: createElement('p', null, 'Login'),
            }),
          ),
        ),
      ),
    ),
  );
  act(() => root.render(strict ? createElement(StrictMode, null, tree) : tree));
}

async function submit(container: HTMLElement) {
  await act(async () => {
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await Promise.resolve();
  });
}

describe('fluxos de senha', () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
    history.replaceState(null, '', '/');
  });

  it('login leva o e-mail digitado por state', () => {
    render(root, createElement(Entrar), '/entrar');
    act(() =>
      setValue(container.querySelector('#email')!, 'aluna@exemplo.com'),
    );
    act(() =>
      (
        Array.from(container.querySelectorAll('a')).find((a) =>
          a.textContent?.includes('Esqueci'),
        ) as HTMLAnchorElement
      ).click(),
    );
    expect(container.textContent).toContain('aluna@exemplo.com');
  });

  it('solicita o link, mostra a mensagem da API e bloqueia reenvio', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      json({ mensagem: 'Se houver uma conta, enviaremos o link.' }, 202),
    );
    render(root, createElement(EsqueciSenha), '/esqueci-senha');
    act(() =>
      setValue(container.querySelector('#email')!, 'qualquer@exemplo.com'),
    );
    await submit(container);
    expect(container.textContent).toContain(
      'Se houver uma conta, enviaremos o link.',
    );
    expect(container.textContent).toContain(
      'O e-mail pode levar até 2 minutos para chegar.',
    );
    expect(container.textContent).not.toContain(
      'Não chegou? Confira a caixa de spam.',
    );
    const resendButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Reenviar'),
    );
    expect(resendButton?.disabled).toBe(true);
    expect(resendButton?.textContent).toContain('Reenviar em 2:00');
  });

  it('mostra a espera do Retry-After no 429', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      json({ detail: 'Limite atingido.' }, 429, { 'Retry-After': '90' }),
    );
    render(root, createElement(EsqueciSenha), '/esqueci-senha');
    act(() =>
      setValue(container.querySelector('#email')!, 'aluna@exemplo.com'),
    );
    await submit(container);
    expect(container.textContent).toContain('1 min e 30 s');
  });

  it('consome o token, limpa a URL antes do POST e impede clique duplo', async () => {
    history.replaceState(null, '', '/redefinir-senha#token=segredo');
    let finish!: (value: Response) => void;
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    render(root, createElement(RedefinirSenha), '/redefinir-senha', true);
    expect(location.hash).toBe('');
    act(() => {
      setValue(container.querySelector('#nova-senha')!, 'senha-segura');
      setValue(container.querySelector('#confirmar-senha')!, 'senha-segura');
    });
    const form = container.querySelector('form')!;
    await act(async () => {
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      );
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      );
      await Promise.resolve();
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const firstBody = fetchMock.mock.calls[0]?.[1]?.body;
    if (typeof firstBody !== 'string') throw new Error('Corpo ausente.');
    const firstPayload = JSON.parse(firstBody) as { token: string };
    expect(firstPayload.token).toBe('segredo');
    await act(async () => {
      finish(new Response(null, { status: 204 }));
      await Promise.resolve();
    });
  });

  it('sem token mostra link inválido', () => {
    render(root, createElement(RedefinirSenha), '/redefinir-senha');
    expect(container.textContent).toContain('Este link não vale mais');
  });

  it('TOKEN_INVALIDO leva ao estado de link inválido', async () => {
    history.replaceState(null, '', '/redefinir-senha#token=invalido');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      json({ codigo: 'TOKEN_INVALIDO', detail: 'Link inválido.' }, 400),
    );
    render(root, createElement(RedefinirSenha), '/redefinir-senha');
    act(() => {
      setValue(container.querySelector('#nova-senha')!, 'senha-segura');
      setValue(container.querySelector('#confirmar-senha')!, 'senha-segura');
    });
    await submit(container);
    expect(container.textContent).toContain('Este link não vale mais');
  });

  it('habilita salvar somente com 8+ caracteres e senhas iguais', () => {
    history.replaceState(null, '', '/redefinir-senha#token=segredo');
    render(root, createElement(RedefinirSenha), '/redefinir-senha');
    const button = Array.from(container.querySelectorAll('button')).find(
      (item) => item.textContent === 'Salvar nova senha',
    );
    expect(button?.disabled).toBe(true);
    act(() => {
      setValue(container.querySelector('#nova-senha')!, '1234567');
      setValue(container.querySelector('#confirmar-senha')!, '1234567');
    });
    expect(button?.disabled).toBe(true);
    act(() => {
      setValue(container.querySelector('#nova-senha')!, '12345678');
      setValue(container.querySelector('#confirmar-senha')!, 'diferente');
    });
    expect(button?.disabled).toBe(true);
    act(() =>
      setValue(container.querySelector('#confirmar-senha')!, '12345678'),
    );
    expect(button?.disabled).toBe(false);
  });

  it('mantém o token após erro de regra e permite reenviar', async () => {
    history.replaceState(null, '', '/redefinir-senha#token=mesmo-token');
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(json({ detail: 'senha recusada' }, 400))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    render(root, createElement(RedefinirSenha), '/redefinir-senha');
    act(() => {
      setValue(container.querySelector('#nova-senha')!, 'senha-segura');
      setValue(container.querySelector('#confirmar-senha')!, 'senha-segura');
    });
    await submit(container);
    expect(container.textContent).toContain('senha recusada');
    await submit(container);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const secondBody = fetchMock.mock.calls[1]?.[1]?.body;
    if (typeof secondBody !== 'string') throw new Error('Corpo ausente.');
    const secondPayload = JSON.parse(secondBody) as { token: string };
    expect(secondPayload.token).toBe('mesmo-token');
  });

  it('204 limpa JWT local', async () => {
    storeSession({
      accessToken: 'antigo',
      email: 'a@b.com',
      expiraEm: new Date(Date.now() + 60_000).toISOString(),
    });
    history.replaceState(null, '', '/redefinir-senha#token=segredo');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    render(root, createElement(RedefinirSenha), '/redefinir-senha');
    act(() => {
      setValue(container.querySelector('#nova-senha')!, 'senha-segura');
      setValue(container.querySelector('#confirmar-senha')!, 'senha-segura');
    });
    await submit(container);
    expect(localStorage.getItem('studymind:accessToken')).toBeNull();
    expect(container.textContent).toContain('Senha alterada');
  });

  it('alteração autenticada substitui JWT e senha atual incorreta não desloga', async () => {
    const expiry = new Date(Date.now() + 60_000).toISOString();
    storeSession({ accessToken: 'antigo', email: 'a@b.com', expiraEm: expiry });
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        json({ codigo: 'SENHA_ATUAL_INCORRETA', detail: 'errada' }, 400),
      )
      .mockResolvedValueOnce(
        json({ accessToken: 'novo', tipo: 'Bearer', expiraEm: expiry }),
      );
    render(root, createElement(AlterarSenha), '/conta/senha');
    const fill = () =>
      act(() => {
        setValue(container.querySelector('#senha-atual')!, 'atual');
        setValue(container.querySelector('#nova-senha')!, 'senha-nova');
        setValue(container.querySelector('#confirmar-senha')!, 'senha-nova');
      });
    fill();
    await submit(container);
    expect(container.textContent).toContain('Senha atual incorreta.');
    expect(localStorage.getItem('studymind:accessToken')).toBe('antigo');
    fill();
    await submit(container);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem('studymind:accessToken')).toBe('novo');
    expect(
      container
        .querySelector('[data-testid="location"]')
        ?.getAttribute('value'),
    ).toBe('/conta/senha');
    expect(container.textContent).toContain(
      'Senha alterada. Os outros aparelhos foram desconectados.',
    );
  });

  it('400 sem código mostra detail na nova senha e mantém a sessão', async () => {
    const expiry = new Date(Date.now() + 60_000).toISOString();
    storeSession({
      accessToken: 'guardado',
      email: 'a@b.com',
      expiraEm: expiry,
    });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      json({ detail: 'A nova senha deve ser diferente da atual.' }, 400),
    );
    render(root, createElement(AlterarSenha), '/conta/senha');
    act(() => {
      setValue(container.querySelector('#senha-atual')!, 'senha-atual');
      setValue(container.querySelector('#nova-senha')!, 'senha-nova');
      setValue(container.querySelector('#confirmar-senha')!, 'senha-nova');
    });
    await submit(container);
    expect(container.querySelector('#nova-senha-error')?.textContent).toBe(
      'A nova senha deve ser diferente da atual.',
    );
    expect(localStorage.getItem('studymind:accessToken')).toBe('guardado');
  });

  it('401 limpa a sessão pelo fluxo atual da API', async () => {
    const expiry = new Date(Date.now() + 60_000).toISOString();
    storeSession({
      accessToken: 'expirado',
      email: 'a@b.com',
      expiraEm: expiry,
    });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({}, 401));
    render(root, createElement(AlterarSenha), '/conta/senha');
    act(() => {
      setValue(container.querySelector('#senha-atual')!, 'senha-atual');
      setValue(container.querySelector('#nova-senha')!, 'senha-nova');
      setValue(container.querySelector('#confirmar-senha')!, 'senha-nova');
    });
    await submit(container);
    expect(localStorage.getItem('studymind:accessToken')).toBeNull();
  });

  it.each([
    ['/esqueci-senha', () => createElement(EsqueciSenha)],
    ['/redefinir-senha', () => createElement(RedefinirSenha)],
    ['/conta/senha', () => createElement(AlterarSenha)],
  ])('%s usa noindex', (path, page) => {
    if (path === '/conta/senha')
      storeSession({
        accessToken: 'jwt',
        email: 'a@b.com',
        expiraEm: new Date(Date.now() + 60_000).toISOString(),
      });
    render(root, page(), path);
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    ).toBe('noindex, nofollow');
  });
});
