import type { KeyboardEvent } from 'react';

type ConsentSwitchProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function ConsentSwitch({
  label,
  checked,
  onCheckedChange,
}: ConsentSwitchProps) {
  function toggle() {
    onCheckedChange(!checked);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    toggle();
  }

  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      className="focus-ring rounded-pill relative flex h-11 w-11 shrink-0 items-center justify-center transition-colors motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className={`rounded-pill relative block h-6 w-10 transition-colors motion-reduce:transition-none ${checked ? 'bg-accent' : 'bg-control'}`}
      >
        <span
          className={`absolute top-1 block size-4 rounded-full bg-white transition-transform duration-200 motion-reduce:transition-none ${checked ? 'translate-x-5' : 'translate-x-1'}`}
        />
      </span>
    </button>
  );
}
