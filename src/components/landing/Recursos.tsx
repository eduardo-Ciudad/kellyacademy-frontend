import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { JuliaAvatar } from '@/components/landing/JuliaAvatar';
import { RecursosMobile } from '@/components/landing/RecursosMobile';
import { TEMA_POSSIVEL_DESTAQUE } from '@/components/landing/data/temasEnem';
import { RevealGroup, RevealItem } from '@/components/landing/fx/Reveal';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';
import { LandingCard } from '@/components/landing/ui/LandingCard';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { competencias } from '@/lib/competencias';

const comments = [
  {
    code: 'C1',
    excerpt: 'se concentra',
    tip: 'Concordância: “se concentram”.',
  },
  {
    code: 'C3',
    excerpt: 'outros motivos também',
    tip: 'Argumento anunciado, mas não desenvolvido.',
  },
  {
    code: 'C5',
    excerpt: 'o governo deve fazer algo',
    tip: 'Faltam ação, meio e finalidade.',
  },
] as const;

const transcription = [
  'Na Constituição de 1988, a cultura é tratada',
  'como direito de todos. Entretanto,',
  'as salas de cinema se concentram nas',
  'capitais, o que afasta grande parte',
  'da população do audiovisual.',
] as const;

const lineWidths = ['92%', '86%', '95%', '70%', '88%'] as const;
const chartPoints = [
  [42, 100],
  [92, 82],
  [142, 88],
  [192, 58],
  [242, 40],
  [296, 18],
] as const;

export function Recursos() {
  const isMobile = useIsMobileLanding();

  return isMobile ? <RecursosMobile /> : <RecursosDesktop />;
}

function RecursosDesktop() {
  return (
    <section
      id="recursos"
      className="scroll-mt-20 px-5 pt-[120px] pb-10 sm:px-6"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow="Recursos"
          title="Tudo o que a redação pede."
          description="Da folha escrita à mão até o repertório certo para o tema — sem trocar de aplicativo."
          layout="split"
        />

        <RevealGroup className="desk:grid-cols-6 mt-12 grid grid-cols-1 gap-5">
          <RevealItem className="desk:col-span-4">
            <CorrectionCard />
          </RevealItem>
          <RevealItem className="desk:col-span-2">
            <PhotoCard />
          </RevealItem>
          <RevealItem className="desk:col-span-3">
            <EvolutionCard />
          </RevealItem>
          <RevealItem className="desk:col-span-3">
            <ThemesCard />
          </RevealItem>
          <RevealItem className="col-span-full">
            <JuliaCard />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

function CorrectionCard() {
  return (
    <LandingCard className="desk:p-7 flex min-h-[360px] flex-col gap-5 p-6">
      <div className="max-w-[460px]">
        <h3 className="text-text text-h3">Correção por competência</h3>
        <p className="text-text-2 text-body mt-2.5">
          Nota de 0 a 200 em cada uma, com o trecho marcado.
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-2.5">
        {comments.map((comment) => {
          const competencia = competencias.find(
            (item) => item.codigo === comment.code,
          )!;
          return (
            <div
              key={comment.code}
              className="border-border-subtle bg-photo-drop rounded-inner flex items-start gap-3 border px-3.5 py-3"
            >
              <span
                className="text-eyebrow rounded-lg px-2 py-1 font-semibold"
                style={{
                  color: competencia.hex,
                  backgroundColor: competencia.bgHex,
                }}
              >
                {comment.code}
              </span>
              <p className="text-small">
                <span className="text-text-3">“{comment.excerpt}”</span>
                <br />
                <span className="text-text-body">{comment.tip}</span>
              </p>
            </div>
          );
        })}
      </div>
    </LandingCard>
  );
}

function PhotoCard() {
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [transcribed, setTranscribed] = useState(Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion) {
      setTranscribed(true);
      return;
    }
    if (!inView) return;

    const timer = window.setTimeout(() => setTranscribed(true), 1700);
    return () => window.clearTimeout(timer);
  }, [inView, reduceMotion]);

  return (
    <LandingCard className="desk:p-7 flex min-h-[360px] flex-col gap-5 p-6">
      <div>
        <h3 className="text-text text-h3">Foto da redação</h3>
        <p className="text-text-2 text-body mt-2.5">
          Escreveu à mão? Tire uma foto e a Kelly transcreve.
        </p>
      </div>
      <div
        ref={frameRef}
        className="border-border-subtle bg-photo-view rounded-inner relative mt-auto flex h-[170px] flex-col justify-center gap-1 overflow-hidden border px-[22px] py-5"
      >
        {transcription.map((text, index) => (
          <span key={text} className="relative block min-h-5">
            <motion.span
              aria-hidden="true"
              className="bg-control absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-sm"
              style={{ width: lineWidths[index] }}
              initial={false}
              animate={{ opacity: transcribed ? 0 : 1 }}
              transition={{
                duration: reduceMotion ? 0 : DUR.fast,
                delay: transcribed && !reduceMotion ? index * 0.12 : 0,
                ease: EASE_OUT,
              }}
            />
            <motion.span
              className="text-text-body text-small absolute inset-0"
              initial={false}
              animate={{ opacity: transcribed ? 1 : 0 }}
              transition={{
                duration: reduceMotion ? 0 : DUR.fast,
                delay:
                  transcribed && !reduceMotion ? index * 0.12 + DUR.fast : 0,
                ease: EASE_OUT,
              }}
            >
              {text}
            </motion.span>
          </span>
        ))}
        {!reduceMotion ? (
          <motion.span
            aria-hidden="true"
            className="bg-accent absolute right-[8%] left-[8%] h-0.5 shadow-[0_0_6px_rgb(8_102_255/0.35)]"
            initial={{ top: '6%' }}
            animate={inView ? { top: ['6%', '88%', '6%'] } : { top: '6%' }}
            transition={
              inView
                ? { duration: 3.4, ease: 'easeInOut', repeat: Infinity }
                : { duration: 0 }
            }
          />
        ) : null}
      </div>
    </LandingCard>
  );
}

