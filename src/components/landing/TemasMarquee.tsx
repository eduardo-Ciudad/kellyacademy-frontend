import { temasEnem } from '@/components/landing/data/temasEnem';
import { Marquee } from '@/components/landing/fx/Marquee';

export function TemasMarquee() {
  const firstRow = temasEnem.slice(0, 4);
  const secondRow = temasEnem.slice(4);

  return (
    <section aria-label="Temas" className="overflow-hidden pt-14 pb-6">
      <p className="text-text-3 mx-auto mb-[22px] max-w-[760px] px-5 text-center font-mono text-xs leading-5 tracking-[1.6px] sm:px-6">
        TREINE COM TEMAS DE EDIÇÕES ANTERIORES E POSSÍVEIS TEMAS DO ENEM 2026
      </p>
      <div
        className="flex flex-col gap-3"
        style={{
          maskImage:
            'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <Marquee speed={60}>
          {firstRow.map((tema) => (
            <ThemePill key={tema.ano} {...tema} />
          ))}
        </Marquee>
        <Marquee speed={70} reverse>
          {secondRow.map((tema) => (
            <ThemePill key={tema.ano} {...tema} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function ThemePill({ ano, nome }: (typeof temasEnem)[number]) {
  return (
    <span className="border-border-subtle bg-photo-drop text-text-2 rounded-pill inline-flex shrink-0 items-center border px-[18px] py-2.5 text-[15px] whitespace-nowrap">
      <span className="text-accent-text mr-2.5 font-mono text-xs">{ano}</span>
      {nome}
    </span>
  );
}
