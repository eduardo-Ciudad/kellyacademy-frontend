import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BorderBeam } from '@/components/landing/fx/BorderBeam';

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
        <header className="mx-auto max-w-[640px] text-center">
          <p className="text-accent-text font-mono text-xs tracking-[1.6px]">
            PLANOS
          </p>
          <h2 className="text-text mt-3.5 text-[34px] leading-[1.05] font-extrabold tracking-[-1.1px] text-balance min-[960px]:text-[52px] min-[960px]:tracking-[-1.6px]">
            Comece de graça. Evolua quando quiser.
          </h2>
        </header>

        <div className="mt-12 grid gap-5 min-[960px]:grid-cols-2">
          <article className="border-border-subtle bg-surface flex flex-col gap-[22px] rounded-[24px] border p-6 sm:p-8">
            <div>
              <h3 className="text-text text-[22px] font-bold">Grátis</h3>
              <p className="text-text-2 mt-2 text-[15px]">
                Para começar a treinar hoje.
              </p>
            </div>
            <p className="text-text text-5xl font-extrabold tracking-[-1.5px]">
              R$ 0
            </p>
            <FeatureList features={freeFeatures} tone="text-success" />
            <Link
              to="/criar-conta"
              className="focus-ring border-control text-text hover:bg-surface-2 rounded-pill mt-auto inline-flex min-h-14 items-center justify-center border px-5 text-center text-base font-bold transition-colors motion-reduce:transition-none"
            >
              Criar conta grátis
            </Link>
          </article>

          <article className="border-accent bg-surface relative flex flex-col gap-[22px] overflow-hidden rounded-[24px] border p-6 sm:p-8">
            <BorderBeam />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-text text-[22px] font-bold">Pro</h3>
                <p className="text-text-2 mt-2 text-[15px]">
                  Para quem quer treinar todo dia.
                </p>
              </div>
              <span className="bg-warning-bg text-warning rounded-pill px-2.5 py-1.5 text-xs font-bold">
                EM BREVE
              </span>
            </div>
            <p className="text-text text-5xl font-extrabold tracking-[-1.5px]">
              Em breve
            </p>
            <FeatureList features={proFeatures} tone="text-accent-text" />
            <button
              type="button"
              disabled
              className="bg-control text-text-3 rounded-pill mt-auto min-h-14 cursor-not-allowed px-5 text-base font-bold opacity-70"
            >
              Em breve
            </button>
          </article>
        </div>
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
    <ul className="text-text-body flex list-none flex-col gap-3 p-0 text-[15.5px]">
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
