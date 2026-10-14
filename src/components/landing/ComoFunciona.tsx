import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';
import { ComoFuncionaMobile } from '@/components/landing/ComoFuncionaMobile';

const DESKTOP_STEPS = [
  {
    number: '01',
    title: 'Diagnóstico',
    description: 'Envie a redação e descubra seu ponto mais fraco.',
  },
  {
    number: '02',
    title: 'Estudo',
    description:
      'Repertório e explicações na competência que mais tira pontos.',
  },
  {
    number: '03',
    title: 'Prática',
    description: 'Temas de edições anteriores e possíveis temas de 2026.',
  },
  {
    number: '04',
    title: 'Nova avaliação',
    description: 'Escreva de novo e veja cada competência evoluir.',
  },
] as const;

export function ComoFunciona() {
  const isMobile = useIsMobileLanding();

  return isMobile ? <ComoFuncionaMobile /> : <ComoFuncionaDesktop />;
}

function ComoFuncionaDesktop() {
  return (
    <section id="como-funciona" className="scroll-mt-20 px-6 pt-[200px]">
      <div className="mx-auto max-w-[1200px]">
      <h2 className="text-text max-w-[700px] text-[clamp(36px,3.8vw,52px)] leading-[1.06] font-light tracking-[-0.035em] text-balance">
          Um ciclo que aprende com você.{' '}
          <span className="text-text-3">Treine onde mais perde.</span>
        </h2>

        <ol className="border-surface-2 mt-[72px] grid list-none grid-cols-4 border-t p-0">
          {DESKTOP_STEPS.map((step, index) => (
            <li
              key={step.number}
              className={
                index === 0
                  ? 'pt-8 pr-8'
                  : 'border-surface-2 border-l px-8 pt-8'
              }
            >
              <span className="text-accent-text font-mono text-[13px]">
                {step.number}
              </span>
              <h3 className="text-text mt-4 text-[19px] font-semibold">
                {step.title}
              </h3>
              <p className="text-text-3 mt-2.5 text-[15px] leading-[1.6]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <div aria-hidden="true" className="hidden justify-center pt-[160px] desk:flex">
          <span className="bg-control size-1 rounded-full" />
        </div>
      </div>
    </section>
  );
}
