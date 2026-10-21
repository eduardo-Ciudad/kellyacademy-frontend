// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BottomNav } from './BottomNav';

let authenticated = true;

vi.mock('@/lib/auth', () => ({
  useAuth: () => ({ isAuthenticated: authenticated }),
}));

function renderBottomNav(pathname = '/') {
  return render(
    createElement(
      MemoryRouter,
      { initialEntries: [pathname] },
      createElement(BottomNav),
    ),
  );
}

afterEach(() => {
  authenticated = true;
  cleanup();
});

describe('BottomNav', () => {
  it('renderiza os cinco destinos, incluindo Nova redação', () => {
    renderBottomNav();
    expect(screen.getByRole('link', { name: 'Redações' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Temas' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Nova redação' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Repertório' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Evolução' })).toBeTruthy();
  });

  it('marca a rota atual com aria-current page', () => {
    renderBottomNav('/repertorio/codigo-exemplo');
    expect(
      screen
        .getByRole('link', { name: 'Repertório' })
        .getAttribute('aria-current'),
    ).toBe('page');
    expect(
      screen
        .getByRole('link', { name: 'Redações' })
        .getAttribute('aria-current'),
    ).toBeNull();
  });

  it('aponta Nova redação para o início do fluxo existente', () => {
    renderBottomNav();
    expect(
      screen.getByRole('link', { name: 'Nova redação' }).getAttribute('href'),
    ).toBe('/temas');
  });

  it('mantém o alvo do tour de Nova redação fora da rota inicial', () => {
    renderBottomNav('/evolucao');

    expect(
      screen.getByRole('link', { name: 'Nova redação' }).dataset.tour,
    ).toBe('nova-redacao');
  });

  it('não aparece para usuário deslogado', () => {
    authenticated = false;
    renderBottomNav();
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('não aparece na rota do editor', () => {
    renderBottomNav('/temas/tema-123/escrever');
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});
