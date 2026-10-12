type GridBackgroundProps = {
  className?: string;
};

export function GridBackground({ className = '' }: GridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(rgb(255 255 255 / 4%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage:
          'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%)',
      }}
    />
  );
}
