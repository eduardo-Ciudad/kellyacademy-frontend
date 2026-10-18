import { Check } from 'lucide-react';

export function PasswordRules({
  lengthOk,
  matchOk,
}: {
  lengthOk: boolean;
  matchOk: boolean;
}) {
  return (
    <ul className="flex flex-col gap-2 text-sm" aria-live="polite">
      <Rule ok={lengthOk}>Pelo menos 8 caracteres</Rule>
      <Rule ok={matchOk}>As duas senhas são iguais</Rule>
    </ul>
  );
}

function Rule({ ok, children }: { ok: boolean; children: string }) {
  return (
    <li
      className={
        ok
          ? 'text-success flex items-center gap-2'
          : 'text-text-3 flex items-center gap-2'
      }
    >
      <span
        className={`flex size-5 items-center justify-center rounded-full border ${ok ? 'border-success bg-success-subtle' : 'border-control'}`}
      >
        {ok && <Check size={13} strokeWidth={2.5} aria-hidden="true" />}
      </span>
      {children}
    </li>
  );
}
