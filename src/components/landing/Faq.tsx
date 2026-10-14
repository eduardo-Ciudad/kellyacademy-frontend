import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FAQS } from '@/components/landing/data/faqs';
import { FaqMobile } from '@/components/landing/FaqMobile';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';
import { RevealGroup, RevealItem } from '@/components/landing/fx/Reveal';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';

export function Faq() {
  const isMobile = useIsMobileLanding();

  return isMobile ? <FaqMobile /> : <FaqDesktop />;
}

function FaqDesktop() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="landing-section scroll-mt-20 px-5 sm:px-6">
      <div className="mx-auto max-w-[820px]">
        <SectionHeader
          title="Dúvidas frequentes"
          align="center"
          className="mb-9"
        />
        <RevealGroup className="flex flex-col gap-2.5">
          {FAQS.map((faq, index) => {
            const open = openIndex === index;
            const contentId = `faq-content-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <RevealItem
                key={faq.question}
                className="border-border-subtle bg-surface rounded-inner overflow-hidden border"
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={contentId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="focus-ring text-text text-body rounded-inner flex min-h-[60px] w-full items-center justify-between gap-4 px-[22px] py-[18px] text-left font-semibold"
                >
                  {faq.question}
                  <motion.span
                    aria-hidden="true"
                    className="text-accent-text text-h3 shrink-0 leading-none"
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
                  <p className="text-text-2 text-body px-[22px] pb-5">
                    {faq.answer}
                  </p>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
