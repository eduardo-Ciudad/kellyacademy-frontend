import { describe, expect, it } from 'vitest';
import {
  isPasswordLengthValid,
  passwordByteLength,
  retryMessage,
} from '@/lib/password';

describe('regras de senha', () => {
  it('exige 8 caracteres e no máximo 72 bytes UTF-8', () => {
    expect(isPasswordLengthValid('1234567')).toBe(false);
    expect(isPasswordLengthValid('12345678')).toBe(true);
    expect(passwordByteLength('á'.repeat(37))).toBe(74);
    expect(isPasswordLengthValid('á'.repeat(37))).toBe(false);
  });

  it('formata o Retry-After', () => {
    expect(retryMessage('Limite atingido.', 90)).toContain('1 min e 30 s');
  });
});
