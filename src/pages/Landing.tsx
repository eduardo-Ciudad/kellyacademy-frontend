import { useEffect } from 'react';
import { ComoFunciona } from '@/components/landing/ComoFunciona';
import { Competencias } from '@/components/landing/Competencias';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { Faq } from '@/components/landing/Faq';
import { Hero } from '@/components/landing/Hero';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNav } from '@/components/landing/LandingNav';
import { Planos } from '@/components/landing/Planos';
import { RepertorioSection } from '@/components/landing/RepertorioSection';
import { Recursos } from '@/components/landing/Recursos';
import { SectionReveal } from '@/components/landing/SectionReveal';
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
    <div className="bg-bg text-text min-h-screen overflow-x-clip">
      <LandingNav />
      <main>
        <Hero />
        <SectionReveal>
          <TemasMarquee />
        </SectionReveal>
        <SectionReveal>
          <RepertorioSection />
        </SectionReveal>
        <SectionReveal>
          <ComoFunciona />
        </SectionReveal>
        <SectionReveal>
          <Recursos />
        </SectionReveal>
        <SectionReveal>
          <Competencias />
        </SectionReveal>
        <SectionReveal>
          <Planos />
        </SectionReveal>
        <SectionReveal>
          <Faq />
        </SectionReveal>
        <SectionReveal>
          <CtaFinal />
        </SectionReveal>
      </main>
      <LandingFooter />
    </div>
  );
}
