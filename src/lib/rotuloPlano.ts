import type { PlanoUsuario } from '@/types/api';

const formatadorData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
});

export function rotuloPlano(plano?: PlanoUsuario) {
  if (!plano) return 'Carregando plano…';
  if (plano.plano === 'GRATIS') return 'Plano Grátis';

  if (plano.origem === 'ASSINATURA' && plano.assinatura) {
    return `Plano Pro · ${plano.assinatura.ciclo.toLowerCase()}`;
  }

  if (plano.origem === 'CONCESSAO' && plano.concessao) {
    return `Plano Pro · até ${formatadorData.format(new Date(plano.concessao.fim))}`;
  }

  return 'Plano Pro';
}

export function seloPlano(plano?: PlanoUsuario): 'Pro' | 'Grátis' | null {
  if (!plano) return null;
  return plano.plano === 'PRO' ? 'Pro' : 'Grátis';
}
