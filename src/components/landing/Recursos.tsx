import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { JuliaAvatar } from '@/components/landing/JuliaAvatar';
import { RevealGroup, RevealItem } from '@/components/landing/fx/Reveal';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { competencias } from '@/lib/competencias';

const comments = [
  {
    code: 'C1',
    excerpt: 'as salas de cinema se concentra',
    tip: 'Concordância: “se concentram”.',
  },
  {
    code: 'C3',
    excerpt: 'existem outros motivos também',
    tip: 'Argumento anunciado, mas não desenvolvido.',
  },
  {
    code: 'C5',
    excerpt: 'o governo deve fazer algo',
    tip: 'Faltam ação, meio e finalidade.',
  },
] as const;

const lineWidths = ['92%', '86%', '95%', '70%', '88%', '60%'] as const;

const cardClass =
  'border-border-subtle bg-surface hover:border-[#3e5a85] h-full rounded-[22px] border p-6 desk:p-7 transition duration-300 hover:-translate-y-1 motion-reduce:transition-none';

export function Recursos() {
  return (
    <section
      id="recursos"
      className="scroll-mt-20 px-5 pt-[120px] pb-10 sm:px-6"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow="Recursos"
          title="Tudo o que a redação pede, num lugar só."
          description="Da folha escrita à mão até o repertório certo para o tema — sem trocar de aplicativo."
          layout="split"
        />

        <RevealGroup className="desk:grid-cols-6 mt-12 grid grid-cols-1 gap-5">
          <RevealItem className="desk:col-span-4">
            <CorrectionCard />
          </RevealItem>
          <RevealItem className="desk:col-span-2">
            <PhotoCard />
          </RevealItem>
          <RevealItem className="desk:col-span-3">
            <EvolutionCard />
          </RevealItem>
          <RevealItem className="desk:col-span-3">
            <ThemesCard />
          </RevealItem>
          <RevealItem className="col-span-full">
            <JuliaCard />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

function CorrectionCard() {
  return (
    <article className={`${cardClass} flex min-h-[360px] flex-col gap-[22px]`}>
      <div className="max-w-[460px]">
        <h3 className="text-text text-h3">Correção por competência</h3>
        <p className="text-text-2 text-body mt-2.5">
          Nota de 0 a 200 em cada uma das cinco competências, com o trecho
          marcado e a explicação do que faltou.
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-2.5">
        {comments.map((comment) => {
          const competencia = competencias.find(
            (item) => item.codigo === comment.code,
          )!;
          return (
            <div
              key={comment.code}
              className="border-border-subtle bg-photo-drop rounded-inner flex items-start gap-3 border px-3.5 py-3"
            >
              <span
                className="text-eyebrow rounded-lg px-2 py-1 font-semibold"
                style={{
                  color: competencia.hex,
                  backgroundColor: competencia.bgHex,
                }}
              >
                {comment.code}
              </span>
              <p className="text-small">
                <span className="text-text-3">“{comment.excerpt}”</span>
                <br />
                <span className="text-text-body">{comment.tip}</span>
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function PhotoCard() {
  const reduceMotion = useReducedMotion();

  return (
    <article className={`${cardClass} flex min-h-[360px] flex-col gap-5`}>
      <div>
        <h3 className="text-text text-h3">Foto da redação</h3>
        <p className="text-text-2 text-body mt-2.5">
          Escreveu à mão, como no dia da prova? Tire uma foto e a Kelly
          transcreve para corrigir.
        </p>
      </div>
      <div className="border-border-subtle bg-photo-view rounded-inner relative mt-auto flex h-[170px] flex-col gap-[13px] overflow-hidden border px-[22px] py-5">
        {lineWidths.map((width) => (
          <span
            key={width}
            aria-hidden="true"
            className="bg-control h-[3px] rounded-sm"
            style={{ width }}
          />
        ))}
        <motion.span
          aria-hidden="true"
          className="bg-accent absolute right-[8%] left-[8%] h-0.5 shadow-[0_0_14px_2px_#0866ff88]"
          initial={false}
          animate={reduceMotion ? { top: '50%' } : { top: ['6%', '88%', '6%'] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 3.4, ease: 'easeInOut', repeat: Infinity }
          }
        />
      </div>
    </article>
  );
}

function EvolutionCard() {
  const chartRef = useRef<SVGSVGElement>(null);
  const inView = useInView(chartRef, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const visible = reduceMotion || inView;

  return (
    <article className={`${cardClass} flex min-h-[330px] flex-col gap-5`}>
      <div>
        <h3 className="text-text text-h3">Evolução visível</h3>
        <p className="text-text-2 text-body mt-2.5">
          Acompanhe sua nota e cada competência ao longo das redações.
        </p>
      </div>
      <svg
        ref={chartRef}
        viewBox="0 0 300 120"
        role="img"
        aria-label="Exemplo de gráfico de evolução da nota subindo ao longo de seis redações"
        className="mt-auto w-full"
      >
        {[30, 70, 110].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="300"
            y2={y}
            stroke="var(--color-border-subtle)"
            strokeWidth="1"
          />
        ))}
        <motion.polyline
          points="6,100 62,82 118,88 174,58 230,40 294,18"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: visible ? 1 : 0 }}
          transition={{
            duration: reduceMotion ? 0 : DUR.slow,
            ease: EASE_OUT,
          }}
        />
        <motion.circle
          cx="294"
          cy="18"
          r="5"
          fill="var(--color-accent-text)"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.5 }}
          transition={{
            duration: reduceMotion ? 0 : DUR.fast,
            delay: reduceMotion ? 0 : DUR.slow,
          }}
        />
      </svg>
    </article>
  );
}

function ThemesCard() {
  return (
    <article className={`${cardClass} flex min-h-[330px] flex-col gap-5`}>
      <div>
        <h3 className="text-text text-h3">Possíveis temas 2026</h3>
        <p className="text-text-2 text-body mt-2.5">
          Uma lista pesquisada de temas prováveis, com mini-análise e sugestão
          de argumentos.
        </p>
      </div>
      <div className="border-possivel-border bg-photo-drop rounded-inner mt-auto border p-3.5">
        <p className="text-possivel text-eyebrow font-mono uppercase">
          POSSÍVEL TEMA
        </p>
        <p className="text-text text-body mt-1.5 font-semibold">
          Seu próximo tema de treino
        </p>
        <div className="mt-3 flex gap-2">
          <span className="bg-accent-tint text-accent-text rounded-pill px-2.5 py-1 text-xs">
            + Adicionar aos meus temas
          </span>
        </div>
      </div>
    </article>
  );
}

function JuliaCard() {
  const reduceMotion = useReducedMotion();

  return (
    <article className="border-nav-active bg-accent-tint hover:border-possivel-border desk:p-8 relative flex h-full flex-wrap items-center gap-7 rounded-[22px] border p-6 transition duration-300 hover:-translate-y-1 motion-reduce:transition-none">
      <span className="relative size-[84px] shrink-0">
        {!reduceMotion ? (
          <motion.span
            aria-hidden="true"
            className="bg-accent absolute inset-0 rounded-full opacity-35"
            animate={{ scale: [1, 2.2], opacity: [0.35, 0] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          />
        ) : null}
        <span className="relative block">
          <JuliaAvatar size={84} />
        </span>
      </span>

      <div className="min-w-[260px] flex-1 basis-[360px]">
        <h3 className="text-text text-h3">Conheça a Julia, sua assistente.</h3>
        <p className="text-text-body text-body mt-2.5 max-w-[620px]">
          Ficou com dúvida sobre a correção? A Julia explica, em linguagem
          simples, por que uma competência perdeu pontos e como o sistema
          funciona.
        </p>
      </div>

      <div className="flex min-w-[260px] flex-1 basis-[300px] flex-col gap-2">
        <div className="bg-accent text-small self-end rounded-[16px_16px_4px_16px] px-3.5 py-2.5 text-white">
          O que é repertório produtivo?
        </div>
        <div className="bg-bg text-text-body text-small max-w-[320px] self-start rounded-[16px_16px_16px_4px] px-3.5 py-2.5">
          É quando a referência que você usou ajuda de verdade o seu argumento,
          em vez de só aparecer no texto.
        </div>
      </div>
    </article>
  );
}
