// @vitest-environment jsdom
import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AccountSheet } from '@/components/layout/AccountSheet';
import type { PlanoUsuario } from '@/types/api';

const { planoState } = vi.hoisted(() => ({
  planoState: { dados: undefined as PlanoUsuario | undefined },
}));

vi.mock('@/hooks/usePlano', () => ({ usePlano: () => planoState }));
vi.mock('@/hooks/useMe', () => ({ useIsAdmin: () => ({ isAdmin: false }) }));
vi.mock('@/hooks/useUsuario', () => ({
  useUsuario: () => ({ nome: 'Kelly Souza', iniciais: 'KS' }),
}));
vi.mock('@/hooks/useLogout', () => ({ useLogout: () => vi.fn() }));
vi.mock('@/features/tour/TourProvider', () => ({
  useTour: () => ({ openTour: vi.fn() }),
}));
vi.mock('@/components/redacao/CorrecoesHojeCard', () => ({
  CorrecoesHojeCard: () => null,
}));

const planoGratis: PlanoUsuario = {
  plano: 'GRATIS',
  origem: null,
  concessao: null,
  limites: { correcoesPorDia: 3, transcricoesPorDia: 2 },
  recursos: [],
  assinatura: null,
};

afterEach(() => {
  cleanup();
  planoState.dados = undefined;
});

function renderSheet() {
  render(
    createElement(
      MemoryRouter,
      null,
      createElement(AccountSheet, { open: true, onOpenChange: vi.fn() }),
    ),
  );
}

describe('AccountSheet', () => {
  it('mostra o plano Grátis sem selo PRO', () => {
    planoState.dados = planoGratis;
    renderSheet();
    expect(screen.getByText('Plano Grátis')).not.toBeNull();
    expect(screen.queryByText('PRO')).toBeNull();
  });

  it('mostra concessão Pro com data em São Paulo e selo PRO', () => {
    planoState.dados = {
      ...planoGratis,
      plano: 'PRO',
      origem: 'CONCESSAO',
      concessao: { fim: '2027-01-01T01:00:00Z' },
    };
    renderSheet();
    expect(screen.getByText('Plano Pro · até 31/12/2026')).not.toBeNull();
    expect(screen.getByText('PRO')).not.toBeNull();
  });

  it('mostra o carregamento sem selo', () => {
    renderSheet();
    expect(screen.getByText('Carregando plano…')).not.toBeNull();
    expect(screen.queryByText('PRO')).toBeNull();
  });
});
