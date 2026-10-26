import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const sections = [
  'ComoFunciona.tsx',
  'Competencias.tsx',
  'CompetenciasMobile.tsx',
  'CtaFinal.tsx',
  'CtaFinalMobile.tsx',
  'Faq.tsx',
  'FaqMobile.tsx',
  'Planos.tsx',
  'PlanosMobile.tsx',
  'Recursos.tsx',
  'RecursosMobile.tsx',
  'RepertorioSection.tsx',
  'RepertorioMobile.tsx',
  'TemasMarquee.tsx',
] as const;

describe('espaçamento das seções da landing', () => {
  it.each(sections)('%s usa o token landing-section', (file) => {
    const source = readFileSync(
      new URL(`./${file}`, import.meta.url),
      'utf8',
    );
    expect(source).toContain('landing-section');
  });

  it('define 96px no mobile e 160px a partir de 640px', () => {
    const styles = readFileSync(
      new URL('../../index.css', import.meta.url),
      'utf8',
    );

    expect(styles).toMatch(
      /\.landing-section\s*{\s*padding-block:\s*6rem;/,
    );
    expect(styles).toMatch(
      /@media \(min-width:\s*40rem\)[\s\S]*?\.landing-section\s*{\s*padding-block:\s*10rem;/,
    );
  });
});
