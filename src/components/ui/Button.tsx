import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      children,
      variant = 'primary',
      loading = false,
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          'focus-ring rounded-pill inline-flex min-h-11 items-center justify-center gap-2 px-6 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          variant === 'primary' && 'bg-accent hover:bg-accent-hover text-white',
          variant === 'secondary' && 'bg-control hover:bg-surface-2 text-text',
          variant === 'outline' &&
            'border-control text-text hover:bg-surface border bg-transparent',
          className,
        )}
        {...props}
      >
        {loading && (
          <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
        )}
        {children}
      </button>
    );
  },
);