function EvolutionCard() {
  const chartRef = useRef<SVGSVGElement>(null);
  const inView = useInView(chartRef, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const visible = reduceMotion || inView;

  return (
    <LandingCard className="desk:p-7 flex min-h-[330px] flex-col gap-5 p-6">
      <div className="desk:flex-nowrap flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-text text-h3">Evolução visível</h3>
          <p className="text-text-2 text-body mt-2.5">
            Acompanhe sua nota e cada competência ao longo das redações.
          </p>
        </div>
        <span className="bg-success-bg text-success text-small rounded-pill shrink-0 px-3 py-1.5">
          +320 desde a 1ª redação
        </span>
      </div>
      <svg
        ref={chartRef}
        viewBox="0 0 310 120"
        role="img"
        aria-label="Exemplo de gráfico de evolução da nota subindo ao longo de seis redações"
        className="mt-auto w-full"
      >
        {[
          { y: 110, label: '560' },
          { y: 70, label: '720' },
          { y: 30, label: '880' },
        ].map(({ y, label }) => (
          <g key={label}>
            <text
              x="0"
              y={y + 3}
              className="fill-text-3 text-eyebrow tabular font-mono"
            >
              {label}
            </text>
            <line
              x1="36"
              y1={y}
              x2="306"
              y2={y}
              stroke="var(--color-border-subtle)"
              strokeWidth="1"
            />
          </g>
        ))}
        <motion.polyline
          points={chartPoints.map(([x, y]) => `${x},${y}`).join(' ')}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: visible ? 1 : 0 }}
          transition={{
            duration: reduceMotion ? 0 : DUR.slow,
            ease: EASE_OUT,
          }}
        />
        {chartPoints.map(([x, y], index) => {
          const last = index === chartPoints.length - 1;
          return (
            <motion.circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={last ? 5 : 3}
              fill={last ? 'var(--color-accent-text)' : 'var(--color-accent)'}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
              animate={{
                opacity: visible ? 1 : 0,
                scale: visible ? 1 : 0.5,
              }}
              transition={{
                duration: reduceMotion ? 0 : DUR.fast,
                delay: reduceMotion
                  ? 0
                  : DUR.slow * (index / (chartPoints.length - 1)),
                ease: EASE_OUT,
              }}
            />
          );
        })}
      </svg>
    </LandingCard>
  );
}

