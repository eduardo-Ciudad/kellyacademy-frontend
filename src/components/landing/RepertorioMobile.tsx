import { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, Link2, ListFilter, TriangleAlert, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  EIXOS,
  FICHAS,
  REPERTORIO_PILARES,
  REPERTORIO_STATS,
  type FichaRepertorio,
} from '@/components/landing/data/repertorioDestaque';
import { GridBackground } from '@/components/landing/fx/GridBackground';
import { Reveal } from '@/components/landing/fx/Reveal';
import { LandingCard } from '@/components/landing/ui/LandingCard';
import { FUNCAO_ARGUMENTATIVA_LABELS } from '@/lib/repertorio';

const MOBILE_STAT_LABELS = [
  'REPERTÓRIOS',
  'EIXOS',
  'PROBLEMAS',
  'ARTIGOS DA CF',
] as const;

const TYPE_STYLES: Record<
  FichaRepertorio['tipo'],
  { text: string; background: string }
> = {
  PERSON: { text: 'text-c2', background: 'bg-c2-bg' },
  LEGAL_SOURCE: { text: 'text-c1', background: 'bg-c1-bg' },
  EVIDENCE: { text: 'text-c3', background: 'bg-c3-bg' },
  CULTURAL_WORK: { text: 'text-c5', background: 'bg-c5-bg' },
};

type RepertorioMobileProps = {
  onSheetOpenChange?: (open: boolean) => void;
};

export function RepertorioMobile({ onSheetOpenChange }: RepertorioMobileProps) {
  const [activeAxis, setActiveAxis] = useState('Todos');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFicha, setSelectedFicha] = useState<FichaRepertorio | null>(
    null,
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const filteredFichas = useMemo(
    () =>
      activeAxis === 'Todos'
        ? FICHAS
        : FICHAS.filter((ficha) => ficha.eixo === activeAxis),
    [activeAxis],
  );

  useEffect(
    () => () => {
      onSheetOpenChange?.(false);
    },
    [onSheetOpenChange],
  );

  useEffect(() => {
    setActiveIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [activeAxis]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || filteredFichas.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const nextIndex = Number(
          (visible.target as HTMLElement).dataset.carouselIndex,
        );
        if (Number.isFinite(nextIndex)) setActiveIndex(nextIndex);
      },
      { root: track, threshold: [0.55, 0.75] },
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [filteredFichas]);

  const selectAxis = (axis: string) => {
    setActiveAxis(axis);
  };

  const openFicha = (ficha: FichaRepertorio, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setSelectedFicha(ficha);
    onSheetOpenChange?.(true);
  };

  const closeFicha = () => {
    setSelectedFicha(null);
    onSheetOpenChange?.(false);
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  };

  return (
    <section id="repertorio" className="landing-section relative scroll-mt-20">
      <GridBackground className="opacity-80" />
      <div className="relative">
        <div className="px-4">
          <h2 className="font-display text-text text-[36px] leading-[1.08] font-light tracking-[-0.03em] text-balance">
            Repertório que você sabe usar.{' '}
            <span className="text-text-3">Não só decorar.</span>
          </h2>
          <p className="text-text-3 mt-4 text-base leading-[1.6]">
            Pensadores, leis, dados e obras curados por eixo do ENEM — com a
            ideia central e o erro que derruba sua C2.
          </p>
        </div>

        <Reveal className="mx-4 mt-7">
          <p className="text-text-3 overflow-x-auto font-mono text-xs leading-[1.6] tracking-[0.06em] whitespace-nowrap">
            {REPERTORIO_STATS.map((stat, index) => (
              <span key={stat.label}>
                {index > 0 ? ' · ' : ''}
                {stat.value} {MOBILE_STAT_LABELS[index]}
              </span>
            ))}
          </p>
        </Reveal>

        <div
          role="tablist"
          aria-label="Filtrar repertórios por eixo"
          className="no-scrollbar mt-5 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] px-4"
        >
          {['Todos', ...EIXOS].map((axis) => {
            const selected = activeAxis === axis;
            return (
              <button
                key={axis}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectAxis(axis)}
                className={`${selected ? 'border-accent bg-accent-tint text-text' : 'border-possivel-border text-possivel'} focus-ring rounded-pill h-10 shrink-0 snap-start border px-4 text-sm font-medium whitespace-nowrap`}
              >
                {axis}
              </button>
            );
          })}
        </div>

        {filteredFichas.length > 0 ? (
          <>
            <div
              ref={trackRef}
              className="no-scrollbar mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4"
            >
              {filteredFichas.map((ficha, index) => (
                <MobileFichaCard
                  key={ficha.nome}
                  ficha={ficha}
                  index={index}
                  cardRef={(card) => {
                    cardRefs.current[index] = card;
                  }}
                  onOpen={(trigger) => openFicha(ficha, trigger)}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 px-4">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {filteredFichas.map((ficha, index) => (
                  <span
                    key={ficha.nome}
                    className={`${index === activeIndex ? 'bg-accent w-[18px]' : 'bg-control w-1.5'} h-1.5 rounded-full transition-[width,background-color] motion-reduce:transition-none`}
                  />
                ))}
              </div>
              <span className="text-text-3 shrink-0 font-mono text-xs">
                {activeIndex + 1} / {filteredFichas.length} · deslize
              </span>
            </div>
          </>
        ) : (
          <p className="text-text-2 mx-4 mt-5 text-sm leading-relaxed">
            Nenhuma ficha deste eixo na prévia —{' '}
            <Link
              to="/criar-conta"
              className="focus-ring text-accent-text rounded-sm underline-offset-4 hover:underline"
            >
              veja todas ao criar a conta.
            </Link>
          </p>
        )}

        <MobilePillars />

        <div className="px-4">
          <Link
            to="/criar-conta"
            className="focus-ring text-accent-text mt-[18px] inline-flex min-h-11 items-center gap-2 rounded-md text-[15.5px] font-semibold"
          >
            Explorar os 63 repertórios
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {selectedFicha ? (
        <MobileFichaSheet ficha={selectedFicha} onClose={closeFicha} />
      ) : null}
    </section>
  );
}

