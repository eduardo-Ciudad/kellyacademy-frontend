// @vitest-environment jsdom
import { createElement, useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  AccessibleDot,
  PointTooltip,
  type ActiveChartPoint,
  type ChartRow,
} from '@/pages/Evolucao';

afterEach(cleanup);

const row: ChartRow = {
  redacaoId: 'redacao-1',
  enviadaEm: '2026-10-15T12:00:00Z',
  temaTitulo: 'Desafios para ampliar o acesso à cultura',
  anulada: false,
  notaTotal: 760,
  notas: { c1: 160, c2: 160, c3: 120, c4: 160, c5: 160 },
  dateLabel: '15 out',
  orderLabel: '1ª',
  anuladaY: null,
  c1: 160,
  c2: 160,
  c3: 120,
  c4: 160,
  c5: 160,
};

function TooltipHarness() {
  const [point, setPoint] = useState<ActiveChartPoint | null>(null);
  return createElement(
    'div',
    null,
    createElement(
      'svg',
      null,
      createElement(AccessibleDot, {
        cx: 40,
        cy: 60,
        value: 760,
        payload: row,
        onActivate: setPoint,
      }),
    ),
    point ? createElement(PointTooltip, { point }) : null,
  );
}

describe('tooltip do gráfico de evolução', () => {
  it('aparece no hover com ordem, data, nota e tema do ponto', () => {
    render(createElement(TooltipHarness));
    fireEvent.mouseEnter(screen.getByRole('button', { name: /nota 760/i }));
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.textContent).toContain('1ª redação · 15 out');
    expect(tooltip.textContent).toContain('760');
    expect(tooltip.textContent).toContain(
      'Desafios para ampliar o acesso à cultura',
    );
  });

  it('aparece quando o ponto recebe foco por teclado', () => {
    render(createElement(TooltipHarness));
    fireEvent.focus(screen.getByRole('button', { name: /nota 760/i }));
    expect(screen.getByRole('tooltip').textContent).toContain('760');
  });
});
