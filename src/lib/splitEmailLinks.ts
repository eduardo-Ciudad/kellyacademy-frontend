export const CONTACT_EMAIL = 'ciudadlab.dev@gmail.com';

export type TextPart =
  { type: 'text'; value: string } | { type: 'email'; value: string };

export function splitEmailLinks(text: string): TextPart[] {
  const parts = text.split(CONTACT_EMAIL);

  return parts.flatMap((part, index) => {
    const result: TextPart[] = [];
    if (part) result.push({ type: 'text', value: part });
    if (index < parts.length - 1) {
      result.push({ type: 'email', value: CONTACT_EMAIL });
    }
    return result;
  });
}
