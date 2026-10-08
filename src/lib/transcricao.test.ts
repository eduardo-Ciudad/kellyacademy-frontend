import { describe, expect, it } from 'vitest';
import {
  contarLinhasEscritas,
  posicoesIlegiveis,
  resumoIlegiveis,
  temTrechoIlegivel,
} from '@/lib/transcricao';

describe('transcrição', () => {
  it('não encontra texto sem marcador nem palavra solta', () => {
    expect(
      posicoesIlegiveis('Texto legível, sem ilegível entre colchetes.'),
    ).toEqual([]);
    expect(temTrechoIlegivel('Tudo certo')).toBe(false);
  });

  it('localiza o marcador contando linha em branco', () => {
    const texto = 'primeira\n\nterceira [ilegível]';
    const [trecho] = posicoesIlegiveis(texto);
    expect(trecho.linha).toBe(3);
    expect(texto.slice(trecho.inicio, trecho.fim)).toBe('[ilegível]');
  });

  it.each(['[ILEGÍVEL]', '[ilegivel]', '[ ilegível ]'])(
    'aceita %s',
    (marcador) => {
      expect(posicoesIlegiveis(marcador)).toHaveLength(1);
    },
  );

  it('encontra dois marcadores na mesma linha', () => {
    expect(posicoesIlegiveis('[ilegível] e [ilegivel]')).toHaveLength(2);
  });

  it('conta somente linhas escritas com LF ou CRLF', () => {
    expect(contarLinhasEscritas('uma\n\n duas \r\n  \r\ntrês')).toBe(3);
  });

  it('resume zero, um e vários trechos', () => {
    expect(resumoIlegiveis([])).toBe('');
    expect(resumoIlegiveis([{ inicio: 0, fim: 10, linha: 10 }])).toBe(
      '1 trecho ilegível · linha 10',
    );
    expect(
      resumoIlegiveis([
        { inicio: 0, fim: 10, linha: 2 },
        { inicio: 12, fim: 22, linha: 5 },
        { inicio: 24, fim: 34, linha: 5 },
        { inicio: 36, fim: 46, linha: 9 },
      ]),
    ).toBe('4 trechos ilegíveis · linhas 2, 5 e 9');
  });
});
