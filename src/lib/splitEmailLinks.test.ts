import { describe, expect, it } from 'vitest';
import { CONTACT_EMAIL, splitEmailLinks } from '@/lib/splitEmailLinks';

describe('splitEmailLinks', () => {
  it('mantém um texto sem e-mail como uma única parte', () => {
    expect(splitEmailLinks('Texto sem contato.')).toEqual([
      { type: 'text', value: 'Texto sem contato.' },
    ]);
  });

  it('separa um e-mail do texto ao redor', () => {
    expect(
      splitEmailLinks(`Escreva para ${CONTACT_EMAIL} e fale conosco.`),
    ).toEqual([
      { type: 'text', value: 'Escreva para ' },
      { type: 'email', value: CONTACT_EMAIL },
      { type: 'text', value: ' e fale conosco.' },
    ]);
  });

  it('preserva o ponto depois de um e-mail no fim da frase', () => {
    expect(splitEmailLinks(`Contato: ${CONTACT_EMAIL}.`)).toEqual([
      { type: 'text', value: 'Contato: ' },
      { type: 'email', value: CONTACT_EMAIL },
      { type: 'text', value: '.' },
    ]);
  });
});
