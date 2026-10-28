import { describe, expect, it } from 'vitest';
import { rotuloPlano, seloPlano } from '@/lib/rotuloPlano';
import type { PlanoUsuario } from '@/types/api';

const base: PlanoUsuario = {
  plano: 'GRATIS',
  origem: null,
  concessao: null,
  limites: { correcoesPorDia: 3, transcricoesPorDia: 2 },
  recursos: [],
  assinatura: null,
};

describe('rotuloPlano', () => {
  it('indica que o plano está carregando', () => {
    expect(rotuloPlano()).toBe('Carregando plano…');
    expect(seloPlano()).toBeNull();
  });

  it('identifica o plano Grátis', () => {
    expect(rotuloPlano(base)).toBe('Plano Grátis');
    expect(seloPlano(base)).toBe('Grátis');
  });

  it('identifica assinatura Pro mensal', () => {
    const plano: PlanoUsuario = {
      ...base,
      plano: 'PRO',
      origem: 'ASSINATURA',
      assinatura: {
        ciclo: 'MENSAL',
        periodoAtualFim: '2027-01-01T00:00:00Z',
        cancelarNoFimDoPeriodo: false,
      },
    };
    expect(rotuloPlano(plano)).toBe('Plano Pro · mensal');
    expect(seloPlano(plano)).toBe('Pro');
  });

  it('identifica assinatura Pro anual', () => {
    const plano: PlanoUsuario = {
      ...base,
      plano: 'PRO',
      origem: 'ASSINATURA',
      assinatura: {
        ciclo: 'ANUAL',
        periodoAtualFim: '2027-01-01T00:00:00Z',
        cancelarNoFimDoPeriodo: false,
      },
    };
    expect(rotuloPlano(plano)).toBe('Plano Pro · anual');
  });

  it('formata o fim da concessão Pro no fuso de São Paulo', () => {
    const plano: PlanoUsuario = {
      ...base,
      plano: 'PRO',
      origem: 'CONCESSAO',
      concessao: { fim: '2027-01-01T01:00:00Z' },
    };
    expect(rotuloPlano(plano)).toBe('Plano Pro · até 31/12/2026');
  });

  it('usa o rótulo Pro sem detalhes quando a origem não está disponível', () => {
    expect(rotuloPlano({ ...base, plano: 'PRO' })).toBe('Plano Pro');
  });
});
