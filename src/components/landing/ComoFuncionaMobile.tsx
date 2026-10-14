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

export function ComoFuncionaMobile() {
  const timelineRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 78%', 'end 58%'],
  });

  return (
    <section id="como-funciona" className="landing-section scroll-mt-20 px-4">
      <h2 className="font-display text-text text-[36px] leading-[1.08] font-light tracking-[-0.03em] text-balance">
        Um ciclo que aprende com você.{' '}
        <span className="text-text-3">Treine onde mais perde.</span>
      </h2>
      <p className="text-text-3 mt-4 text-base leading-[1.6]">
        Do diagnóstico à nova avaliação, cada etapa orienta o próximo treino.
      </p>

      <Reveal>
        <ol
          ref={timelineRef}
          className="border-surface-2 mt-8 list-none border-t p-0"
        >
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
    <li className="border-surface-2 grid grid-cols-[32px_minmax(0,1fr)] gap-4 border-b py-5">
      <div className="flex items-start">
        <motion.span
          className="tabular pt-1 font-mono text-xs"
          initial={false}
          animate={{
            color: active ? 'var(--color-accent-text)' : 'var(--color-text-3)',
          }}
          transition={transition}
        >
          {step.number}
        </motion.span>
      </div>
      <div>
        <h3 className="text-text text-[17px] leading-tight font-medium">
          {step.title}
        </h3>
        <p className="text-text-3 mt-1.5 text-[15px] leading-6">
          {step.description}
        </p>
      </div>
    </li>
  );
}
