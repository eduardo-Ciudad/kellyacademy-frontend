import type { Consent } from '@/lib/consent';

type AnalyticsEligibility = {
  consent: Consent | null;
  measurementId: string;
  isProd: boolean;
  hostname: string;
};

type GoogleAnalyticsWindow = Window & {
  [key: `ga-disable-${string}`]: boolean | undefined;
};

const ANALYTICS_SCRIPT_ATTRIBUTE = 'data-kelly-google-analytics';

export function shouldEnableAnalytics({
  consent,
  measurementId,
  isProd,
  hostname,
}: AnalyticsEligibility) {
  return (
    consent?.analytics === 'granted' &&
    measurementId.trim() !== '' &&
    isProd &&
    hostname === 'kellyacademy.com.br'
  );
}

export function gaCookieNames(measurementId: string) {
  return ['_ga', `_ga_${measurementId.replace(/^G-/, '')}`];
}

export function loadGoogleAnalytics(
  measurementId: string,
  doc: Document = document,
  win: Window = window,
) {
  const analyticsWindow = win as GoogleAnalyticsWindow;
  analyticsWindow[`ga-disable-${measurementId}`] = false;
  win.dataLayer ??= [];
  win.gtag ??= (...args: GoogleTagArguments) => {
    win.dataLayer?.push(args);
  };

  const existingScript = doc.querySelector<HTMLScriptElement>(
    `script[${ANALYTICS_SCRIPT_ATTRIBUTE}="${measurementId}"]`,
  );
  if (existingScript) {
    win.gtag('consent', 'update', { analytics_storage: 'granted' });
    return existingScript;
  }

  win.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
  win.gtag('consent', 'update', { analytics_storage: 'granted' });
  win.gtag('js', new Date());
  win.gtag('config', measurementId);

  const script = doc.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.setAttribute(ANALYTICS_SCRIPT_ATTRIBUTE, measurementId);
  doc.head.append(script);
  return script;
}

export function disableGoogleAnalytics(
  measurementId: string,
  doc: Document = document,
  win: Window = window,
) {
  if (!measurementId.trim()) return;

  if (win.gtag) {
    win.gtag('consent', 'update', { analytics_storage: 'denied' });
  }
  const analyticsWindow = win as GoogleAnalyticsWindow;
  analyticsWindow[`ga-disable-${measurementId}`] = true;

  const expired = 'Thu, 01 Jan 1970 00:00:00 GMT';
  gaCookieNames(measurementId).forEach((name) => {
    doc.cookie = `${name}=; path=/; expires=${expired}; SameSite=Lax`;
    doc.cookie = `${name}=; path=/; domain=.kellyacademy.com.br; expires=${expired}; SameSite=Lax`;
  });
}
