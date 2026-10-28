import { describe, expect, it } from 'vitest';
import {
  calcularPrecoAnual,
  linhasComparativo,
  planos,
  textosPlanos,
} from '@/components/landing/data/planos';

describe('preço anual do Pro', () => {
  it('aplica 30% de desconto e calcula o total anual', () => {
    expect(calcularPrecoAnual(30, 0.3)).toEqual({
      mensalComDesconto: 21,
      totalAnual: 252,
    });
  });
});

describe('conteúdo dos planos', () => {
  it('mantém as listas de benefícios aprovadas', () => {
    expect(planos.gratis.itens).toEqual([
      '3 correções por dia',
      '2 transcrições de redação por foto por dia',
      'Banco de temas oficiais do ENEM',
      'Repertório essencial: um por problema social',
      'Histórico e evolução por competência',
    ]);
    expect(planos.pro.itens).toEqual([
      'Tudo do plano Grátis',
      '10 correções por dia',
      '10 transcrições por foto por dia',
      'Repertório completo, em todos os eixos',
      'Possíveis temas do ENEM 2026',
      'Assistente Júlia: tire dúvidas sobre cada correção',
    ]);
    expect(textosPlanos.descricao).toBe(
      'Sem cartão para começar. O Pro libera mais correções, o repertório completo e a assistente Júlia.',
    );
  });

  it('não anuncia recursos inexistentes ou correções ilimitadas', () => {
    const itens = [...planos.gratis.itens, ...planos.pro.itens];
    expect(
      itens.some((item) => /ilimitad|Plano de estudo|Comparativo/i.test(item)),
    ).toBe(false);
    expect(
      planos.gratis.itens.some((item) => item.includes('Assistente Júlia')),
    ).toBe(false);
    expect(
      planos.pro.itens.some((item) => item.includes('Assistente Júlia')),
    ).toBe(true);
    expect(planos.pro.itens).toContain('10 correções por dia');
  });

  it('mantém as sete linhas corretas no comparativo', () => {
    expect(linhasComparativo).toEqual([
      { nome: 'Correções por dia', gratis: '3 por dia', pro: '10 por dia' },
      {
        nome: 'Transcrição de redação por foto',
        gratis: '2 por dia',
        pro: '10 por dia',
      },
      { nome: 'Banco de temas oficiais do ENEM', gratis: true, pro: true },
      { nome: 'Possíveis temas do ENEM 2026', gratis: false, pro: true },
      {
        nome: 'Repertório',
        gratis: 'Essencial (1 por problema)',
        pro: 'Completo',
      },
      {
        nome: 'Histórico e evolução por competência',
        gratis: true,
        pro: true,
      },
      { nome: 'Assistente Júlia', gratis: false, pro: true },
    ]);
  });
});
