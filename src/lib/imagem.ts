export const TAMANHO_MAXIMO_FOTO = 5 * 1024 * 1024;
export const MAX_FOTOS = 2;
export const LADO_MAXIMO_PX = 2048;
export const QUALIDADE_JPEG = 0.85;

export type TipoImagemAceito = 'image/jpeg' | 'image/png' | 'image/webp';

export function detectarTipoImagem(bytes: Uint8Array): TipoImagemAceito | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  )
    return 'image/jpeg';
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && png.every((byte, index) => bytes[index] === byte))
    return 'image/png';
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  )
    return 'image/webp';
  return null;
}

export function dimensoesReduzidas(
  largura: number,
  altura: number,
  ladoMaximo = LADO_MAXIMO_PX,
) {
  const escala = Math.min(1, ladoMaximo / Math.max(largura, altura));
  return {
    largura: Math.max(1, Math.round(largura * escala)),
    altura: Math.max(1, Math.round(altura * escala)),
  };
}

export class FotoInvalidaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FotoInvalidaError';
  }
}

async function fallbackImagem(arquivo: File) {
  const bytes = new Uint8Array(await arquivo.slice(0, 12).arrayBuffer());
  if (!detectarTipoImagem(bytes))
    throw new FotoInvalidaError('Use uma foto em JPEG, PNG ou WebP.');
  if (arquivo.size > TAMANHO_MAXIMO_FOTO)
    throw new FotoInvalidaError('Cada foto deve ter no máximo 5 MB.');
  return arquivo;
}

export async function comprimirImagem(arquivo: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(arquivo, {
      imageOrientation: 'from-image',
    });
  } catch {
    return fallbackImagem(arquivo);
  }
  try {
    const dimensoes = dimensoesReduzidas(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = dimensoes.largura;
    canvas.height = dimensoes.altura;
    const context = canvas.getContext('2d');
    if (!context) return fallbackImagem(arquivo);
    context.drawImage(bitmap, 0, 0, dimensoes.largura, dimensoes.altura);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALIDADE_JPEG),
    );
    if (!blob) return fallbackImagem(arquivo);
    if (blob.size > TAMANHO_MAXIMO_FOTO)
      throw new FotoInvalidaError('Cada foto deve ter no máximo 5 MB.');
    const base = arquivo.name.replace(/\.[^.]+$/, '') || 'redacao';
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg' });
  } finally {
    bitmap.close();
  }
}
