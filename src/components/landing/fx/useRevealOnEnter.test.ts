// @vitest-environment jsdom

import { createElement } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  REVEAL_THRESHOLD,
  useRevealOnEnter,
} from '@/components/landing/fx/useRevealOnEnter';

let observerCallback: IntersectionObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();

class IntersectionObserverMock {
  constructor(
    callback: IntersectionObserverCallback,
    public readonly options?: IntersectionObserverInit,
  ) {
    observerCallback = callback;
    instances.push(this);
  }

  observe = observe;
  disconnect = disconnect;
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [REVEAL_THRESHOLD];
}

const instances: IntersectionObserverMock[] = [];

function Probe() {
  const { ref, revealed } = useRevealOnEnter<HTMLDivElement>();
  return createElement('div', { ref, 'data-testid': 'probe' }, String(revealed));
}

describe('useRevealOnEnter', () => {
  afterEach(() => {
    cleanup();
    instances.length = 0;
    observe.mockClear();
    disconnect.mockClear();
    vi.unstubAllGlobals();
  });

  it('observa 15% e mantém a seção vista depois da primeira entrada', () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    render(createElement(Probe));

    expect(instances[0].options?.threshold).toBe(0.15);
    const target = screen.getByTestId('probe');
    act(() => {
      observerCallback(
        [
          { isIntersecting: true, target } as unknown as IntersectionObserverEntry,
        ],
        instances[0],
      );
    });

    expect(screen.getByTestId('probe').textContent).toBe('true');
    expect(disconnect).toHaveBeenCalled();
    expect(instances).toHaveLength(1);
  });
});
