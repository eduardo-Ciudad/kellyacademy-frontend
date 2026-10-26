// @vitest-environment jsdom
import { createElement, type ComponentProps } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SidebarAccountMenu } from '@/components/layout/SidebarAccountMenu';
import { nomeDoUsuario } from '@/hooks/useUsuario';

const { adminState } = vi.hoisted(() => ({
  adminState: { isAdmin: false },
}));

vi.mock('@/hooks/useMe', () => ({ useIsAdmin: () => adminState }));

afterEach(() => {
  cleanup();
  adminState.isAdmin = false;
});

function renderMenu(
  overrides: Partial<ComponentProps<typeof SidebarAccountMenu>> = {},
) {
  const props = {
    name: 'Kelly Souza',
    email: 'kelly@academy.com',
    initials: 'KS',
    onLogout: vi.fn(),
    onOpenTour: vi.fn(),
    ...overrides,
  };
  render(
    createElement(MemoryRouter, null, createElement(SidebarAccountMenu, props)),
  );
  return props;
}

describe('SidebarAccountMenu', () => {
  it('renderiza nome e plano no botão e usa o e-mail como fallback', () => {
    renderMenu();
    expect(
      screen.getByRole('button', { name: /kelly souza/i }).textContent,
    ).toContain('Plano gratuito');
    expect(nomeDoUsuario(null, 'aluna.teste@academy.com')).toBe('aluna.teste');
  });

  it('abre o menu com cabeçalho e os quatro itens', async () => {
    const user = userEvent.setup();
    renderMenu();
    const button = screen.getByRole('button', { name: /kelly souza/i });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    await user.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('kelly@academy.com')).not.toBeNull();
    expect(
      screen.getAllByRole('menuitem').map((item) => item.textContent?.trim()),
    ).toEqual(['PlanosGrátis', 'Alterar senha', 'Rever tour', 'Sair']);
  });

  it('fecha com Escape, devolve o foco e fecha com clique fora', async () => {
    const user = userEvent.setup();
    renderMenu();
    const button = screen.getByRole('button', { name: /kelly souza/i });
    await user.click(button);
    expect(document.activeElement).toBe(
      screen.getByRole('menuitem', { name: /planos/i }),
    );
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(button);
    await user.click(button);
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('aciona o mesmo callback de logout ao escolher Sair', async () => {
    const user = userEvent.setup();
    const props = renderMenu();
    await user.click(screen.getByRole('button', { name: /kelly souza/i }));
    await user.click(screen.getByRole('menuitem', { name: 'Sair' }));
    expect(props.onLogout).toHaveBeenCalledOnce();
  });

  it('exibe Painel admin somente para ADMIN', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: /kelly souza/i }));
    expect(screen.queryByRole('menuitem', { name: 'Painel admin' })).toBeNull();
    cleanup();

    adminState.isAdmin = true;
    renderMenu();
    await user.click(screen.getByRole('button', { name: /kelly souza/i }));
    const item = screen.getByRole('menuitem', { name: 'Painel admin' });
    expect(item.getAttribute('href')).toBe('/admin');
  });
});
