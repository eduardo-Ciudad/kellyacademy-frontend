import { describe, expect, it } from 'vitest';
import { calcularPrecoAnual } from '@/components/landing/data/planos';

describe('preço anual do Pro', () => {
  it('aplica 30% de desconto e calcula o total anual', () => {
    expect(calcularPrecoAnual(30, 0.3)).toEqual({
      mensalComDesconto: 21,
      totalAnual: 252,
    });
  });
});
