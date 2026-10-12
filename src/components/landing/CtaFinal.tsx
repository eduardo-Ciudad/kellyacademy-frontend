import { Link } from 'react-router-dom';
import { GridBackground } from '@/components/landing/fx/GridBackground';

export function CtaFinal() {
  return (
    <section id="comecar" className="scroll-mt-20 px-5 py-[120px] sm:px-6">
      <div className="bg-accent relative mx-auto max-w-[1200px] overflow-hidden rounded-[32px] px-6 py-16 text-center sm:px-8 sm:py-20">
        <GridBackground className="opacity-70" />
        <div className="relative">
          <h2 className="mx-auto max-w-[760px] text-[38px] leading-[1.04] font-extrabold tracking-[-1.2px] text-balance text-white min-[960px]:text-[56px] min-[960px]:tracking-[-1.8px]">
            Sua próxima redação pode ser a melhor.
          </h2>
          <p className="mx-auto mt-5 max-w-[520px] text-lg leading-[1.6] text-[#e6efff]">
            Envie hoje e descubra em minutos o que separa você da nota que quer.
          </p>
          <Link
            to="/criar-conta"
            className="focus-ring rounded-pill mt-[34px] inline-flex min-h-14 items-center bg-white px-[30px] text-[17px] font-extrabold text-[#0a3a8c] transition hover:-translate-y-px hover:bg-[#f1f6ff] active:translate-y-0 motion-reduce:transition-none"
          >
            Corrigir minha primeira redação
          </Link>
        </div>
      </div>
    </section>
  );
}
