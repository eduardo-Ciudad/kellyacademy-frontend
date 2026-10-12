import type { Variants } from 'motion/react';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  fast: 0.2,
  base: 0.45,
  slow: 0.7,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
