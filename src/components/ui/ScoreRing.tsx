type ScoreRingProps = {
  valor: number;
  maximo?: number;
  tamanho: number;
  espessura: number;
};

export function ScoreRing({
  valor,
  maximo = 1000,
  tamanho,
  espessura,
}: ScoreRingProps) {
  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const progresso = Math.min(Math.max(valor / maximo, 0), 1);

  return (
    <div
      className="relative shrink-0"
      style={{ width: tamanho, height: tamanho }}
    >
      <svg
        width={tamanho}
        height={tamanho}
        viewBox={`0 0 ${tamanho} ${tamanho}`}
        aria-hidden="true"
      >
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke="var(--color-control)"
          strokeWidth={espessura}
        />
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={`${circunferencia * progresso} ${circunferencia}`}
          transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
        />
      </svg>
      <span className="tabular text-text absolute inset-0 flex items-center justify-center text-2xl font-bold">
        {valor}
      </span>
    </div>
  );
}
