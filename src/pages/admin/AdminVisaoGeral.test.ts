// @vitest-environment jsdom

import { createElement, type ReactNode } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import type { AdminVisaoGeral as AdminVisaoGeralData } from '@/types/admin';

const { queryState, useAdminVisaoGeralMock } = vi.hoisted(() => ({
  queryState: {
    data: undefined as AdminVisaoGeralData | undefined,
    isPending: false,
    isError: false,
    isPlaceholderData: false,
    refetch: vi.fn(),
  },
  useAdminVisaoGeralMock: vi.fn(),
}));

vi.mock('@/hooks/useAdmin', () => ({
  useAdminVisaoGeral: useAdminVisaoGeralMock,
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => children,
  BarChart: ({ children }: { children: ReactNode }) =>
    createElement('div', null, children),
  Bar: ({ children }: { children: ReactNode }) =>
    createElement('div', null, children),
  Cell: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

import { AdminVisaoGeral } from '@/pages/admin/AdminVisaoGeral';

const overview: AdminVisaoGeralData = {
  periodo: 30,
  geradoEm: '2026-10-26T15:20:00-03:00',
  totalUsuarios: 1250,
  novosNoPeriodo: 42,
  ativosNoPeriodo: 389,
  correcoesNoPeriodo: 721,
  notaMediaNoPeriodo: 743.5,
  assinantesPro: 125,
  receitaMensalCentavos: 499000,
  serieDiaria: [{ data: '2026-10-26', cadastros: 4, correcoes: 7 }],
  usoIaHoje: [
    { recurso: 'CORRECAO', usados: 40, teto: 100 },
    { recurso: 'TRANSCRICAO', usados: 10, teto: 100 },
    { recurso: 'JULIA', usados: 20, teto: 100 },
  ],
  tokensHoje: 412000,
  usuariosNoLimiteHoje: 3,
  distribuicaoNotas: [
    { min: 0, max: 399, quantidade: 2 },
    { min: 400, max: 599, quantidade: 4 },
    { min: 600, max: 799, quantidade: 8 },
    { min: 800, max: 899, quantidade: 5 },
    { min: 900, max: 1000, quantidade: 1 },
  ],
  mediaPorCompetencia: [
    { competencia: 1, media: 160 },
    { competencia: 2, media: 150 },
    { competencia: 3, media: 120 },
    { competencia: 4, media: 140 },
    { competencia: 5, media: 170 },
  ],
  ultimosCadastros: [],
  alertas: {
    correcoesComErro24h: 0,
    contasSemVerificacao48h: 0,
    ultimoEventoStripeEm: '2026-10-26T14:00:00-03:00',
  },
};

function LocationProbe() {
  const location = useLocation();
  return createElement('output', { 'aria-label': 'url atual' }, location.search);
}

function renderPage(initialEntry = '/admin?periodo=30') {
  return render(
    createElement(
      MemoryRouter,
      { initialEntries: [initialEntry] },
      createElement(AdminVisaoGeral),
      createElement(LocationProbe),
    ),
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  Object.assign(queryState, {
    data: undefined,
    isPending: false,
    isError: false,
    isPlaceholderData: false,
  });
});

describe('AdminVisaoGeral', () => {
  it('renderiza os KPIs retornados pela API', () => {
    queryState.data = overview;
    useAdminVisaoGeralMock.mockImplementation(() => queryState);
    renderPage();

    expect(screen.getByText('1.250')).toBeTruthy();
    expect(screen.getByText('389')).toBeTruthy();
    expect(screen.getByText('721')).toBeTruthy();
    expect(screen.getByText('125')).toBeTruthy();
    expect(screen.getByText('+42')).toBeTruthy();
  });

  it('troca o período pela URL e normaliza valores inválidos', () => {
    queryState.data = overview;
    useAdminVisaoGeralMock.mockImplementation(() => queryState);
    renderPage('/admin?periodo=invalido');

    expect(screen.getByLabelText('url atual').textContent).toBe('?periodo=30');
    fireEvent.click(screen.getByRole('button', { name: '7 dias' }));
    expect(screen.getByLabelText('url atual').textContent).toBe('?periodo=7');
    expect(useAdminVisaoGeralMock).toHaveBeenLastCalledWith(7);
  });

  it('mostra o estado de erro e permite tentar novamente', () => {
    queryState.isError = true;
    useAdminVisaoGeralMock.mockImplementation(() => queryState);
    renderPage();

    expect(
      screen.getByRole('heading', {
        name: 'Não foi possível carregar a visão geral',
      }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(queryState.refetch).toHaveBeenCalledOnce();
  });
});
