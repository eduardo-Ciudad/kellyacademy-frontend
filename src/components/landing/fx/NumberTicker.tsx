import { useEffect, useRef, useState } from 'react';
import {
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from 'motion/react';

type NumberTickerProps = {
  value: number;
  className?: string;
};

const numberFormatter = new Intl.NumberFormat('pt-BR');

export function NumberTicker({ value, className = '' }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const spring = useSpring(0, { damping: 32, stiffness: 90 });
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) setDisplayValue(value);
    else if (inView) spring.set(value);
  }, [inView, reduceMotion, spring, value]);

  useMotionValueEvent(spring, 'change', (latest) => {
    if (reduceMotion) return;
    setDisplayValue(Math.round(latest));
  });

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {numberFormatter.format(displayValue)}
    </span>
  );
}
