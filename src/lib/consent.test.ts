// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  readConsent,
  shouldShowCookieBanner,
  writeConsent,
} from '@/lib/consent';

describe('readConsent', () => {
  beforeEach(() => localStorage.clear());

  it('retorna null quando não há valor', () => {
    expect(readConsent(localStorage)).toBeNull();
  });

  it('retorna null para JSON inválido', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, '{inválido');
    expect(readConsent(localStorage)).toBeNull();
  });

  it('retorna null para versão diferente', () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION + 1,
        analytics: 'granted',
        decidedAt: '2026-10-16T12:00:00.000Z',
      }),
    );
    expect(readConsent(localStorage)).toBeNull();
  });

  it('retorna null para escolha de analytics inválida', () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION,
        analytics: 'pending',
        decidedAt: '2026-10-16T12:00:00.000Z',
      }),
    );
    expect(readConsent(localStorage)).toBeNull();
  });

  it('retorna null quando o storage lança erro', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('storage indisponível');
      }),
    };
    expect(readConsent(storage)).toBeNull();
  });
});

describe('writeConsent', () => {
  beforeEach(() => localStorage.clear());

  it('grava versão, escolha e data ISO', () => {
    const now = new Date('2026-10-16T12:34:56.000Z');

    writeConsent(localStorage, 'granted', now);

    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? '')).toEqual(
      {
        version: CONSENT_VERSION,
        analytics: 'granted',
        decidedAt: now.toISOString(),
      },
    );
  });

  it('dispara o evento de mudança de consentimento', () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_CHANGED_EVENT, listener);

    writeConsent(localStorage, 'denied');

    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener(CONSENT_CHANGED_EVENT, listener);
  });
});

describe('shouldShowCookieBanner', () => {
  const consent = {
    version: CONSENT_VERSION,
    analytics: 'denied' as const,
    decidedAt: '2026-10-16T12:00:00.000Z',
  };

  it('aparece sem decisão ou quando as preferências são reabertas', () => {
    expect(shouldShowCookieBanner(null, false)).toBe(true);
    expect(shouldShowCookieBanner(consent, true)).toBe(true);
    expect(shouldShowCookieBanner(consent, false)).toBe(false);
  });
});
