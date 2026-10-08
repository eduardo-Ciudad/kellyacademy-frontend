import { describe, expect, it } from 'vitest';
import { detectarTipoImagem, dimensoesReduzidas } from '@/lib/imagem';

describe('detectarTipoImagem', () => {
  it('reconhece JPEG, PNG e WebP', () => {
    expect(detectarTipoImagem(new Uint8Array([0xff, 0xd8, 0xff]))).toBe(
      'image/jpeg',
    );
    expect(
      detectarTipoImagem(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
    ).toBe('image/png');
    expect(detectarTipoImagem(new TextEncoder().encode('RIFFxxxxWEBP'))).toBe(
      'image/webp',
    );
  });

  it.each([
    new TextEncoder().encode('RIFFxxxxWAVE'),
    new TextEncoder().encode('%PDF'),
    new Uint8Array([0x47, 0x49, 0x46, 0x38]),
    new Uint8Array([0xff]),
    new Uint8Array(),
  ])('recusa formatos inválidos', (bytes) => {
    expect(detectarTipoImagem(bytes)).toBeNull();
  });
});

describe('dimensoesReduzidas', () => {
  it('não amplia uma foto que já cabe', () => {
    expect(dimensoesReduzidas(800, 600)).toEqual({ largura: 800, altura: 600 });
  });
  it('reduz retrato mantendo proporção', () => {
    expect(dimensoesReduzidas(3024, 4032)).toEqual({
      largura: 1536,
      altura: 2048,
    });
  });
  it('reduz paisagem mantendo proporção', () => {
    expect(dimensoesReduzidas(4032, 3024)).toEqual({
      largura: 2048,
      altura: 1536,
    });
  });
  it('nunca produz dimensão zero', () => {
    expect(dimensoesReduzidas(10000, 1, 100)).toEqual({
      largura: 100,
      altura: 1,
    });
  });
});
