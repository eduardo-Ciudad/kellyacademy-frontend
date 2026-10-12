import type { ReactNode } from 'react';
import { Reveal } from '@/components/landing/fx/Reveal';

type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  eyebrowVariant?: 'text' | 'pill';
  layout?: 'stack' | 'split';
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  eyebrowVariant = 'text',
  layout = 'stack',
  className = '',
}: SectionHeaderProps) {
  const centered = align === 'center';
  const split = layout === 'split';

  return (
    <Reveal className={`${centered ? 'mx-auto' : ''} ${className}`.trim()}>
      <header
        className={`${centered ? 'mx-auto items-center text-center' : 'items-start'} ${split ? 'desk:flex-row desk:items-end desk:justify-between gap-6' : ''} flex flex-col`}
      >
        <div
          className={`${centered ? 'items-center' : 'items-start'} ${split ? 'max-w-[640px]' : ''} flex flex-col`}
        >
          {eyebrow ? (
            <p
              className={
                eyebrowVariant === 'pill'
                  ? 'border-possivel-border bg-photo-drop text-possivel text-small rounded-pill flex items-center gap-2 border px-3.5 py-[7px] font-semibold'
                  : 'text-accent-text text-eyebrow flex items-center gap-2 font-mono uppercase'
              }
            >
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-text text-h2 mt-3.5 text-balance">{title}</h2>
        </div>
        {description ? (
          <p
            className={`text-text-2 text-lead max-w-[60ch] text-pretty ${split ? 'desk:max-w-[380px]' : 'mt-[18px]'} ${centered ? 'mx-auto' : ''}`}
          >
            {description}
          </p>
        ) : null}
      </header>
    </Reveal>
  );
}
