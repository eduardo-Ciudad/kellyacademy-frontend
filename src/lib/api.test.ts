import { describe, expect, it } from 'vitest';
import { JULIA_TIMEOUT_MS, timeoutPara } from '@/lib/api';

describe('timeoutPara', () => {
  it('usa 75 segundos no envio da Júlia', () => {
    expect(timeoutPara('POST', '/redacoes/abc/julia/mensagens')).toBe(
      JULIA_TIMEOUT_MS,
    );
    expect(timeoutPara('post', '/redacoes/abc/julia/mensagens/')).toBe(
      JULIA_TIMEOUT_MS,
    );
  });

  it('preserva os demais timeouts', () => {
    expect(timeoutPara('POST', '/redacoes')).toBe(180_000);
    expect(timeoutPara('POST', '/transcricoes')).toBe(180_000);
    expect(timeoutPara('GET', '/redacoes/abc/julia')).toBe(20_000);
    expect(timeoutPara('POST', '/qualquer')).toBe(20_000);
  });
});
