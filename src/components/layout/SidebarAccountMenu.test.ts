// @vitest-environment jsdom
import { createElement, type ComponentProps } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SidebarAccountMenu } from '@/components/layout/SidebarAccountMenu';
import { nomeDoUsuario } from '@/hooks/useUsuario';
import type { PlanoUsuario } from '@/types/api';

const { adminState, planoState } = vi.hoisted(() => ({
  adminState: { isAdmin: false },
  planoState: { dados: undefined as PlanoUsuario | undefined },
}));

vi.mock('@/hooks/useMe', () => ({ useIsAdmin: () => adminState }));
vi.mock('@/hooks/usePlano', () => ({ usePlano: () => planoState }));

const planoGratis: PlanoUsuario = {
  plano: 'GRATIS',
  origem: null,
  concessao: null,
  limites: { correcoesPorDia: 3, transcricoesPorDia: 2 },
  recursos: [],
  assinatura: null,
};

const planoProMensal: PlanoUsuario = {
  ...planoGratis,
  plano: 'PRO',
  origem: 'ASSINATURA',
  assinatura: {
    ciclo: 'MENSAL',
    periodoAtualFim: '2026-11-28T00:00:00Z',
    cancelarNoFimDoPeriodo: false,
  },
};

afterEach(() => {
  cleanup();
  adminState.isAdmin = false;
  planoState.dados = undefined;
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
  it('renderiza o plano Grátis no botão e no item do menu', async () => {
    planoState.dados = planoGratis;
    const user = userEvent.setup();
    renderMenu();
    expect(
      screen.getByRole('button', { name: /kelly souza/i }).textContent,
    ).toContain('Plano Grátis');
    await user.click(screen.getByRole('button', { name: /kelly souza/i }));
    expect(
      screen.getByRole('menuitem', { name: 'PlanosGrátis' }),
    ).not.toBeNull();
    expect(nomeDoUsuario(null, 'aluna.teste@academy.com')).toBe('aluna.teste');
  });

  it('renderiza assinatura Pro mensal e os dois selos', async () => {
    planoState.dados = planoProMensal;
    const user = userEvent.setup();
    renderMenu();
    const button = screen.getByRole('button', { name: /kelly souza/i });
    expect(button.textContent).toContain('Plano Pro · mensal');
    expect(screen.getByText('PRO')).not.toBeNull();
    await user.click(button);
    expect(screen.getByRole('menuitem', { name: 'PlanosPro' })).not.toBeNull();
  });

  it('não exibe selo enquanto o plano carrega', async () => {
    const user = userEvent.setup();
    renderMenu();
    const button = screen.getByRole('button', { name: /kelly souza/i });
    expect(button.textContent).toContain('Carregando plano…');
    expect(screen.queryByText('PRO')).toBeNull();
    await user.click(button);
    expect(screen.queryByText('Pro')).toBeNull();
    expect(screen.queryByText('Grátis')).toBeNull();
  });

  it('abre o menu com cabeçalho e os quatro itens', async () => {
    planoState.dados = planoGratis;
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
    expect(
      screen
        .getByRole('menuitem', { name: 'Painel admin' })
        .getAttribute('href'),
    ).toBe('/admin');
  });
});
