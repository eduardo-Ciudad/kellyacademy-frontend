import { api } from '@/lib/api';
import type { Ciclo } from '@/components/landing/data/planos';

export type CicloCheckout = 'MENSAL' | 'ANUAL';

export function cicloParaCheckout(ciclo: Ciclo): CicloCheckout {
  return ciclo === 'mensal' ? 'MENSAL' : 'ANUAL';
}

export function iniciarCheckout(ciclo: CicloCheckout) {
  return api<{ url: string }>('/assinaturas/checkout', {
    method: 'POST',
    body: JSON.stringify({ ciclo }),
  });
}
