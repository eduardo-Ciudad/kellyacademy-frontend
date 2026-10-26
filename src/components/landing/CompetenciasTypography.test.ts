import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('tipografia do título da competência', () => {
  it.each(['Competencias.tsx', 'CompetenciasMobile.tsx'])(
    '%s usa Inter Tight 300 no título do card',
    (file) => {
      const source = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
      const titleClass = source.match(
        /<h3 className="([^"]+)">\s*\{(?:content|activeContent)\.nomeOficial\}/,
      )?.[1];

      expect(titleClass).toContain('font-display');
      expect(titleClass).toContain('font-light');
      expect(titleClass).toContain('text-[30px]');
      expect(titleClass).not.toContain('font-bold');
    },
  );
});
