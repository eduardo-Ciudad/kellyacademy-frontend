import { Link } from 'react-router-dom';
import { BrandWatermark } from '@/components/brand/BrandWatermark';
import { Reveal } from '@/components/landing/fx/Reveal';

export function CtaFinalMobile() {
  return (
    <section
      id="comecar"
      className="border-surface-2 bg-bg relative scroll-mt-20 overflow-hidden border-t px-4 py-28"
    >
      <BrandWatermark
        width={560}
        className="right-[-140px] bottom-[-80px]"
      />
      <Reveal className="relative z-10 text-center">
        <h2 className="font-display mx-auto max-w-[440px] text-balance text-[40px] leading-[1.03] font-light tracking-[-0.035em] text-text">
          Sua próxima redação <span className="text-[#8a8d91]">pode ser a melhor.</span>
        </h2>
        <p className="text-text-2 mx-auto mt-[26px] max-w-[480px] text-[18px] leading-relaxed">
          Descubra em minutos o que separa você da nota que quer.
        </p>
        <Link
          to="/criar-conta"
          className="focus-ring bg-accent hover:bg-accent-hover rounded-pill mt-[38px] flex h-14 w-full items-center justify-center px-4 text-center text-base font-semibold text-white transition-colors motion-reduce:transition-none"
        >
          Corrigir minha primeira redação →
        </Link>
        <p className="font-mono text-text-3 mt-[18px] text-xs">
          3 correções por dia · sem cartão
        </p>
      </Reveal>
    </section>
  );
}
