import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { competenciasLanding } from '@/components/landing/data/competenciasLanding';
import { BorderBeam } from '@/components/landing/fx/BorderBeam';
import { useRovingTabs } from '@/components/landing/useRovingTabs';
import { competencias } from '@/lib/competencias';

const landingByCode = new Map(
  competenciasLanding.map((competencia) => [competencia.codigo, competencia]),
);

export function Competencias() {
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
      className="scroll-mt-20 px-5 pt-[120px] pb-10 sm:px-6"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 min-[960px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-accent-text font-mono text-xs tracking-[1.6px]">
            AS 5 COMPETÊNCIAS
          </p>
          <h2 className="text-text mt-3.5 text-[34px] leading-[1.05] font-extrabold tracking-[-1.1px] min-[960px]:text-[52px] min-[960px]:tracking-[-1.6px]">
            A mesma régua do ENEM.
          </h2>
          <p className="text-text-2 mt-[18px] mb-7 text-lg leading-[1.6]">
            Cada competência vale até 200 pontos. A Kelly avalia as cinco
            separadamente, para você saber exatamente onde focar.
          </p>

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
                      ? 'bg-surface border-[#3e5a85]'
                      : 'border-border-subtle hover:bg-surface bg-transparent'
                  }`}
                >
                  <span
                    className="rounded-lg px-[9px] py-1.5 text-[13px] font-extrabold"
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

        <div className="border-border-subtle bg-surface relative self-start overflow-hidden rounded-[24px] border">
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
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
      className="flex flex-col gap-[22px] p-6 sm:p-9"
    >
      <div className="flex items-center gap-3.5">
        <span
          className="rounded-[10px] px-3 py-2 text-lg font-extrabold"
          style={{
            color: competencia.hex,
            backgroundColor: competencia.bgHex,
          }}
        >
          {competencia.codigo}
        </span>
        <span className="text-text-3 font-mono text-[13px]">
          0 — 200 PONTOS
        </span>
      </div>

      <h3 className="text-text text-[26px] leading-[1.2] font-bold sm:text-[28px]">
        {content.nomeOficial}
      </h3>

      <div>
        <p className="text-text-3 mb-2 font-mono text-[11px] tracking-[1.4px]">
          O QUE A KELLY OLHA
        </p>
        <p className="text-text-body text-[17px] leading-[1.65]">
          {content.olha}
        </p>
      </div>

      <div className="border-border-subtle bg-photo-drop rounded-inner border px-[18px] py-4">
        <p className="text-text-3 mb-2 font-mono text-[11px] tracking-[1.4px]">
          EXEMPLO DE APONTAMENTO
        </p>
        <p className="text-text text-[15.5px] leading-[1.6]">
          {content.exemplo}
        </p>
      </div>
    </motion.article>
  );
}
