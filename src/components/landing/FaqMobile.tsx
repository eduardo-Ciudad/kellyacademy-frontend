import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FAQS } from '@/components/landing/data/faqs';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { Reveal } from '@/components/landing/fx/Reveal';

export function FaqMobile() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="landing-section scroll-mt-20 px-4">
      <Reveal>
        <h2 className="font-display text-text text-[36px] leading-[1.08] font-light tracking-[-0.03em] text-balance">
          Dúvidas frequentes
        </h2>
        <p className="text-text-3 mt-4 text-base leading-[1.6]">
          Respostas diretas sobre correção, notas e como começar.
        </p>
      </Reveal>
      <div className="border-surface-2 mt-8 border-t">
        {FAQS.map((faq, index) => {
          const open = openIndex === index;
          const contentId = `faq-mobile-content-${index}`;
          const buttonId = `faq-mobile-button-${index}`;
          return (
            <div key={faq.question} className="border-surface-2 border-b">
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="focus-ring text-text flex min-h-[64px] w-full items-center justify-between gap-3.5 py-4 text-left text-base font-medium"
              >
                <span>{faq.question}</span>
                <motion.span
                  aria-hidden="true"
                  className="text-accent-text shrink-0 text-[24px] leading-none"
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : DUR.fast }}
                >
                  +
                </motion.span>
              </button>
              <motion.div
                id={contentId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!open}
                initial={false}
                animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                transition={{
                  duration: reduceMotion ? 0 : DUR.base,
                  ease: EASE_OUT,
                }}
                className="overflow-hidden"
              >
                <p className="text-text-3 mb-5 text-[15px] leading-[1.6]">
                  {faq.answer}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
