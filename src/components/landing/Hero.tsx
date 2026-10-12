import { motion, type Variants, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { GridBackground } from '@/components/landing/fx/GridBackground';
import { TextShimmer } from '@/components/landing/fx/TextShimmer';
import { HeroMock } from '@/components/landing/HeroMock';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.05, staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] },
  },
};

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="topo"
      className="relative scroll-mt-20 px-5 pt-20 pb-10 sm:px-6 sm:pt-24"
    >
      <GridBackground />
      <motion.div
        className="relative mx-auto flex max-w-[1200px] flex-col items-center text-center"
        variants={containerVariants}
        initial={reduceMotion ? 'visible' : 'hidden'}
        animate="visible"
      >
        <motion.a
          variants={itemVariants}
          href="#repertorio"
          className="focus-ring border-control bg-surface rounded-pill inline-flex max-w-full items-center gap-2.5 border py-[7px] pr-3.5 pl-2 text-sm font-medium"
        >
          <span className="bg-accent-tint text-accent-text rounded-pill px-2.5 py-[3px] text-xs font-bold">
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
          variants={itemVariants}
          className="text-text mt-7 max-w-[920px] text-[44px] leading-[1.02] font-extrabold tracking-[-1.6px] text-balance min-[960px]:text-[72px] min-[960px]:tracking-[-2.4px]"
        >
          Descubra onde sua redação{' '}
          <span className="text-accent-text">perde pontos.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-text-2 mt-6 max-w-[640px] text-lg leading-[1.55] text-pretty min-[960px]:text-xl"
        >
          A Kelly Academy corrige sua redação do ENEM competência por
          competência, mostra o trecho exato que segurou a nota e diz o que
          treinar para subir na próxima.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/criar-conta"
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill inline-flex min-h-14 items-center gap-2.5 px-7 text-[17px] font-bold text-white transition hover:-translate-y-px active:translate-y-0 motion-reduce:transition-none"
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
            className="focus-ring border-control text-text hover:bg-surface-2 rounded-pill inline-flex min-h-14 items-center border px-[26px] text-[17px] font-semibold transition hover:-translate-y-px active:translate-y-0 motion-reduce:transition-none"
          >
            Ver como funciona
          </a>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-text-3 mt-[18px] font-mono text-[13px]"
        >
          3 correções grátis por dia · sem cartão de crédito
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex w-full justify-center"
        >
          <HeroMock />
        </motion.div>
      </motion.div>
    </section>
  );
}
