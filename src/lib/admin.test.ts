import { describe, expect, it } from 'vitest';
import {
  competenciaMaisFraca,
  corAlertaStripe,
  focoDaSerie,
  periodoAdminFromSearch,
  percentualSeguro,
  rotuloFaixa,
  erroConcessao,
  fimConcessao,
  mensagemReenvio429,
  proPelaAssinatura,
  traduzirStatusAssinatura,
} from '@/lib/admin';

describe('helpers do painel admin', () => {
  it('aceita apenas os periodos administrativos validos', () => {
    expect(periodoAdminFromSearch('7')).toBe(7);
    expect(periodoAdminFromSearch('90')).toBe(90);
    expect(periodoAdminFromSearch('invalido')).toBe(30);
    expect(periodoAdminFromSearch(null)).toBe(30);
  });

  it('calcula percentual sem dividir por zero', () => {
    expect(percentualSeguro(25, 200)).toBe(12.5);
    expect(percentualSeguro(10, 0)).toBe(0);
  });

  it('usa o ultimo dia como foco padrao e respeita um indice valido', () => {
    const serie = [
      { data: '2026-10-25', cadastros: 2, correcoes: 5 },
      { data: '2026-10-26', cadastros: 3, correcoes: 7 },
    ];
    expect(focoDaSerie(serie)?.data).toBe('2026-10-26');
    expect(focoDaSerie(serie, 0)?.data).toBe('2026-10-25');
  });

  it('formata a faixa de notas com traco en', () => {
    expect(rotuloFaixa({ min: 400, max: 599 })).toBe('400\u2013599');
  });

  it('ignora medias nulas ao encontrar a competencia mais fraca', () => {
    expect(
      competenciaMaisFraca([
        { competencia: 1, media: 160 },
        { competencia: 2, media: null },
        { competencia: 3, media: 120 },
      ]),
    ).toEqual({ competencia: 3, media: 120 });
  });

  it('considera o Stripe saudavel somente nas ultimas 24 horas', () => {
    const agora = new Date('2026-10-26T15:00:00Z');
    expect(corAlertaStripe('2026-10-25T16:00:00Z', agora)).toBe('success');
    expect(corAlertaStripe('2026-10-25T14:00:00Z', agora)).toBe('warning');
    expect(corAlertaStripe(null, agora)).toBe('warning');
  });

  it('traduz os status de assinatura', () => {
    expect(traduzirStatusAssinatura('ACTIVE')).toBe('Ativa');
    expect(traduzirStatusAssinatura('PAST_DUE')).toBe('Pagamento atrasado');
    expect(traduzirStatusAssinatura('PAUSED')).toBe('Pausada');
  });

  it('calcula o fim da concessao no fim do dia de Sao Paulo', () => {
    expect(fimConcessao(7, new Date('2026-10-27T02:00:00Z'))).toBe(
      '2026-11-02T23:59:59-03:00',
    );
  });

  it('valida dias e motivo da concessao', () => {
    expect(erroConcessao(0, 'motivo válido')).toContain('1 e 365');
    expect(erroConcessao(366, 'motivo válido')).toContain('1 e 365');
    expect(erroConcessao(30, 'abcd')).toContain('5 e 300');
    expect(erroConcessao(30, 'Apoio para o simulado')).toBeNull();
  });

  it('arredonda o retry-after para cima em minutos', () => {
    expect(mensagemReenvio429(61)).toContain('2 min');
  });

  it('identifica Pro por assinatura ativa e ainda válida', () => {
    const agora = new Date('2026-10-27T12:00:00Z');
    expect(
      proPelaAssinatura(
        { status: 'ACTIVE', periodoAtualFim: '2026-10-28T12:00:00Z' },
        agora,
      ),
    ).toBe(true);
    expect(
      proPelaAssinatura(
        { status: 'CANCELED', periodoAtualFim: '2026-10-28T12:00:00Z' },
        agora,
      ),
    ).toBe(false);
  });
});
