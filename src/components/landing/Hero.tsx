import { useRef } from 'react';
import {
  motion,
  type Variants,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { Link } from 'react-router-dom';
import { GridBackground } from '@/components/landing/fx/GridBackground';
import {
  DUR,
  EASE_OUT,
  fadeUp,
  mobileFadeUp,
  mobileStagger,
  stagger,
} from '@/components/landing/fx/motion';
import { TextShimmer } from '@/components/landing/fx/TextShimmer';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';
import { HeroMock } from '@/components/landing/HeroMock';
import { HeroResultadoCompacto } from '@/components/landing/HeroResultadoCompacto';

const headline = 'Descubra onde sua redação perde pontos.';
const headlineWords = ['Descubra', 'onde', 'sua', 'redação'] as const;
const accentWords = ['perde', 'pontos.'] as const;

const wordStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};

const mobileWord: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobileLanding();
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      id="topo"
      className="desk:px-6 desk:pt-24 relative scroll-mt-20 px-4 pt-5 pb-10"
    >
      <GridBackground />
      <motion.div
        className="desk:items-center desk:text-center relative mx-auto flex max-w-[1200px] flex-col items-start text-left"
        variants={isMobile ? mobileStagger : stagger}
        initial={reduceMotion ? 'visible' : 'hidden'}
        animate="visible"
      >
        <motion.a
          variants={isMobile ? mobileFadeUp : fadeUp}
          href="#repertorio"
          className="focus-ring border-control bg-surface rounded-pill inline-flex max-w-full items-center gap-2.5 border py-[7px] pr-3.5 pl-2 text-sm font-medium"
        >
          <span className="bg-accent-tint text-accent-text rounded-pill px-2.5 py-[3px] text-xs font-semibold">
            NOVO
          </span>
          <TextShimmer className="truncate">
            Repertório por eixo do ENEM
          </TextShimmer>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            className="text-text-2 shrink-0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </motion.a>

        <motion.h1
          aria-label={headline}
          variants={wordStagger}
        className="text-text desk:mt-7 desk:text-display mt-[22px] max-w-[920px] text-[40px] leading-[1.04] font-light tracking-[-0.035em] text-balance"
        >
          <span aria-hidden="true">
            {headlineWords.map((headlineWord) => (
              <motion.span
                key={headlineWord}
                variants={
                  reduceMotion ? undefined : isMobile ? mobileWord : word
                }
                className="mr-[0.22em] inline-block"
              >
                {headlineWord}
              </motion.span>
            ))}
            <span className="text-accent-text inline-block">
              {accentWords.map((headlineWord, index) => (
                <motion.span
                  key={headlineWord}
                  variants={
                    reduceMotion ? undefined : isMobile ? mobileWord : word
                  }
                  className={
                    index === 0 ? 'mr-[0.22em] inline-block' : 'inline-block'
                  }
                >
                  {headlineWord}
                </motion.span>
              ))}
            </span>
          </span>
        </motion.h1>

        <motion.p
          variants={isMobile ? mobileFadeUp : fadeUp}
          className="text-text-2 desk:mt-6 desk:text-xl mt-4 max-w-[640px] text-[16.5px] leading-[1.55] text-pretty"
        >
          Correção competência por competência, com o trecho exato que segurou
          sua nota e o que treinar a seguir.
        </motion.p>

        <motion.div
          variants={isMobile ? mobileFadeUp : fadeUp}
          className="desk:mt-9 desk:w-auto mt-6 flex w-full flex-wrap justify-center gap-3"
        >
          <Link
            to="/criar-conta"
            id="hero-primary-cta"
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill desk:min-h-14 desk:w-auto desk:text-body inline-flex h-[54px] w-full items-center justify-center gap-2.5 px-7 text-[16.5px] font-semibold text-white transition hover:-translate-y-px active:translate-y-0 motion-reduce:transition-none"
          >
            Corrigir minha redação grátis
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <a
            href="#como-funciona"
            className="focus-ring border-control text-text hover:bg-surface-2 rounded-pill text-body desk:inline-flex hidden min-h-14 items-center border px-[26px] font-semibold transition hover:-translate-y-px active:translate-y-0 motion-reduce:transition-none"
          >
            Ver como funciona
          </a>
        </motion.div>

        <motion.p
          variants={isMobile ? mobileFadeUp : fadeUp}
          className="text-text-3 desk:mt-[18px] desk:w-auto desk:text-small mt-3 w-full text-center font-mono text-xs"
        >
          3 correções grátis por dia · sem cartão
        </motion.p>

        <motion.div
          variants={isMobile ? mobileFadeUp : fadeUp}
          className="flex w-full justify-center"
          style={isMobile ? undefined : { perspective: 1200 }}
        >
          {isMobile ? (
            <HeroResultadoCompacto />
          ) : reduceMotion ? (
            <div className="flex w-full justify-center">
              <HeroMock />
            </div>
          ) : (
            <DesktopHeroMock heroRef={heroRef} />
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

function DesktopHeroMock({
  heroRef,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end center'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);

  return (
    <motion.div
      className="flex w-full justify-center"
      style={{ scale, rotateX, transformOrigin: 'center top' }}
    >
      <HeroMock />
    </motion.div>
  );
}
