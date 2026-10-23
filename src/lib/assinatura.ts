import { api } from '@/lib/api';
import type { Ciclo } from '@/components/landing/data/planos';

export type CicloCheckout = 'MENSAL' | 'ANUAL';
export type AcaoBotaoPro = 'em-breve' | '/criar-conta?plano=pro' | '/planos';

export const pagamentoHabilitado =
  import.meta.env.VITE_PAGAMENTO_HABILITADO === 'true';

export function acaoBotaoPro({
  pagamentoHabilitado,
  logado,
}: {
  pagamentoHabilitado: boolean;
  logado: boolean;
}): AcaoBotaoPro {
  if (!pagamentoHabilitado) return 'em-breve';
  return logado ? '/planos' : '/criar-conta?plano=pro';
}

export function cicloParaCheckout(ciclo: Ciclo): CicloCheckout {
  return ciclo === 'mensal' ? 'MENSAL' : 'ANUAL';
}

export function iniciarCheckout(ciclo: CicloCheckout) {
  return api<{ url: string }>('/assinaturas/checkout', {
    method: 'POST',
    body: JSON.stringify({ ciclo }),
  });
}
