import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';

const faqs = [
  {
    question: 'A correção substitui um professor?',
    answer:
      'Não. A Kelly é um treino: ela te dá retorno imediato e consistente entre uma redação e outra. A correção é uma estimativa feita por IA e pode diferir da nota de um corretor humano.',
  },
  {
    question: 'Como a nota é calculada?',
    answer:
      'Seguindo as cinco competências do ENEM, cada uma de 0 a 200 pontos. A nota final é a soma das cinco, e cada ponto perdido vem com o trecho e a explicação.',
  },
  {
    question: 'Posso enviar uma redação escrita à mão?',
    answer:
      'Sim. Tire uma foto da folha e a Kelly transcreve o texto. Você revisa a transcrição antes de mandar para a correção.',
  },
  {
    question: 'Quantas correções posso fazer por dia?',
    answer:
      'No plano grátis, 3 correções por dia. O plano Pro, com mais correções, chega em breve.',
  },
] as const;

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="scroll-mt-20 px-5 pt-[120px] pb-10 sm:px-6">
      <div className="mx-auto max-w-[820px]">
        <SectionHeader
          title="Dúvidas frequentes"
          align="center"
          className="mb-9"
        />
        <div className="flex flex-col gap-2.5">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            const contentId = `faq-content-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div
                key={faq.question}
                className="border-border-subtle bg-surface overflow-hidden rounded-[16px] border"
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={contentId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="focus-ring text-text text-body flex min-h-[60px] w-full items-center justify-between gap-4 rounded-[16px] px-[22px] py-[18px] text-left font-semibold"
                >
                  {faq.question}
                  <motion.span
                    aria-hidden="true"
                    className="text-accent-text text-h3 shrink-0 leading-none"
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
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
                    duration: reduceMotion ? 0 : 0.3,
                    ease: 'easeOut',
                  }}
                  className="overflow-hidden"
                >
                  <p className="text-text-2 text-body px-[22px] pb-5">
                    {faq.answer}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
