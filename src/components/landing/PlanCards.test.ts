import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('estrutura dos planos da landing', () => {
  it.each(['Planos.tsx', 'PlanosMobile.tsx'])(
    '%s mantém apoio e ação alinhados',
    (file) => {
      const source = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');

      expect(source).toContain('data-plan-support');
      expect(source).toContain('sem cartão');
      expect(source).toContain('cancele quando quiser');
      expect(source).toContain('data-plan-action');
      expect(source).toContain('mt-auto');
    },
  );
});
