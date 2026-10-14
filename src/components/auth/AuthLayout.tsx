import type { PropsWithChildren } from 'react';
import { Check } from 'lucide-react';
import { KellyLogo } from '@/components/brand/KellyLogo';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { SparkIcon } from '@/components/ui/SparkIcon';

type AuthLayoutProps = PropsWithChildren<{ variant: 'login' | 'cadastro' }>;

export function AuthLayout({ children, variant }: AuthLayoutProps) {
  return (
    <main className="bg-bg min-h-[100dvh] font-sans lg:flex lg:p-6">
      <section className="flex min-h-[100dvh] flex-col px-6 pt-[calc(56px+env(safe-area-inset-top))] pb-[calc(32px+env(safe-area-inset-bottom))] lg:min-h-[calc(100vh-48px)] lg:w-[500px] lg:shrink-0 lg:px-10 lg:py-4 xl:w-[600px] xl:px-14">
        <Brand />

        <div className="mt-10 lg:hidden">
          <h1 className="text-text text-[30px] leading-[1.15] font-normal tracking-[-0.02em]">
            {variant === 'login'
              ? 'Entenda o que falta para a sua nota subir'
              : 'Crie sua conta'}
          </h1>
          <p className="text-text-2 mt-2 text-[15px] leading-[1.5]">
            {variant === 'login'
              ? 'Correção com IA nas 5 competências do ENEM.'
              : 'Grátis, com 3 correções por dia.'}
          </p>
        </div>

        <div className="flex flex-1 flex-col">{children}</div>

        <p className="text-text-3 hidden text-[13px] lg:block">
          Kelly Academy · treino para a redação do ENEM
        </p>
      </section>

      <aside className="bg-surface hidden min-h-[calc(100vh-48px)] flex-1 flex-col justify-center gap-9 rounded-[28px] p-8 lg:flex xl:p-14">
        {variant === 'login' ? <LoginPanel /> : <CadastroPanel />}
      </aside>
    </main>
  );
}

function Brand() {
  return <KellyLogo size={32} />;
}

function LoginPanel() {
  const competencias = [
    ['C1', 'text-c1', 'bg-c1', 'w-4/5'],
    ['C2', 'text-c2', 'bg-c2', 'w-3/5'],
    ['C3', 'text-c3', 'bg-c3', 'w-2/5'],
    ['C4', 'text-c4', 'bg-c4', 'w-4/5'],
    ['C5', 'text-c5', 'bg-c5', 'w-3/5'],
  ] as const;

  return (
    <>
      <div className="flex max-w-[560px] flex-col gap-3.5">
        <span className="bg-accent-tint text-accent-text-hover rounded-pill flex items-center gap-1.5 self-start px-3 py-1.5 text-[13px] font-semibold">
          <SparkIcon size={14} double={false} /> Correção com IA
        </span>
        <h2 className="text-text text-[40px] leading-[1.15] font-light tracking-[-0.025em]">
          Entenda o que falta para a sua nota subir
        </h2>
        <p className="text-text-2 text-[17px] leading-[1.6]">
          Correção nas 5 competências do ENEM, com um diagnóstico do que treinar
          primeiro.
        </p>
      </div>

      <div className="bg-bg rounded-card flex max-w-[560px] flex-col gap-[18px] p-6">
        <div className="flex items-center gap-5">
          <ScoreRing valor={640} tamanho={92} espessura={8} />
          <div className="grid flex-1 grid-cols-5 gap-2">
            {competencias.map(([label, textColor, barColor, width]) => (
              <div key={label} className="flex flex-col gap-1.5">
                <span className={`text-xs font-semibold ${textColor}`}>
                  {label}
                </span>
                <div className="bg-control h-1 rounded-sm">
                  <div className={`h-1 rounded-sm ${barColor} ${width}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-inner flex gap-3 px-4 py-3.5">
          <SparkIcon
            className="text-accent-text-hover mt-0.5 shrink-0"
            size={18}
            double={false}
          />
          <p className="text-text-body text-sm leading-[1.6]">
            Sua maior fragilidade está na argumentação. Aprofundar um argumento
            com exemplos concretos pode render até 80 pontos.
          </p>
        </div>
      </div>

      <div className="text-text-2 flex gap-7 text-sm">
        <Benefit>Temas oficiais de 2017 a 2024</Benefit>
        <Benefit>3 correções grátis por dia</Benefit>
      </div>
    </>
  );
}

function Benefit({ children }: PropsWithChildren) {
  return (
    <span className="flex items-center gap-2">
      <Check
        className="text-success"
        size={16}
        strokeWidth={2.4}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

function CadastroPanel() {
  const steps = [
    ['Escolha um tema', 'Todos os temas oficiais do ENEM de 2017 a 2024.'],
    ['Escreva sua redação', 'O rascunho fica salvo enquanto você escreve.'],
    [
      'Receba a correção da IA',
      'Nota nas 5 competências e um diagnóstico do que priorizar.',
    ],
  ] as const;

  return (
    <>
      <div className="flex max-w-[560px] flex-col gap-3.5">
        <span className="bg-accent-tint text-accent-text-hover rounded-pill flex items-center gap-1.5 self-start px-3 py-1.5 text-[13px] font-semibold">
          <SparkIcon size={14} double={false} /> Como funciona
        </span>
        <h2 className="text-text text-[40px] leading-[1.15] font-light tracking-[-0.025em]">
          Escreva, receba a correção e saiba o que treinar
        </h2>
      </div>
      <div className="flex max-w-[560px] flex-col gap-3">
        {steps.map(([title, description], index) => (
          <div
            key={title}
            className="bg-bg flex items-start gap-4 rounded-[18px] px-[22px] py-5"
          >
            <span className="bg-accent-tint text-accent-text-hover tabular flex size-9 shrink-0 items-center justify-center rounded-full text-[15px] font-bold">
              {index + 1}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-text text-base font-semibold">{title}</span>
              <span className="text-text-2 text-sm leading-[1.5]">
                {description}
              </span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
