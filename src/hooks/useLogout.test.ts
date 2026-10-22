// @vitest-environment jsdom

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiMock, logoutMock, navigateMock } = vi.hoisted(() => ({
  apiMock: vi.fn(),
  logoutMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock('@/lib/api', () => ({ api: apiMock }));
vi.mock('@/lib/auth', () => ({ useAuth: () => ({ logout: logoutMock }) }));
vi.mock('@/lib/julia', () => ({ juliaHabilitada: true }));
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));

import { useLogout } from '@/hooks/useLogout';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function Harness() {
  const logout = useLogout();
  return createElement('button', { onClick: logout }, 'sair');
}

describe('useLogout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('dispara o encerramento da Júlia e limpa a sessão sem esperar', () => {
    apiMock.mockReturnValue(new Promise(() => undefined));
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => root.render(createElement(Harness)));
    act(() => container.querySelector('button')!.click());
    expect(apiMock).toHaveBeenCalledWith('/julia/conversas', {
      method: 'DELETE',
    });
    expect(logoutMock).toHaveBeenCalledOnce();
    act(() => root.unmount());
  });

  it('faz logout mesmo quando a chamada falha', async () => {
    apiMock.mockRejectedValue(new Error('offline'));
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => root.render(createElement(Harness)));
    act(() => container.querySelector('button')!.click());
    await Promise.resolve();
    expect(logoutMock).toHaveBeenCalledOnce();
    act(() => root.unmount());
  });
});
