import { useState } from 'react';
import { AccountSheet } from '@/components/layout/AccountSheet';
import { useUsuario } from '@/hooks/useUsuario';

export function AccountButton({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { iniciais } = useUsuario();

  return (
    <>
      <button
        type="button"
        aria-label="Abrir conta"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={`focus-ring flex size-11 shrink-0 items-center justify-center rounded-full lg:hidden ${className}`}
      >
        <span className="bg-control text-text flex size-9 items-center justify-center rounded-full text-[13px] font-semibold">
          {iniciais}
        </span>
      </button>
      <AccountSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
