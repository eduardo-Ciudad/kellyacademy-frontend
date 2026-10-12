import { temasEnem } from '@/components/landing/data/temasEnem';
import { Marquee } from '@/components/landing/fx/Marquee';
import { Reveal } from '@/components/landing/fx/Reveal';

export function TemasMarquee() {
  const firstRow = temasEnem.slice(0, 4);
  const secondRow = temasEnem.slice(4);

  return (
    <section aria-label="Temas" className="overflow-hidden pt-14 pb-6">
      <Reveal>
        <p className="text-text-3 text-eyebrow mx-auto mb-[22px] max-w-[760px] px-5 text-center font-mono uppercase sm:px-6">
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
      </Reveal>
    </section>
  );
}

function ThemePill({ ano, nome }: (typeof temasEnem)[number]) {
  return (
    <span className="border-border-subtle bg-photo-drop text-text-2 text-body rounded-pill inline-flex shrink-0 items-center border px-[18px] py-2.5 whitespace-nowrap">
      <span className="text-accent-text mr-2.5 font-mono text-xs">{ano}</span>
      {nome}
    </span>
  );
}