function ThemesCard() {
  return (
    <LandingCard className="desk:p-7 flex min-h-[330px] flex-col gap-5 p-6">
      <div>
        <h3 className="text-text text-h3">Possíveis temas 2026</h3>
        <p className="text-text-2 text-body mt-2.5">
          Uma lista pesquisada de temas prováveis, com mini-análise e sugestão
          de argumentos.
        </p>
      </div>
      <div className="border-possivel-border bg-photo-drop rounded-inner mt-auto border p-3.5">
        <p className="text-possivel text-eyebrow font-mono uppercase">
          POSSÍVEL TEMA
        </p>
        <p className="text-text text-body mt-1.5 font-semibold">
          {TEMA_POSSIVEL_DESTAQUE}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Tecnologia e sociedade', 'Cidadania'].map((axis) => (
            <span
              key={axis}
              className="border-possivel-border text-possivel text-small rounded-pill border px-2.5 py-1"
            >
              {axis}
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <span className="bg-accent-tint text-accent-text text-small rounded-pill px-2.5 py-1">
            + Adicionar aos meus temas
          </span>
        </div>
      </div>
    </LandingCard>
  );
}

function JuliaCard() {
  const cardRef = useRef<HTMLElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobileLanding();
  const [messageState, setMessageState] = useState<
    'question' | 'typing' | 'answer'
  >(reduceMotion ? 'answer' : 'question');

  useEffect(() => {
    if (reduceMotion) {
      setMessageState('answer');
      return;
    }
    if (!inView) return;

    const typingTimer = window.setTimeout(() => setMessageState('typing'), 400);
    const answerTimer = window.setTimeout(
      () => setMessageState('answer'),
      1300,
    );

    return () => {
      window.clearTimeout(typingTimer);
      window.clearTimeout(answerTimer);
    };
  }, [inView, reduceMotion]);

  return (
    <LandingCard
      ref={cardRef}
      variant="highlight"
      className="desk:p-7 flex flex-wrap items-center gap-5 p-6"
    >
      <span className="relative size-[84px] shrink-0">
        {!reduceMotion && !isMobile ? (
          <motion.span
            aria-hidden="true"
            className="bg-accent absolute inset-0 rounded-full opacity-35"
            animate={{ scale: [1, 2.2], opacity: [0.35, 0] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          />
        ) : null}
        <span className="relative block">
          <JuliaAvatar size={84} />
        </span>
      </span>

      <div className="min-w-[260px] flex-1 basis-[360px]">
        <h3 className="text-text text-h3">Julia, sua assistente</h3>
        <p className="text-text-body text-body mt-2.5 max-w-[620px]">
          Explica, em linguagem simples, por que uma competência perdeu pontos.
        </p>
      </div>

      <div className="flex min-h-[154px] min-w-[260px] flex-1 basis-[300px] flex-col gap-2 sm:min-h-[126px]">
        <div className="bg-accent text-small rounded-inner self-end px-3.5 py-2.5 text-white">
          O que é repertório produtivo?
        </div>
        <div
          aria-live="polite"
          className="relative min-h-[84px] max-w-[320px] self-start sm:min-h-[74px]"
        >
          <AnimatePresence initial={false} mode="wait">
            {messageState === 'typing' ? (
              <motion.div
                key="typing"
                aria-hidden="true"
                className="bg-bg rounded-inner flex h-10 items-center gap-1 px-3.5 py-2.5"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.fast, ease: EASE_OUT }}
              >
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="bg-text-3 size-1.5 rounded-full"
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{
                      duration: DUR.slow,
                      delay: dot * 0.12,
                      ease: 'easeInOut',
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
            ) : messageState === 'answer' ? (
              <motion.div
                key="answer"
                className="bg-bg text-text-body text-small rounded-inner px-3.5 py-2.5"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : DUR.base,
                  ease: EASE_OUT,
                }}
              >
                É quando a referência que você usou ajuda de verdade o seu
                argumento, em vez de só aparecer no texto.
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </LandingCard>
  );
}
