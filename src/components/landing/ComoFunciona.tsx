import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

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
  const inView = useInView(flowRef, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 px-5 pt-[120px] pb-10 sm:px-6"
    >
      <div className="mx-auto max-w-[1200px]">
        <header className="max-w-[720px]">
          <p className="text-accent-text font-mono text-xs tracking-[1.6px]">
            COMO FUNCIONA
          </p>
          <h2 className="text-text mt-3.5 text-[34px] leading-[1.05] font-extrabold tracking-[-1.1px] text-balance min-[960px]:text-[52px] min-[960px]:tracking-[-1.6px]">
            Um ciclo de treino que aprende com cada redação.
          </h2>
          <p className="text-text-2 mt-[18px] text-lg leading-[1.6]">
            Você não precisa de mais redações corrigidas. Precisa saber o que
            mudar entre uma e outra.
          </p>
        </header>

        <div ref={flowRef} className="relative mt-14">
          <div
            aria-hidden="true"
            className="bg-border-subtle absolute top-[27px] right-0 left-0 hidden h-0.5 overflow-hidden rounded-sm min-[960px]:block"
          >
            <motion.div
              className="bg-accent h-full origin-left"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: reduceMotion || inView ? 1 : 0 }}
              transition={{
                duration: reduceMotion ? 0 : 1.4,
                ease: [0.2, 0.7, 0.2, 1],
              }}
            />
          </div>

          <ol className="relative grid list-none grid-cols-1 gap-5 p-0 min-[960px]:grid-cols-4 sm:grid-cols-2">
            {steps.map((step) => (
              <li key={step.number} className="flex flex-col gap-4">
                <span className="border-accent bg-bg relative flex size-14 items-center justify-center rounded-full border-2">
                  <span className="text-accent-text font-mono text-[15px] font-medium">
                    {step.number}
                  </span>
                </span>
                <article className="border-border-subtle bg-surface rounded-card flex grow flex-col border p-[22px] transition duration-300 hover:-translate-y-1 hover:border-[#3e5a85] motion-reduce:transition-none">
                  <h3 className="text-text text-xl font-bold">{step.title}</h3>
                  <p className="text-text-2 mt-2.5 text-[15px] leading-[1.6]">
                    {step.description}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
