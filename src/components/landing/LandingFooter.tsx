import { Link } from 'react-router-dom';
import logo from '@/assets/kelly-logo-escuro.svg';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';
import { LandingFooterMobile } from '@/components/landing/LandingFooterMobile';

const productLinks = [
  ['Recursos', '#recursos'],
  ['Planos', '#planos'],
  ['Competências', '#competencias'],
] as const;

export function LandingFooter() {
  const isMobile = useIsMobileLanding();

  return isMobile ? <LandingFooterMobile /> : <LandingFooterDesktop />;
}

function LandingFooterDesktop() {
  return (
    <footer className="border-border-subtle border-t px-5 pt-14 pb-10 sm:px-6">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-10 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="col-span-2 sm:col-span-1">
          <a
            href="#topo"
            aria-label="Kelly Academy — início"
            className="focus-ring rounded-inner inline-flex"
          >
            <img src={logo} alt="Kelly Academy" className="h-9 w-auto" />
          </a>
          <p className="text-text-3 mt-3.5 max-w-[300px] text-sm leading-6">
            Treino adaptativo para a redação do ENEM.
          </p>
        </div>

        <FooterColumn title="Produto">
          {productLinks.map(([label, href]) => (
            <a key={href} href={href} className="focus-ring rounded-sm">
              {label}
            </a>
          ))}
        </FooterColumn>

        <FooterColumn title="Conta">
          <Link to="/entrar" className="focus-ring rounded-sm">
            Entrar
          </Link>
          <Link to="/criar-conta" className="focus-ring rounded-sm">
            Criar conta
          </Link>
        </FooterColumn>
      </div>

      <p className="text-text-3 mx-auto mt-10 max-w-[1200px] font-mono text-xs leading-5">
        © 2026 Kelly Academy · feito pela CiudadLab · não é afiliado ao INEP
      </p>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-text text-sm font-semibold">{title}</h2>
      <div className="text-text-3 hover:[&_a]:text-text mt-4 flex flex-col items-start gap-3 text-sm [&_a]:transition-colors motion-reduce:[&_a]:transition-none">
        {children}
      </div>
    </div>
  );
}
