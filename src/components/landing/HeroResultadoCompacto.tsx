import { JuliaAvatar } from '@/components/landing/JuliaAvatar';
import { NumberTicker } from '@/components/landing/fx/NumberTicker';
import { LandingCard } from '@/components/landing/ui/LandingCard';
import { competencias } from '@/lib/competencias';

const scores = [160, 200, 120, 200, 180] as const;

export function HeroResultadoCompacto() {
  return (
    <LandingCard
      as="div"
      aria-label="Exemplo de resultado"
      className="shadow-soft mt-7 flex w-full flex-col gap-3.5 p-[18px]"
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-text-3 font-mono text-[11px] leading-none tracking-[0.14em]">
            NOTA ESTIMADA
          </p>
          <p className="text-text mt-1.5 text-[44px] leading-none font-extrabold tracking-[-0.03em]">
            <NumberTicker value={860} />
            <span className="text-text-3 text-[17px] font-medium tracking-normal">
              /1000
            </span>
          </p>
        </div>
        <span className="bg-success-bg text-success rounded-pill shrink-0 px-2.5 py-1 text-[12.5px] font-semibold">
          +80 vs. anterior
        </span>
      </div>

      <div className="flex flex-col gap-[9px]">
        {competencias.map((competencia, index) => {
          const score = scores[index];
          const highlighted = competencia.codigo === 'C3';

          return (
            <div
              key={competencia.codigo}
              className="grid grid-cols-[34px_minmax(0,1fr)_34px] items-center gap-2.5 text-[13px]"
            >
              <span
                className="font-semibold"
                style={{ color: competencia.hex }}
              >
                {competencia.codigo}
              </span>
              <span className="bg-control h-1.5 overflow-hidden rounded-[3px]">
                <span
                  className="block h-full rounded-[3px]"
                  style={{
                    width: `${(score / 200) * 100}%`,
                    backgroundColor: competencia.hex,
                  }}
                />
              </span>
              <span
                className={`${highlighted ? 'text-text font-semibold' : 'text-text-2'} tabular text-right`}
              >
                {score}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-border-subtle bg-photo-drop rounded-inner flex items-start gap-2.5 border px-3 py-[11px]">
        <JuliaAvatar size={28} loading="eager" />
        <p className="text-text-body text-[13.5px] leading-[1.45]">
          <strong className="text-text">Sua C3 perdeu 80 pontos:</strong> o 2º
          argumento foi anunciado, mas não desenvolvido.
        </p>
      </div>
    </LandingCard>
  );
}
