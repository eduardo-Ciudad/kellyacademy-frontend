import {
  CircleCheck,
  KeyRound,
  LockKeyhole,
  Mail,
  TriangleAlert,
} from 'lucide-react';

export const passwordTitleClass =
  'font-display text-text text-[36px] leading-[1.08] font-light tracking-[-0.03em] lg:text-[40px]';

export function PasswordStatusIcon({
  type,
}: {
  type: 'key' | 'mail' | 'lock' | 'success' | 'warning';
}) {
  const Icon =
    type === 'key'
      ? KeyRound
      : type === 'mail'
        ? Mail
        : type === 'lock'
          ? LockKeyhole
          : type === 'success'
            ? CircleCheck
            : TriangleAlert;
  const color =
    type === 'success'
      ? 'text-success'
      : type === 'warning'
        ? 'text-warning'
        : 'text-[#4599ff]';
  const surface =
    type === 'success'
      ? 'bg-success-subtle border-success-subtle-border'
      : type === 'warning'
        ? 'bg-warning-subtle border-warning-subtle-border'
        : 'bg-[#1b2638] border-[#2b4a7a]';
  return (
    <div
      className={`${surface} flex size-16 items-center justify-center rounded-2xl border`}
    >
      <Icon className={color} size={30} strokeWidth={1.8} aria-hidden="true" />
    </div>
  );
}
