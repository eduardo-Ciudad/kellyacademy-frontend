import type { PropsWithChildren } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  fadeUp,
  mobileFadeUp,
  mobileStagger,
  stagger,
} from '@/components/landing/fx/motion';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';
import { useRevealOnEnter } from '@/components/landing/fx/useRevealOnEnter';

type RevealProps = PropsWithChildren<{ className?: string }>;
type RevealGroupProps = RevealProps & { as?: 'div' | 'ol' | 'ul' };
type RevealItemProps = RevealProps & { as?: 'div' | 'li' | 'article' };

export function Reveal({ children, className }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobileLanding();
  const { ref, revealed } = useRevealOnEnter<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={isMobile ? mobileFadeUp : fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion || revealed ? 'visible' : 'hidden'}
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
  const { ref, revealed } = useRevealOnEnter<
    HTMLDivElement & HTMLOListElement & HTMLUListElement
  >();
  const Component =
    as === 'ol' ? motion.ol : as === 'ul' ? motion.ul : motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      variants={isMobile ? mobileStagger : stagger}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion || revealed ? 'visible' : 'hidden'}
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
