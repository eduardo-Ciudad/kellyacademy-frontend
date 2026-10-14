import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JuliaAvatar } from './JuliaAvatar';
import {
  competenciaStyles,
  redacaoParagraphs,
  redacaoSteps,
  type Competencia,
  type RedacaoStep,
} from './data/redacaoScroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function CompetenciaBadge({ competencia }: { competencia: Competencia }) {
  const style = competenciaStyles[competencia];
  return (
    <span
      className="flex h-6 shrink-0 items-center rounded-md px-2 text-xs font-bold"
      style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
    >
      {competencia}
    </span>
  );
}

function Paragraph({ index, active, animated = false }: { index: number; active: boolean; animated?: boolean }) {
  return (
    <div className={animated ? 'redacao-paragraph relative' : 'relative'} data-paragraph={animated ? index : undefined}>
      <span aria-hidden="true" className="absolute -left-[52px] top-1 font-mono text-[11px]">
        <span className="text-paper-muted">§{index + 1}</span>
        <span
          className="redacao-section-mark-active absolute inset-0 text-paper-accent"
          style={{ opacity: active ? 1 : 0 }}
        >
          §{index + 1}
        </span>
      </span>
      <p className="m-0">
        {redacaoParagraphs[index].segments.map((segment, segmentIndex) => {
          const style = segment.competencia ? competenciaStyles[segment.competencia] : undefined;
          return segment.competencia ? (
            <span
              key={segmentIndex}
              className="relative z-0 px-0.5 text-paper-ink"
              data-competencia={segment.competencia}
            >
              <span
                aria-hidden="true"
                className="redacao-highlight-bg pointer-events-none absolute -inset-x-0.5 -inset-y-px -z-10 rounded-[3px]"
                style={{
                  backgroundColor: style?.highlight,
                  boxShadow: `inset 0 -2px 0 ${style?.underline}`,
                  opacity: active ? 1 : 0,
                }}
              />
              {segment.text}
            </span>
          ) : (
            segment.text
          );
        })}
      </p>
    </div>
  );
}

