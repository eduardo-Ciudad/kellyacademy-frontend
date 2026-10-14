import { Link } from 'react-router-dom';
import { BrandWatermark } from '@/components/brand/BrandWatermark';
import { CtaFinalMobile } from '@/components/landing/CtaFinalMobile';
import { Reveal } from '@/components/landing/fx/Reveal';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';

export function CtaFinal() {
  const isMobile = useIsMobileLanding();

  return isMobile ? <CtaFinalMobile /> : <CtaFinalDesktop />;
}

function CtaFinalDesktop() {
  return (
    <section
      id="comecar"
      className="border-surface-2 bg-bg relative scroll-mt-20 overflow-hidden border-t px-6 py-[200px]"
    >
      <BrandWatermark className="right-[-120px] bottom-[-140px]" />
      <Reveal className="relative z-10 mx-auto max-w-[1200px] text-center">
        <h2 className="font-display mx-auto max-w-[880px] text-balance text-[clamp(44px,5vw,72px)] leading-[1.03] font-light tracking-[-0.035em] text-text">
          Sua próxima redação <span className="text-[#8a8d91]">pode ser a melhor.</span>
        </h2>
        <p className="text-text-2 mx-auto mt-[26px] max-w-[480px] text-[18px] leading-relaxed">
          Descubra em minutos o que separa você da nota que quer.
        </p>
        <Link
          to="/criar-conta"
          className="focus-ring bg-accent hover:bg-accent-hover rounded-pill mt-[38px] inline-flex h-14 items-center justify-center px-[30px] text-base font-semibold text-white transition-colors motion-reduce:transition-none"
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
