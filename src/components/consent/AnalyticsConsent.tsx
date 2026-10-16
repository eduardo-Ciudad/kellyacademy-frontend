import { useCallback, useEffect, useState } from 'react';
import { CookieBanner } from '@/components/consent/CookieBanner';
import {
  disableGoogleAnalytics,
  loadGoogleAnalytics,
  shouldEnableAnalytics,
} from '@/lib/analytics';
import {
  CONSENT_CHANGED_EVENT,
  OPEN_COOKIE_PREFERENCES_EVENT,
  readConsent,
  shouldShowCookieBanner,
  writeConsent,
  type AnalyticsConsentChoice,
  type Consent,
} from '@/lib/consent';

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<Consent | null>(() =>
    readConsent(window.localStorage),
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const bannerVisible = shouldShowCookieBanner(consent, preferencesOpen);

  const applyConsent = useCallback(() => {
    const currentConsent = readConsent(window.localStorage);
    setConsent(currentConsent);

    if (
      shouldEnableAnalytics({
        consent: currentConsent,
        measurementId,
        isProd: import.meta.env.PROD,
        hostname: window.location.hostname,
      })
    ) {
      loadGoogleAnalytics(measurementId);
    } else if (currentConsent?.analytics === 'denied') {
      disableGoogleAnalytics(measurementId);
    }
  }, []);

  useEffect(() => {
    applyConsent();
    window.addEventListener(CONSENT_CHANGED_EVENT, applyConsent);
    return () =>
      window.removeEventListener(CONSENT_CHANGED_EVENT, applyConsent);
  }, [applyConsent]);

  useEffect(() => {
    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences);
    return () =>
      window.removeEventListener(
        OPEN_COOKIE_PREFERENCES_EVENT,
        openPreferences,
      );
  }, []);

  useEffect(() => {
    document.documentElement.dataset.cookieBannerVisible =
      String(bannerVisible);
    return () => {
      delete document.documentElement.dataset.cookieBannerVisible;
    };
  }, [bannerVisible]);

  function handleDecision(choice: AnalyticsConsentChoice) {
    writeConsent(window.localStorage, choice);
    setPreferencesOpen(false);
  }

  return bannerVisible ? (
    <CookieBanner currentConsent={consent} onDecision={handleDecision} />
  ) : null;
}
