import { useEffect, useState } from 'react';
import { ComoFunciona } from '@/components/landing/ComoFunciona';
import { Competencias } from '@/components/landing/Competencias';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { Faq } from '@/components/landing/Faq';
import { Hero } from '@/components/landing/Hero';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNav } from '@/components/landing/LandingNav';
import { MobileStickyCta } from '@/components/landing/MobileStickyCta';
import { Planos } from '@/components/landing/Planos';
import { RepertorioSection } from '@/components/landing/RepertorioSection';
import { Recursos } from '@/components/landing/Recursos';
import { RedacaoScroll } from '@/components/landing/RedacaoScroll';
import { TemasMarquee } from '@/components/landing/TemasMarquee';
import { useLenis } from '@/hooks/useLenis';

export default function Landing() {
  useLenis();

  const [mobileRepertorioSheetOpen, setMobileRepertorioSheetOpen] =
    useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Kelly Academy — Correção de redação do ENEM com IA';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="bg-bg text-text min-h-screen overflow-x-clip font-sans">
      <LandingNav />
      <main className="desk:pb-0 pb-[calc(78px+env(safe-area-inset-bottom))]">
        <Hero />
        <RedacaoScroll />
        <TemasMarquee />
        <RepertorioSection
          onMobileSheetOpenChange={setMobileRepertorioSheetOpen}
        />
        <ComoFunciona />
        <Recursos />
        <Competencias />
        <Planos />
        <Faq />
        <CtaFinal />
      </main>
      <LandingFooter />
      <MobileStickyCta suppressed={mobileRepertorioSheetOpen} />
    </div>
  );
}
