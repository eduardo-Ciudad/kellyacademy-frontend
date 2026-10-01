import { Check, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SparkIcon } from '@/components/ui/SparkIcon';
import type { Tema } from '@/types/api';

const etapas = [
  'Texto recebido',
  'Lendo a estrutura do texto',
  'Avaliando as 5 competências',
  'Montando o diagnóstico',
] as const;

export function EtapasCorrecao({ tema }: { tema: Tema }) {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const structureTimer = window.setTimeout(() => setActiveStep(2), 3000);
    const competenciesTimer = window.setTimeout(() => setActiveStep(3), 8000);
    return () => {
      window.clearTimeout(structureTimer);
      window.clearTimeout(competenciesTimer);
    };
  }, []);

  return (
    <main className="bg-bg flex min-h-[100svh] flex-col">
      <header className="border-border-subtle hidden h-[68px] shrink-0 items-center gap-4 border-b px-8 lg:flex">
        <span className="bg-surface text-text-3 flex size-10 items-center justify-center rounded-full">
          ‹
        </span>
        <div className="min-w-0 leading-[1.25]">
          <span className="text-text-3 block text-xs font-semibold">
            {tema.origem === 'AUTORAL'
              ? 'Autoral'
              : tema.ano !== null
                ? `ENEM ${tema.ano}`
                : 'ENEM'}
          </span>
          <span className="text-text block truncate text-base font-semibold">
            {tema.titulo}
          </span>
        </div>
        <span className="bg-surface text-text-3 rounded-pill ml-auto px-5 py-3 text-[15px] font-semibold">
          Corrigindo…
        </span>
      </header>

      <div
        role="status"
        aria-live="polite"
        className="flex flex-1 flex-col items-center gap-7 px-6 pt-[120px] pb-10 lg:justify-center lg:p-8"
      >
        <span className="sr-only">{etapas[activeStep]}</span>
        <div className="relative size-24">
          <svg
            className="animate-spin"
            width="96"
            height="96"
            viewBox="0 0 96 96"
            aria-hidden="true"
          >
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="var(--color-control)"
              strokeWidth="6"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="90 251.3"
            />
          </svg>
          <span className="text-accent-text-hover absolute inset-0 flex items-center justify-center">
            <SparkIcon size={30} />
          </span>
        </div>
        <div className="text-center">
          <h1 className="text-text text-2xl font-bold tracking-[-0.02em] lg:text-[26px]">
            Corrigindo sua redação
          </h1>
          <p className="text-text-2 mt-2 text-[15px] leading-[1.55]">
            Costuma levar de 10 a 30 segundos.{' '}
            <span className="hidden lg:inline">
              Mantenha esta página aberta.
            </span>
            <span className="lg:hidden">Mantenha o app aberto.</span>
          </p>
        </div>

        <div className="bg-surface rounded-card w-full max-w-[520px] p-2 lg:rounded-[28px] lg:p-4">
          {etapas.map((etapa, index) => {
            const complete = index < activeStep;
            const active = index === activeStep;
            return (
              <div
                key={etapa}
                className={`rounded-input flex items-center gap-3 px-3.5 py-3 text-[15px] ${active ? 'bg-surface-2 text-text font-semibold' : complete ? 'text-text-2' : 'text-text-3'}`}
              >
                {complete ? (
                  <span className="bg-success-bg text-success flex size-6 items-center justify-center rounded-full">
                    <Check size={13} strokeWidth={3} />
                  </span>
                ) : (
                  <span
                    className={`flex size-6 items-center justify-center rounded-full border-2 ${active ? 'border-accent' : 'border-control'}`}
                  >
                    {active && (
                      <span className="bg-accent size-2 rounded-full" />
                    )}
                  </span>
                )}
                {etapa}
              </div>
            );
          })}
          <div className="border-control text-text-3 mt-2 flex items-start justify-center gap-2 border-t px-2 pt-[18px] text-center text-[13px] leading-[1.5]">
            <Lock className="mt-0.5 shrink-0" size={15} />
            Se a correção falhar, seu texto continua salvo e a tentativa não é
            descontada.
          </div>
        </div>
      </div>
    </main>
  );
}
