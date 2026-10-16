// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { applyPageMeta, canonicalUrl } from './usePageMeta';

const ORIGINAL_TITLE = 'Kelly Academy — Correção de redação do ENEM com IA';
const ORIGINAL_DESCRIPTION =
  'Treine a redação do ENEM com correção por IA nas 5 competências do INEP.';
const ORIGINAL_CANONICAL = 'https://kellyacademy.com.br/';

function expectUniqueMetaTags() {
  expect(
    document.querySelectorAll('meta[name="description"]').length,
  ).toBeLessThanOrEqual(1);
  expect(
    document.querySelectorAll('meta[name="robots"]').length,
  ).toBeLessThanOrEqual(1);
  expect(
    document.querySelectorAll('link[rel="canonical"]').length,
  ).toBeLessThanOrEqual(1);
}

beforeEach(() => {
  document.head.innerHTML = `
    <title>${ORIGINAL_TITLE}</title>
    <meta name="description" content="${ORIGINAL_DESCRIPTION}">
    <link rel="canonical" href="${ORIGINAL_CANONICAL}">
  `;
});

describe('canonicalUrl', () => {
  it('gera a URL canônica da landing', () => {
    expect(canonicalUrl('/')).toBe('https://kellyacademy.com.br/');
  });

  it('gera a URL canônica de uma rota pública', () => {
    expect(canonicalUrl('/entrar')).toBe('https://kellyacademy.com.br/entrar');
  });
});

describe('applyPageMeta', () => {
  it('aplica os metadados de uma página indexável', () => {
    applyPageMeta(document, {
      title: 'Entrar',
      description: 'Acesse sua conta.',
      path: '/entrar',
    });

    expect(document.title).toBe('Entrar');
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content'),
    ).toBe('Acesse sua conta.');
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://kellyacademy.com.br/entrar');
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    ).toBe('index, follow');
    expectUniqueMetaTags();
  });

  it('restaura os metadados originais no cleanup', () => {
    const cleanup = applyPageMeta(document, {
      title: 'Entrar',
      description: 'Acesse sua conta.',
      path: '/entrar',
    });

    cleanup();

    expect(document.title).toBe(ORIGINAL_TITLE);
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content'),
    ).toBe(ORIGINAL_DESCRIPTION);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe(ORIGINAL_CANONICAL);
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
    expectUniqueMetaTags();
  });

  it('aplica noindex e remove o canonical', () => {
    applyPageMeta(document, { title: 'Área privada', noindex: true });

    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    ).toBe('noindex, nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expectUniqueMetaTags();
  });

  it('restaura o canonical original após o cleanup de noindex', () => {
    const cleanup = applyPageMeta(document, {
      title: 'Área privada',
      noindex: true,
    });

    cleanup();

    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe(ORIGINAL_CANONICAL);
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
    expectUniqueMetaTags();
  });

  it('mantém a description existente quando nenhuma é informada', () => {
    applyPageMeta(document, { title: 'Entrar', path: '/entrar' });

    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content'),
    ).toBe(ORIGINAL_DESCRIPTION);
    expectUniqueMetaTags();
  });

  it('cria tags ausentes e remove somente o que criou no cleanup', () => {
    document.head.innerHTML = '<title>Título original</title>';

    const cleanup = applyPageMeta(document, {
      title: 'Entrar',
      description: 'Acesse sua conta.',
      path: '/entrar',
    });

    expectUniqueMetaTags();
    cleanup();

    expect(document.title).toBe('Título original');
    expect(document.querySelector('meta[name="description"]')).toBeNull();
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expectUniqueMetaTags();
  });

  it('restaura a landing após navegar para uma tela privada', () => {
    const cleanupLanding = applyPageMeta(document, {
      title: 'Landing',
      description: 'Descrição da landing.',
      path: '/',
    });
    const cleanupPrivate = applyPageMeta(document, {
      title: 'Área privada',
      noindex: true,
    });

    cleanupPrivate();

    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    ).toBe('index, follow');
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe(ORIGINAL_CANONICAL);
    expectUniqueMetaTags();

    cleanupLanding();
  });
});
