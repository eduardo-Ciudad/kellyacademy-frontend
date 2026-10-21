// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cicloParaCheckout,
  iniciarCheckout,
} from '@/lib/assinatura';

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
      new Response(JSON.stringify({ url: 'https://checkout.stripe.com/test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(iniciarCheckout('ANUAL')).resolves.toEqual({
      url: 'https://checkout.stripe.com/test',
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [path, request] = fetchMock.mock.calls[0] ?? [];
    expect(path).toBe('/assinaturas/checkout');
    expect(request).toMatchObject({ method: 'POST', body: '{"ciclo":"ANUAL"}' });
  });
});
