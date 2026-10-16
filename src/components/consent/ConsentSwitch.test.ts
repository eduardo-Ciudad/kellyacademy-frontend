// @vitest-environment jsdom

import { act, createElement, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ConsentSwitch } from '@/components/consent/ConsentSwitch';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function SwitchHarness() {
  const [checked, setChecked] = useState(false);
  return createElement(ConsentSwitch, {
    label: 'Cookies de análise',
    checked,
    onCheckedChange: setChecked,
  });
}

describe('ConsentSwitch', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(createElement(SwitchHarness)));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('alterna aria-checked no clique, Espaço e Enter', () => {
    const switchButton =
      container.querySelector<HTMLButtonElement>('[role="switch"]');
    expect(switchButton?.getAttribute('aria-checked')).toBe('false');

    act(() => switchButton?.click());
    expect(switchButton?.getAttribute('aria-checked')).toBe('true');

    act(() => {
      switchButton?.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
      );
    });
    expect(switchButton?.getAttribute('aria-checked')).toBe('false');

    act(() => {
      switchButton?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
    });
    expect(switchButton?.getAttribute('aria-checked')).toBe('true');
  });
});
