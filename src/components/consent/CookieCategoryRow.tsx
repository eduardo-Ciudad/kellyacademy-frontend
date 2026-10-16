import type { ReactNode } from 'react';

type CookieCategoryRowProps = {
  title: string;
  description: string;
  control: ReactNode;
};

export function CookieCategoryRow({
  title,
  description,
  control,
}: CookieCategoryRowProps) {
  return (
    <div className="border-border-subtle bg-bg/60 rounded-inner flex min-h-[76px] items-center gap-3 border px-3.5 py-3 sm:px-4">
      <div className="min-w-0 flex-1">
        <h3 className="text-text text-sm font-semibold">{title}</h3>
        <p className="text-text-3 text-small mt-1 leading-5">{description}</p>
      </div>
      {control}
    </div>
  );
}
