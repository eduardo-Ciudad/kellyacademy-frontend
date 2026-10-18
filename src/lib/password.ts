export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_BYTES = 72;

export function passwordByteLength(value: string) {
  return new TextEncoder().encode(value).length;
}

export function isPasswordLengthValid(value: string) {
  return (
    value.length >= MIN_PASSWORD_LENGTH &&
    passwordByteLength(value) <= MAX_PASSWORD_BYTES
  );
}

export function retryMessage(detail: string, retryAfter?: number) {
  if (!retryAfter) return detail;
  const minutes = Math.floor(retryAfter / 60);
  const seconds = retryAfter % 60;
  const duration = minutes
    ? `${minutes} min${seconds ? ` e ${seconds} s` : ''}`
    : `${seconds} s`;
  return `${detail} Tente novamente em ${duration}.`;
}
