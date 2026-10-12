import { motion, useReducedMotion } from 'motion/react';

type BorderBeamProps = {
  bottom?: boolean;
};

export function BorderBeam({ bottom = false }: BorderBeamProps) {
  const reduceMotion = useReducedMotion();
  const beamClass =
    'pointer-events-none absolute z-10 h-px w-[35%] bg-gradient-to-r from-transparent via-accent-text to-transparent';

  if (reduceMotion) {
    return (
      <span
        aria-hidden="true"
        className={`${beamClass} left-[32.5%] ${bottom ? 'bottom-0' : 'top-0'}`}
      />
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      className={`${beamClass} left-0 ${bottom ? 'bottom-0' : 'top-0'}`}
      animate={{ x: bottom ? ['385%', '-100%'] : ['-100%', '385%'] }}
      transition={{
        duration: 5,
        delay: bottom ? 2.5 : 0,
        ease: 'linear',
        repeat: Infinity,
      }}
    />
  );
}
