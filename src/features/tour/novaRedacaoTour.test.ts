import { describe, expect, it } from 'vitest';
import { tours } from './tourSteps';
import { tourStorageKey } from './useTourStorage';

describe('tour da nova redação', () => {
  it('mantém as chaves antigas e cria a nova chave versionada', () => {
    expect(tourStorageKey('aluna@example.com', 'principal')).toBe(
      'kelly:tour:v1:aluna@example.com',
    );
    expect(tourStorageKey('aluna@example.com', 'julia')).toBe(
      'kelly:tour-julia:v1:aluna@example.com',
    );
    expect(tourStorageKey('aluna@example.com', 'nova-redacao')).toBe(
      'kelly:tour-nova-redacao:v1:aluna@example.com',
    );
  });

  it('tem três passos nos alvos do fluxo', () => {
    expect(tours['nova-redacao']).toHaveLength(3);
    expect(tours['nova-redacao'].map((step) => step.target)).toEqual([
      'nova-redacao-lista',
      'nova-redacao-meu-tema',
      'nova-redacao-etapas',
    ]);
  });
});
