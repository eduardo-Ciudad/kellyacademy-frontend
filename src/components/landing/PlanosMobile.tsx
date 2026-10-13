import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/landing/fx/Reveal';
import { LandingCard } from '@/components/landing/ui/LandingCard';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';

const FREE_FEATURES = [
  '3 correções por dia',
  'Temas e possíveis temas 2026',
  'Evolução por competência e Julia',
] as const;

export function PlanosMobile() {
  return (
    <section id="planos" className="scroll-mt-20 px-4 pt-14 pb-4">
      <SectionHeader
        eyebrow="Planos"
        title={
          <span className="block text-[32px] leading-[1.08] tracking-[-0.03em]">
            Comece de graça.
          </span>
        }
      />

      <Reveal className="mt-5">
        <LandingCard className="flex flex-col gap-3.5 p-5">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-text text-[20px] font-semibold">Grátis</h3>
            <p className="text-text text-[30px] leading-none font-extrabold tracking-[-0.02em] tabular-nums">
              R$ 0
            </p>
          </div>
          <ul className="text-text-body flex list-none flex-col gap-[9px] p-0 text-[15px]">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <Check
                  size={18}
                  strokeWidth={2.4}
                  aria-hidden="true"
                  className="text-success mt-0.5 shrink-0"
                />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            to="/criar-conta"
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill flex min-h-[50px] items-center justify-center px-5 text-center text-base font-semibold text-white transition-colors motion-reduce:transition-none"
          >
            Criar conta grátis
          </Link>
        </LandingCard>
      </Reveal>

      <Reveal className="mt-3">
        <article className="border-possivel-border rounded-card flex flex-col gap-2 border border-dashed px-[18px] py-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-text text-[17px] font-semibold">Pro</h3>
            <span className="bg-warning-bg text-warning rounded-pill px-[9px] py-1 font-mono text-[10.5px] tracking-[0.1em]">
              EM BREVE
            </span>
          </div>
          <p className="text-text-2 text-[14.5px] leading-[1.5]">
            Mais correções, transcrição por foto, repertório completo e plano de
            estudo.
          </p>
        </article>
      </Reveal>
    </section>
  );
}
