import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'rounded-input bg-surface text-text placeholder:text-text-3 h-[52px] w-full border px-4 text-base transition outline-none lg:text-[15px]',
        invalid
          ? 'border-danger focus:border-danger focus:ring-danger/20 focus:ring-[3px]'
          : 'border-control focus:border-accent focus:ring-accent-ring focus:ring-[3px]',
        className,
      )}
      {...props}
    />
  );
});
