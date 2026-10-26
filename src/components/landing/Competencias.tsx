import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { competenciasLanding } from '@/components/landing/data/competenciasLanding';
import { CompetenciasMobile } from '@/components/landing/CompetenciasMobile';
import { BorderBeam } from '@/components/landing/fx/BorderBeam';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { Reveal } from '@/components/landing/fx/Reveal';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { useRovingTabs } from '@/components/landing/useRovingTabs';
import { competencias } from '@/lib/competencias';

const landingByCode = new Map(
  competenciasLanding.map((competencia) => [competencia.codigo, competencia]),
);

export function Competencias() {
  const isMobile = useIsMobileLanding();

  return isMobile ? <CompetenciasMobile /> : <CompetenciasDesktop />;
}

function CompetenciasDesktop() {
  const [activeIndex, setActiveIndex] = useState(2);
  const { tabRefs, onKeyDown } = useRovingTabs({
    count: competencias.length,
    onSelect: setActiveIndex,
  });
  const activeCompetencia = competencias[activeIndex];
  const activeContent = landingByCode.get(activeCompetencia.codigo)!;

  return (
    <section
      id="competencias"
      className="landing-section scroll-mt-20 px-5 sm:px-6"
    >
      <div className="desk:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] mx-auto grid max-w-[1200px] gap-10">
        <div>
          <SectionHeader
            eyebrow="As 5 competências"
            title="A mesma régua do ENEM."
            description="Até 200 pontos cada. Escolha uma para ver o que a Kelly avalia."
            className="mb-7"
          />

          <div
            role="tablist"
            aria-label="Competências"
            aria-orientation="vertical"
            className="flex flex-col gap-2"
          >
            {competencias.map((competencia, index) => {
              const selected = activeIndex === index;
              return (
                <button
                  key={competencia.codigo}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`competencia-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="competencia-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`focus-ring rounded-inner flex min-h-14 items-center gap-3.5 border px-4 py-3.5 text-left text-base font-semibold transition-colors motion-reduce:transition-none ${
                    selected
                      ? 'bg-surface border-border-hover'
                      : 'border-border-subtle hover:bg-surface bg-transparent'
                  }`}
                >
                  <span
                    className="text-small rounded-lg px-[9px] py-1.5 font-semibold"
                    style={{
                      color: competencia.hex,
                      backgroundColor: competencia.bgHex,
                    }}
                  >
                    {competencia.codigo}
                  </span>
                  <span className="text-text">{competencia.nomeCurto}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Reveal>
          <div className="border-border-subtle bg-surface rounded-panel relative self-start overflow-hidden border">
            <BorderBeam />
            <AnimatePresence mode="wait" initial={false}>
              <CompetenciaPanel
                key={activeCompetencia.codigo}
                index={activeIndex}
                competencia={activeCompetencia}
                content={activeContent}
              />
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CompetenciaPanel({
  index,
  competencia,
  content,
}: {
  index: number;
  competencia: (typeof competencias)[number];
  content: (typeof competenciasLanding)[number];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      id="competencia-panel"
      role="tabpanel"
      aria-labelledby={`competencia-tab-${index}`}
      tabIndex={0}
      initial={reduceMotion ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
      transition={{
        duration: reduceMotion ? 0 : DUR.fast,
        ease: EASE_OUT,
      }}
      className="flex flex-col gap-[22px] p-6 sm:p-9"
    >
      <div className="flex items-center gap-3.5">
        <span
          className="text-body rounded-[10px] px-3 py-2 font-semibold"
          style={{
            color: competencia.hex,
            backgroundColor: competencia.bgHex,
          }}
        >
          {competencia.codigo}
        </span>
        <span className="text-text-3 text-small tabular font-mono">
          0 — 200 PONTOS
        </span>
      </div>

      <h3 className="font-display text-text text-[30px] leading-[1.2] font-light tracking-[-0.02em]">
        {content.nomeOficial}
      </h3>

      <div>
        <p className="text-text-3 text-eyebrow mb-2 font-mono uppercase">
          O QUE A KELLY OLHA
        </p>
        <p className="text-text-body text-body">{content.olha}</p>
      </div>

      <div className="border-border-subtle bg-photo-drop rounded-inner border px-[18px] py-4">
        <p className="text-text-3 text-eyebrow mb-2 font-mono uppercase">
          EXEMPLO DE APONTAMENTO
        </p>
        <p className="text-text text-body">{content.exemplo}</p>
      </div>
    </motion.article>
  );
}
