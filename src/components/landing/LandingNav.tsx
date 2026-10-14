import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';
import { Link } from 'react-router-dom';
import { KellyLogo } from '@/components/brand/KellyLogo';
import { DUR, EASE_OUT } from '@/components/landing/fx/motion';

const navLinks = [
  ['Repertório', '#repertorio'],
  ['Como funciona', '#como-funciona'],
  ['Recursos', '#recursos'],
  ['Competências', '#competencias'],
  ['Planos', '#planos'],
  ['Dúvidas', '#faq'],
] as const;

export function LandingNav() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(Boolean(reduceMotion));
  const scrolledRef = useRef(Boolean(reduceMotion));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const visibleSections = useRef(new Set<string>());

  useEffect(() => {
    const nextScrolled = reduceMotion ? true : scrollY.get() > 8;
    scrolledRef.current = nextScrolled;
    setScrolled(nextScrolled);
  }, [reduceMotion, scrollY]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (reduceMotion) return;
    const nextScrolled = latest > 8;
    if (scrolledRef.current === nextScrolled) return;
    scrolledRef.current = nextScrolled;
    setScrolled(nextScrolled);
  });

  useEffect(() => {
    const sections = navLinks
      .map(([, href]) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            visibleSections.current.add(entry.target.id);
          else visibleSections.current.delete(entry.target.id);
        });

        const active = sections.find((section) =>
          visibleSections.current.has(section.id),
        );
        setActiveSection(active?.id ?? null);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`${
        scrolled
          ? 'border-border-subtle bg-bg/80 border-b backdrop-blur-md'
          : 'border-transparent bg-transparent'
      } sticky top-0 z-20 transition-[background-color,border-color,backdrop-filter] ${reduceMotion ? 'duration-0' : 'duration-200'}`}
    >
      <nav
        aria-label="Principal"
        className="desk:min-h-[72px] desk:px-6 mx-auto flex min-h-[60px] max-w-[1200px] items-center justify-between gap-4 px-4"
      >
        <a
          href="#topo"
          aria-label="Kelly Academy — início"
          className="focus-ring rounded-inner shrink-0"
        >
          <KellyLogo size={26} className="desk:hidden" />
          <KellyLogo size={30} className="hidden desk:inline-flex" />
        </a>

        <div className="desk:flex hidden items-center gap-1">
          {navLinks.map(([label, href]) => {
            const active = activeSection === href.slice(1);

            return (
              <a
                key={href}
                href={href}
                onClick={() => setActiveSection(href.slice(1))}
                className={`${active ? 'text-text' : 'text-text-2 hover:text-text'} focus-ring relative isolate rounded-md px-3 py-2 text-sm font-medium transition-colors motion-reduce:transition-none`}
              >
                {active ? (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden="true"
                    className="bg-surface-2 absolute inset-0 -z-10 rounded-md"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: DUR.base, ease: EASE_OUT }
                    }
                  />
                ) : null}
                {label}
              </a>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            to="/entrar"
            className="focus-ring text-text hover:text-text desk:text-text-2 desk:text-sm inline-flex min-h-11 items-center rounded-md px-1 text-[15px] font-semibold transition-colors motion-reduce:transition-none"
          >
            Entrar
          </Link>
          <Link
            to="/criar-conta"
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill desk:inline-flex hidden min-h-11 items-center px-5 text-sm font-semibold text-white transition-colors motion-reduce:transition-none"
          >
            Começar grátis
          </Link>
        </div>
      </nav>
    </header>
  );
}
