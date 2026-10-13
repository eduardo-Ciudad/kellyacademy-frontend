import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FAQS } from '@/components/landing/data/faqs';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { Reveal } from '@/components/landing/fx/Reveal';

export function FaqMobile() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="scroll-mt-20 px-4 pt-20 pb-4">
      <Reveal>
        <h2 className="text-text text-[28px] leading-[1.1] font-bold tracking-[-0.03em]">
          Dúvidas frequentes
        </h2>
      </Reveal>
      <div className="border-border-subtle mt-[18px] border-t">
        {FAQS.map((faq, index) => {
          const open = openIndex === index;
          const contentId = `faq-mobile-content-${index}`;
          const buttonId = `faq-mobile-button-${index}`;
          return (
            <div key={faq.question} className="border-border-subtle border-b">
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="focus-ring text-text flex min-h-[58px] w-full items-center justify-between gap-3.5 py-3.5 text-left text-[16px] font-semibold"
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
                <p className="text-text-2 mb-4 text-[15px] leading-[1.6]">
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
