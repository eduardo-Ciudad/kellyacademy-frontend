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
      className="relative scroll-mt-20 px-5 pt-20 pb-10 sm:px-6 sm:pt-24"
    >
      <GridBackground />
      <motion.div
        className="relative mx-auto flex max-w-[1200px] flex-col items-center text-center"
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
            Repertório curado por eixo temático do ENEM
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
          className="text-text text-display mt-7 max-w-[920px] text-balance"
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
          className="text-text-2 desk:text-xl mt-6 max-w-[640px] text-lg leading-[1.55] text-pretty"
        >
          A Kelly Academy corrige sua redação do ENEM competência por
          competência, mostra o trecho exato que segurou a nota e diz o que
          treinar para subir na próxima.
        </motion.p>

        <motion.div
          variants={isMobile ? mobileFadeUp : fadeUp}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/criar-conta"
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill text-body inline-flex min-h-14 items-center gap-2.5 px-7 font-semibold text-white transition hover:-translate-y-px active:translate-y-0 motion-reduce:transition-none"
          >
            Corrigir minha redação
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
            className="focus-ring border-control text-text hover:bg-surface-2 rounded-pill text-body inline-flex min-h-14 items-center border px-[26px] font-semibold transition hover:-translate-y-px active:translate-y-0 motion-reduce:transition-none"
          >
            Ver como funciona
          </a>
        </motion.div>

        <motion.p
          variants={isMobile ? mobileFadeUp : fadeUp}
          className="text-text-3 text-small mt-[18px] font-mono"
        >
          3 correções grátis por dia · sem cartão de crédito
        </motion.p>

        <motion.div
          variants={isMobile ? mobileFadeUp : fadeUp}
          className="flex w-full justify-center"
          style={{ perspective: 1200 }}
        >
          {isMobile || reduceMotion ? (
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
