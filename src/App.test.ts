// @vitest-environment jsdom

import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('@/lib/maintenance', () => ({ isMaintenanceMode: () => true }));

describe('App em modo manutenção', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renderiza somente a manutenção e não chama a API', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(createElement(App));

    expect(
      screen.getByRole('heading', { name: 'Servidor em manutenção' }),
    ).toBeTruthy();
    expect(screen.queryByText(/Treine sua redação/i)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
