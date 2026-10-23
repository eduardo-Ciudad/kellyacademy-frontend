// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  acaoBotaoPro,
  cicloParaCheckout,
  iniciarCheckout,
} from '@/lib/assinatura';

describe('acaoBotaoPro', () => {
  it('oculta a ação quando pagamentos estão desligados', () => {
    expect(acaoBotaoPro({ pagamentoHabilitado: false, logado: false })).toBe(
      'em-breve',
    );
    expect(acaoBotaoPro({ pagamentoHabilitado: false, logado: true })).toBe(
      'em-breve',
    );
  });

  it('leva o visitante ao cadastro Pro quando pagamentos estão ligados', () => {
    expect(acaoBotaoPro({ pagamentoHabilitado: true, logado: false })).toBe(
      '/criar-conta?plano=pro',
    );
  });

  it('leva a pessoa logada para planos quando pagamentos estão ligados', () => {
    expect(acaoBotaoPro({ pagamentoHabilitado: true, logado: true })).toBe(
      '/planos',
    );
  });
});

describe('cicloParaCheckout', () => {
  it('converte os ciclos da landing para os valores do backend', () => {
    expect(cicloParaCheckout('mensal')).toBe('MENSAL');
    expect(cicloParaCheckout('anual')).toBe('ANUAL');
  });
});

describe('iniciarCheckout', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('envia o ciclo em POST para o checkout de assinaturas', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ url: 'https://checkout.stripe.com/test' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    await expect(iniciarCheckout('ANUAL')).resolves.toEqual({
      url: 'https://checkout.stripe.com/test',
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [path, request] = fetchMock.mock.calls[0] ?? [];
    expect(path).toBe('/assinaturas/checkout');
    expect(request).toMatchObject({
      method: 'POST',
      body: '{"ciclo":"ANUAL"}',
    });
  });
});
