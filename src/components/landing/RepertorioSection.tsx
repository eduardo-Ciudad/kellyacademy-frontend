import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  Pause,
  Play,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  EIXOS,
  FICHAS,
  REPERTORIO_PILARES,
  REPERTORIO_STATS,
  type FichaRepertorio,
} from '@/components/landing/data/repertorioDestaque';
import { BorderBeam } from '@/components/landing/fx/BorderBeam';
import { GridBackground } from '@/components/landing/fx/GridBackground';
import { Marquee } from '@/components/landing/fx/Marquee';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { NumberTicker } from '@/components/landing/fx/NumberTicker';
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from '@/components/landing/fx/Reveal';
import { TextShimmer } from '@/components/landing/fx/TextShimmer';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { useRovingTabs } from '@/components/landing/useRovingTabs';
import {
  FUNCAO_ARGUMENTATIVA_LABELS,
  TIPO_ENTIDADE_LABELS,
} from '@/lib/repertorio';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ROTATION_DURATION = 7_000;

const TYPE_STYLES: Record<
  FichaRepertorio['tipo'],
  { text: string; background: string }
> = {
  PERSON: { text: 'text-c2', background: 'bg-c2-bg' },
  LEGAL_SOURCE: { text: 'text-c1', background: 'bg-c1-bg' },
  EVIDENCE: { text: 'text-c3', background: 'bg-c3-bg' },
  CULTURAL_WORK: { text: 'text-c5', background: 'bg-c5-bg' },
};

