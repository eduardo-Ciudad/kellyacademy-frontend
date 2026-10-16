export const CONSENT_STORAGE_KEY = 'kelly:consent';
export const CONSENT_CHANGED_EVENT = 'kelly:consent-changed';
export const OPEN_COOKIE_PREFERENCES_EVENT = 'kelly:open-cookie-preferences';
export const CONSENT_VERSION = 1;

export type AnalyticsConsentChoice = 'granted' | 'denied';

export type Consent = {
  version: number;
  analytics: AnalyticsConsentChoice;
  decidedAt: string;
};

function isConsent(value: unknown): value is Consent {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<Consent>;
  if (
    candidate.version !== CONSENT_VERSION ||
    (candidate.analytics !== 'granted' && candidate.analytics !== 'denied') ||
    typeof candidate.decidedAt !== 'string'
  ) {
    return false;
  }

  const date = new Date(candidate.decidedAt);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString() === candidate.decidedAt
  );
}

export function readConsent(storage: Pick<Storage, 'getItem'>): Consent | null {
  try {
    const stored = storage.getItem(CONSENT_STORAGE_KEY);
    if (stored === null) return null;

    const parsed: unknown = JSON.parse(stored);
    return isConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(
  storage: Pick<Storage, 'setItem'>,
  analytics: AnalyticsConsentChoice,
  now = new Date(),
) {
  const consent: Consent = {
    version: CONSENT_VERSION,
    analytics,
    decidedAt: now.toISOString(),
  };

  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT));
  }

  return consent;
}

export function openCookiePreferences() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
  }
}

export function shouldShowCookieBanner(
  consent: Consent | null,
  preferencesOpen: boolean,
) {
  return consent === null || preferencesOpen;
}
