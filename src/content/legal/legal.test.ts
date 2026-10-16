import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { privacidade } from '@/content/legal/privacidade';
import { termos } from '@/content/legal/termos';

const documents = [privacidade, termos];
const kebabCaseWithoutAccents = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

describe.each(documents)('$title', (document) => {
  it('tem ids de seção únicos em kebab-case sem acento', () => {
    const ids = document.sections.map((section) => section.id);

    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(kebabCaseWithoutAccents));
  });

  it('não tem seção sem título ou sem parágrafos', () => {
    document.sections.forEach((section) => {
      expect(section.title.trim()).not.toBe('');
      expect(section.paragraphs.length).toBeGreaterThan(0);
      section.paragraphs.forEach((paragraph) =>
        expect(paragraph.trim()).not.toBe(''),
      );
    });
  });

  it('só tem closing em seções que possuem items', () => {
    document.sections.forEach((section) => {
      if (section.closing) expect(section.items).toBeDefined();
    });
  });

  it('só termina parágrafo inicial com dois-pontos quando há items', () => {
    document.sections.forEach((section) => {
      section.paragraphs.forEach((paragraph) => {
        if (paragraph.endsWith(':')) expect(section.items).toBeDefined();
      });
    });
  });

  it('não tem strings vazias em closing', () => {
    document.sections.forEach((section) => {
      section.closing?.forEach((paragraph) =>
        expect(paragraph.trim()).not.toBe(''),
      );
    });
  });

  it('tem updatedAt no formato AAAA-MM-DD e representa uma data válida', () => {
    expect(document.updatedAt).toMatch(isoDate);

    const date = new Date(`${document.updatedAt}T00:00:00Z`);
    expect(Number.isNaN(date.getTime())).toBe(false);
    expect(date.toISOString().slice(0, 10)).toBe(document.updatedAt);
  });

  it('tem description entre 50 e 160 caracteres', () => {
    expect(document.description.length).toBeGreaterThanOrEqual(50);
    expect(document.description.length).toBeLessThanOrEqual(160);
  });

  it('contém o e-mail de contato', () => {
    const text = JSON.stringify(document);
    expect(text).toContain('ciudadlab.dev@gmail.com');
  });
});

describe('sitemap', () => {
  it('contém a home e as duas páginas legais', () => {
    const sitemap = readFileSync(
      resolve(process.cwd(), 'public/sitemap.xml'),
      'utf8',
    );

    expect(sitemap).toContain('<loc>https://kellyacademy.com.br/</loc>');
    expect(sitemap).toContain(
      '<loc>https://kellyacademy.com.br/privacidade</loc>',
    );
    expect(sitemap).toContain('<loc>https://kellyacademy.com.br/termos</loc>');
  });
});
