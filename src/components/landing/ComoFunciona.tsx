import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from 'motion/react';
import { COMO_FUNCIONA_STEPS } from '@/components/landing/data/comoFunciona';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';
import { RevealGroup, RevealItem } from '@/components/landing/fx/Reveal';
import { ComoFuncionaMobile } from '@/components/landing/ComoFuncionaMobile';
import { LandingCard } from '@/components/landing/ui/LandingCard';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';

export function ComoFunciona() {
  const isMobile = useIsMobileLanding();

  return isMobile ? <ComoFuncionaMobile /> : <ComoFuncionaDesktop />;
}

function ComoFuncionaDesktop() {
  const flowRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: flowRef,
    offset: ['start 80%', 'end 60%'],
  });

  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 px-5 pt-[120px] pb-10 sm:px-6"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow="Como funciona"
          title="Um ciclo que aprende com cada redação."
          className="max-w-[720px]"
        />

        <div ref={flowRef} className="relative mt-14">
          <div
            aria-hidden="true"
            className="bg-border-subtle desk:block absolute top-[27px] right-0 left-0 hidden h-0.5 overflow-hidden rounded-sm"
          >
            <motion.div
              className="bg-accent h-full origin-left"
              style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
            />
          </div>

          <RevealGroup
            as="ol"
            className="desk:grid-cols-4 relative grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2"
          >
            {COMO_FUNCIONA_STEPS.map((step, index) => (
              <RevealItem
                key={step.number}
                as="li"
                className="flex flex-col gap-4"
              >
                <StepCircle
                  number={step.number}
                  threshold={index / (COMO_FUNCIONA_STEPS.length - 1)}
                  progress={scrollYProgress}
                  reduceMotion={Boolean(reduceMotion)}
                />
                <LandingCard className="flex grow flex-col p-[22px]">
                  <h3 className="text-text text-h3">{step.title}</h3>
                  <p className="text-text-2 text-body mt-2.5">
                    {step.description}
                  </p>
                </LandingCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

function StepCircle({
  number,
  threshold,
  progress,
  reduceMotion,
}: {
  number: string;
  threshold: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const initiallyActive = reduceMotion || progress.get() >= threshold;
  const [active, setActive] = useState(initiallyActive);
  const activeRef = useRef(initiallyActive);

  useEffect(() => {
    if (!reduceMotion || activeRef.current) return;
    activeRef.current = true;
    setActive(true);
  }, [reduceMotion]);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (reduceMotion) return;
    const nextActive = latest >= threshold;
    if (activeRef.current === nextActive) return;
    activeRef.current = nextActive;
    setActive(nextActive);
  });

  return (
    <>
      <span className="border-accent bg-bg desk:hidden relative flex size-14 items-center justify-center rounded-full border-2">
        <span className="text-accent-text text-small tabular font-mono font-medium">
          {number}
        </span>
      </span>
      <motion.span
        className="bg-bg desk:flex relative hidden size-14 items-center justify-center rounded-full border-2"
        initial={false}
        animate={{
          borderColor: active ? 'var(--color-accent)' : 'var(--color-control)',
        }}
        transition={{ duration: reduceMotion ? 0 : DUR.fast, ease: EASE_OUT }}
      >
        <motion.span
          className="text-small tabular font-mono font-medium"
          initial={false}
          animate={{
            color: active ? 'var(--color-accent-text)' : 'var(--color-text-3)',
          }}
          transition={{
            duration: reduceMotion ? 0 : DUR.fast,
            ease: EASE_OUT,
          }}
        >
          {number}
        </motion.span>
      </motion.span>
    </>
  );
}
