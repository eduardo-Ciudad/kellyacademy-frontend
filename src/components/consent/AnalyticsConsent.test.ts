// @vitest-environment jsdom

import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AnalyticsConsent } from '@/components/consent/AnalyticsConsent';
import { CONSENT_STORAGE_KEY, openCookiePreferences } from '@/lib/consent';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function buttonWithText(container: HTMLElement, text: string) {
  const button = [...container.querySelectorAll('button')].find(
    (candidate) => candidate.textContent?.trim() === text,
  );
  if (!button) throw new Error(`Botão não encontrado: ${text}`);
  return button;
}

describe('AnalyticsConsent', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    document.head.innerHTML = '';
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    delete document.documentElement.dataset.cookieBannerVisible;
  });

  it('permite recusar, reabrir e aceitar sem carregar GA em desenvolvimento', () => {
    act(() => root.render(createElement(AnalyticsConsent)));

    expect(
      container.querySelector('[aria-label="Preferências de cookies"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('script[src*="googletagmanager.com"]'),
    ).toBeNull();

    act(() => buttonWithText(container, 'Recusar').click());

    expect(
      container.querySelector('[aria-label="Preferências de cookies"]'),
    ).toBeNull();
    expect(
      JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? ''),
    ).toMatchObject({ analytics: 'denied' });

    act(() => openCookiePreferences());

    expect(container.textContent).toContain('Escolha atual: Recusados');
    act(() => buttonWithText(container, 'Aceitar').click());

    expect(
      container.querySelector('[aria-label="Preferências de cookies"]'),
    ).toBeNull();
    expect(
      JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? ''),
    ).toMatchObject({ analytics: 'granted' });
    expect(
      document.querySelector('script[src*="googletagmanager.com"]'),
    ).toBeNull();
  });
});
