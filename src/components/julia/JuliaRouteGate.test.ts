// @vitest-environment jsdom
import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { JuliaRouteGate } from '@/components/julia/JuliaRouteGate';
import { RESULTADO_CONTENT_CLASS } from '@/lib/julia';

afterEach(cleanup);

function renderAt(pathname: string) {
  render(
    createElement(
      MemoryRouter,
      { initialEntries: [pathname] },
      createElement(
        JuliaRouteGate,
        null,
        createElement('button', null, 'Botão da Júlia'),
      ),
    ),
  );
}

describe('visibilidade do botão flutuante da Júlia', () => {
  it('renderiza na rota de correção', () => {
    renderAt('/redacoes/abc-123');
    expect(screen.queryByRole('button', { name: 'Botão da Júlia' })).not.toBeNull();
  });

  it.each(['/temas', '/repertorio', '/evolucao'])(
    'não renderiza em %s',
    (pathname) => {
      renderAt(pathname);
      expect(screen.queryByRole('button')).toBeNull();
    },
  );

  it('reserva 112px no fim do container da correção', () => {
    expect(RESULTADO_CONTENT_CLASS).toContain('pb-28');
    expect(RESULTADO_CONTENT_CLASS).toContain('lg:pb-28');
  });
});
