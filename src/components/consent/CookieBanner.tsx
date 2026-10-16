import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ShieldCheck } from 'lucide-react';
import { BrandWatermark } from '@/components/brand/BrandWatermark';
import { CookieCategoryRow } from '@/components/consent/CookieCategoryRow';
import { ConsentSwitch } from '@/components/consent/ConsentSwitch';
import { Button } from '@/components/ui/Button';
import type { AnalyticsConsentChoice, Consent } from '@/lib/consent';

type CookieBannerProps = {
  currentConsent: Consent | null;
  openedFromPreferences: boolean;
  onDecision: (choice: AnalyticsConsentChoice) => void;
  onClosePreferences: () => void;
};

type BannerView = 'compact' | 'customize';

export function CookieBanner({
  currentConsent,
  openedFromPreferences,
  onDecision,
  onClosePreferences,
}: CookieBannerProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [view, setView] = useState<BannerView>(() =>
    openedFromPreferences ? 'customize' : 'compact',
  );
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    currentConsent?.analytics === 'granted',
  );

  useEffect(() => {
    if (!openedFromPreferences) return;
    setAnalyticsEnabled(currentConsent?.analytics === 'granted');
    setView('customize');
  }, [currentConsent?.analytics, openedFromPreferences]);

  useEffect(() => {
    if (openedFromPreferences && view === 'customize') {
      titleRef.current?.focus();
    }
  }, [openedFromPreferences, view]);

  function openCustomize() {
    setAnalyticsEnabled(currentConsent?.analytics === 'granted');
    setView('customize');
  }

  function leaveCustomize() {
    if (openedFromPreferences) {
      onClosePreferences();
      return;
    }
    setView('compact');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Escape' || view !== 'customize') return;
    event.preventDefault();
    leaveCustomize();
  }

  return (
    <section
      role="region"
      aria-labelledby="cookie-banner-title"
      onKeyDown={handleKeyDown}
      className="border-border-subtle bg-surface/95 rounded-panel shadow-raised fixed right-3 bottom-[calc(12px+env(safe-area-inset-bottom))] left-3 z-50 overflow-hidden border p-5 backdrop-blur-md motion-safe:animate-[cookie-banner-in_180ms_ease-out] motion-reduce:animate-none sm:right-auto sm:bottom-5 sm:left-5 sm:w-[440px] sm:p-6"
    >
      <BrandWatermark
        width={220}
        opacity={0.04}
        className="-top-14 -right-14"
      />

      <div className="relative z-10">
        <div className="text-accent-text text-eyebrow flex items-center gap-2 font-mono font-semibold uppercase">
          <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
          Privacidade
        </div>
        <h2
          ref={titleRef}
          id="cookie-banner-title"
          tabIndex={-1}
          className="font-display text-text mt-3 text-[24px] leading-[1.15] font-light tracking-[-0.03em] outline-none"
        >
          Sua privacidade, sua escolha
        </h2>

        {view === 'compact' ? (
          <div className="motion-safe:animate-[cookie-panel-in_150ms_ease-out] motion-reduce:animate-none">
            <p className="text-text-2 text-small mt-3 text-pretty">
              Usamos cookies de análise do Google Analytics para entender como a
              Kelly Academy é usada. Eles só são ativados se você aceitar.{' '}
              <a
                href="/cookies"
                className="focus-ring text-accent-text hover:text-accent-text-hover rounded-sm underline decoration-current/30 underline-offset-4 transition-colors"
              >
                Política de Cookies
              </a>
              .
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <Button
                type="button"
                variant="primary"
                className="w-full px-4 sm:w-auto sm:min-w-28"
                onClick={() => onDecision('granted')}
              >
                Aceitar
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full px-4 sm:w-auto sm:min-w-28"
                onClick={() => onDecision('denied')}
              >
                Recusar
              </Button>
              <button
                type="button"
                onClick={openCustomize}
                className="focus-ring text-text-2 hover:text-text col-span-2 min-h-11 justify-self-center rounded-sm text-sm underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current/40 sm:ml-auto"
              >
                Personalizar
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 motion-safe:animate-[cookie-panel-in_150ms_ease-out] motion-reduce:animate-none">
            <div className="space-y-2.5">
              <CookieCategoryRow
                title="Necessários"
                description="Mantêm você conectado, salvam rascunhos e lembram esta escolha."
                control={
                  <span className="bg-success-bg text-success rounded-pill shrink-0 px-2.5 py-1 font-mono text-[11px] leading-4">
                    Sempre ativo
                  </span>
                }
              />
              <CookieCategoryRow
                title="Análise"
                description="Google Analytics: páginas visitadas e tipo de dispositivo, de forma estatística. Sem anúncios."
                control={
                  <ConsentSwitch
                    label="Cookies de análise"
                    checked={analyticsEnabled}
                    onCheckedChange={setAnalyticsEnabled}
                  />
                }
              />
            </div>

            <div className="mt-5 flex items-center gap-4">
              <Button
                type="button"
                variant="primary"
                className="px-5"
                onClick={() =>
                  onDecision(analyticsEnabled ? 'granted' : 'denied')
                }
              >
                Salvar escolhas
              </Button>
              <button
                type="button"
                onClick={leaveCustomize}
                className="focus-ring text-text-2 hover:text-text min-h-11 rounded-sm text-sm underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current/40"
              >
                {openedFromPreferences ? 'Cancelar' : 'Voltar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