function PanelContent({ step, index, progress = false }: { step: RedacaoStep; index: number; progress?: boolean }) {
  return (
    <>
      <span className="font-mono text-[13px] text-[#6b6f76]">
        {String(index + 1).padStart(2, '0')} / 04 · {step.label}
      </span>
        <h2 className={`${step.panelWidth === 600 ? 'desk:text-[44px]' : 'desk:text-[40px]'} m-0 text-[32px] font-light leading-[1.1] tracking-[-0.03em] text-paper-ink`}>
        {step.title} <span className="text-paper-muted">{step.titleMuted}</span>
      </h2>
      {step.supportingText && <p className="m-0 max-w-[520px] text-[17px] leading-[1.6] text-paper-soft">{step.supportingText}</p>}
      {step.notes && (
        <ul className="m-0 list-none border-t border-paper-line p-0">
          {step.notes.map((note) => (
            <li key={`${note.competencia}-${note.lead}`} className="flex gap-4 border-b border-paper-line py-4">
              <CompetenciaBadge competencia={note.competencia} />
              <p className="m-0 text-[15px] leading-[1.55] text-paper-body">
                <strong className="text-paper-ink">{note.lead}</strong> {note.text}
              </p>
            </li>
          ))}
        </ul>
      )}
      {step.checklist && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <CompetenciaBadge competencia="C5" />
            <span className="text-[15px] text-paper-body">Os elementos da proposta de intervenção</span>
          </div>
          <ul className="m-0 list-none border-t border-paper-line p-0">
            {step.checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-3.5 border-b border-paper-line py-[11px] text-[15px]">
                <span className={`w-5 shrink-0 font-bold ${item.status === 'complete' ? 'text-[#1d8a72]' : 'text-[#b8436b]'}`}>
                  {item.status === 'complete' ? '✓' : item.status === 'warning' ? '!' : '×'}
                </span>
                <span className="w-[110px] shrink-0 font-semibold text-paper-ink">{item.label}</span>
                <span className="text-paper-soft">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {index === 3 && (
        <div className="flex items-center gap-3.5 pt-1">
          <JuliaAvatar size={40} />
          <p className="m-0 text-[15px] leading-normal text-paper-body">
            <strong className="text-paper-ink">Nota estimada: 880.</strong> Treine C3 e C5 primeiro — é onde você mais perde.
          </p>
        </div>
      )}
      {progress && (
        <div aria-hidden="true" className="flex gap-1.5" style={{ width: step.panelWidth }}>
          {redacaoSteps.map((_, progressIndex) => (
            <span
              key={progressIndex}
              className="h-[3px] flex-1 overflow-hidden rounded-sm bg-[#dfe2e6]"
              data-progress={progressIndex}
            >
              <span className="redacao-progress-fill block h-full origin-left scale-x-0 bg-[#0866ff]" />
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function DesktopPaper() {
  return (
    <div className="redacao-paper absolute left-0 top-[110px] h-[680px] w-[520px] overflow-hidden rounded-md border border-paper-line bg-paper shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <div aria-hidden="true" className="absolute bottom-0 left-14 top-0 w-px bg-paper-margin" />
      <div className="redacao-paper-content absolute inset-x-0 top-0 px-10 py-10 pl-[76px]">
        <div className="flex justify-between border-b border-[#eef0f2] pb-3.5 font-mono text-[11px] text-paper-muted">
          <span className="tracking-[0.14em]">TEMA · ENEM 2019</span>
          <span>Redação 4 de 6</span>
        </div>
        <p className="mb-[22px] mt-5 text-lg font-semibold leading-[1.3] text-paper-ink">Democratização do acesso ao cinema no Brasil</p>
        <div className="flex flex-col gap-5 text-base leading-7 text-paper-body">
          {redacaoParagraphs.map((_, index) => <Paragraph key={index} index={index} active={index === 0} animated />)}
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[90px] bg-gradient-to-b from-white to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}

function StaticVersion() {
  return (
    <div className="px-4 py-16 desk:hidden motion-reduce:desk:block">
      <div className="mx-auto flex max-w-2xl flex-col gap-16">
        {redacaoSteps.map((step, index) => (
          <article key={step.label} className="flex flex-col gap-7">
            <div className="flex flex-col gap-5"><PanelContent step={step} index={index} /></div>
            <div className="relative overflow-hidden rounded-md border border-paper-line bg-paper px-5 py-7 pl-[60px] shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
              <div aria-hidden="true" className="absolute bottom-0 left-10 top-0 w-px bg-paper-margin" />
              <div className="text-base leading-7 text-paper-body"><Paragraph index={index} active /></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function RedacaoScroll() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
      const stage = section.querySelector<HTMLElement>('.redacao-stage');
      const paper = section.querySelector<HTMLElement>('.redacao-paper');
      const content = section.querySelector<HTMLElement>('.redacao-paper-content');
      const panels = gsap.utils.toArray<HTMLElement>('.redacao-panel', section);
      const paragraphs = gsap.utils.toArray<HTMLElement>('.redacao-paragraph', section);
      const progressFills = gsap.utils.toArray<HTMLElement>('.redacao-progress-fill', section);
      if (!stage || !paper || !content) return;

      const setScale = () => {
        const heightScale = Math.max(0.75, window.innerHeight / 900);
        const widthScale = (window.innerWidth - 48) / 1200;
        gsap.set(stage, { scale: Math.min(1, heightScale, widthScale) });
      };
      let resizeRefreshTimer: number | undefined;
      const handleResize = () => {
        setScale();
        window.clearTimeout(resizeRefreshTimer);
        resizeRefreshTimer = window.setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      };
      setScale();
      window.addEventListener('resize', handleResize);

      gsap.set(stage, { transformOrigin: 'center center' });
      gsap.set([paper, content], { force3D: true, willChange: 'transform' });
      gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 });
      gsap.set(paragraphs.slice(1), { opacity: 0.55 });
      gsap.set(progressFills, { scaleX: 0, transformOrigin: 'left center' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: '+=350%',
          scrub: 1,
          anticipatePin: 1,
        },
      });

      timeline
        .fromTo(paper, { x: 0 }, { x: 680, duration: 1, ease: 'sine.inOut', force3D: true }, 0)
        .fromTo(paper, { y: 40 }, { y: -40, duration: 1, ease: 'none', force3D: true }, 0)
        .fromTo(content, { y: 0 }, { y: -420, duration: 1, ease: 'none', force3D: true }, 0);

      for (let index = 0; index < redacaoSteps.length; index += 1) {
        const rangeStart = index * 0.25;
        const rangeEnd = rangeStart + 0.25;
        const highlightBackgrounds = paragraphs[index].querySelectorAll<HTMLElement>('.redacao-highlight-bg');
        const activeMark = paragraphs[index].querySelector<HTMLElement>('.redacao-section-mark-active');
        const rangeProgressFills = section.querySelectorAll<HTMLElement>(
          `[data-progress="${index}"] .redacao-progress-fill`,
        );

        timeline.to(rangeProgressFills, { scaleX: 1, duration: 0.25, ease: 'none' }, rangeStart);

        if (index > 0) {
          timeline
            .to(paragraphs[index], { opacity: 1, duration: 0.08, ease: 'sine.inOut' }, rangeStart - 0.08)
            .to(highlightBackgrounds, { opacity: 1, duration: 0.08, ease: 'sine.inOut' }, rangeStart - 0.08)
            .to(activeMark, { opacity: 1, duration: 0.08, ease: 'sine.inOut' }, rangeStart - 0.08);
        }

        if (index < redacaoSteps.length - 1) {
          timeline
            .to(paragraphs[index], { opacity: 0.55, duration: 0.08, ease: 'sine.inOut' }, rangeEnd)
            .to(highlightBackgrounds, { opacity: 0, duration: 0.08, ease: 'sine.inOut' }, rangeEnd)
            .to(activeMark, { opacity: 0, duration: 0.08, ease: 'sine.inOut' }, rangeEnd);
        }
      }

      for (let index = 1; index < panels.length; index += 1) {
        const boundary = index * 0.25;
        timeline
          .to(panels[index - 1], { y: -40, autoAlpha: 0, duration: 0.03, ease: 'power1.inOut' }, boundary - 0.03)
          .to(panels[index], { y: 0, autoAlpha: 1, duration: 0.03, ease: 'power1.inOut' }, boundary);
      }

      void document.fonts.ready.then(
        () => {
          ScrollTrigger.refresh();
        },
        () => undefined,
      );

      return () => {
        window.removeEventListener('resize', handleResize);
        window.clearTimeout(resizeRefreshTimer);
        gsap.set([paper, content], { clearProps: 'willChange' });
      };
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section id="correcao" ref={sectionRef} aria-label="Como a Kelly corrige cada parágrafo" className="relative bg-paper-bg text-paper-ink">
      <StaticVersion />
      <div className="redacao-desktop hidden h-screen min-h-[675px] overflow-hidden desk:flex desk:items-center desk:justify-center motion-reduce:desk:hidden">
        <div className="redacao-stage relative h-[900px] w-[1200px] shrink-0">
          <DesktopPaper />
          {redacaoSteps.map((step, index) => (
            <div
              key={step.label}
              className="redacao-panel absolute top-0 flex h-[900px] flex-col justify-center gap-7"
              data-panel={index}
              style={{ left: step.panelLeft, width: step.panelWidth }}
            >
              <PanelContent step={step} index={index} progress />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
