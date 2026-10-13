import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';

type MobileStickyCtaProps = {
  suppressed?: boolean;
};

export function MobileStickyCta({ suppressed = false }: MobileStickyCtaProps) {
  const isMobile = useIsMobileLanding();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const heroButtonVisible = useRef(true);
  const finalCtaReached = useRef(false);

  useEffect(() => {
    if (!isMobile) {
      setVisible(false);
      return;
    }

    const heroButton = document.querySelector('#hero-primary-cta');
    const finalCta = document.querySelector('#comecar');
    if (!heroButton || !finalCta) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroButton)
          heroButtonVisible.current = entry.isIntersecting;
        if (entry.target === finalCta && entry.isIntersecting)
          finalCtaReached.current = true;
      });
      setVisible(!heroButtonVisible.current && !finalCtaReached.current);
    });

    observer.observe(heroButton);
    observer.observe(finalCta);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <AnimatePresence initial={false}>
      {isMobile && visible && !suppressed ? (
        <motion.aside
          aria-label="Começar correção grátis"
          className="border-border-subtle bg-bg/94 fixed right-0 bottom-0 left-0 z-30 flex items-center gap-3 border-t px-4 pt-3 pb-[calc(18px+env(safe-area-inset-bottom))]"
          initial={reduceMotion ? false : { y: '100%' }}
          animate={{ y: 0 }}
          exit={reduceMotion ? { y: 0 } : { y: '100%' }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <div className="min-w-0 flex-1">
            <p className="text-text text-small font-semibold">
              Corrija grátis hoje
            </p>
            <p className="text-text-3 mt-0.5 font-mono text-[11.5px]">
              3 por dia · sem cartão
            </p>
          </div>
          <Link
            to="/criar-conta"
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill inline-flex h-12 shrink-0 items-center px-5 text-[15px] font-semibold text-white transition-colors motion-reduce:transition-none"
          >
            Começar
          </Link>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
