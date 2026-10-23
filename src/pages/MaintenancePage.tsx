import { KellyLogo } from '@/components/brand/KellyLogo';
import { usePageMeta } from '@/lib/usePageMeta';

export function MaintenancePage() {
  usePageMeta({ title: 'Em manutenção | Kelly Academy', noindex: true });

  return (
    <main className="bg-bg text-text relative grid min-h-dvh w-full place-items-center overflow-x-hidden px-5 py-10 font-sans sm:px-8">
      <div
        aria-hidden="true"
        className="bg-accent/60 pointer-events-none absolute inset-x-0 top-0 h-px"
      />

      <section className="relative flex w-full max-w-xl flex-col items-center text-center">
        <KellyLogo className="mb-14 sm:mb-16" size={34} />

        <div className="bg-accent mb-7 h-px w-10" aria-hidden="true" />
        <h1 className="font-display text-[clamp(2.75rem,10vw,4.5rem)] leading-[0.98] font-light tracking-[-0.045em] text-balance">
          Servidor em manutenção
        </h1>

        <div className="text-text-2 mt-8 space-y-3 text-[1.0625rem] leading-relaxed sm:text-lg">
          <p>Por favor, volte mais tarde.</p>
          <p>Para mais informações, entre em contato:</p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            className="rounded-input bg-accent hover:bg-accent-hover focus-visible:outline-accent px-6 py-3 font-semibold text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 active:translate-y-px"
            href="https://wa.me/5517991009238"
            target="_blank"
            rel="noopener noreferrer"
          >
            (17) 99100-9238
          </a>
          <a
            className="text-text-3 decoration-control hover:text-accent-text focus-visible:outline-accent text-sm underline underline-offset-4 transition-colors duration-200 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
            href="tel:+5517991009238"
          >
            Ligar para o número
          </a>
        </div>
      </section>
    </main>
  );
}
