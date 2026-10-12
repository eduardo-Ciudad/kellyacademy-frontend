import type { PropsWithChildren } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  fadeUp,
  mobileFadeUp,
  mobileStagger,
  stagger,
} from '@/components/landing/fx/motion';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';

type RevealProps = PropsWithChildren<{ className?: string }>;
type RevealGroupProps = RevealProps & { as?: 'div' | 'ol' | 'ul' };
type RevealItemProps = RevealProps & { as?: 'div' | 'li' | 'article' };

const viewport = {
  once: true,
  amount: 'some',
  margin: '0px 0px -12% 0px',
} as const;

export function Reveal({ children, className }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobileLanding();

  return (
    <motion.div
      className={className}
      variants={isMobile ? mobileFadeUp : fadeUp}
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
  const isMobile = useIsMobileLanding();
  const Component =
    as === 'ol' ? motion.ol : as === 'ul' ? motion.ul : motion.div;

  return (
    <Component
      className={className}
      variants={isMobile ? mobileStagger : stagger}
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
  const isMobile = useIsMobileLanding();
  const Component =
    as === 'li' ? motion.li : as === 'article' ? motion.article : motion.div;

  return (
    <Component
      className={className}
      variants={reduceMotion ? undefined : isMobile ? mobileFadeUp : fadeUp}
    >
      {children}
    </Component>
  );
}
