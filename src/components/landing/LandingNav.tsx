import { Link } from 'react-router-dom';
import logo from '@/assets/kelly-logo-escuro.svg';

const navLinks = [
  ['Repertório', '#repertorio'],
  ['Como funciona', '#como-funciona'],
  ['Recursos', '#recursos'],
  ['Competências', '#competencias'],
  ['Planos', '#planos'],
  ['Dúvidas', '#faq'],
] as const;

export function LandingNav() {
  return (
    <header className="border-border-subtle bg-bg/80 sticky top-0 z-20 border-b backdrop-blur-md">
      <nav
        aria-label="Principal"
        className="mx-auto flex min-h-[72px] max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-6"
      >
        <a
          href="#topo"
          aria-label="Kelly Academy — início"
          className="focus-ring rounded-inner shrink-0"
        >
          <img src={logo} alt="Kelly Academy" className="h-10 w-auto" />
        </a>

        <div className="desk:flex hidden items-center gap-7">
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="focus-ring text-text-2 hover:text-text rounded-md text-sm font-medium transition-colors motion-reduce:transition-none"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            to="/entrar"
            className="focus-ring text-text-2 hover:text-text hidden rounded-md px-1 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none sm:inline-flex"
          >
            Entrar
          </Link>
          <Link
            to="/criar-conta"
            className="focus-ring bg-accent hover:bg-accent-hover rounded-pill inline-flex min-h-11 items-center px-4 text-sm font-semibold text-white transition-colors motion-reduce:transition-none sm:px-5"
          >
            Começar grátis
          </Link>
        </div>
      </nav>
    </header>
  );
}
