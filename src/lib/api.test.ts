import { describe, expect, it } from 'vitest';
import {
  ApiError,
  JULIA_TIMEOUT_MS,
  recursoProDoErro,
  timeoutPara,
} from '@/lib/api';

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

describe('recursoProDoErro', () => {
  it('lê o recurso do 403 de plano Pro', () => {
    const erro = new ApiError({
      code: 'HTTP',
      status: 403,
      detail: '',
      codigo: 'PLANO_PRO_NECESSARIO',
      recurso: 'JULIA',
    });
    expect(recursoProDoErro(erro)).toBe('JULIA');
  });

  it('ignora outros 403 e outros status', () => {
    expect(
      recursoProDoErro(
        new ApiError({
          code: 'HTTP',
          status: 403,
          detail: '',
          codigo: 'EMAIL_NAO_VERIFICADO',
        }),
      ),
    ).toBeNull();
    expect(
      recursoProDoErro(
        new ApiError({
          code: 'HTTP',
          status: 409,
          detail: '',
          codigo: 'PLANO_PRO_NECESSARIO',
          recurso: 'JULIA',
        }),
      ),
    ).toBeNull();
  });
});
