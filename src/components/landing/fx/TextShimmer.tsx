import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type TextShimmerProps = {
  children: ReactNode;
  className?: string;
};

export function TextShimmer({ children, className = '' }: TextShimmerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={`text-text-2 ${className}`}>{children}</span>;
  }

  return (
    <motion.span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, var(--color-text-2) 0%, #fff 45%, var(--color-accent-text) 50%, #fff 55%, var(--color-text-2) 100%)',
        backgroundSize: '200% 100%',
      }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 4.5, ease: 'linear', repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
}
