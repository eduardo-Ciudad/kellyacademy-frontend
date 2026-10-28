import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, X } from 'lucide-react';
import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import logo from '@/assets/brand/kelly-marca-mono-branca.svg';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { posicionarPopover } from './posicionarPopover';
import { tours, type TourStep } from './tourSteps';
import { useTour } from './TourProvider';

type TargetRect = { top: number; left: number; width: number; height: number };

function getTarget(target: string) {
  const matches = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-tour="${target}"]`),
  );
  return (
    matches.find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }) ??
    matches[0] ??
    null
  );
}

function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  primaryRef: RefObject<HTMLButtonElement | null>,
  onEscape: () => void,
) {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    window.setTimeout(() => primaryRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus.current?.focus();
    };
  }, [active, containerRef, onEscape, primaryRef]);
}

export function TourOverlay() {
  const tour = useTour();
  const {
    screen,
    tourId,
    stepIndex,
    openTour,
    begin,
    setStepIndex,
    finish,
    closeToast,
  } = tour;
  const mobile = useMediaQuery('(max-width: 63.999rem)');
  const activeSteps = tours[tourId];
  const [availableSteps, setAvailableSteps] = useState<TourStep[]>(activeSteps);
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [popoverSize, setPopoverSize] = useState({ width: 380, height: 310 });
  const [toastPaused, setToastPaused] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  const skip = useCallback(() => finish(), [finish]);
  useFocusTrap(
    screen === 'welcome' || screen === 'steps',
    dialogRef,
    primaryRef,
    skip,
  );

  useLayoutEffect(() => {
    if (screen !== 'steps') return;
    const filtered = activeSteps.filter((step) => getTarget(step.target));
    setAvailableSteps(filtered);
    if (stepIndex >= filtered.length) setStepIndex(0);
  }, [activeSteps, screen, setStepIndex, stepIndex]);

  const step = availableSteps[stepIndex];
  useLayoutEffect(() => {
    if (screen !== 'steps' || !step) return;
    const measure = () => {
      const next = dialogRef.current?.getBoundingClientRect();
      if (!next?.width || !next.height) return;
      setPopoverSize((current) =>
        current.width === next.width && current.height === next.height
          ? current
          : { width: next.width, height: next.height },
      );
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [mobile, screen, step]);

  useLayoutEffect(() => {
    if (screen !== 'steps' || !step) return;
    const measure = () => {
      const element = getTarget(step.target);
      if (!element) return;
      const next = element.getBoundingClientRect();
      setRect({
        top: next.top - 6,
        left: next.left - 6,
        width: next.width + 12,
        height: next.height + 12,
      });
    };
    const element = getTarget(step.target);
    element?.scrollIntoView({ block: 'center', behavior: 'auto' });
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [screen, step]);

  const next = useCallback(() => {
    if (stepIndex >= availableSteps.length - 1) finish();
    else setStepIndex(stepIndex + 1);
  }, [availableSteps.length, finish, setStepIndex, stepIndex]);

  useEffect(() => {
    if (screen !== 'steps') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft' && stepIndex > 0)
        setStepIndex(stepIndex - 1);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [next, screen, setStepIndex, stepIndex]);

  useEffect(() => {
    if (screen !== 'toast' || toastPaused) return;
    const timeout = window.setTimeout(closeToast, 8000);
    return () => window.clearTimeout(timeout);
  }, [closeToast, screen, toastPaused]);

  const popoverPosition = useMemo(() => {
    if (!rect || !step) return null;
    const ancoradoNaBarraInferior = [
      'temas',
      'nova-redacao',
      'repertorio',
      'evolucao',
    ].includes(step.target);
    return posicionarPopover({
      alvo: rect,
      viewport: { largura: window.innerWidth, altura: window.innerHeight },
      popover: {
        largura: mobile ? window.innerWidth - 32 : popoverSize.width,
        altura: popoverSize.height,
      },
      mobile,
      ancoradoNaBarraInferior,
    });
  }, [mobile, popoverSize.height, popoverSize.width, rect, step]);

  const popoverStyle = useMemo<CSSProperties>(
    () =>
      popoverPosition
        ? {
            top: popoverPosition.top,
            left: popoverPosition.left,
            bottom: popoverPosition.bottom,
          }
        : {},
    [popoverPosition],
  );

  const arrowStyle = useMemo<CSSProperties>(() => {
    if (!popoverPosition) return {};
    const offset = popoverPosition.setaOffset - 6;
    return popoverPosition.lado === 'direita' ||
      popoverPosition.lado === 'esquerda'
      ? { top: offset }
      : { left: offset };
  }, [popoverPosition]);

  const arrowClass =
    popoverPosition?.lado === 'esquerda'
      ? '-right-[7px] border-t border-r'
      : popoverPosition?.lado === 'abaixo'
        ? '-top-[7px] border-t border-l'
        : popoverPosition?.lado === 'acima'
          ? '-bottom-[7px] border-r border-b'
          : '-left-[7px] border-b border-l';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {screen === 'welcome' ? (
        <motion.div
          key="welcome-veil"
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[rgba(8,9,10,.74)] lg:items-center lg:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-welcome-title"
            className="w-full rounded-t-[28px] border border-[#3a3b3c] bg-[#242526] px-6 pt-7 pb-[calc(24px+env(safe-area-inset-bottom))] text-center shadow-[0_4px_16px_rgba(0,0,0,.18)] lg:w-[520px] lg:rounded-[28px] lg:p-8"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
          >
            <img
              src={logo}
              alt="Kelly Academy"
              className="mx-auto h-9 w-auto"
            />
            <h2
              id="tour-welcome-title"
              className="font-display mt-7 text-[28px] font-light tracking-[-0.025em] text-white"
            >
              Primeira vez na Kelly Academy?
            </h2>
            <p className="mx-auto mt-3 max-w-[430px] text-[15px] leading-6 text-[#b0b3b8]">
              Em menos de um minuto mostramos onde ficam os temas, como enviar
              sua redação e onde acompanhar sua nota.
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={finish}
                className="focus-ring min-h-11 rounded-full border border-[#4a4b4d] px-5 text-sm font-semibold text-[#e4e6eb]"
              >
                Já conheço, pular
              </button>
              <button
                ref={primaryRef}
                type="button"
                onClick={begin}
                className="focus-ring min-h-11 rounded-full bg-[#0866ff] px-5 text-sm font-semibold text-white"
              >
                Fazer o tour · 1 minuto
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      {screen === 'steps' && step ? (
        <div key="steps" className="pointer-events-none fixed inset-0 z-[100]">
          <div
            data-testid="tour-interaction-blocker"
            aria-hidden="true"
            className="pointer-events-auto fixed inset-0 z-[100]"
          />
          {rect ? (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none fixed z-[101] border-2 border-[#4599ff]"
              animate={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                borderRadius: mobile
                  ? (step.mobileRadius ?? step.radius)
                  : step.radius,
              }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 420, damping: 34 }
              }
              style={{ boxShadow: '0 0 0 4000px rgba(8,9,10,.74)' }}
            />
          ) : null}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.target}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="tour-step-title"
              className="pointer-events-auto fixed z-[102] w-[calc(100%-32px)] rounded-[20px] border border-[#3a3b3c] bg-[#242526] p-[22px] shadow-[0_4px_16px_rgba(0,0,0,.18)] lg:w-[380px]"
              style={popoverStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.16 }}
            >
              <span
                aria-hidden="true"
                className={`absolute size-3 rotate-45 border-[#3a3b3c] bg-[#242526] ${arrowClass}`}
                style={arrowStyle}
              />
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-[#a9abb0]">
                  PASSO {stepIndex + 1} DE {availableSteps.length}
                </span>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {availableSteps.map((item, index) => (
                    <span
                      key={item.target}
                      className={`h-1.5 rounded-full ${index <= stepIndex ? 'bg-[#4599ff]' : 'bg-[#4a4b4d]'} ${index === stepIndex ? 'w-[18px]' : 'w-1.5'}`}
                    />
                  ))}
                </div>
              </div>
              <h2
                id="tour-step-title"
                className="font-display mt-5 text-2xl font-light tracking-[-0.02em] text-white"
              >
                {step.title}
              </h2>
              <p className="mt-2 text-[15px] leading-6 text-[#b0b3b8]">
                {mobile && step.text.mobile
                  ? step.text.mobile
                  : step.text.desktop}
              </p>
              <div className="mt-6 flex min-h-11 items-center gap-2">
                <button
                  type="button"
                  onClick={finish}
                  className="focus-ring mr-auto min-h-11 px-1 text-sm font-medium text-[#b0b3b8]"
                >
                  Pular tour
                </button>
                {stepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStepIndex(stepIndex - 1)}
                    className="focus-ring min-h-11 rounded-full border border-[#4a4b4d] px-4 text-sm font-semibold text-white"
                  >
                    Voltar
                  </button>
                ) : null}
                <button
                  ref={primaryRef}
                  type="button"
                  onClick={next}
                  className="focus-ring min-h-11 rounded-full bg-[#0866ff] px-5 text-sm font-semibold text-white"
                >
                  {stepIndex === availableSteps.length - 1
                    ? tourId === 'nova-redacao'
                      ? 'Entendi'
                      : tourId === 'julia'
                        ? 'Concluir'
                        : 'Começar'
                    : 'Próximo'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}

      {screen === 'toast' ? (
        <motion.div
          key="toast"
          role="status"
          onMouseEnter={() => setToastPaused(true)}
          onMouseLeave={() => setToastPaused(false)}
          onFocusCapture={() => setToastPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setToastPaused(false);
          }}
          className="fixed top-4 right-4 left-4 z-[110] flex min-h-[72px] items-center gap-3 rounded-[16px] border border-[#2f4a7a] bg-[#1f2633] p-4 text-[#e4e6eb] shadow-[0_4px_16px_rgba(0,0,0,.18)] lg:left-auto lg:w-[400px]"
          initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0866ff]">
            <Check size={18} aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 text-sm leading-5">
            {tourId === 'julia' ? (
              'Pronto! A Júlia fica no canto da tela sempre que você abrir uma correção.'
            ) : (
              <>
                <span className="lg:hidden">
                  Pronto! Para rever o tour, toque na sua foto no topo.
                </span>
                <span className="hidden lg:inline">
                  Pronto! Para rever o tour, abra o menu da sua conta.
                </span>
              </>
            )}
          </p>
          {tourId === 'principal' ? (
            <button
              type="button"
              onClick={openTour}
              className="focus-ring min-h-11 px-2 text-sm font-semibold text-[#8ab4ff]"
            >
              Rever
            </button>
          ) : null}
          <button
            type="button"
            onClick={closeToast}
            aria-label="Fechar"
            className="focus-ring flex size-11 shrink-0 items-center justify-center rounded-full text-[#b0b3b8]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
