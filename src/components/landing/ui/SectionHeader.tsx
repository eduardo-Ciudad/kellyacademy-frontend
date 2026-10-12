import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <header
      className={`${centered ? 'mx-auto items-center text-center' : 'items-start'} flex flex-col ${className}`}
    >
      {eyebrow ? (
        <p className="text-accent-text text-eyebrow flex items-center gap-2 font-mono uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-text text-h2 mt-3.5 text-balance">{title}</h2>
      {description ? (
        <p
          className={`text-text-2 text-lead mt-[18px] max-w-[60ch] text-pretty ${centered ? 'mx-auto' : ''}`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
