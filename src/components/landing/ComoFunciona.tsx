import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from 'motion/react';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { RevealGroup, RevealItem } from '@/components/landing/fx/Reveal';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';

const steps = [
  {
    number: '01',
    title: 'Diagnóstico',
    description:
      'Escreva ou envie a foto da redação. A Kelly corrige nas cinco competências e encontra seu ponto mais fraco.',
  },
  {
    number: '02',
    title: 'Estudo',
    description:
      'Repertório e explicações focados na competência que mais tira pontos de você.',
  },
  {
    number: '03',
    title: 'Prática',
    description:
      'Treine com temas de edições anteriores e possíveis temas de 2026.',
  },
  {
    number: '04',
    title: 'Nova avaliação',
    description:
      'Escreva de novo e compare. A evolução de cada competência fica registrada.',
  },
] as const;

export function ComoFunciona() {
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
          title="Um ciclo de treino que aprende com cada redação."
          description="Você não precisa de mais redações corrigidas. Precisa saber o que mudar entre uma e outra."
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
            {steps.map((step, index) => (
              <RevealItem
                key={step.number}
                as="li"
                className="flex flex-col gap-4"
              >
                <StepCircle
                  number={step.number}
                  threshold={index / (steps.length - 1)}
                  progress={scrollYProgress}
                  reduceMotion={Boolean(reduceMotion)}
                />
                <article className="border-border-subtle bg-surface rounded-card flex grow flex-col border p-[22px] transition duration-300 hover:-translate-y-1 hover:border-[#3e5a85] motion-reduce:transition-none">
                  <h3 className="text-text text-h3">{step.title}</h3>
                  <p className="text-text-2 text-body mt-2.5">
                    {step.description}
                  </p>
                </article>
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
