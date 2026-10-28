import { describe, expect, it } from 'vitest';
import type { Tema } from '@/types/api';
import {
  chaveTitulo,
  inserirTemaNoCache,
  normalizarTitulo,
  resolverTemaDigitado,
} from './temaPersonalizado';

const tema: Tema = {
  id: '1',
  titulo: 'Educação e inclusão no Brasil',
  textosMotivadores: null,
  origem: 'PERSONALIZADO',
  ano: null,
};

describe('tema personalizado', () => {
  it('normaliza espaços, quebras e bordas', () => {
    expect(normalizarTitulo('  Um\n\ttema   completo  ')).toBe(
      'Um tema completo',
    );
  });

  it('cria chave sem acentos e sem diferença de maiúsculas', () => {
    expect(chaveTitulo('  EDUCAÇÃO   Pública ')).toBe('educacao publica');
  });

  it.each([
    ['', 'vazio'],
    ['123456789', 'curto'],
    ['1234567890', 'novo'],
    ['a'.repeat(200), 'novo'],
    ['a'.repeat(201), 'longo'],
  ] as const)('resolve limites de %s como %s', (texto, tipo) => {
    expect(resolverTemaDigitado(texto, [])).toMatchObject({ tipo });
  });

  it('encontra tema existente ignorando acentos, caixa e espaços', () => {
    expect(
      resolverTemaDigitado(' EDUCACAO e   INCLUSÃO no brasil ', [tema]),
    ).toEqual({ tipo: 'existente', tema });
  });

  it('devolve título normalizado para tema novo', () => {
    expect(resolverTemaDigitado('  Desafios   sociais no Brasil ', [])).toEqual(
      {
        tipo: 'novo',
        titulo: 'Desafios sociais no Brasil',
      },
    );
  });

  it('insere no início sem duplicar por id', () => {
    const outro = { ...tema, id: '2', titulo: 'Outro tema brasileiro' };
    expect(inserirTemaNoCache([outro, tema], tema)).toEqual([tema, outro]);
    expect(inserirTemaNoCache(undefined, tema)).toEqual([tema]);
  });
});
