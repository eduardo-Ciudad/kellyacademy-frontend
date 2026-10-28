// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import { iniciarCheckout } from '@/lib/assinatura';
import { ApiError } from '@/lib/api';
import { Planos } from '@/pages/Planos';

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));
vi.mock('@/components/layout/AccountButton', () => ({
  AccountButton: () => null,
}));
vi.mock('@/hooks/usePlano', () => ({
  usePlano: () => ({
    plano: 'GRATIS',
    ehPro: false,
    libera: () => false,
    limites: { correcoesPorDia: 3, transcricoesPorDia: 2 },
    assinatura: null,
    isLoading: false,
  }),
}));
vi.mock('@/lib/assinatura', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/assinatura')>()),
  pagamentoHabilitado: true,
  iniciarCheckout: vi.fn(),
}));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function normalizeText(value: string | null) {
  return value?.replace(/\s+/g, ' ').trim() ?? '';
}

function button(container: HTMLElement, label: string) {
  return Array.from(container.querySelectorAll('button')).find((item) =>
    normalizeText(item.textContent).includes(label),
  )!;
}

describe('página de planos', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    act(() => {
      root.render(
        createElement(
          QueryClientProvider,
          { client: queryClient },
          createElement(Planos),
        ),
      );
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  it('mostra o preço mensal e o total anual vindos dos dados da landing', () => {
    expect(normalizeText(container.textContent)).toContain('R$ 30/mês');

    act(() => button(container, 'Anual').click());

    const text = normalizeText(container.textContent);
    expect(text).toContain('R$ 21/mês');
    expect(text).toContain('R$ 252/ano');
    expect(text).toContain('cobrado anualmente');
  });

  it('alinha apoio abaixo do preço e mantém a ação no fim dos dois cards', () => {
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-plan-card]'),
    );

    expect(cards).toHaveLength(2);
    expect(
      cards.map((card) =>
        normalizeText(
          card.querySelector('[data-plan-support]')?.textContent ?? null,
        ),
      ),
    ).toEqual(['sem cartão', 'cancele quando quiser']);
    cards.forEach((card) => {
      const action = card.querySelector('[data-plan-action]');
      expect(action).not.toBeNull();
      expect(action?.classList.contains('mt-auto')).toBe(true);
    });
  });

  it('troca o botão pela mensagem de assinante quando recebe 409', async () => {
    vi.mocked(iniciarCheckout).mockRejectedValueOnce(
      new ApiError({
        code: 'HTTP',
        status: 409,
        codigo: 'ASSINATURA_EXISTENTE',
        detail: 'Assinatura já existe.',
      }),
    );

    await act(async () => {
      button(container, 'Assinar Pro').click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toContain('Você já é assinante Pro.');
    expect(button(container, 'Assinar Pro')).toBeUndefined();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('mostra em toast o detail retornado no 503', async () => {
    vi.mocked(iniciarCheckout).mockRejectedValueOnce(
      new ApiError({
        code: 'HTTP',
        status: 503,
        codigo: 'PAGAMENTO_INDISPONIVEL',
        detail: 'Pagamentos temporariamente indisponíveis.',
      }),
    );

    await act(async () => {
      button(container, 'Assinar Pro').click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Pagamentos temporariamente indisponíveis.',
    );
  });
});
