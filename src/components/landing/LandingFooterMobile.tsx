import { Link } from 'react-router-dom';
import { KellyLogo } from '@/components/brand/KellyLogo';
import { scrollToLandingAnchor } from '@/components/landing/scrollToLandingAnchor';
import { openCookiePreferences } from '@/lib/consent';

const LINKS = [
  ['Recursos', '#recursos'],
  ['Planos', '#planos'],
  ['Competências', '#competencias'],
] as const;

export function LandingFooterMobile() {
  return (
    <footer className="border-border-subtle mt-12 flex flex-col gap-[22px] border-t px-4 pt-7 pb-8">
      <a
        href="#topo"
        onClick={(event) => scrollToLandingAnchor(event, '#topo')}
        aria-label="Kelly Academy — início"
        className="focus-ring rounded-inner inline-flex self-start"
      >
        <KellyLogo size={24} />
      </a>

      <nav
        aria-label="Rodapé"
        className="text-text-2 flex flex-col gap-4 text-[15px]"
      >
        <div>
          <p className="text-text mb-1 text-xs font-semibold tracking-[0.08em] uppercase">
            Produto
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={(event) => scrollToLandingAnchor(event, href)}
                className="focus-ring hover:text-text flex min-h-11 items-center rounded-sm transition-colors motion-reduce:transition-none"
              >
                {label}
              </a>
            ))}
            <Link
              to="/entrar"
              className="focus-ring hover:text-text flex min-h-11 items-center rounded-sm transition-colors motion-reduce:transition-none"
            >
              Entrar
            </Link>
          </div>
        </div>
        <div>
          <p className="text-text mb-1 text-xs font-semibold tracking-[0.08em] uppercase">
            Legal
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link
              to="/privacidade"
              className="focus-ring hover:text-text flex min-h-11 items-center rounded-sm transition-colors motion-reduce:transition-none"
            >
              Privacidade
            </Link>
            <Link
              to="/termos"
              className="focus-ring hover:text-text flex min-h-11 items-center rounded-sm transition-colors motion-reduce:transition-none"
            >
              Termos
            </Link>
            <Link
              to="/cookies"
              className="focus-ring hover:text-text flex min-h-11 items-center rounded-sm transition-colors motion-reduce:transition-none"
            >
              Cookies
            </Link>
            <button
              type="button"
              onClick={openCookiePreferences}
              className="focus-ring hover:text-text flex min-h-11 items-center rounded-sm text-left transition-colors motion-reduce:transition-none"
            >
              Preferências de cookies
            </button>
          </div>
        </div>
      </nav>

      <p className="text-text-3 font-mono text-[11.5px] leading-[1.6]">
        © 2026 Kelly Academy · feito pela CiudadLab
        <br />
        não é afiliado ao INEP
      </p>
    </footer>
  );
}
