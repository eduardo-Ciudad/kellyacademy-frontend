// @vitest-environment jsdom

import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const { adminState } = vi.hoisted(() => ({
  adminState: {
    isAdmin: false,
    isPending: false,
    isError: false,
  },
}));

vi.mock('@/hooks/useMe', () => ({ useIsAdmin: () => adminState }));

import { RequireAdmin } from '@/components/routing/RequireAdmin';

afterEach(() => {
  cleanup();
  adminState.isAdmin = false;
  adminState.isPending = false;
  adminState.isError = false;
});

function renderGuard() {
  render(
    createElement(
      MemoryRouter,
      { initialEntries: ['/admin'] },
      createElement(
        Routes,
        null,
        createElement(
          Route,
          { element: createElement(RequireAdmin) },
          createElement(Route, {
            path: '/admin',
            element: createElement('p', null, 'Conteúdo administrativo'),
          }),
        ),
      ),
    ),
  );
}

describe('RequireAdmin', () => {
  it('renderiza o conteúdo para ADMIN', () => {
    adminState.isAdmin = true;
    renderGuard();
    expect(screen.getByText('Conteúdo administrativo')).toBeTruthy();
  });

  it('renderiza NotFound para ALUNO', () => {
    renderGuard();
    expect(
      screen.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeTruthy();
  });

  it('renderiza NotFound quando /usuarios/me falha', () => {
    adminState.isError = true;
    renderGuard();
    expect(
      screen.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeTruthy();
  });
});
