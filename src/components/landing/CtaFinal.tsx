import { Link } from 'react-router-dom';
import { GridBackground } from '@/components/landing/fx/GridBackground';
import { Reveal } from '@/components/landing/fx/Reveal';

export function CtaFinal() {
  return (
    <section id="comecar" className="scroll-mt-20 px-5 py-[120px] sm:px-6">
      <Reveal className="mx-auto max-w-[1200px]">
        <div className="bg-accent rounded-panel relative overflow-hidden px-6 py-16 text-center sm:px-8 sm:py-20">
          <GridBackground className="opacity-70" />
          <div className="relative">
            <h2 className="text-h2 mx-auto max-w-[760px] text-balance text-white">
              Sua próxima redação pode ser a melhor.
            </h2>
            <p className="text-lead mx-auto mt-5 max-w-[520px] text-[#e6efff]">
              Envie hoje e descubra em minutos o que separa você da nota que
              quer.
            </p>
            <Link
              to="/criar-conta"
              className="focus-ring rounded-pill text-body mt-[34px] inline-flex min-h-14 items-center bg-white px-[30px] font-semibold text-[#0a3a8c] transition hover:-translate-y-px hover:bg-[#f1f6ff] active:translate-y-0 motion-reduce:transition-none"
            >
              Corrigir minha primeira redação
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
