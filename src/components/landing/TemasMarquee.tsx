import { temasEnem } from '@/components/landing/data/temasEnem';
import { Marquee } from '@/components/landing/fx/Marquee';
import { Reveal } from '@/components/landing/fx/Reveal';

export function TemasMarquee() {
  const firstRow = temasEnem.slice(0, 4);
  const secondRow = temasEnem.slice(4);

  return (
    <section aria-label="Temas" className="landing-section overflow-hidden">
      <Reveal>
        <p className="text-text-3 text-eyebrow desk:px-6 desk:text-center mx-auto mb-[22px] max-w-[760px] px-4 text-left font-mono uppercase">
          TREINE COM TEMAS REAIS DO ENEM
        </p>
        <div className="no-scrollbar desk:hidden flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4">
          {temasEnem.map((tema) => (
            <ThemeCard key={tema.ano} {...tema} />
          ))}
        </div>
        <div
          className="desk:flex hidden flex-col gap-3"
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

function ThemeCard({ ano, nome }: (typeof temasEnem)[number]) {
  return (
    <article className="border-border-subtle bg-surface rounded-inner flex w-[236px] shrink-0 snap-start flex-col gap-2 border p-3.5">
      <span className="text-accent-text font-mono text-xs">ENEM {ano}</span>
      <span className="text-text line-clamp-3 text-[15px] leading-[1.35] font-semibold">
        {nome}
      </span>
    </article>
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
