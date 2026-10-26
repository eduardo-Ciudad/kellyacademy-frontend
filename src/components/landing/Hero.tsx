import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { HeroShaderBg } from '@/components/landing/fx/HeroShaderBg';
import { EASE_OUT } from '@/components/landing/fx/motion';

const heroContentVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
} as const;

const heroActionVariants = {
  hidden: { opacity: 1, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
} as const;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? {}
    : { initial: 'hidden' as const, animate: 'visible' as const };

  return (
    <section
      id="topo"
      className="desk:px-6 relative flex min-h-[min(100svh,900px)] scroll-mt-20 items-center justify-center overflow-hidden px-4 py-[120px]"
    >
      <HeroShaderBg />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center text-center"
      >
        <motion.p
          variants={heroContentVariants}
          {...motionProps}
          className="m-0 font-mono text-xs tracking-[0.16em] text-white/60"
        >
          CORREÇÃO DE REDAÇÃO DO ENEM
        </motion.p>

        <motion.h1
          variants={heroContentVariants}
          {...motionProps}
          className="desk:text-[clamp(44px,6vw,84px)] mt-6 max-w-[980px] text-[44px] leading-none font-light tracking-[-0.04em] text-balance text-white"
        >
          Descubra onde sua redação perde pontos.
        </motion.h1>

        <motion.p
          variants={heroContentVariants}
          {...motionProps}
          className="mt-6 max-w-[600px] text-[19px] leading-[1.55] text-pretty text-white/78"
        >
          Correção competência por competência, com o trecho exato que segurou
          sua nota e o que treinar a seguir.
        </motion.p>

        <motion.div
          variants={heroActionVariants}
          {...motionProps}
          className="desk:w-auto mt-8 flex w-full flex-wrap justify-center gap-3"
        >
          <Link
            to="/criar-conta"
            id="hero-primary-cta"
            className="focus-ring rounded-pill desk:min-h-14 desk:w-auto desk:text-body inline-flex h-[54px] w-full items-center justify-center bg-white px-7 text-[16.5px] font-semibold text-[#0b1b3a] transition-colors hover:bg-white/90 active:bg-white/85 motion-reduce:transition-none"
          >
            Corrigir minha redação grátis&nbsp;→
          </Link>
          <a
            href="#como-funciona"
            className="focus-ring rounded-pill text-body desk:inline-flex hidden min-h-14 items-center border border-white/28 px-[26px] font-semibold text-white transition-colors hover:bg-white/8 active:bg-white/12 motion-reduce:transition-none"
          >
            Ver como funciona
          </a>
        </motion.div>

        <motion.p
          variants={heroActionVariants}
          {...motionProps}
          className="desk:w-auto desk:text-small mt-[18px] w-full text-center font-mono text-xs text-white/60"
        >
          3 correções grátis por dia · sem cartão
        </motion.p>
      </motion.div>
    </section>
  );
}
