import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { JuliaAvatar } from '@/components/landing/JuliaAvatar';
import { RecursosMobile } from '@/components/landing/RecursosMobile';
import { TEMAS_POSSIVEIS_PREVIEW } from '@/components/landing/data/temasEnem';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';

const PAPER_LINE_WIDTHS = ['88%', '94%', '76%', '90%', '64%', '84%', '70%'];

export function Recursos() {
  const isMobile = useIsMobileLanding();

  return isMobile ? <RecursosMobile /> : <RecursosDesktop />;
}

function RecursosDesktop() {
  return (
    <section id="recursos" className="landing-section scroll-mt-20 px-6">
      <div className="mx-auto max-w-[1200px]">
        <header className="flex items-end justify-between gap-8">
          <h2 className="text-text max-w-[700px] text-[clamp(36px,3.8vw,52px)] leading-[1.06] font-light tracking-[-0.035em] text-balance">
            Tudo o que a redação pede.{' '}
            <span className="text-text-3">Sem trocar de aplicativo.</span>
          </h2>
          <p className="text-text-3 max-w-[340px] text-[17px] leading-[1.6] text-pretty">
            Da folha escrita à mão até o tema que pode cair em 2026.
          </p>
        </header>

        <div className="border-surface-2 mt-[72px] grid grid-cols-2 border-y">
          <ResourceItem
            title="Foto da redação"
            description="Escreveu à mão? Tire uma foto e a Kelly transcreve. Você revisa antes de corrigir."
          >
            <ScannerScene />
          </ResourceItem>
          <ResourceItem
            title="Possíveis temas 2026"
            description="Uma lista pesquisada de temas prováveis, com mini-análise e sugestão de argumentos."
            right
          >
            <ThemesScene />
          </ResourceItem>
          <ResourceItem
            title="Júlia, sua assistente"
            description="Explica, em linguagem simples, por que uma competência perdeu pontos."
            bottom
          >
            <JuliaScene />
          </ResourceItem>
          <ResourceItem
            title="Evolução visível"
            description="Sua nota e cada competência ao longo das redações."
            right
            bottom
          >
            <EvolutionScene />
          </ResourceItem>
        </div>
      </div>
    </section>
  );
}

function ResourceItem({
  title,
  description,
  right = false,
  bottom = false,
  children,
}: {
  title: string;
  description: string;
  right?: boolean;
  bottom?: boolean;
  children: ReactNode;
}) {
  return (
    <article
      className={`${right ? 'border-surface-2 border-l pr-0 pl-12' : 'pr-12'} ${bottom ? 'border-surface-2 border-t pt-12 pb-14' : 'pt-12 pb-14'} flex min-w-0 flex-col gap-7`}
    >
      {children}
      <div>
        <h3 className="text-text text-xl font-semibold">{title}</h3>
        <p className="text-text-3 mt-2 text-[15px] leading-[1.6]">
          {description}
        </p>
      </div>
    </article>
  );
}

function Scene({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="bg-photo-drop relative flex h-[220px] overflow-hidden rounded-[14px] border border-[#2a2b2c]"
    >
      {children}
    </div>
  );
}

function ScannerScene() {
  const reduceMotion = useReducedMotion();

  return (
    <Scene>
      <div className="bg-photo-view absolute inset-0 flex items-center justify-center">
        <div className="flex h-44 w-[62%] -rotate-3 flex-col gap-[11px] rounded-sm bg-[#f3f1ea] px-5 py-[18px]">
          {PAPER_LINE_WIDTHS.map((width, index) => (
            <span
              key={`${width}-${index}`}
              className="h-0.5 bg-[#9aa0aa]"
              style={{ width }}
            />
          ))}
        </div>
        <motion.span
          className="bg-accent absolute right-[14%] left-[14%] h-0.5"
          initial={false}
          animate={reduceMotion ? { y: 0 } : { y: [-58, 58, -58] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 3.6, ease: 'easeInOut', repeat: Infinity }
          }
        />
        <span className="border-accent-text absolute top-4 left-4 size-[22px] rounded-tl-sm border-t-2 border-l-2" />
        <span className="border-accent-text absolute right-4 bottom-4 size-[22px] rounded-br-sm border-r-2 border-b-2" />
      </div>
    </Scene>
  );
}

function ThemesScene() {
  return (
    <Scene>
      <div className="flex w-full flex-col gap-3 px-6 py-[22px]">
        <p className="text-possivel font-mono text-[11px] tracking-[0.14em]">
          POSSÍVEIS TEMAS 2026
        </p>
        {TEMAS_POSSIVEIS_PREVIEW.map((tema, index) => (
          <div
            key={`${tema.nome}-${index}`}
            className={`${index === 0 ? 'bg-[#2a2b2d]' : 'border-surface-2 border'} ${index === 2 ? 'opacity-60' : ''} flex min-h-11 items-center justify-between gap-3 rounded-[10px] px-3.5 py-2.5`}
          >
            <span
              className={`${index === 0 ? 'text-text font-semibold' : 'text-text-2'} truncate text-[15px]`}
            >
              {tema.nome}
            </span>
            <span
              className={`${index === 0 ? 'text-accent-text' : 'text-text-3'} shrink-0 text-[13px]`}
            >
              {tema.eixo}
            </span>
          </div>
        ))}
      </div>
    </Scene>
  );
}

function JuliaScene() {
  return (
    <Scene>
      <div className="flex w-full flex-col justify-center gap-3 px-6 py-[22px]">
        <div className="bg-accent max-w-[78%] self-end rounded-[14px_14px_4px_14px] px-3.5 py-2.5 text-sm leading-[1.45] text-white">
          Por que minha C3 caiu?
        </div>
        <div className="flex max-w-[88%] items-end gap-2.5">
          <JuliaAvatar size={30} />
          <div className="text-text-body rounded-[14px_14px_14px_4px] bg-[#2a2b2d] px-3.5 py-2.5 text-sm leading-[1.45]">
            Seu 2º argumento foi anunciado, mas não explicado: faltou causa,
            exemplo ou dado.
          </div>
        </div>
      </div>
    </Scene>
  );
}

function EvolutionScene() {
  const chartRef = useRef<SVGSVGElement>(null);
  const inView = useInView(chartRef, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const visible = reduceMotion || inView;

  return (
    <Scene>
      <div className="flex w-full flex-col gap-2.5 px-6 py-[22px]">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-text text-[32px] font-semibold tracking-[-0.03em]">
            880
          </span>
          <span className="text-success text-[13px]">
            +320 desde a 1ª redação
          </span>
        </div>
        <svg
          ref={chartRef}
          viewBox="0 0 300 120"
          preserveAspectRatio="none"
          className="min-h-0 w-full flex-1"
        >
          {[110, 60, 10].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="300"
              y2={y}
              stroke="var(--color-surface-2)"
              strokeWidth="1"
            />
          ))}
          <motion.polyline
            points="6,104 62,86 118,92 174,58 230,40 294,14"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="400"
            initial={reduceMotion ? false : { strokeDashoffset: 400 }}
            animate={{ strokeDashoffset: visible ? 0 : 400 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: 'easeOut' }}
          />
          <motion.circle
            cx="294"
            cy="14"
            r="4.5"
            fill="var(--color-accent-text)"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.2,
              delay: reduceMotion ? 0 : 1,
            }}
          />
        </svg>
      </div>
    </Scene>
  );
}
