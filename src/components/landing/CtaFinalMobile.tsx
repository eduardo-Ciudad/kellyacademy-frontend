import { Link } from 'react-router-dom';
import { Reveal } from '@/components/landing/fx/Reveal';

export function CtaFinalMobile() {
  return (
    <section id="comecar" className="scroll-mt-20 px-4 pt-12 pb-0">
      <Reveal>
        <div className="bg-accent rounded-card flex flex-col items-center px-[22px] py-8 text-center">
          <h2 className="text-[30px] leading-[1.08] font-bold tracking-[-0.03em] text-balance text-white">
            Sua próxima redação pode ser a melhor.
          </h2>
          <p className="mt-3 text-[16px] leading-6 text-[#e6efff]">
            Descubra em minutos o que separa você da nota que quer.
          </p>
          <Link
            to="/criar-conta"
            className="focus-ring rounded-pill mt-[22px] flex min-h-[54px] w-full items-center justify-center bg-white px-4 text-center text-[16.5px] font-bold text-[#0a3a8c] transition-colors hover:bg-[#f1f6ff] motion-reduce:transition-none"
          >
            Corrigir minha primeira redação
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
