import { Button } from '@/components/ui/Button';
import type { AnalyticsConsentChoice, Consent } from '@/lib/consent';

type CookieBannerProps = {
  currentConsent: Consent | null;
  onDecision: (choice: AnalyticsConsentChoice) => void;
};

export function CookieBanner({
  currentConsent,
  onDecision,
}: CookieBannerProps) {
  const currentChoice =
    currentConsent?.analytics === 'granted' ? 'Aceitos' : 'Recusados';

  return (
    <section
      role="region"
      aria-label="Preferências de cookies"
      className="border-border-subtle bg-surface rounded-card fixed right-3 bottom-[calc(12px+env(safe-area-inset-bottom))] left-3 z-50 border p-5 motion-safe:animate-[cookie-banner-in_180ms_ease-out] sm:right-auto sm:bottom-5 sm:left-5 sm:w-[calc(100%-2.5rem)] sm:max-w-[420px] sm:p-6"
    >
      <h2 className="text-text text-lg font-semibold tracking-[-0.015em]">
        Cookies de análise
      </h2>
      <p className="text-text-2 mt-2 text-sm leading-6">
        Usamos cookies do Google Analytics para entender como a Kelly Academy é
        usada e melhorar a plataforma. Eles só são ativados se você aceitar.{' '}
        <a
          href="/cookies"
          className="focus-ring text-accent-text hover:text-accent-text-hover rounded-sm underline decoration-current/40 underline-offset-4 transition-colors"
        >
          Política de Cookies
        </a>
        .
      </p>
      {currentConsent ? (
        <p className="text-text-3 mt-3 font-mono text-xs">
          Escolha atual: {currentChoice}
        </p>
      ) : null}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full px-4"
          onClick={() => onDecision('denied')}
        >
          Recusar
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full px-4"
          onClick={() => onDecision('granted')}
        >
          Aceitar
        </Button>
      </div>
    </section>
  );
}
