import { describe, expect, it } from 'vitest';
import { planoLibera } from '@/hooks/usePlano';
import type { PlanoUsuario, RecursoPro } from '@/types/api';

const recursos: RecursoPro[] = [
  'JULIA',
  'TEMAS_POSSIVEIS',
  'REPERTORIO_COMPLETO',
];

describe('planoLibera', () => {
  it('não libera recursos no Grátis', () => {
    const plano: PlanoUsuario = {
      plano: 'GRATIS',
      limites: { correcoesPorDia: 3, transcricoesPorDia: 2 },
      recursos: [],
      assinatura: null,
    };
    expect(recursos.map((recurso) => planoLibera(plano, recurso))).toEqual([
      false,
      false,
      false,
    ]);
  });

  it('libera os três recursos no Pro', () => {
    const plano: PlanoUsuario = {
      plano: 'PRO',
      limites: { correcoesPorDia: 10, transcricoesPorDia: 10 },
      recursos,
      assinatura: null,
    };
    expect(recursos.map((recurso) => planoLibera(plano, recurso))).toEqual([
      true,
      true,
      true,
    ]);
  });
});
