import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const STEPS = [
  {
    number: '01',
    title: 'Diagnóstico',
    description: 'Envie a redação e descubra seu ponto mais fraco.',
    stageLabel:
      'Uma redação é analisada e a proposta de intervenção é identificada como o ponto mais fraco.',
  },
  {
    number: '02',
    title: 'Estudo',
    description:
      'Repertório e explicações na competência que mais tira pontos.',
    stageLabel:
      'Uma ficha de repertório sobre Paulo Freire apresenta educação dialógica, autonomia e leitura crítica do mundo.',
  },
  {
    number: '03',
    title: 'Prática',
    description: 'Temas de edições anteriores e possíveis temas de 2026.',
    stageLabel:
      'Três propostas de redação aparecem em sequência, com o tema do ENEM 2025 pronto para começar.',
  },
  {
    number: '04',
    title: 'Nova avaliação',
    description: 'Escreva de novo e veja cada competência evoluir.',
    stageLabel:
      'A nota estimada sobe de 640 para 680 e a competência cinco evolui de 120 para 160 pontos.',
  },
] as const;

const EASE = [0.22, 0.8, 0.26, 1] as const;

export function ComoFunciona() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [progressRun, setProgressRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const progressPaused = paused || hovered || !inView;

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className="landing-section scroll-mt-20 px-4 sm:px-6"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setHovered(false);
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <h2 className="font-display text-text max-w-[700px] text-[clamp(36px,3.8vw,52px)] leading-[1.06] font-light tracking-[-0.035em] text-balance">
          Um ciclo que aprende com você.{' '}
          <span className="text-text-3">Treine onde mais perde.</span>
        </h2>

        <div className="mt-14 grid items-center gap-12 min-[900px]:mt-[72px] min-[900px]:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] min-[900px]:gap-16">
          <div>
            <ol className="m-0 list-none space-y-1 p-0">
              {STEPS.map((step, index) => {
                const current = active === index;
                return (
                  <li
                    key={step.number}
                    aria-current={current ? 'step' : undefined}
                    className="grid grid-cols-[2px_minmax(0,1fr)] gap-5"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-surface-2 relative overflow-hidden rounded-[2px]"
                    >
                      {current && !reduced && (
                        <ProgressBar
                          key={`${index}-${progressRun}`}
                          paused={progressPaused}
                          onComplete={() =>
                            setActive((value) => (value + 1) % STEPS.length)
                          }
                        />
                      )}
                    </span>
                    <button
                      type="button"
                      className="focus-ring min-h-16 rounded-md py-[18px] text-left"
                      onClick={() => {
                        setActive(index);
                        setProgressRun((value) => value + 1);
                      }}
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          className={`font-mono text-[13px] ${current ? 'text-accent-text' : 'text-[#5d6178]'}`}
                        >
                          {step.number}
                        </span>
                        <span
                          className={`text-[21px] font-semibold transition-colors ${current ? 'text-text' : 'text-text-3'}`}
                        >
                          {step.title}
                        </span>
                      </span>
                      <AnimatePresence initial={false}>
                        {current && (
                          <motion.span
                            className="text-text-2 mt-2 block pl-9 text-base leading-[1.6]"
                            initial={reduced ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduced ? undefined : { opacity: 0, y: -6 }}
                            transition={{
                              duration: reduced ? 0 : 0.5,
                              ease: EASE,
                            }}
                          >
                            {step.description}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ol>
            <button
              type="button"
              aria-label={paused ? 'Continuar' : 'Pausar'}
              className="border-surface-2 text-text-2 hover:border-control hover:text-text focus-ring mt-6 inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors"
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? (
                <Play size={15} fill="currentColor" aria-hidden="true" />
              ) : (
                <Pause size={15} fill="currentColor" aria-hidden="true" />
              )}
              {paused ? 'Continuar' : 'Pausar'}
            </button>
          </div>

          <div
            role="img"
            aria-label={STEPS[active].stageLabel}
            className="bg-surface border-surface-2 relative flex h-[420px] items-center justify-center overflow-hidden rounded-3xl border p-5 min-[900px]:h-[480px] min-[900px]:p-8"
          >
            <AnimatePresence mode="wait">
              <Stage key={active} step={active} reduced={reduced} />
            </AnimatePresence>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="desk:flex hidden justify-center pt-[160px]"
        >
          <span className="bg-control size-1 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function ProgressBar({
  paused,
  onComplete,
}: {
  paused: boolean;
  onComplete: () => void;
}) {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;
    progress.addEventListener('animationend', onComplete);
    return () => progress.removeEventListener('animationend', onComplete);
  }, [onComplete]);

  return (
    <span
      ref={progressRef}
      data-testid="step-progress"
      className="bg-accent-text absolute inset-0 origin-top scale-y-0 animate-[step-progress_5s_linear_forwards]"
      style={{ animationPlayState: paused ? 'paused' : 'running' }}
    />
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

function Stage({ step, reduced }: { step: number; reduced: boolean }) {
  return (
    <motion.div
      className="flex size-full items-center justify-center"
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
    >
      {step === 0 && <DiagnosisStage reduced={reduced} />}
      {step === 1 && <StudyStage reduced={reduced} />}
      {step === 2 && <PracticeStage reduced={reduced} />}
      {step === 3 && <EvaluationStage reduced={reduced} />}
    </motion.div>
  );
}

const lineGroups = [
  ['94%', '88%', '62%'],
  ['96%', '90%', '93%', '54%'],
  ['91%', '70%'],
];

function DiagnosisStage({ reduced }: { reduced: boolean }) {
  let lineIndex = 0;
  return (
    <div className="w-full max-w-[340px]">
      <div className="bg-paper-bg relative h-[300px] overflow-hidden rounded-[14px] p-7">
        <div className="space-y-7">
          {lineGroups.map((group, groupIndex) => (
            <motion.div
              key={groupIndex}
              className={`space-y-2 rounded-lg ${groupIndex === 2 ? '-m-2 p-2' : ''}`}
              initial={
                reduced ? false : { backgroundColor: 'rgba(255,106,120,0)' }
              }
              animate={
                groupIndex === 2
                  ? { backgroundColor: 'rgba(255,106,120,.22)' }
                  : undefined
              }
              transition={{
                duration: reduced ? 0 : 0.35,
                delay: reduced ? 0 : 2.5,
              }}
            >
              {group.map((width) => {
                const order = lineIndex++;
                return (
                  <motion.span
                    key={`${groupIndex}-${width}`}
                    className="block h-[7px] origin-left rounded bg-[#c9ccd3]"
                    style={{ width }}
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: reduced ? 0 : 0.35,
                      delay: reduced ? 0 : 0.15 + order * 0.1,
                      ease: EASE,
                    }}
                  />
                );
              })}
            </motion.div>
          ))}
        </div>
        <motion.span
          className="bg-accent absolute right-4 left-4 h-0.5"
          style={{ top: 28 }}
          initial={reduced ? false : { y: 0, opacity: 0 }}
          animate={{
            y: reduced ? 238 : [0, 0, 238, 238],
            opacity: reduced ? 0 : [0, 1, 1, 0],
          }}
          transition={{
            duration: reduced ? 0 : 1.3,
            delay: reduced ? 0 : 1.15,
            times: [0, 0.08, 0.92, 1],
            ease: 'linear',
          }}
        />
      </div>
      <motion.div
        className="border-control mt-3 ml-auto flex w-fit items-center gap-3 rounded-xl border bg-[#1c1e2a] px-3 py-2"
        initial={reduced ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: reduced ? 1 : [0.92, 1.03, 1] }}
        transition={{
          duration: reduced ? 0 : 0.45,
          delay: reduced ? 0 : 2.8,
          ease: EASE,
        }}
      >
        <span className="font-mono text-xs text-[#ff8a92]">C5</span>
        <span className="text-text text-xs leading-tight">
          Proposta de intervenção
          <small className="text-text-3 block">seu ponto mais fraco</small>
        </span>
      </motion.div>
    </div>
  );
}

function StudyStage({ reduced }: { reduced: boolean }) {
  const ghosts = [
    { color: '#161722', delay: 0.1, offset: 12 },
    { color: '#181a26', delay: 0.2, offset: 24 },
  ];
  return (
    <div className="relative w-full max-w-[380px]">
      {ghosts.map((sheet) => (
        <motion.span
          key={sheet.color}
          className="border-surface-2 absolute inset-0 z-0 rounded-2xl border"
          style={{
            backgroundColor: sheet.color,
            transform: `translate(${sheet.offset}px, ${sheet.offset}px)`,
          }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduced ? 0 : 0.45,
            delay: reduced ? 0 : sheet.delay,
          }}
        />
      ))}
      <motion.div
        className="border-control bg-surface-2 relative z-10 w-full rounded-2xl border p-6"
        initial={reduced ? false : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: reduced ? 0 : 0.55,
          delay: reduced ? 0 : 0.3,
          ease: EASE,
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#241f45] px-2.5 py-1 text-[10px] font-semibold tracking-[.12em] text-[#b9a2fb]">
            EDUCADOR / PENSADOR
          </span>
          <span className="text-text-3 text-xs">Eixo · Educação</span>
        </div>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.6 }}
        >
          <h3 className="font-display text-text mt-5 text-[32px] font-light tracking-[-.03em]">
            Paulo Freire
          </h3>
          <p className="text-text-3 mt-1 text-sm">
            educação dialógica e autonomia
          </p>
        </motion.div>
        <motion.p
          className="text-text-2 mt-4 text-[15px] leading-[1.6]"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0 : 0.4,
            delay: reduced ? 0 : 0.85,
          }}
        >
          A educação deve formar sujeitos capazes de compreender criticamente a
          realidade.
        </motion.p>
        <motion.div
          className="mt-5 rounded-xl bg-[#1c1e2a] p-3.5"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 1.2 }}
        >
          <span className="text-accent-text font-mono text-[10px] tracking-[.12em]">
            LEMBRE NA PROVA
          </span>
          <p className="text-text-2 mt-1.5 text-sm">
            Ligue Freire a autonomia e leitura crítica do mundo.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

