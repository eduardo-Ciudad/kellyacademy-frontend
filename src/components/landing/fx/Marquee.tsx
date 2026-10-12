import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';

type MarqueeProps = {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
};

export function Marquee({
  children,
  speed = 60,
  reverse = false,
  className = '',
}: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobileLanding();

  if (reduceMotion || isMobile) {
    return (
      <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <AnimatedMarquee speed={speed} reverse={reverse} className={className}>
      {children}
    </AnimatedMarquee>
  );
}

function AnimatedMarquee({
  children,
  speed,
  reverse,
  className,
}: Required<MarqueeProps>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const x = useMotionValue(0);
  const [groupWidth, setGroupWidth] = useState(0);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const updateWidth = () => {
      const width = group.getBoundingClientRect().width;
      setGroupWidth(width);
      x.set(reverse ? -width : 0);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(group);
    return () => observer.disconnect();
  }, [reverse, x]);

  useAnimationFrame((_time, delta) => {
    if (pausedRef.current || groupWidth === 0) return;
    const pixelsPerMillisecond = groupWidth / (speed * 1000);
    const next = x.get() + (reverse ? 1 : -1) * pixelsPerMillisecond * delta;
    if (!reverse && next <= -groupWidth) x.set(next + groupWidth);
    else if (reverse && next >= 0) x.set(next - groupWidth);
    else x.set(next);
  });

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <motion.div className="flex w-max" style={{ x }}>
        <div ref={groupRef} className="flex shrink-0 gap-3 pr-3">
          {children}
        </div>
        <div aria-hidden="true" className="flex shrink-0 gap-3 pr-3">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
