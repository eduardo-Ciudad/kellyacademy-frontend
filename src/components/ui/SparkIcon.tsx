import type { SVGProps } from 'react';

type SparkIconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  size?: number;
  double?: boolean;
};

export function SparkIcon({
  size = 24,
  double = true,
  className,
  ...props
}: SparkIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" />
      {double && (
        <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z" />
      )}
    </svg>
  );
}
