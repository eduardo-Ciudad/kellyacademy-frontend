import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { JuliaAvatar } from '@/components/landing/JuliaAvatar';
import { BorderBeam } from '@/components/landing/fx/BorderBeam';
import { competencias } from '@/lib/competencias';

const CYCLE_DURATION = 10_000;
const scores = [160, 200, 160, 200, 160] as const;

function cubicOut(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function correctionProgress(time: number) {
  if (time <= 2_600) return 0;
  if (time < 4_400) return cubicOut((time - 2_600) / 1_800);
  if (time < 9_400) return 1;
  if (time < 9_900) return 1 - (time - 9_400) / 500;
  return 0;
}

function highlightProgress(time: number, delay: number) {
  if (time < delay) return 0;
  if (time < delay + 600) return cubicOut((time - delay) / 600);
  if (time < 9_400) return 1;
  if (time < 9_900) return 1 - (time - 9_400) / 500;
  return 0;
}

function juliaProgress(time: number) {
  if (time < 4_600) return 0;
  if (time < 5_200) return cubicOut((time - 4_600) / 600);
  if (time < 9_200) return 1;
  if (time < 9_700) return 1 - (time - 9_200) / 500;
  return 0;
}

export function HeroMock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const elapsedRef = useRef(0);
  const [cycleTime, setCycleTime] = useState(reduceMotion ? 7_000 : 0);

  useEffect(() => {
    if (reduceMotion) {
      elapsedRef.current = 7_000;
      setCycleTime(7_000);
      return;
    }
    if (!inView) return;

    let frameId = 0;
    let previousTime = performance.now();
    const tick = (now: number) => {
      elapsedRef.current =
        (elapsedRef.current + now - previousTime) % CYCLE_DURATION;
      previousTime = now;
      setCycleTime(elapsedRef.current);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, reduceMotion]);

  const progress = reduceMotion ? 1 : correctionProgress(cycleTime);
  const score = Math.round((880 * progress) / 10) * 10;
  const julia = reduceMotion ? 1 : juliaProgress(cycleTime);

  return (
    <div
      ref={containerRef}
      className="relative mt-16 w-full max-w-[1080px] text-left"
    >
      <div className="border-control bg-surface relative overflow-hidden rounded-[22px] border shadow-[0_40px_120px_-30px_#0866ff55,0_0_0_1px_#00000040]">
        <BorderBeam />
        <BorderBeam bottom />

        <div className="border-border-subtle flex items-center gap-2 border-b px-[18px] py-3.5">
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              aria-hidden="true"
              className="bg-control size-[11px] rounded-full"
            />
          ))}
          <span className="text-text-3 ml-3.5 truncate font-mono text-xs">
            kellyacademy · resultado da correção (exemplo)
          </span>
        </div>

        <div className="desk:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] grid">
          <div className="border-border-subtle desk:border-r desk:border-b-0 desk:px-[30px] border-b px-5 py-7">
            <p className="text-text-3 text-eyebrow font-mono uppercase">TEMA</p>
            <p className="text-text text-body mt-1.5 font-semibold">
              Democratização do acesso ao cinema no Brasil
            </p>
            <div className="text-text-body text-body mt-[18px]">
              <p className="mb-3">
                Na Constituição de 1988, a cultura é tratada como direito de
                todos. Entretanto,{' '}
                <Highlight
                  code="C1"
                  progress={
                    reduceMotion ? 1 : highlightProgress(cycleTime, 600)
                  }
                >
                  as salas de cinema se concentra
                </Highlight>{' '}
                nas capitais, o que afasta grande parte da população do
                audiovisual.
              </p>
              <p className="mb-3">
                Em primeiro lugar, o preço do ingresso pesa no orçamento das
                famílias.{' '}
                <Highlight
                  code="C3"
                  progress={
                    reduceMotion ? 1 : highlightProgress(cycleTime, 1_200)
                  }
                >
                  Além disso, existem outros motivos também.
                </Highlight>{' '}
                <Highlight
                  code="C4"
                  progress={
                    reduceMotion ? 1 : highlightProgress(cycleTime, 1_800)
                  }
                >
                  Assim, o problema persiste.
                </Highlight>
              </p>
              <p>
                Portanto,{' '}
                <Highlight
                  code="C5"
                  progress={
                    reduceMotion ? 1 : highlightProgress(cycleTime, 2_400)
                  }
                >
                  o governo deve fazer algo para mudar isso
                </Highlight>
                <span
                  aria-hidden="true"
                  className="bg-accent-text ml-0.5 inline-block h-[1.05em] w-0.5 align-[-2px]"
                  style={{
                    opacity: reduceMotion || cycleTime % 1_000 < 500 ? 1 : 0,
                  }}
                />
              </p>
            </div>
          </div>

          <div className="desk:px-[26px] flex flex-col gap-4 px-5 pt-[26px] pb-6">
            <span className="sr-only">Nota estimada: 880 de 1000</span>
            <div
              aria-hidden="true"
              className="flex items-end justify-between gap-3"
            >
              <div>
                <p className="text-text-3 text-eyebrow font-mono uppercase">
                  NOTA ESTIMADA
                </p>
                <p className="text-text tabular mt-1.5 text-[3.5rem] leading-none font-extrabold">
                  {score}
                  <span className="text-text-3 text-xl font-semibold tracking-normal">
                    {' '}
                    /1000
                  </span>
                </p>
              </div>
              <span className="bg-success-bg text-success rounded-pill mb-1 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap">
                +80 vs. anterior
              </span>
            </div>

            <div aria-hidden="true" className="flex flex-col gap-[11px]">
              {competencias.map((competencia, index) => {
                const value = scores[index];
                const animatedValue = Math.round((value * progress) / 40) * 40;
                return (
                  <div key={competencia.codigo}>
                    <div className="text-small mb-1.5 flex justify-between gap-3">
                      <span className="text-text-2 min-w-0 truncate">
                        <strong style={{ color: competencia.hex }}>
                          {competencia.codigo}
                        </strong>{' '}
                        · {competencia.nomeCurto}
                      </span>
                      <span className="text-text shrink-0 font-mono">
                        {animatedValue}
                      </span>
                    </div>
                    <div className="bg-border-subtle h-1.5 overflow-hidden rounded-full">
                      <div
                        className="h-full origin-left rounded-full"
                        style={{
                          backgroundColor: competencia.hex,
                          transform: `scaleX(${(value / 200) * progress})`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="border-control bg-surface-2 rounded-inner flex origin-bottom-left items-start gap-2.5 border p-3"
              style={{
                opacity: julia,
                transform: `translateY(${(1 - julia) * 10}px) scale(${0.98 + julia * 0.02})`,
              }}
            >
              <JuliaAvatar size={34} loading="eager" />
              <p className="text-text-body text-small">
                <strong className="text-text">Julia</strong> · Sua C3 perdeu
                pontos porque o 2º argumento não foi desenvolvido. Quer ver
                repertórios sobre esse tema?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Highlight({
  code,
  progress,
  children,
}: {
  code: (typeof competencias)[number]['codigo'];
  progress: number;
  children: React.ReactNode;
}) {
  const competencia = competencias.find((item) => item.codigo === code)!;
  return (
    <span
      className="rounded-[3px] bg-no-repeat px-0.5"
      style={{
        backgroundImage: `linear-gradient(${competencia.hex}33, ${competencia.hex}33)`,
        backgroundSize: `${progress * 100}% 100%`,
      }}
    >
      {children}
    </span>
  );
}