const practiceCards = [
  [
    'ENEM 2025',
    'Perspectivas acerca do envelhecimento na sociedade brasileira',
  ],
  ['ENEM 2024', 'Desafios para a valorização da herança africana no Brasil'],
  [
    'POSSÍVEIS TEMAS 2026',
    'Recortes com argumentos, leis e agentes de intervenção',
  ],
] as const;

function PracticeStage({ reduced }: { reduced: boolean }) {
  return (
    <div className="w-full max-w-[400px] space-y-3">
      {practiceCards.map(([tag, title], index) => (
        <motion.div
          key={tag}
          className={`relative flex flex-col items-start rounded-xl border p-5 ${index === 0 ? 'border-accent bg-[#1a1d2e]' : index === 2 ? 'border-control border-dashed bg-[#161722]' : 'border-surface-2 bg-[#161722]'}`}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0 : 0.45,
            delay: reduced ? 0 : 0.1 + index * 0.2,
            ease: EASE,
          }}
        >
          <span
            className={`font-mono text-[10px] tracking-[.12em] ${index === 0 ? 'text-accent-text' : 'text-text-3'}`}
          >
            {tag}
          </span>
          <p className="text-text mt-2 max-w-[310px] text-[15px] leading-[1.45]">
            {title}
          </p>
          {index === 0 && (
            <motion.span
              className="bg-accent mt-3 self-start rounded-full px-3 py-1.5 text-xs font-semibold text-white"
              initial={reduced ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: reduced ? 1 : [0.92, 1.04, 1] }}
              transition={{
                duration: reduced ? 0 : 0.4,
                delay: reduced ? 0 : 1.4,
                ease: EASE,
              }}
            >
              Começar →
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

const scores = [
  ['C1', 80, '160'],
  ['C2', 60, '120'],
  ['C3', 60, '120'],
  ['C4', 60, '120'],
] as const;

function EvaluationStage({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="border-surface-2 w-full max-w-[380px] rounded-2xl border bg-[#161722] p-6"
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
    >
      <span className="text-text-3 font-mono text-[10px] tracking-[.14em]">
        NOTA ESTIMADA
      </span>
      <div className="mt-2 flex h-[68px] items-center gap-3 overflow-hidden">
        <div className="relative h-[68px] w-[112px]">
          <motion.span
            className="font-display text-text-3 absolute inset-0 text-[56px] leading-[68px] font-light"
            initial={false}
            animate={
              reduced
                ? { opacity: 0, y: -28 }
                : { opacity: [1, 1, 0], y: [0, 0, -28] }
            }
            transition={{
              duration: reduced ? 0 : 0.35,
              delay: reduced ? 0 : 1.6,
              times: [0, 0.25, 1],
              ease: EASE,
            }}
          >
            640
          </motion.span>
          <motion.span
            className="font-display text-text absolute inset-0 text-[56px] leading-[68px] font-light"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0 : 0.4,
              delay: reduced ? 0 : 1.85,
              ease: EASE,
            }}
          >
            680
          </motion.span>
        </div>
        <motion.span
          className="text-possivel rounded-full bg-[#1c2440] px-2.5 py-1 font-mono text-xs"
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: reduced ? 1 : [0.9, 1.06, 1] }}
          transition={{
            duration: reduced ? 0 : 0.4,
            delay: reduced ? 0 : 2.1,
            ease: EASE,
          }}
        >
          +40
        </motion.span>
      </div>
      <div className="mt-4 space-y-3">
        {scores.map(([label, width, value], index) => (
          <ScoreBar
            key={label}
            label={label}
            width={width}
            value={value}
            delay={0.1 + index * 0.1}
            reduced={reduced}
          />
        ))}
        <div className="grid grid-cols-[24px_1fr_28px] items-center gap-3">
          <span className="text-accent-text font-mono text-xs">C5</span>
          <span className="bg-surface-2 relative h-1.5 overflow-hidden rounded-full">
            <motion.span
              className="absolute inset-y-0 left-0 w-[60%] origin-left rounded-full bg-[#4a4e66]"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: reduced ? 0 : 0.6,
                delay: reduced ? 0 : 0.5,
                ease: EASE,
              }}
            />
            <motion.span
              className="bg-accent-text absolute inset-y-0 left-[60%] w-[20%] origin-left rounded-r-full"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: reduced ? 0 : 0.6,
                delay: reduced ? 0 : 1.2,
                ease: EASE,
              }}
            />
          </span>
          <span className="relative h-4 overflow-hidden text-right font-mono text-xs">
            <motion.span
              className="text-text-3 absolute inset-0"
              initial={false}
              animate={
                reduced
                  ? { opacity: 0, y: -12 }
                  : { opacity: [1, 1, 0], y: [0, 0, -12] }
              }
              transition={{
                duration: reduced ? 0 : 0.3,
                delay: reduced ? 0 : 1.4,
                times: [0, 0.25, 1],
              }}
            >
              120
            </motion.span>
            <motion.span
              className="text-accent-text absolute inset-0"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0 : 0.3,
                delay: reduced ? 0 : 1.6,
              }}
            >
              160
            </motion.span>
          </span>
        </div>
      </div>
      <motion.p
        className="text-text-2 mt-5 text-xs"
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 2.3 }}
      >
        Proposta de intervenção subiu na reescrita.
      </motion.p>
    </motion.div>
  );
}

function ScoreBar({
  label,
  width,
  value,
  delay,
  reduced,
}: {
  label: string;
  width: number;
  value: string;
  delay: number;
  reduced: boolean;
}) {
  return (
    <div className="grid grid-cols-[24px_1fr_28px] items-center gap-3">
      <span className="text-text-3 font-mono text-xs">{label}</span>
      <span className="bg-surface-2 h-1.5 overflow-hidden rounded-full">
        <motion.span
          className="block h-full origin-left rounded-full bg-[#4a4e66]"
          style={{ width: `${width}%` }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: reduced ? 0 : 0.6,
            delay: reduced ? 0 : delay,
            ease: EASE,
          }}
        />
      </span>
      <span className="text-text-3 text-right font-mono text-xs">{value}</span>
    </div>
  );
}
