// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import {
  disableGoogleAnalytics,
  gaCookieNames,
  loadGoogleAnalytics,
  shouldEnableAnalytics,
} from '@/lib/analytics';
import { CONSENT_VERSION, type Consent } from '@/lib/consent';

const measurementId = 'G-TEST123';
const granted: Consent = {
  version: CONSENT_VERSION,
  analytics: 'granted',
  decidedAt: '2026-10-16T12:00:00.000Z',
};
const denied: Consent = { ...granted, analytics: 'denied' };

describe('shouldEnableAnalytics', () => {
  it.each([
    ['sem consentimento', null, measurementId, true, 'kellyacademy.com.br'],
    ['com recusa', denied, measurementId, true, 'kellyacademy.com.br'],
    [
      'em desenvolvimento',
      granted,
      measurementId,
      false,
      'kellyacademy.com.br',
    ],
    ['em outro host', granted, measurementId, true, 'preview.vercel.app'],
    ['sem ID', granted, '', true, 'kellyacademy.com.br'],
  ])('retorna false %s', (_, consent, id, isProd, hostname) => {
    expect(
      shouldEnableAnalytics({
        consent,
        measurementId: id,
        isProd,
        hostname,
      }),
    ).toBe(false);
  });

  it('retorna true com aceite, ID e domínio de produção', () => {
    expect(
      shouldEnableAnalytics({
        consent: granted,
        measurementId,
        isProd: true,
        hostname: 'kellyacademy.com.br',
      }),
    ).toBe(true);
  });
});

describe('gaCookieNames', () => {
  it('gera os nomes dos cookies do GA4', () => {
    expect(gaCookieNames('G-Y8T5J3MNJE')).toEqual(['_ga', '_ga_Y8T5J3MNJE']);
  });
});

describe('Google Analytics DOM integration', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    window.dataLayer = undefined;
    window.gtag = undefined;
    Reflect.deleteProperty(window, `ga-disable-${measurementId}`);
  });

  it('carrega uma única vez e configura consentimento antes do GA', () => {
    loadGoogleAnalytics(measurementId);
    loadGoogleAnalytics(measurementId);

    const scripts = document.querySelectorAll(
      `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`,
    );
    expect(scripts).toHaveLength(1);
    expect(window.dataLayer?.[0]).toEqual([
      'consent',
      'default',
      {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      },
    ]);
    expect(window.dataLayer?.[1]).toEqual([
      'consent',
      'update',
      { analytics_storage: 'granted' },
    ]);
  });

  it('desabilita a coleta e atualiza o consentimento para denied', () => {
    loadGoogleAnalytics(measurementId);
    disableGoogleAnalytics(measurementId);

    expect(Reflect.get(window, `ga-disable-${measurementId}`)).toBe(true);
    expect(window.dataLayer).toContainEqual([
      'consent',
      'update',
      { analytics_storage: 'denied' },
    ]);
  });
});
