// @vitest-environment jsdom

import { createElement, lazy, Suspense } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AuthRouteFallback } from '@/components/auth/AuthRouteFallback';

describe('AuthRouteFallback', () => {
  afterEach(cleanup);

  it('renderiza o skeleton dentro do layout de autenticação', () => {
    const PendingRoute = lazy(
      () => new Promise<{ default: () => null }>(() => undefined),
    );
    const { container } = render(
      createElement(
        Suspense,
        {
          fallback: createElement(AuthRouteFallback, { variant: 'login' }),
        },
        createElement(PendingRoute),
      ),
    );

    expect(screen.getByLabelText('Carregando').getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(container.querySelector('main')?.className).toContain('bg-bg');
    expect(container.textContent).toContain(
      'Descubra onde sua redação perde pontos.',
    );
  });
});
