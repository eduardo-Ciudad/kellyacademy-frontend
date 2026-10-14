import brandMark from '@/assets/brand/kelly-marca-mono-branca.svg';

type BrandWatermarkProps = {
  className?: string;
  width?: number;
  opacity?: number;
};

export function BrandWatermark({
  className = '',
  width = 1100,
  opacity = 0.06,
}: BrandWatermarkProps) {
  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ width }}
    >
      <img
        src={brandMark}
        alt=""
        aria-hidden="true"
        className="block h-auto w-full"
        style={{ opacity }}
      />
    </div>
  );
}
