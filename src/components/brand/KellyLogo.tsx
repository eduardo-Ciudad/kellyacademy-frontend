import darkLogo from '@/assets/brand/kelly-marca-fundo-escuro.svg';
import lightLogo from '@/assets/brand/kelly-marca.svg';

type KellyLogoProps = {
  variant?: 'dark' | 'light';
  size?: number;
  withWordmark?: boolean;
  className?: string;
};

export function KellyLogo({
  variant = 'dark',
  size = 28,
  withWordmark = true,
  className = '',
}: KellyLogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center ${className}`}
      style={{ gap: withWordmark ? size * 0.35 : undefined }}
    >
      <img
        src={variant === 'dark' ? darkLogo : lightLogo}
        alt={withWordmark ? '' : 'Kelly Academy'}
        className="w-auto shrink-0"
        style={{ height: size }}
      />
      {withWordmark ? (
        <span
          className={variant === 'dark' ? 'text-text' : 'text-[#0b2a6b]'}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: size * 0.68,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          Kelly Academy
        </span>
      ) : null}
    </span>
  );
}
