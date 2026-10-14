import { Link } from 'react-router-dom';
import { KellyLogo } from '@/components/brand/KellyLogo';

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
        aria-label="Kelly Academy — início"
        className="focus-ring rounded-inner inline-flex self-start"
      >
        <KellyLogo size={24} />
      </a>

      <nav
        aria-label="Rodapé"
        className="text-text-2 flex flex-wrap gap-x-5 gap-y-1 text-[15px]"
      >
        {LINKS.map(([label, href]) => (
          <a
            key={href}
            href={href}
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
      </nav>

      <p className="text-text-3 font-mono text-[11.5px] leading-[1.6]">
        © 2026 Kelly Academy · feito pela CiudadLab
        <br />
        não é afiliado ao INEP
      </p>
    </footer>
  );
}