export function RepertorioSection() {
  return (
    <section
      id="repertorio"
      className="relative scroll-mt-20 px-5 pt-[130px] pb-[60px] sm:px-6"
    >
      <GridBackground className="opacity-80" />
      <div className="relative mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow={
            <>
              <BookOpen size={14} strokeWidth={2} aria-hidden="true" />O
              DIFERENCIAL DA KELLY
            </>
          }
          title={
            <>
              Repertório que você sabe <TextShimmer>usar</TextShimmer>, não só
              decorar.
            </>
          }
          description="Pensadores, artigos da Constituição, dados oficiais e obras culturais — curados por eixo temático, com a ideia central, como encaixar no argumento e o erro que derruba a sua C2."
          align="center"
          eyebrowVariant="pill"
          className="mx-auto max-w-[900px]"
        />

        <RevealGroup className="desk:grid-cols-4 desk:gap-4 mt-[52px] grid grid-cols-2 gap-3">
          {REPERTORIO_STATS.map((stat) => (
            <RevealItem key={stat.label}>
              <div className="border-border-subtle bg-photo-drop/80 desk:px-[22px] rounded-[18px] border px-4 py-5">
                <NumberTicker
                  value={stat.value}
                  className="text-text block text-[2.5rem] leading-none font-extrabold"
                />
                <p className="text-text-2 text-small mt-2">{stat.label}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div
          className="mt-[22px] overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
          }}
        >
          <Marquee speed={45}>
            {EIXOS.map((eixo) => (
              <span
                key={eixo}
                className="border-possivel-border text-possivel rounded-pill shrink-0 border px-3.5 py-[7px] text-sm whitespace-nowrap"
              >
                {eixo}
              </span>
            ))}
          </Marquee>
        </div>

        <Reveal>
          <RepertorioExplorer />
        </Reveal>

        <RevealGroup className="desk:grid-cols-3 mt-5 grid gap-5">
          {REPERTORIO_PILARES.map((pilar) => (
            <RevealItem
              key={pilar.titulo}
              as="article"
              className="border-border-subtle bg-surface hover:border-possivel-border rounded-card border p-6 transition duration-300 hover:-translate-y-1 motion-reduce:transition-none"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-text text-h3">{pilar.titulo}</h3>
                {'emBreve' in pilar && pilar.emBreve ? (
                  <span className="bg-warning-bg text-warning text-eyebrow rounded-pill shrink-0 px-2 py-1 font-semibold">
                    EM BREVE
                  </span>
                ) : null}
              </div>
              <p className="text-text-2 text-body mt-2.5">{pilar.descricao}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 flex justify-center">
          <Link
            to="/criar-conta"
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill text-body inline-flex min-h-14 items-center gap-2.5 px-7 font-semibold text-white transition hover:-translate-y-px active:translate-y-0 motion-reduce:transition-none"
          >
            Explorar o repertório
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RepertorioExplorer() {
  const explorerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(explorerRef, { amount: 0.1 });
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 960px)');
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [automaticDisabled, setAutomaticDisabled] = useState(false);
  const [automaticPaused, setAutomaticPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(
    () => document.visibilityState === 'visible',
  );

  useEffect(() => {
    const updateVisibility = () =>
      setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', updateVisibility);
    return () =>
      document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  const automaticAvailable = isDesktop && !reduceMotion && !automaticDisabled;

  useAnimationFrame((_time, delta) => {
    if (!automaticAvailable || automaticPaused || !inView || !pageVisible)
      return;
    elapsedRef.current += delta;
    if (elapsedRef.current >= ROTATION_DURATION) {
      elapsedRef.current %= ROTATION_DURATION;
      setActiveIndex((current) => (current + 1) % FICHAS.length);
    }
    progress.set(elapsedRef.current / ROTATION_DURATION);
  });

  const selectTab = (index: number) => {
    setActiveIndex(index);
    setAutomaticDisabled(true);
    elapsedRef.current = 0;
    progress.set(0);
  };
  const { tabRefs, onKeyDown } = useRovingTabs({
    count: FICHAS.length,
    onSelect: selectTab,
  });

  const activeFicha = FICHAS[activeIndex];

  return (
    <div
      ref={explorerRef}
      className="border-control bg-surface relative mt-10 overflow-hidden rounded-[28px] border shadow-[0_40px_120px_-40px_#0866ff66]"
    >
      <BorderBeam />
      <BorderBeam bottom />
      <div className="desk:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] grid grid-cols-1">
        <div className="border-border-subtle desk:border-r desk:border-b-0 flex min-w-0 flex-col gap-2.5 border-b p-4 sm:p-6">
          <Link
            to="/criar-conta"
            aria-label="Criar conta para buscar no repertório"
            className="focus-ring border-control bg-bg text-text-3 hover:border-possivel-border rounded-input text-body mb-1.5 flex min-h-12 items-center gap-2.5 border px-3.5 text-left transition-colors motion-reduce:transition-none"
          >
            <Search size={16} strokeWidth={2} aria-hidden="true" />
            <span>Buscar por tema, pensador ou palavra-chave</span>
          </Link>

          <div
            role="tablist"
            aria-label="Repertórios em destaque"
            aria-orientation="vertical"
            className="flex flex-col gap-2"
          >
            {FICHAS.map((ficha, index) => {
              const selected = index === activeIndex;
              const styles = TYPE_STYLES[ficha.tipo];
              return (
                <button
                  key={ficha.nome}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`repertorio-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="repertorio-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`focus-ring rounded-inner relative flex min-h-16 items-center gap-3.5 overflow-hidden border px-3.5 py-3 text-left transition-colors motion-reduce:transition-none ${
                    selected
                      ? 'bg-surface-2 border-[#3e5a85]'
                      : 'border-border-subtle hover:bg-surface-2 bg-transparent'
                  }`}
                >
                  <span
                    className={`${styles.text} ${styles.background} text-small flex size-[38px] shrink-0 items-center justify-center rounded-[10px] font-semibold`}
                  >
                    {ficha.iniciais}
                  </span>
                  <span className="flex min-w-0 flex-col gap-[3px]">
                    <span className="text-text text-body truncate font-semibold">
                      {ficha.nome}
                    </span>
                    <span className="text-text-3 text-eyebrow truncate font-mono uppercase">
                      {TIPO_ENTIDADE_LABELS[ficha.tipo].toUpperCase()} ·{' '}
                      {ficha.eixo}
                    </span>
                  </span>
                  {selected && automaticAvailable ? (
                    <motion.span
                      aria-hidden="true"
                      className="bg-accent absolute bottom-0 left-0 h-0.5 w-full origin-left"
                      style={{ scaleX: progress }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="mx-1 mt-2 flex min-h-11 items-center justify-between gap-3">
            <p className="text-text-3 text-small">
              Exemplos reais da base · 63 repertórios ativos
            </p>
            {automaticAvailable ? (
              <button
                type="button"
                aria-label="Pausar troca automática"
                aria-pressed={automaticPaused}
                onClick={() => setAutomaticPaused((paused) => !paused)}
                className="focus-ring border-border-subtle text-text-2 hover:bg-surface-2 hover:text-text flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors motion-reduce:transition-none"
              >
                {automaticPaused ? (
                  <Play size={16} fill="currentColor" aria-hidden="true" />
                ) : (
                  <Pause size={16} fill="currentColor" aria-hidden="true" />
                )}
              </button>
            ) : null}
          </div>
        </div>

        <div className="desk:min-h-[620px] min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <FichaPanel
              key={activeFicha.nome}
              ficha={activeFicha}
              index={activeIndex}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function FichaPanel({
  ficha,
  index,
}: {
  ficha: FichaRepertorio;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const styles = TYPE_STYLES[ficha.tipo];

  return (
    <motion.article
      id="repertorio-panel"
      role="tabpanel"
      aria-labelledby={`repertorio-tab-${index}`}
      tabIndex={0}
      initial={reduceMotion ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
      transition={{
        duration: reduceMotion ? 0 : DUR.fast,
        ease: EASE_OUT,
      }}
      className="desk:min-h-[620px] flex flex-col gap-5 p-5 sm:p-8 sm:px-[34px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`text-eyebrow rounded-pill px-3 py-1.5 font-mono uppercase ${styles.text} ${styles.background}`}
        >
          {ficha.typeLabel}
        </span>
        <span className="border-possivel-border text-possivel text-small rounded-pill border px-3 py-1">
          Eixo: {ficha.eixo}
        </span>
      </div>

      <div>
        <h3 className="text-text text-h3-lg">{ficha.nome}</h3>
        {ficha.subtitulo ? (
          <p className="text-text-2 text-body mt-1.5">{ficha.subtitulo}</p>
        ) : null}
      </div>

      <div>
        <p className="text-text-3 text-eyebrow mb-2 font-mono uppercase">
          IDEIA CENTRAL
        </p>
        <p className="text-text text-body">{ficha.ideiaCentral}</p>
      </div>

      {ficha.lembre ? (
        <div className="border-nav-active bg-accent-tint rounded-inner flex gap-3 border px-4 py-3.5">
          <Lightbulb
            size={20}
            strokeWidth={2}
            aria-hidden="true"
            className="text-accent-text mt-0.5 shrink-0"
          />
          <div>
            <p className="text-accent-text text-small mb-1 font-semibold">
              Lembre na prova
            </p>
            <p className="text-text-body text-body">{ficha.lembre}</p>
          </div>
        </div>
      ) : null}

      {ficha.comoUsar || ficha.evite ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {ficha.comoUsar ? (
            <InfoBlock title="Como usar" tone="text-success">
              {ficha.comoUsar}
            </InfoBlock>
          ) : null}
          {ficha.evite ? (
            <InfoBlock title="Evite" tone="text-danger">
              {ficha.evite}
            </InfoBlock>
          ) : null}
        </div>
      ) : null}

      {ficha.exemplo ? (
        <div>
          <p className="text-text-3 text-eyebrow mb-2 font-mono uppercase">
            NA SUA REDAÇÃO
          </p>
          <p className="border-accent text-text-body text-body border-l-2 pl-3.5 italic">
            {ficha.exemplo}
          </p>
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2">
        {ficha.funcoes.map((funcao) => (
          <span
            key={funcao}
            className="bg-surface-2 text-text-2 text-small rounded-pill px-[11px] py-1.5"
          >
            {FUNCAO_ARGUMENTATIVA_LABELS[funcao]}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function InfoBlock({
  title,
  tone,
  children,
}: {
  title: string;
  tone: string;
  children: string;
}) {
  return (
    <div className="border-border-subtle bg-photo-drop rounded-inner border px-4 py-3.5">
      <p className={`${tone} text-small mb-1.5 font-semibold`}>{title}</p>
      <p className="text-text-body text-body">{children}</p>
    </div>
  );
}
