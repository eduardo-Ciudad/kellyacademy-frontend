import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { competenciasLanding } from '@/components/landing/data/competenciasLanding';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { Reveal } from '@/components/landing/fx/Reveal';
import { LandingCard } from '@/components/landing/ui/LandingCard';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { useRovingTabs } from '@/components/landing/useRovingTabs';
import { competencias } from '@/lib/competencias';

const landingByCode = new Map(
  competenciasLanding.map((competencia) => [competencia.codigo, competencia]),
);

export function CompetenciasMobile() {
  const [activeIndex, setActiveIndex] = useState(2);
  const reduceMotion = useReducedMotion();
  const { tabRefs, onKeyDown } = useRovingTabs({
    count: competencias.length,
    onSelect: setActiveIndex,
    orientation: 'horizontal',
  });
  const activeCompetencia = competencias[activeIndex];
  const activeContent = landingByCode.get(activeCompetencia.codigo)!;

  return (
    <section id="competencias" className="scroll-mt-20 px-4 pt-24 pb-4">
      <SectionHeader
        eyebrow="As 5 competências"
        title={
          <span className="block text-[32px] leading-[1.08] tracking-[-0.03em]">
            A mesma régua do ENEM.
          </span>
        }
        description="Até 200 pontos cada. Toque para ver o que a Kelly avalia."
      />

      <div
        role="tablist"
        aria-label="Competências"
        aria-orientation="horizontal"
        className="mt-5 grid grid-cols-5 gap-2"
      >
        {competencias.map((competencia, index) => {
          const selected = activeIndex === index;
          return (
            <button
              key={competencia.codigo}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`competencia-mobile-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="competencia-mobile-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className="focus-ring rounded-inner h-12 border-2 text-[15px] font-bold transition-colors motion-reduce:transition-none"
              style={{
                color: competencia.hex,
                backgroundColor: competencia.bgHex,
                borderColor: selected ? competencia.hex : 'transparent',
              }}
            >
              {competencia.codigo}
            </button>
          );
        })}
      </div>

      <Reveal className="mt-3.5">
        <LandingCard className="min-h-[330px] p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeCompetencia.codigo}
              id="competencia-mobile-panel"
              role="tabpanel"
              aria-labelledby={`competencia-mobile-tab-${activeIndex}`}
              tabIndex={0}
              className="flex min-h-[288px] flex-col gap-3.5"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0 : DUR.fast,
                ease: EASE_OUT,
              }}
            >
              <p className="text-text-3 tabular font-mono text-[12px]">
                {activeCompetencia.codigo} · 0 — 200 PONTOS
              </p>
              <h3 className="text-text text-[21px] leading-[1.25] font-bold tracking-[-0.02em]">
                {activeContent.nomeOficial}
              </h3>
              <div>
                <p className="text-text-3 mb-1.5 font-mono text-[11px] tracking-[0.12em] uppercase">
                  O que a Kelly olha
                </p>
                <p className="text-text-body text-[15.5px] leading-[1.55]">
                  {activeContent.olha}
                </p>
              </div>
              <div className="border-border-subtle bg-photo-drop rounded-inner mt-auto border px-3.5 py-3">
                <p className="text-text-3 font-mono text-[11px] tracking-[0.12em] uppercase">
                  Exemplo de apontamento
                </p>
                <p className="text-text mt-1.5 text-[14.5px] leading-[1.5]">
                  {activeContent.exemplo}
                </p>
              </div>
            </motion.article>
          </AnimatePresence>
        </LandingCard>
      </Reveal>
    </section>
  );
}
