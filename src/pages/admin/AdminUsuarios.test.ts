// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdminUsuarios } from '@/pages/admin/AdminUsuarios';
import type { AdminUsuarioResumo } from '@/types/admin';

const { query } = vi.hoisted(() => ({
  query: {
    data: {
      itens: [] as AdminUsuarioResumo[],
      pagina: 0,
      tamanho: 20,
      totalItens: 0,
      totalPaginas: 0,
      temProxima: false,
    },
    isPending: false,
    isError: false,
    isPlaceholderData: false,
    refetch: vi.fn(),
  },
}));
vi.mock('@/hooks/useAdmin', () => ({ useAdminUsuarios: () => query }));

function Probe() {
  const location = useLocation();
  return createElement('output', { 'aria-label': 'url' }, location.search);
}
function renderPage(path = '/admin/usuarios?pagina=2') {
  return render(
    createElement(
      MemoryRouter,
      { initialEntries: [path] },
      createElement(AdminUsuarios),
      createElement(Probe),
    ),
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  query.data = {
    itens: [],
    pagina: 0,
    tamanho: 20,
    totalItens: 0,
    totalPaginas: 0,
    temProxima: false,
  };
});

describe('AdminUsuarios', () => {
  it('sincroniza filtros na URL e volta para a página zero', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('Buscar nome ou e-mail'), {
      target: { value: 'Ana' },
    });
    await waitFor(() =>
      expect(screen.getByLabelText('url').textContent).toContain('busca=Ana'),
    );
    expect(screen.getByLabelText('url').textContent).toContain('pagina=0');
    fireEvent.change(screen.getByLabelText('Plano'), {
      target: { value: 'PRO' },
    });
    expect(screen.getByLabelText('url').textContent).toContain('plano=PRO');
  });

  it('mostra o estado vazio e limpa filtros', () => {
    renderPage('/admin/usuarios?plano=PRO&pagina=0');
    expect(
      screen.getByText('Nenhum usuário encontrado com esses filtros.'),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getByLabelText('url').textContent).toBe('?pagina=0');
  });

  it('pagina para frente quando há próxima página', () => {
    query.data = {
      ...query.data,
      itens: [
        {
          id: '1',
          nome: 'Ana',
          email: 'ana@x.com',
          role: 'ALUNO',
          plano: 'GRATIS',
          emailVerificado: true,
          totalRedacoes: 0,
          notaMedia: null,
          ultimaRedacaoEm: null,
          criadoEm: '2026-10-01T12:00:00Z',
        },
      ],
      totalItens: 21,
      totalPaginas: 2,
      temProxima: true,
    };
    renderPage('/admin/usuarios?pagina=0');
    fireEvent.click(screen.getByRole('button', { name: /Próxima/ }));
    expect(screen.getByLabelText('url').textContent).toBe('?pagina=1');
  });
});
