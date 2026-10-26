// @vitest-environment jsdom

import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, PublicOnlyRoute } from '@/lib/auth';

function TestRoutes() {
  return createElement(
    Routes,
    null,
    createElement(
      Route,
      { element: createElement(PublicOnlyRoute) },
      createElement(Route, {
        path: '/entrar',
        element: createElement('main', null, 'Layout público de autenticação'),
      }),
    ),
    createElement(
      Route,
      { path: '/', element: createElement(Outlet) },
      createElement(Route, {
        index: true,
        element: createElement('main', null, 'Área logada'),
      }),
    ),
  );
}

function renderLoginRoute() {
  return render(
    createElement(
      AuthProvider,
      null,
      createElement(
        MemoryRouter,
        { initialEntries: ['/entrar'] },
        createElement(TestRoutes),
      ),
    ),
  );
}

describe('PublicOnlyRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('pinta a rota pública sem aguardar uma chamada de sessão pendente', () => {
    const pendingRequest = new Promise<Response>(() => undefined);
    const fetchMock = vi.fn(() => pendingRequest);
    vi.stubGlobal('fetch', fetchMock);

    renderLoginRoute();

    expect(screen.getByText('Layout público de autenticação')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('continua redirecionando quem já está logado', () => {
    localStorage.setItem('studymind:accessToken', 'token');
    localStorage.setItem(
      'studymind:expiraEm',
      new Date(Date.now() + 60_000).toISOString(),
    );
    localStorage.setItem('studymind:email', 'aluna@example.com');

    renderLoginRoute();

    expect(screen.getByText('Área logada')).toBeTruthy();
    expect(screen.queryByText('Layout público de autenticação')).toBeNull();
  });
});
