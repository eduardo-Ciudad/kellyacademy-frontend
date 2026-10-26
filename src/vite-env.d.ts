/// <reference types="vite/client" />

type GoogleConsentSettings = {
  ad_storage?: 'denied' | 'granted';
  ad_user_data?: 'denied' | 'granted';
  ad_personalization?: 'denied' | 'granted';
  analytics_storage?: 'denied' | 'granted';
};

type GoogleTagArguments =
  | ['consent', 'default' | 'update', GoogleConsentSettings]
  | ['js', Date]
  | ['config', string]
  | ['event', string, Record<string, unknown>?];

interface Window {
  [key: `ga-disable-${string}`]: boolean | undefined;
  dataLayer: ArrayLike<unknown>[];
  gtag?: (...args: GoogleTagArguments) => void;
}

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_MAINTENANCE_MODE?: string;
  readonly VITE_PAGAMENTO_HABILITADO?: string;
}
