import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { JuliaAvatar } from '@/components/landing/JuliaAvatar';
import {
  TEMA_POSSIVEL_DESTAQUE,
  TEMA_POSSIVEL_DESTAQUE_EIXOS,
} from '@/components/landing/data/temasEnem';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { Reveal } from '@/components/landing/fx/Reveal';
import { LandingCard } from '@/components/landing/ui/LandingCard';
import { competencias } from '@/lib/competencias';

const COMMENTS = [
  {
    code: 'C1',
    excerpt: 'se concentra',
    tip: 'Concordância: “se concentram”.',
  },
  {
    code: 'C3',
    excerpt: 'outros motivos também',
    tip: 'Argumento anunciado, não desenvolvido.',
  },
  {
    code: 'C5',
    excerpt: 'o governo deve fazer algo',
    tip: 'Faltam ação, meio e finalidade.',
  },
] as const;

const TRANSCRIPTION = [
  'Na Constituição de 1988, a cultura é tratada',
  'como direito de todos. Entretanto,',
  'as salas de cinema se concentram nas',
  'capitais, o que afasta grande parte',
  'da população do audiovisual.',
] as const;
const LINE_WIDTHS = ['92%', '86%', '95%', '70%', '88%'] as const;
const CHART_POINTS = [
  [42, 100],
  [92, 82],
  [142, 88],
  [192, 58],
  [242, 40],
  [296, 18],
] as const;
const CARD_LABELS = ['Correção', 'Foto', 'Evolução', 'Temas 2026'] as const;

export function RecursosMobile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const nextIndex = Number(
          (visible.target as HTMLElement).dataset.carouselIndex,
        );
        if (Number.isFinite(nextIndex)) setActiveIndex(nextIndex);
      },
      { root: track, threshold: [0.55, 0.75] },
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const cards = [
    <CorrectionMobileCard key="correction" />,
    <PhotoMobileCard key="photo" active={activeIndex === 1} />,
    <EvolutionMobileCard key="evolution" active={activeIndex === 2} />,
    <ThemesMobileCard key="themes" />,
  ];

  return (
    <section id="recursos" className="landing-section scroll-mt-20">
      <div className="px-4">
        <h2 className="font-display text-text text-[36px] leading-[1.08] font-light tracking-[-0.03em] text-balance">
          Tudo o que a redação pede.{' '}
          <span className="text-text-3">Sem trocar de aplicativo.</span>
        </h2>
        <p className="text-text-3 mt-4 text-base leading-[1.6]">
          Da folha escrita à mão até o tema que pode cair em 2026.
        </p>
      </div>

      <Reveal>
        <div
          ref={trackRef}
          className="no-scrollbar mt-[22px] flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4"
        >
          {cards.map((card, index) => (
            <div
              key={CARD_LABELS[index]}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              data-carousel-index={index}
              className="h-[372px] w-[300px] shrink-0 snap-start"
            >
              {card}
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-3.5 flex items-center justify-between gap-3 px-4">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          {CARD_LABELS.map((label, index) => (
            <span
              key={label}
              className={`${index === activeIndex ? 'bg-accent w-[18px]' : 'bg-control w-1.5'} h-1.5 rounded-full transition-[width,background-color] motion-reduce:transition-none`}
            />
          ))}
        </div>
        <p className="text-text-3 truncate font-mono text-[12px]">
          Correção · Foto · Evolução · Temas 2026
        </p>
      </div>

      <Reveal className="mx-4 mt-6">
        <LandingCard
          variant="highlight"
          className="flex items-center gap-3.5 p-4"
        >
          <JuliaAvatar size={52} />
          <div className="min-w-0">
            <h3 className="text-text text-[17px] leading-tight font-semibold">
              Júlia, sua assistente
            </h3>
            <p className="text-text-body mt-0.5 text-[14.5px] leading-[1.45]">
              Explica, em linguagem simples, por que uma competência perdeu
              pontos.
            </p>
          </div>
        </LandingCard>
      </Reveal>
    </section>
  );
}

function CardHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-text text-[20px] leading-tight font-semibold">
        {title}
      </h3>
      <p className="text-text-2 mt-1.5 text-[14.5px] leading-[1.5]">
        {description}
      </p>
    </div>
  );
}