function MobileFichaCard({
  ficha,
  index,
  cardRef,
  onOpen,
}: {
  ficha: FichaRepertorio;
  index: number;
  cardRef: (card: HTMLElement | null) => void;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const styles = TYPE_STYLES[ficha.tipo];

  return (
    <LandingCard
      ref={cardRef}
      data-carousel-index={index}
      className="flex w-[316px] shrink-0 snap-start flex-col gap-3.5 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`${styles.text} ${styles.background} rounded-pill px-2.5 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase`}
        >
          {ficha.typeLabel}
        </span>
        <span className="border-possivel-border text-possivel rounded-pill border px-2.5 py-1 text-xs">
          {ficha.eixo}
        </span>
      </div>
      <div>
        <h3 className="text-text text-[26px] leading-[1.1] font-bold tracking-[-0.025em]">
          {ficha.nome}
        </h3>
        {ficha.subtitulo ? (
          <p className="text-text-2 mt-1 text-sm">{ficha.subtitulo}</p>
        ) : null}
      </div>
      <div>
        <p className="text-text-3 mb-1.5 font-mono text-[11px] tracking-[0.14em] uppercase">
          Ideia central
        </p>
        <p className="text-text-body line-clamp-4 text-[14.5px] leading-[1.5]">
          {ficha.ideiaCentral}
        </p>
      </div>
      {ficha.lembre ? (
        <div className="bg-accent-tint rounded-inner px-3.5 py-3">
          <p className="text-accent-text text-[13px] font-semibold">
            Lembre na prova
          </p>
          <p className="text-text-body mt-1 line-clamp-2 text-sm leading-[1.5]">
            {ficha.lembre}
          </p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={(event) => onOpen(event.currentTarget)}
        className="focus-ring border-control text-text rounded-pill mt-auto inline-flex h-[46px] w-full items-center justify-center gap-2 border text-[15px] font-semibold"
      >
        Ver ficha completa <ArrowRight size={16} aria-hidden="true" />
      </button>
    </LandingCard>
  );
}

function MobilePillars() {
  const icons = [ListFilter, TriangleAlert, Link2] as const;

  return (
    <Reveal className="mt-9 px-4">
      <div aria-label="Por que o repertório da Kelly">
        {REPERTORIO_PILARES.map((pilar, index) => {
          const Icon = icons[index];
          const warning = index === 2;
          return (
            <div
              key={pilar.titulo}
              className={`border-border-subtle flex gap-3.5 border-t py-4 ${index === REPERTORIO_PILARES.length - 1 ? 'border-b' : ''}`}
            >
              <span
                className={`${warning ? 'bg-warning-bg text-warning' : 'bg-accent-tint text-accent-text'} flex size-10 shrink-0 items-center justify-center rounded-[12px]`}
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-text text-[17px] font-semibold">
                    {pilar.titulo}
                  </h3>
                  {'emBreve' in pilar && pilar.emBreve ? (
                    <span className="bg-warning-bg text-warning rounded-pill px-2 py-0.5 font-mono text-[10.5px] tracking-[0.1em]">
                      EM BREVE
                    </span>
                  ) : null}
                </div>
                <p className="text-text-2 mt-1 text-[14.5px] leading-[1.5]">
                  {pilar.descricao}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}

type SheetTab = 'idea' | 'use' | 'essay';

function MobileFichaSheet({
  ficha,
  onClose,
}: {
  ficha: FichaRepertorio;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<SheetTab>('idea');
  const styles = TYPE_STYLES[ficha.tipo];
  const tabs: Array<{ id: SheetTab; label: string }> = [
    { id: 'idea', label: 'Ideia' },
    { id: 'use', label: 'Usar / evitar' },
    { id: 'essay', label: 'Na redação' },
  ];

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Dialog.Content className="border-control bg-surface fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-[24px] border-t px-5 pt-2.5 pb-[calc(16px+env(safe-area-inset-bottom))] outline-none">
          <div className="bg-control mx-auto h-[5px] w-10 shrink-0 rounded-full" />
          <div className="mt-3.5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span
                className={`${styles.text} ${styles.background} rounded-pill inline-flex px-2.5 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase`}
              >
                {ficha.typeLabel}
              </span>
              <Dialog.Title className="text-text mt-3 text-[28px] leading-[1.1] font-bold tracking-[-0.025em]">
                {ficha.nome}
              </Dialog.Title>
              <Dialog.Description className="text-text-2 mt-1 text-[14.5px]">
                {ficha.subtitulo ? `${ficha.subtitulo} · ` : ''}Eixo{' '}
                {ficha.eixo}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Fechar ficha"
              className="focus-ring border-control text-text-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            >
              <X size={18} strokeWidth={2.2} aria-hidden="true" />
            </Dialog.Close>
          </div>

          <div
            role="tablist"
            aria-label="Partes da ficha"
            className="bg-bg mt-5 grid shrink-0 grid-cols-3 gap-1 rounded-full p-1"
          >
            {tabs.map((item) => (
              <button
                key={item.id}
                id={`ficha-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                aria-controls={`ficha-panel-${item.id}`}
                onClick={() => setTab(item.id)}
                className={`${tab === item.id ? 'bg-control text-text' : 'text-text-3'} focus-ring min-h-10 rounded-full px-1 text-[13.5px] font-semibold`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
            {tab === 'idea' ? (
              <div
                id="ficha-panel-idea"
                role="tabpanel"
                aria-labelledby="ficha-tab-idea"
                className="flex flex-col gap-3.5"
              >
                <p className="text-text-3 font-mono text-[11.5px] tracking-[0.14em] uppercase">
                  Ideia central
                </p>
                <p className="text-text text-[17px] leading-[1.6]">
                  {ficha.ideiaCentral}
                </p>
                {ficha.lembre ? (
                  <div className="bg-accent-tint rounded-inner p-3.5">
                    <p className="text-accent-text text-[13px] font-semibold">
                      Lembre na prova
                    </p>
                    <p className="text-text-body mt-1.5 text-[15px] leading-[1.5]">
                      {ficha.lembre}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {tab === 'use' ? (
              <div
                id="ficha-panel-use"
                role="tabpanel"
                aria-labelledby="ficha-tab-use"
                className="flex flex-col gap-3.5"
              >
                {ficha.comoUsar ? (
                  <SheetInfoBlock title="Como usar" tone="text-success">
                    {ficha.comoUsar}
                  </SheetInfoBlock>
                ) : null}
                {ficha.evite ? (
                  <SheetInfoBlock title="Evite" tone="text-danger">
                    {ficha.evite}
                  </SheetInfoBlock>
                ) : null}
              </div>
            ) : null}

            {tab === 'essay' ? (
              <div
                id="ficha-panel-essay"
                role="tabpanel"
                aria-labelledby="ficha-tab-essay"
                className="flex flex-col gap-4"
              >
                <p className="text-text-3 font-mono text-[11.5px] tracking-[0.14em] uppercase">
                  Na sua redação
                </p>
                {ficha.exemplo ? (
                  <p className="border-accent text-text-body border-l-2 pl-3.5 text-[16.5px] leading-[1.6] italic">
                    {ficha.exemplo}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {ficha.funcoes.map((funcao) => (
                    <span
                      key={funcao}
                      className="bg-surface-2 text-text-2 rounded-pill px-[11px] py-1.5 text-[13px]"
                    >
                      {FUNCAO_ARGUMENTATIVA_LABELS[funcao]}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <Link
            to="/criar-conta"
            onClick={onClose}
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill inline-flex h-[52px] shrink-0 items-center justify-center text-base font-semibold text-white transition-colors"
          >
            Criar conta e ver os 63
          </Link>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SheetInfoBlock({
  title,
  tone,
  children,
}: {
  title: string;
  tone: string;
  children: string;
}) {
  return (
    <div className="border-border-subtle bg-photo-drop rounded-inner border p-3.5">
      <p className={`${tone} text-[13px] font-semibold`}>{title}</p>
      <p className="text-text-body mt-1.5 text-[15.5px] leading-[1.55]">
        {children}
      </p>
    </div>
  );
}
