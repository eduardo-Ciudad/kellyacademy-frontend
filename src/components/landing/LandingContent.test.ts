import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  REPERTORIO_STATS,
  TOTAL_REPERTORIOS,
} from '@/components/landing/data/repertorioDestaque';

const visibleLandingFiles = [
  'HeroMock.tsx',
  'Recursos.tsx',
  'RecursosMobile.tsx',
  'RedacaoScroll.tsx',
  'Planos.tsx',
  'PlanosMobile.tsx',
] as const;

describe('conteúdo público da landing', () => {
  it('usa o contador fixo seguro quando o endpoint exige login', () => {
    expect(TOTAL_REPERTORIOS).toBe('mais de 100');
    expect(REPERTORIO_STATS[0]).toEqual({
      value: 'mais de 100',
      label: 'repertórios curados',
    });
  });

  it('não exibe Julia sem acento nos textos da landing', () => {
    const visibleText = visibleLandingFiles
      .map((file) => readFileSync(new URL(`./${file}`, import.meta.url), 'utf8'))
      .join('\n');

    expect(visibleText).not.toMatch(/[>"']Julia(?:[<,"'])/);
    expect(visibleText).toContain('Júlia, sua assistente');
  });

  it('explica a queda da C3 sem prometer repertórios no mock', () => {
    const recursos = readFileSync(
      new URL('./Recursos.tsx', import.meta.url),
      'utf8',
    );
    expect(recursos).toContain(
      'Seu 2º argumento foi anunciado, mas não explicado: faltou causa,',
    );
    expect(recursos).not.toContain('Quer ver repertórios sobre o tema?');
  });
});