function CorrectionMobileCard() {
  return (
    <LandingCard className="flex flex-col gap-3 p-5">
      <CardHeading
        title="Correção por competência"
        description="Nota de 0 a 200 em cada uma, com o trecho marcado."
      />
      <div className="mt-auto flex flex-col gap-2">
        {COMMENTS.map((comment) => {
          const competencia = competencias.find(
            (item) => item.codigo === comment.code,
          )!;
          return (
            <div
              key={comment.code}
              className="border-border-subtle bg-photo-drop rounded-inner flex items-start gap-2.5 border px-3 py-2.5"
            >
              <span
                className="shrink-0 rounded-[7px] px-1.5 py-0.5 text-[12px] font-bold"
                style={{
                  color: competencia.hex,
                  backgroundColor: competencia.bgHex,
                }}
              >
                {comment.code}
              </span>
              <p className="text-[13.5px] leading-[1.45]">
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

function PhotoMobileCard({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const [transcribed, setTranscribed] = useState(Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion) {
      setTranscribed(true);
      return;
    }
    if (!active || transcribed) return;
    const timer = window.setTimeout(() => setTranscribed(true), 1700);
    return () => window.clearTimeout(timer);
  }, [active, reduceMotion, transcribed]);

  return (
    <LandingCard className="flex flex-col gap-3 p-5">
      <CardHeading
        title="Foto da redação"
        description="Escreveu à mão? Tire uma foto e a Kelly transcreve."
      />
      <div className="border-border-subtle bg-photo-view rounded-inner relative mt-auto flex h-[196px] flex-col justify-center gap-1 overflow-hidden border px-4 py-5">
        {TRANSCRIPTION.map((text, index) => (
          <span key={text} className="relative block min-h-5">
            <motion.span
              aria-hidden="true"
              className="bg-control absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-sm"
              style={{ width: LINE_WIDTHS[index] }}
              animate={{ opacity: transcribed ? 0 : 1 }}
              transition={{
                duration: reduceMotion ? 0 : DUR.fast,
                ease: EASE_OUT,
              }}
            />
            <motion.span
              className="text-text-body absolute inset-0 text-[12px] leading-5"
              animate={{ opacity: transcribed ? 1 : 0 }}
              transition={{
                duration: reduceMotion ? 0 : DUR.fast,
                delay: transcribed && !reduceMotion ? index * 0.1 : 0,
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
            animate={
              active && !transcribed
                ? { top: ['6%', '88%', '6%'] }
                : { top: '6%' }
            }
            transition={
              active && !transcribed
                ? { duration: 3.4, ease: 'easeInOut', repeat: Infinity }
                : { duration: 0 }
            }
          />
        ) : null}
      </div>
    </LandingCard>
  );
}

function EvolutionMobileCard({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const [started, setStarted] = useState(Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion || active) setStarted(true);
  }, [active, reduceMotion]);

  return (
    <LandingCard className="flex flex-col gap-3 p-5">
      <CardHeading
        title="Evolução visível"
        description="Acompanhe sua nota e cada competência ao longo das redações."
      />
      <span className="bg-success-bg text-success self-start rounded-full px-3 py-1.5 text-[13px]">
        +320 desde a 1ª redação
      </span>
      <svg
        viewBox="0 0 310 120"
        role="img"
        aria-label="Gráfico de evolução da nota, de 560 a 880"
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
              className="fill-text-3 tabular font-mono text-[11px]"
            >
              {label}
            </text>
            <line
              x1="36"
              y1={y}
              x2="306"
              y2={y}
              stroke="var(--color-border-subtle)"
            />
          </g>
        ))}
        <motion.polyline
          points={CHART_POINTS.map(([x, y]) => `${x},${y}`).join(' ')}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: started ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : DUR.slow, ease: EASE_OUT }}
        />
        {CHART_POINTS.map(([x, y], index) => (
          <motion.circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={index === CHART_POINTS.length - 1 ? 5 : 3}
            fill={
              index === CHART_POINTS.length - 1
                ? 'var(--color-accent-text)'
                : 'var(--color-accent)'
            }
            initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: started ? 1 : 0, scale: started ? 1 : 0.5 }}
            transition={{
              duration: reduceMotion ? 0 : DUR.fast,
              delay: reduceMotion
                ? 0
                : DUR.slow * (index / (CHART_POINTS.length - 1)),
              ease: EASE_OUT,
            }}
          />
        ))}
      </svg>
    </LandingCard>
  );
}

function ThemesMobileCard() {
  return (
    <LandingCard className="flex flex-col gap-3 p-5">
      <CardHeading
        title="Possíveis temas 2026"
        description="Temas prováveis, com mini-análise e sugestão de argumentos."
      />
      <div className="border-possivel-border bg-photo-drop rounded-inner mt-auto border p-3.5">
        <p className="text-possivel font-mono text-[11px] tracking-wide uppercase">
          Possível tema
        </p>
        <p className="text-text mt-2 text-[15px] leading-snug font-semibold">
          {TEMA_POSSIVEL_DESTAQUE}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TEMA_POSSIVEL_DESTAQUE_EIXOS.map((axis) => (
            <span
              key={axis}
              className="border-possivel-border text-possivel rounded-full border px-2.5 py-1 text-[12px]"
            >
              {axis}
            </span>
          ))}
        </div>
        <span className="bg-accent-tint text-accent-text mt-3 inline-flex rounded-full px-2.5 py-1 text-[12px]">
          + Adicionar aos meus temas
        </span>
      </div>
    </LandingCard>
  );
}
