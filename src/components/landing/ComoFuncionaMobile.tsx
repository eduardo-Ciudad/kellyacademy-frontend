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
import { Reveal } from '@/components/landing/fx/Reveal';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';

export function ComoFuncionaMobile() {
  const timelineRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 78%', 'end 58%'],
  });

  return (
    <section id="como-funciona" className="scroll-mt-20 px-4 pt-24 pb-4">
      <SectionHeader
        eyebrow="Como funciona"
        title={
          <span className="block text-[32px] leading-[1.08] tracking-[-0.03em]">
            Um ciclo que aprende com cada redação.
          </span>
        }
      />

      <Reveal>
        <ol ref={timelineRef} className="mt-[26px] list-none p-0">
          {COMO_FUNCIONA_STEPS.map((step, index) => (
            <TimelineItem
              key={step.number}
              step={step}
              index={index}
              progress={scrollYProgress}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

function TimelineItem({
  step,
  index,
  progress,
  reduceMotion,
}: {
  step: (typeof COMO_FUNCIONA_STEPS)[number];
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const threshold = index / (COMO_FUNCIONA_STEPS.length - 1);
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
    if (nextActive === activeRef.current) return;
    activeRef.current = nextActive;
    setActive(nextActive);
  });

  const transition = {
    duration: reduceMotion ? 0 : DUR.fast,
    ease: EASE_OUT,
  } as const;

  return (
    <li className="grid grid-cols-[36px_minmax(0,1fr)] gap-3.5">
      <div className="flex flex-col items-center">
        <motion.span
          className="tabular flex size-9 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[13px]"
          initial={false}
          animate={{
            borderColor: active
              ? 'var(--color-accent)'
              : 'var(--color-control)',
            color: active ? 'var(--color-accent-text)' : 'var(--color-text-3)',
          }}
          transition={transition}
        >
          {step.number}
        </motion.span>
        {index < COMO_FUNCIONA_STEPS.length - 1 ? (
          <motion.span
            aria-hidden="true"
            className="mt-1 min-h-5 w-0.5 grow"
            initial={false}
            animate={{
              backgroundColor: active
                ? 'var(--color-accent)'
                : 'var(--color-control)',
            }}
            transition={transition}
          />
        ) : null}
      </div>
      <div
        className={index < COMO_FUNCIONA_STEPS.length - 1 ? 'pb-[22px]' : ''}
      >
        <h3 className="text-text mt-1.5 text-[18px] leading-tight font-semibold">
          {step.title}
        </h3>
        <p className="text-text-2 mt-1 text-[15px] leading-6">
          {step.description}
        </p>
      </div>
    </li>
  );
}
