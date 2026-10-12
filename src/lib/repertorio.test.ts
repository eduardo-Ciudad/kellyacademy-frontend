import { describe, expect, it } from 'vitest';
import {
  contarFiltrosAtivos,
  dadoAntigo,
  filtrosParaParams,
  lerFiltros,
  seloRisco,
  seloSaturacao,
  type FiltrosRepertorio,
} from '@/lib/repertorio';

describe('lerFiltros', () => {
  it('lê valores válidos', () => {
    expect(
      lerFiltros(
        new URLSearchParams(
          'macroeixo=educacao&problema=abandono-escolar&tipo=PERSON&funcao=EXPLAIN_CAUSE&q= Bourdieu ',
        ),
      ),
    ).toEqual({
      macroeixo: 'educacao',
      problema: 'abandono-escolar',
      tipo: 'PERSON',
      funcao: 'EXPLAIN_CAUSE',
      q: 'Bourdieu',
    });
  });

  it.each([
    ['tipo=FILME', 'tipo'],
    ['funcao=xyz', 'funcao'],
    ['macroeixo=Educação', 'macroeixo'],
    ['problema=saude mental', 'problema'],
  ])('descarta valor inválido: %s', (query, campo) => {
    expect(
      lerFiltros(new URLSearchParams(query))[campo as keyof FiltrosRepertorio],
    ).toBeNull();
  });

  it('limita a busca a 100 caracteres', () => {
    expect(
      lerFiltros(new URLSearchParams({ q: 'a'.repeat(150) })).q,
    ).toHaveLength(100);
  });

  it('transforma busca só com espaços em vazio', () => {
    expect(lerFiltros(new URLSearchParams({ q: '   ' })).q).toBe('');
  });
});

describe('serialização dos filtros', () => {
  const filtros: FiltrosRepertorio = {
    macroeixo: 'educacao',
    problema: null,
    tipo: 'CONCEPT',
    funcao: 'DEFINE_CONCEPT',
    q: '',
  };

  it('omite valores nulos e busca vazia', () => {
    expect(filtrosParaParams(filtros).toString()).toBe(
      'macroeixo=educacao&tipo=CONCEPT&funcao=DEFINE_CONCEPT',
    );
  });

  it('faz ida e volta sem perder valores', () => {
    expect(lerFiltros(filtrosParaParams(filtros))).toEqual(filtros);
  });

  it('não conta a busca como filtro ativo', () => {
    expect(contarFiltrosAtivos({ ...filtros, q: 'teste' })).toBe(3);
  });
});

describe('selos', () => {
  it.each([
    ['HIGH', 'Muito usado'],
    ['MEDIUM', null],
    ['LOW', 'Pouco usado'],
    [null, null],
  ] as const)('saturação %s', (nivel, esperado) => {
    expect(seloSaturacao(nivel)).toBe(esperado);
  });

  it.each([
    ['HIGH', 'Cuidado ao usar'],
    ['MEDIUM', null],
    ['LOW', null],
    [null, null],
  ] as const)('risco %s', (nivel, esperado) => {
    expect(seloRisco(nivel)).toBe(esperado);
  });
});

describe('dadoAntigo', () => {
  it.each([
    [null, false],
    [2026, false],
    [2024, false],
    [2023, true],
  ] as const)('avalia ano %s', (ano, esperado) => {
    expect(dadoAntigo(ano, 2026)).toBe(esperado);
  });
});
