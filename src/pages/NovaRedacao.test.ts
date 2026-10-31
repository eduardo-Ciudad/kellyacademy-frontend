// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NovaRedacao } from './NovaRedacao';

vi.mock('@/hooks/useTemas', () => ({
  useTemas: () => ({ data: [], isLoading: false, isError: false }),
}));

vi.mock('@/hooks/useCriarTemaPersonalizado', () => ({
  useCriarTemaPersonalizado: () => ({
    mutate: vi.fn(),
    reset: vi.fn(),
    isError: false,
    isPending: false,
    limiteAtingido: false,
    erroCampo: null,
  }),
}));

vi.mock('@/features/tour/TourProvider', () => ({
  useTour: () => ({
    screen: 'closed',
    isTourCompleted: () => true,
    startTour: vi.fn(),
  }),
}));

afterEach(cleanup);

function renderMeuTema() {
  render(
    createElement(
      MemoryRouter,
      { initialEntries: ['/nova-redacao?etapa=meu-tema'] },
      createElement(
        Routes,
        null,
        createElement(Route, {
          path: '/nova-redacao',
          element: createElement(NovaRedacao),
        }),
      ),
    ),
  );
  return document.querySelector<HTMLTextAreaElement>('#tema-redacao')!;
}

describe('NovaRedacao — tema personalizado', () => {
  it('mostra ajuda para título curto e a associa ao campo', () => {
    const campo = renderMeuTema();

    fireEvent.change(campo, { target: { value: 'Curto' } });

    expect(screen.getByText('Use pelo menos 10 caracteres.')).toBeTruthy();
    expect(campo.getAttribute('aria-describedby')).toBe('tema-redacao-ajuda');
  });

  it('mostra ajuda para título com mais de 200 caracteres', () => {
    const campo = renderMeuTema();

    fireEvent.change(campo, { target: { value: 'a'.repeat(201) } });

    expect(screen.getByText('Use no máximo 200 caracteres.')).toBeTruthy();
  });

  it('não mostra mensagens de limite para título válido', () => {
    const campo = renderMeuTema();

    fireEvent.change(campo, {
      target: { value: 'Os desafios da mobilidade urbana no Brasil' },
    });

    expect(screen.queryByText('Use pelo menos 10 caracteres.')).toBeNull();
    expect(screen.queryByText('Use no máximo 200 caracteres.')).toBeNull();
  });
});
