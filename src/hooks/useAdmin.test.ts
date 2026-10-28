// @vitest-environment jsdom

import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { apiMock } = vi.hoisted(() => ({
  apiMock: vi.fn<(path: string, options: RequestInit) => Promise<unknown>>(),
}));
vi.mock('@/lib/api', () => ({ api: apiMock }));

import {
  adminUsuariosPath,
  useAdminUsuarios,
  useConcederPro,
  useRevogarPro,
} from '@/hooks/useAdmin';

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
  it('monta a URL com todos os filtros', () => {
    expect(
      adminUsuariosPath({
        busca: 'Kelly',
        plano: 'PRO',
        email: 'PENDENTE',
        pagina: 0,
        tamanho: 20,
      }),
    ).toBe(
      '/admin/usuarios?busca=Kelly&plano=PRO&email=PENDENTE&pagina=0&tamanho=20',
    );
  });
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

function MutationHarness({ tipo }: { tipo: 'conceder' | 'revogar' }) {
  const conceder = useConcederPro();
  const revogar = useRevogarPro();
  return createElement(
    'button',
    {
      onClick: () =>
        tipo === 'conceder'
          ? conceder.mutate({
              id: 'abc',
              dias: 30,
              motivo: 'Apoio no simulado',
            })
          : revogar.mutate({ id: 'abc', motivo: 'Fim do apoio' }),
    },
    'enviar',
  );
}

describe('mutations de concessão Pro', () => {
  it.each([
    [
      'conceder',
      '/admin/usuarios/abc/concessao-pro',
      { dias: 30, motivo: 'Apoio no simulado' },
    ],
    [
      'revogar',
      '/admin/usuarios/abc/concessao-pro/revogar',
      { motivo: 'Fim do apoio' },
    ],
  ] as const)('usa POST na rota correta para %s', async (tipo, path, body) => {
    apiMock.mockResolvedValue({ id: 'c1' });
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const view = render(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(MutationHarness, { tipo }),
      ),
    );
    view.getByRole('button').click();
    await waitFor(() => expect(apiMock).toHaveBeenCalled());
    expect(apiMock).toHaveBeenCalledWith(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  });
});
