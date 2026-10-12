import { forwardRef, type HTMLAttributes, type PointerEvent } from 'react';

type LandingCardProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'li';
  variant?: 'default' | 'accent' | 'highlight';
};

const variantClasses = {
  default: 'border-border-subtle bg-surface',
  accent: 'border-accent bg-surface',
  highlight: 'border-nav-active bg-accent-tint',
} as const;

export const LandingCard = forwardRef<HTMLElement, LandingCardProps>(
  function LandingCard(
    {
      as: Component = 'article',
      variant = 'default',
      className = '',
      onPointerMove,
      ...props
    },
    ref,
  ) {
    const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty(
        '--mx',
        `${event.clientX - bounds.left}px`,
      );
      event.currentTarget.style.setProperty(
        '--my',
        `${event.clientY - bounds.top}px`,
      );
      onPointerMove?.(event);
    };

    return (
      <Component
        ref={ref as never}
        data-variant={variant}
        onPointerMove={handlePointerMove}
        className={`landing-card rounded-card relative h-full overflow-hidden border transition-[border-color] duration-200 ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  },
);
