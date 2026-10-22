import { useId } from 'react';

const CORES = {
  de: '#e3e6ff',
  ate: '#5468ff',
  texto: '#e8eaf3',
  tinta: '#0b0d16',
} as const;

export function JuliaMarca({
  variante,
  tamanho,
  className,
  titulo,
}: {
  variante: 'principal' | 'mono' | 'escura';
  tamanho: number;
  className?: string;
  titulo?: string;
}) {
  const reactId = useId();
  const gradientId = `julia-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const fill =
    variante === 'principal'
      ? `url(#${gradientId})`
      : variante === 'mono'
        ? CORES.texto
        : CORES.tinta;

  return (
    <svg
      viewBox="0 0 120 120"
      width={tamanho}
      height={tamanho}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      className={className}
    >
      {variante === 'principal' && (
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="120"
            y2="120"
          >
            <stop offset="0" stopColor={CORES.de} />
            <stop offset="1" stopColor={CORES.ate} />
          </linearGradient>
        </defs>
      )}
      <path
        d="M2 64C2 40 18 28 40 28H75Q77 28 77 30V46Q77 48 75 48H40C28 48 21 56 21 67V89C26 84 33 81 41 81H77C88 81 97 72 97 61V44Q97 41 100 41H114Q117 41 117 44V67C117 88 100 104 79 104H35C24 104 14 110 6 118Q3 120 2 117Z"
        fill={fill}
      />
      <path
        d="M100 1H116Q118 1 118 3V17A14 14 0 0 1 104 31H89Q86 31 86 28V15A14 14 0 0 1 100 1Z"
        fill={fill}
      />
    </svg>
  );
}
