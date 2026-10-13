import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BorderBeam } from '@/components/landing/fx/BorderBeam';
import { RevealGroup, RevealItem } from '@/components/landing/fx/Reveal';
import { LandingCard } from '@/components/landing/ui/LandingCard';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';

const freeFeatures = [
  '3 correções por dia',
  'Banco de temas e possíveis temas 2026',
  'Histórico e evolução por competência',
  'Assistente Julia',
] as const;

const proFeatures = [
  'Mais correções por dia',
  'Transcrição de redação por foto',
  'Repertório completo por eixo',
  'Comparativo detalhado entre redações',
  'Plano de estudo',
] as const;

export function Planos() {
  return (
    <section id="planos" className="scroll-mt-20 px-5 pt-[120px] pb-10 sm:px-6">
      <div className="mx-auto max-w-[1000px]">
        <SectionHeader
          eyebrow="Planos"
          title="Comece de graça."
          align="center"
          className="max-w-[640px]"
        />

        <RevealGroup className="desk:grid-cols-2 mt-12 grid gap-5">
          <RevealItem>
            <LandingCard className="flex flex-col gap-[22px] p-6 sm:p-8">
              <div>
                <h3 className="text-text text-h3">Grátis</h3>
                <p className="text-text-2 text-body mt-2">
                  Para começar a treinar hoje.
                </p>
              </div>
              <p className="text-text tabular text-h2">R$ 0</p>
              <FeatureList features={freeFeatures} tone="text-success" />
              <Link
                to="/criar-conta"
                className="focus-ring border-control text-text hover:bg-surface-2 rounded-pill mt-auto inline-flex min-h-14 items-center justify-center border px-5 text-center text-base font-semibold transition-colors motion-reduce:transition-none"
              >
                Criar conta grátis
              </Link>
            </LandingCard>
          </RevealItem>

          <RevealItem>
            <LandingCard
              variant="accent"
              className="flex flex-col gap-[22px] p-6 sm:p-8"
            >
              <BorderBeam />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-text text-h3">Pro</h3>
                  <p className="text-text-2 text-body mt-2">
                    Para quem quer treinar todo dia.
                  </p>
                </div>
                <span className="bg-warning-bg text-warning text-eyebrow rounded-pill px-2.5 py-1.5 font-semibold">
                  EM BREVE
                </span>
              </div>
              <div>
                <p className="text-text-3 tabular text-h2">R$ —</p>
                <p className="text-text-3 text-small mt-1">
                  Preço no lançamento
                </p>
              </div>
              <FeatureList features={proFeatures} tone="text-accent-text" />
              <button
                type="button"
                disabled
                className="bg-control text-text-3 rounded-pill mt-auto min-h-14 cursor-not-allowed px-5 text-base font-semibold opacity-70"
              >
                Avise-me quando lançar
              </button>
            </LandingCard>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

function FeatureList({
  features,
  tone,
}: {
  features: readonly string[];
  tone: string;
}) {
  return (
    <ul className="text-text-body text-body flex list-none flex-col gap-3 p-0">
      {features.map((feature) => (
        <li key={feature} className="flex gap-2.5">
          <Check
            size={20}
            strokeWidth={2.4}
            aria-hidden="true"
            className={`${tone} shrink-0`}
          />
          {feature}
        </li>
      ))}
    </ul>
  );
}
