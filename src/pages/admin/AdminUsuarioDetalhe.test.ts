// @vitest-environment jsdom

import {
  cleanup,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/lib/api';
import { AdminUsuarioDetalhe } from '@/pages/admin/AdminUsuarioDetalhe';
import type { AdminUsuarioDetalhe as Detalhe } from '@/types/admin';

const { state, conceder, revogar, reenviar } = vi.hoisted(() => ({
  state: {
    data: undefined as Detalhe | undefined,
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  },
  conceder: { mutateAsync: vi.fn(), isPending: false },
  revogar: { mutateAsync: vi.fn(), isPending: false },
  reenviar: { mutateAsync: vi.fn(), isPending: false },
}));
vi.mock('@/hooks/useAdmin', () => ({
  useAdminUsuario: () => state,
  useConcederPro: () => conceder,
  useRevogarPro: () => revogar,
  useZerarCotaHoje: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useReenviarVerificacao: () => reenviar,
}));

const base: Detalhe = {
  usuario: {
    id: 'u1',
    nome: 'Ana',
    email: 'ana@x.com',
    role: 'ALUNO',
    plano: 'GRATIS',
    emailVerificado: true,
    totalRedacoes: 0,
    notaMedia: null,
    ultimaRedacaoEm: null,
    criadoEm: '2026-01-01T12:00:00Z',
  },
  melhorNota: null,
  competenciaMaisFraca: null,
  assinatura: null,
  concessaoPro: null,
  concessoes: [],
  usoHoje: [],
  julia: { conversas: 0, mensagens: 0 },
  redacoes: [],
};
function renderPage() {
  return render(
    createElement(
      MemoryRouter,
      { initialEntries: ['/admin/usuarios/u1'] },
      createElement(
        Routes,
        null,
        createElement(Route, {
          path: '/admin/usuarios/:id',
          element: createElement(AdminUsuarioDetalhe),
        }),
      ),
    ),
  );
}
afterEach(() => {
  vi.useRealTimers();
  cleanup();
  vi.clearAllMocks();
  state.data = base;
  state.isError = false;
  state.error = null;
});

describe('AdminUsuarioDetalhe', () => {
  it('oferece conceder Pro para aluno grátis', () => {
    state.data = base;
    renderPage();
    expect(screen.getByRole('button', { name: 'Conceder Pro' })).toBeTruthy();
  });
  it('oferece revogar Pro para concessão vigente', () => {
    state.data = {
      ...base,
      usuario: { ...base.usuario, plano: 'PRO' },
      concessaoPro: {
        id: 'c',
        inicio: '2026-10-01T00:00:00Z',
        fim: '2026-11-01T23:59:59Z',
        vigente: true,
        motivo: 'Bolsa de estudos',
        concedidaPor: 'admin',
        revogadaEm: null,
        revogadaPor: null,
        motivoRevogacao: null,
      },
    };
    renderPage();
    expect(screen.getByRole('button', { name: 'Revogar Pro' })).toBeTruthy();
  });
  it('informa quando já é Pro pela assinatura', () => {
    state.data = {
      ...base,
      usuario: { ...base.usuario, plano: 'PRO' },
      assinatura: {
        status: 'ACTIVE',
        ciclo: 'MENSAL',
        periodoAtualFim: '2099-01-01T00:00:00Z',
        cancelarNoFimDoPeriodo: false,
        stripeCustomerId: null,
      },
    };
    renderPage();
    expect(screen.getByText('Já é Pro pela assinatura')).toBeTruthy();
  });
  it('bloqueia dias e motivo inválidos e mostra o detail do 409', async () => {
    state.data = base;
    conceder.mutateAsync.mockRejectedValueOnce(
      new ApiError({
        code: 'HTTP',
        status: 409,
        detail: 'Este aluno já é Pro pela assinatura.',
      }),
    );
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Conceder Pro' }));
    const dias = screen.getByLabelText('Dias');
    const motivo = screen.getByLabelText('Motivo');
    const enviar = screen.getByRole('button', { name: 'Conceder' });
    fireEvent.change(dias, { target: { value: '0' } });
    fireEvent.change(motivo, { target: { value: 'abcd' } });
    expect(enviar).toHaveProperty('disabled', true);
    fireEvent.change(dias, { target: { value: '366' } });
    expect(enviar).toHaveProperty('disabled', true);
    expect(conceder.mutateAsync).not.toHaveBeenCalled();
    fireEvent.change(dias, { target: { value: '30' } });
    fireEvent.change(motivo, { target: { value: 'Motivo válido' } });
    fireEvent.click(enviar);
    await waitFor(() =>
      expect(
        screen.getByText('Este aluno já é Pro pela assinatura.'),
      ).toBeTruthy(),
    );
  });

  it('mostra o 429 do reenvio como alerta, não como status', async () => {
    state.data = {
      ...base,
      usuario: { ...base.usuario, emailVerificado: false },
    };
    reenviar.mutateAsync.mockRejectedValueOnce(
      new ApiError({
        code: 'HTTP',
        status: 429,
        detail: 'Muitas tentativas.',
        retryAfter: 121,
      }),
    );
    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Reenviar verificação de e-mail' }),
    );

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Um link foi enviado há pouco. Tente de novo em 3 min',
    );
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('remove o aviso de sucesso depois de 6 segundos', async () => {
    vi.useFakeTimers();
    state.data = {
      ...base,
      usuario: { ...base.usuario, emailVerificado: false },
    };
    reenviar.mutateAsync.mockResolvedValueOnce(undefined);
    renderPage();
    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Reenviar verificação de e-mail' }),
      );
      await Promise.resolve();
    });
    expect(screen.getByRole('status')).toBeTruthy();

    await act(() => vi.advanceTimersByTime(6_000));
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('remove o aviso ao clicar em Fechar aviso', async () => {
    state.data = {
      ...base,
      usuario: { ...base.usuario, emailVerificado: false },
    };
    reenviar.mutateAsync.mockResolvedValueOnce(undefined);
    renderPage();
    fireEvent.click(
      screen.getByRole('button', { name: 'Reenviar verificação de e-mail' }),
    );

    expect(await screen.findByRole('status')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(screen.queryByRole('status')).toBeNull();
  });
});
