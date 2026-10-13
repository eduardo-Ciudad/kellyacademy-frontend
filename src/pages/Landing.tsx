import { useEffect } from 'react';
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
import { TemasMarquee } from '@/components/landing/TemasMarquee';

export default function Landing() {
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
        <TemasMarquee />
        <RepertorioSection />
        <ComoFunciona />
        <Recursos />
        <Competencias />
        <Planos />
        <Faq />
        <CtaFinal />
      </main>
      <LandingFooter />
      <MobileStickyCta />
    </div>
  );
}
