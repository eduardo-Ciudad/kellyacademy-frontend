import { Check, Crown } from 'lucide-react';
import { useState } from 'react';
import { AccountButton } from '@/components/layout/AccountButton';
import {
  PRECO_PRO_ANUAL,
  PRECO_PRO_MENSAL,
  formatarPreco,
  planos,
  textosPlanos,
  type Ciclo,
} from '@/components/landing/data/planos';
import { Button } from '@/components/ui/Button';
import { useIniciarCheckout } from '@/hooks/useIniciarCheckout';
import { cicloParaCheckout, pagamentoHabilitado } from '@/lib/assinatura';
import { usePageMeta } from '@/lib/usePageMeta';

export function Planos() {
  const [ciclo, setCiclo] = useState<Ciclo>('mensal');
  const checkout = useIniciarCheckout();
  const anual = ciclo === 'anual';
  const precoMensal = anual
    ? PRECO_PRO_ANUAL.mensalComDesconto
    : PRECO_PRO_MENSAL;

  usePageMeta({ title: 'Planos — Kelly Academy', noindex: true });

  return (
    <div className="px-5 pt-5 pb-8 lg:px-0 lg:pt-0">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-accent-text text-xs font-bold tracking-[0.12em] uppercase">
            Planos
          </p>
          <h1 className="text-text mt-2 text-[28px] leading-tight font-normal tracking-[-0.025em] lg:text-[36px]">
            Escolha como você quer evoluir
          </h1>
          <p className="text-text-2 mt-2 max-w-2xl text-sm leading-6 lg:text-[15px]">
            {textosPlanos.descricao}
          </p>
        </div>
        <AccountButton className="shrink-0" />
      </header>

      <div
        className="bg-surface border-control mx-auto mt-7 flex w-fit rounded-full border p-1"
        aria-label={textosPlanos.seletor.rotulo}
      >
        {(['mensal', 'anual'] as const).map((opcao) => (
          <button
            key={opcao}
            type="button"
            aria-pressed={ciclo === opcao}
            onClick={() => setCiclo(opcao)}
            className={`focus-ring rounded-pill min-h-10 px-5 text-sm font-semibold transition-colors ${
              ciclo === opcao
                ? 'bg-control text-text'
                : 'text-text-2 hover:text-text'
            }`}
          >
            {opcao === 'mensal'
              ? textosPlanos.seletor.mensal
              : textosPlanos.seletor.anual}
            {opcao === 'anual' ? (
              <span className="bg-success-bg text-success ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold">
                {textosPlanos.seletor.desconto}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-6 grid max-w-[900px] gap-4 lg:grid-cols-2">
        <PlanCard
          name={planos.gratis.nome}
          description={planos.gratis.descricao}
          items={planos.gratis.itens}
        >
          <div className="mt-6">
            <strong className="text-text tabular font-display text-4xl font-semibold">
              {formatarPreco(planos.gratis.preco)}
            </strong>
            <span className="text-text-3 ml-1 text-sm">
              {planos.gratis.sufixo}
            </span>
          </div>
          <div className="bg-control text-text-2 rounded-pill mt-6 flex min-h-11 items-center justify-center text-sm font-semibold">
            Seu plano atual
          </div>
        </PlanCard>

        <PlanCard
          featured
          name={planos.pro.nome}
          description={planos.pro.descricao}
          items={planos.pro.itens}
        >
          <div className="mt-6">
            <div className="flex items-end gap-1">
              <strong className="text-text tabular font-display text-4xl font-semibold">
                {formatarPreco(precoMensal)}
              </strong>
              <span className="text-text-3 pb-1 text-sm">/mês</span>
            </div>
            <p className="text-text-3 mt-1 min-h-5 text-xs">
              {anual
                ? `${formatarPreco(PRECO_PRO_ANUAL.totalAnual)}/ano · ${planos.pro.detalheAnual}`
                : planos.pro.detalheMensal}
            </p>
          </div>

          {!pagamentoHabilitado ? (
            <div className="bg-control text-text-2 rounded-pill mt-6 flex min-h-11 items-center justify-center px-4 text-center text-sm font-semibold">
              Assinatura disponível em breve
            </div>
          ) : checkout.jaAssinante ? (
            <div
              role="status"
              className="bg-success-subtle border-success-subtle-border text-success-subtle-text rounded-inner mt-6 border px-4 py-3 text-center text-sm font-semibold"
            >
              Você já é assinante Pro.
            </div>
          ) : (
            <>
              <Button
                className="mt-6 w-full"
                loading={checkout.isLoading}
                onClick={() => checkout.mutate(cicloParaCheckout(ciclo))}
              >
                <Crown size={17} aria-hidden="true" /> Assinar Pro
              </Button>
              <p className="text-text-3 mt-2.5 text-center text-xs leading-5">
                Pagamento seguro pelo Stripe. Cancele quando quiser.
              </p>
            </>
          )}
        </PlanCard>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  description,
  items,
  featured = false,
  children,
}: {
  name: string;
  description: string;
  items: readonly string[];
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-card shadow-soft border p-6 lg:p-7 ${
        featured
          ? 'bg-surface border-accent-outline'
          : 'bg-surface border-control'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-text text-2xl font-semibold tracking-[-0.02em]">
          {name}
        </h2>
        {featured ? (
          <span className="bg-accent-tint text-accent-text-hover rounded-pill px-3 py-1 text-xs font-bold">
            Mais recursos
          </span>
        ) : null}
      </div>
      <p className="text-text-2 mt-2 min-h-12 text-sm leading-6">
        {description}
      </p>
      {children}
      <ul className="border-control mt-6 space-y-3 border-t pt-6">
        {items.map((item) => (
          <li
            key={item}
            className="text-text-body flex gap-3 text-sm leading-5"
          >
            <Check
              className="text-success mt-0.5 shrink-0"
              size={16}
              strokeWidth={2.5}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
