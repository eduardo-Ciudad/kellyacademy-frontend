import type { PropsWithChildren } from 'react';
import { KellyLogo } from '@/components/brand/KellyLogo';
import { HeroShaderBg } from '@/components/landing/fx/HeroShaderBg';

type AuthLayoutProps = PropsWithChildren<{
  variant: 'login' | 'cadastro';
  showMobileIntro?: boolean;
}>;

const mobileIntro = {
  login: {
    title: 'Entenda o que falta para a sua nota subir',
    description: 'Correção com IA nas 5 competências do ENEM.',
  },
  cadastro: {
    title: 'Crie sua conta',
    description: 'Grátis, com 3 correções por dia.',
  },
} as const;

export function AuthLayout({
  children,
  variant,
  showMobileIntro = true,
}: AuthLayoutProps) {
  const intro = mobileIntro[variant];

  return (
    <main className="bg-bg relative min-h-[100dvh] font-sans lg:flex lg:items-stretch lg:gap-6 lg:bg-[#04051a] lg:p-6">
      <div className="hidden lg:block">
        <HeroShaderBg variant="auth" />
      </div>

      <section className="relative hidden min-h-[calc(100dvh-48px)] flex-1 basis-[560px] flex-col justify-between gap-12 px-10 py-8 lg:flex">
        <KellyLogo size={32} />
        <div className="flex max-w-[600px] flex-col gap-6">
          <span className="font-mono text-xs tracking-[0.16em] text-white/[0.62]">
            CORREÇÃO DE REDAÇÃO DO ENEM
          </span>
          <p className="font-display text-[clamp(52px,4.45vw,64px)] leading-none font-light tracking-[-0.04em] text-white">
            Descubra onde sua redação perde pontos.
          </p>
          <p className="max-w-[520px] text-lg leading-[1.55] text-white/80">
            Correção competência por competência, com o trecho exato que segurou
            sua nota e o que treinar a seguir.
          </p>
        </div>
        <span className="font-mono text-xs text-white/[0.62]">
          3 correções grátis por dia · sem cartão
        </span>
      </section>

      <section className="lg:bg-bg relative flex min-h-[100dvh] flex-col px-6 pt-[calc(56px+env(safe-area-inset-top))] pb-[calc(32px+env(safe-area-inset-bottom))] lg:min-h-[calc(100dvh-48px)] lg:w-[560px] lg:shrink-0 lg:items-center lg:justify-center lg:self-stretch lg:rounded-[28px] lg:border lg:border-white/8 lg:p-12">
        <div className="lg:hidden">
          <KellyLogo size={32} />
        </div>
        <div className={showMobileIntro ? 'mt-10 lg:hidden' : 'hidden'}>
          <p className="font-display text-text text-[30px] leading-[1.15] font-normal tracking-[-0.02em]">
            {intro.title}
          </p>
          <p className="text-text-2 mt-2 text-[15px] leading-[1.5]">
            {intro.description}
          </p>
        </div>
        <div className="flex flex-1 flex-col lg:w-full lg:max-w-[420px] lg:flex-none">
          {children}
        </div>
      </section>
    </main>
  );
}
