// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Temas } from './Temas';

vi.mock('@/components/layout/AccountButton', () => ({
  AccountButton: () => null,
}));

vi.mock('@/hooks/usePlano', () => ({
  usePlano: () => ({ isLoading: false, libera: () => true }),
}));

vi.mock('@/hooks/useTemas', () => ({
  useTemas: () => ({
    data: [],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/hooks/useRedacoes', () => ({
  useRedacoes: () => ({
    data: [],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

afterEach(cleanup);

describe('Temas — filtros', () => {
  it('renderiza os filtros na ordem esperada com Todos ativo', () => {
    render(createElement(MemoryRouter, null, createElement(Temas)));

    const filtros = [
      screen.getByRole('button', { name: 'Todos' }),
      screen.getByRole('button', { name: 'Seus temas' }),
      screen.getByRole('button', { name: 'Não praticados' }),
      screen.getByRole('button', { name: /Já praticados/ }),
    ];

    for (let index = 0; index < filtros.length - 1; index += 1) {
      expect(
        filtros[index].compareDocumentPosition(filtros[index + 1]) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
    expect(filtros[0].className).toContain('border-accent');
    expect(filtros[0].className).toContain('bg-nav-active');
    expect(
      filtros
        .slice(1)
        .every((filtro) => !filtro.className.includes('bg-nav-active')),
    ).toBe(true);
  });
});
