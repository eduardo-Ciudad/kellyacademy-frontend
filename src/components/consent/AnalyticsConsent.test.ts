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

function storedAnalytics() {
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  return stored
    ? (JSON.parse(stored) as { analytics: string }).analytics
    : null;
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

  it('permite recusar, personalizar e cancelar sem carregar GA em desenvolvimento', () => {
    act(() => root.render(createElement(AnalyticsConsent)));

    expect(container.querySelector('[role="region"]')).not.toBeNull();
    expect(buttonWithText(container, 'Personalizar')).toBeTruthy();
    expect(
      document.querySelector('script[src*="googletagmanager.com"]'),
    ).toBeNull();

    act(() => buttonWithText(container, 'Recusar').click());
    expect(container.querySelector('[role="region"]')).toBeNull();
    expect(storedAnalytics()).toBe('denied');

    act(() => openCookiePreferences());

    const title = container.querySelector<HTMLHeadingElement>(
      '#cookie-banner-title',
    );
    const switchButton =
      container.querySelector<HTMLButtonElement>('[role="switch"]');
    expect(title).not.toBeNull();
    expect(document.activeElement).toBe(title);
    expect(switchButton?.getAttribute('aria-checked')).toBe('false');
    expect(buttonWithText(container, 'Cancelar')).toBeTruthy();

    act(() => switchButton?.click());
    expect(switchButton?.getAttribute('aria-checked')).toBe('true');
    act(() => buttonWithText(container, 'Salvar escolhas').click());
    expect(storedAnalytics()).toBe('granted');
    expect(container.querySelector('[role="region"]')).toBeNull();

    act(() => openCookiePreferences());
    const reopenedSwitch =
      container.querySelector<HTMLButtonElement>('[role="switch"]');
    expect(reopenedSwitch?.getAttribute('aria-checked')).toBe('true');
    act(() => reopenedSwitch?.click());
    act(() => buttonWithText(container, 'Cancelar').click());
    expect(storedAnalytics()).toBe('granted');
    expect(container.querySelector('[role="region"]')).toBeNull();

    act(() => openCookiePreferences());
    const region = container.querySelector<HTMLElement>('[role="region"]');
    act(() => {
      region?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
    });
    expect(container.querySelector('[role="region"]')).toBeNull();
    expect(storedAnalytics()).toBe('granted');
    expect(
      document.querySelector('script[src*="googletagmanager.com"]'),
    ).toBeNull();
  });
});
