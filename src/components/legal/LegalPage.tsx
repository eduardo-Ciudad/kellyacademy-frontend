import { format, parseISO } from 'date-fns';
import type { ReactNode } from 'react';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { KellyLogo } from '@/components/brand/KellyLogo';
import type { LegalDoc } from '@/content/legal/types';
import { openCookiePreferences } from '@/lib/consent';
import { CONTACT_EMAIL, splitEmailLinks } from '@/lib/splitEmailLinks';

type LegalPageProps = {
  doc: LegalDoc;
  relatedDocuments: {
    label: string;
    to: string;
  }[];
  sectionActions?: Record<string, ReactNode>;
};

function LinkedText({ children }: { children: string }) {
  return splitEmailLinks(children).map((part, index) =>
    part.type === 'email' ? (
      <a
        key={`${part.value}-${index}`}
        href={`mailto:${part.value}`}
        className="focus-ring text-accent-text hover:text-accent-text-hover rounded-sm underline decoration-current/40 underline-offset-4 transition-colors"
      >
        {part.value}
      </a>
    ) : (
      part.value
    ),
  );
}

export function LegalPage({
  doc,
  relatedDocuments,
  sectionActions,
}: LegalPageProps) {
  const formattedDate = format(
    parseISO(doc.updatedAt),
    "d 'de' MMMM 'de' yyyy",
    {
      locale: ptBR,
    },
  );
  return (
    <div className="bg-bg text-text min-h-screen">
      <header className="border-border-subtle border-b">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 sm:h-[72px] sm:px-5">
          <Link
            to="/"
            aria-label="Kelly Academy — início"
            className="focus-ring rounded-inner inline-flex"
          >
            <KellyLogo size={26} />
          </Link>
          <Link
            to="/"
            className="focus-ring text-text-2 hover:text-text rounded-sm text-sm transition-colors"
          >
            Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 pt-14 pb-20 sm:px-5 sm:pt-20 sm:pb-28">
        <div className="border-border-subtle border-b pb-10 sm:pb-12">
          <p className="text-accent-text mb-4 font-mono text-xs tracking-[0.12em] uppercase">
            Documento legal
          </p>
          <h1 className="text-text text-[clamp(2.4rem,7vw,4.25rem)] leading-[1.02] font-light tracking-[-0.04em]">
            {doc.title}
          </h1>
          <p className="text-text-3 mt-5 text-sm">
            Última atualização: {formattedDate}
          </p>
          {doc.intro ? (
            <p className="text-text-2 mt-8 text-lg leading-8">
              <LinkedText>{doc.intro}</LinkedText>
            </p>
          ) : null}
        </div>

        <nav
          aria-labelledby="legal-summary-title"
          className="border-border-subtle border-b py-9 sm:py-10"
        >
          <h2
            id="legal-summary-title"
            className="text-text text-lg font-semibold tracking-[-0.01em]"
          >
            Neste documento
          </h2>
          <ol className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {doc.sections.map((section, index) => (
              <li key={section.id} className="flex gap-3 text-sm leading-6">
                <span className="text-text-3 tabular font-mono text-xs leading-6">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <a
                  href={`#${section.id}`}
                  className="focus-ring text-text-2 hover:text-accent-text rounded-sm transition-colors"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="divide-border-subtle divide-y">
          {doc.sections.map((section, index) => (
            <section key={section.id} className="py-10 sm:py-12">
              <div className="flex gap-4 sm:gap-6">
                <span
                  aria-hidden="true"
                  className="text-text-3 tabular mt-1 shrink-0 font-mono text-xs"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <h2
                    id={section.id}
                    className="text-text scroll-mt-6 text-2xl leading-tight font-semibold tracking-[-0.025em] sm:text-[1.75rem]"
                  >
                    {section.title}
                  </h2>
                  <div className="text-text-2 mt-5 space-y-4 text-base leading-7">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>
                        <LinkedText>{paragraph}</LinkedText>
                      </p>
                    ))}
                    {section.items ? (
                      <ul className="marker:text-accent-text list-disc space-y-3 pl-5">
                        {section.items.map((item) => (
                          <li key={item} className="pl-1">
                            <LinkedText>{item}</LinkedText>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {section.closing?.map((paragraph) => (
                      <p key={paragraph}>
                        <LinkedText>{paragraph}</LinkedText>
                      </p>
                    ))}
                    {sectionActions?.[section.id]}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-border-subtle border-t">
        <div className="text-text-3 mx-auto flex max-w-[760px] flex-col gap-5 px-4 py-8 text-sm leading-6 sm:px-5">
          <nav
            aria-label="Documentos legais"
            className="flex flex-wrap gap-x-5 gap-y-3"
          >
            {relatedDocuments.map((related) => (
              <Link
                key={related.to}
                to={related.to}
                className="focus-ring text-text-2 hover:text-accent-text rounded-sm transition-colors"
              >
                {related.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={openCookiePreferences}
              className="focus-ring text-text-2 hover:text-accent-text rounded-sm text-left transition-colors"
            >
              Preferências de cookies
            </button>
          </nav>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="focus-ring hover:text-text-2 rounded-sm transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </footer>
    </div>
  );
}
