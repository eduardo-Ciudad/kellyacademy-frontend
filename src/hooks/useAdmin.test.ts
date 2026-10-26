// @vitest-environment jsdom

import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { apiMock } = vi.hoisted(() => ({
  apiMock: vi.fn<(path: string, options: RequestInit) => Promise<unknown>>(),
}));
vi.mock('@/lib/api', () => ({ api: apiMock }));

import { useAdminUsuarios } from '@/hooks/useAdmin';

function Harness() {
  useAdminUsuarios({
    busca: '  ',
    plano: '',
    email: 'VERIFICADO',
    pagina: 2,
    tamanho: 20,
  });
  return null;
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('useAdminUsuarios', () => {
  it('omite filtros vazios e envia pagina e tamanho', async () => {
    apiMock.mockResolvedValue({
      itens: [],
      pagina: 2,
      tamanho: 20,
      totalItens: 0,
      totalPaginas: 0,
      temProxima: false,
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(Harness),
      ),
    );

    await waitFor(() => expect(apiMock).toHaveBeenCalledOnce());
    const [path, options] = apiMock.mock.calls[0];
    expect(path).toBe('/admin/usuarios?email=VERIFICADO&pagina=2&tamanho=20');
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });
});
