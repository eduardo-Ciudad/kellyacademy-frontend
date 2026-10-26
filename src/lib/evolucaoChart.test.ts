import { describe, expect, it } from 'vitest';
import {
  rotuloMediaRecente,
  rotuloOrdinal,
  Y_DOMAIN_TOTAL,
  Y_TICKS_TOTAL,
} from '@/lib/evolucaoChart';

describe('configuração do gráfico de evolução', () => {
  it('gera os rótulos do eixo X na ordem das redações', () => {
    expect([0, 1, 2, 3].map(rotuloOrdinal)).toEqual(['1ª', '2ª', '3ª', '4ª']);
  });

  it('mantém o domínio e os ticks da nota total entre 0 e 1000', () => {
    expect(Y_DOMAIN_TOTAL).toEqual([0, 1000]);
    expect(Y_TICKS_TOTAL).toEqual([0, 250, 500, 750, 1000]);
  });

  it('gera o rótulo da média com o valor recebido', () => {
    expect(rotuloMediaRecente(587)).toBe('média das últimas 3 · 587');
  });
});
