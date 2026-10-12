import type { PropsWithChildren } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { fadeUp, stagger } from '@/components/landing/fx/motion';

type RevealProps = PropsWithChildren<{ className?: string }>;
type RevealGroupProps = RevealProps & { as?: 'div' | 'ol' | 'ul' };
type RevealItemProps = RevealProps & { as?: 'div' | 'li' | 'article' };

const viewport = { once: true, amount: 0.3 } as const;

export function Reveal({ children, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  as = 'div',
}: RevealGroupProps) {
  const reduceMotion = useReducedMotion();
  const Component =
    as === 'ol' ? motion.ol : as === 'ul' ? motion.ul : motion.div;

  return (
    <Component
      className={className}
      variants={stagger}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: RevealItemProps) {
  const reduceMotion = useReducedMotion();
  const Component =
    as === 'li' ? motion.li : as === 'article' ? motion.article : motion.div;

  return (
    <Component
      className={className}
      variants={reduceMotion ? undefined : fadeUp}
    >
      {children}
    </Component>
  );
}
