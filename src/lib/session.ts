const TOKEN_KEY = 'studymind:accessToken';
const EXPIRES_AT_KEY = 'studymind:expiraEm';
const EMAIL_KEY = 'studymind:email';
const SESSION_END_REASON_KEY = 'studymind:sessionEndReason';

export const SESSION_CHANGED_EVENT = 'studymind:session-changed';

export type StoredSession = {
  accessToken: string;
  expiraEm: string;
  email: string;
};

export type SessionEndReason = 'expired' | 'manual';

function notifySessionChanged() {
  window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}

function nameKey(email: string) {
  return `studymind:nome:${email.trim().toLowerCase()}`;
}

export function getStoredSession(): StoredSession | null {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  const expiraEm = localStorage.getItem(EXPIRES_AT_KEY);
  const email = localStorage.getItem(EMAIL_KEY);
  if (!accessToken || !expiraEm || !email) return null;
  if (new Date(expiraEm).getTime() <= Date.now()) {
    clearStoredSession('expired');
    return null;
  }
  return { accessToken, expiraEm, email };
}

export function storeSession(session: StoredSession, nome?: string) {
  const normalizedEmail = session.email.trim().toLowerCase();
  localStorage.setItem(TOKEN_KEY, session.accessToken);
  localStorage.setItem(EXPIRES_AT_KEY, session.expiraEm);
  localStorage.setItem(EMAIL_KEY, normalizedEmail);
  sessionStorage.removeItem(SESSION_END_REASON_KEY);
  if (nome) localStorage.setItem(nameKey(normalizedEmail), nome);
  notifySessionChanged();
}

export function clearStoredSession(reason: SessionEndReason = 'expired') {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem(EMAIL_KEY);
  sessionStorage.setItem(SESSION_END_REASON_KEY, reason);
  notifySessionChanged();
}

export function getStoredName(email: string) {
  return localStorage.getItem(nameKey(email));
}

export function consumeSessionEndReason(): SessionEndReason | null {
  const reason = sessionStorage.getItem(
    SESSION_END_REASON_KEY,
  ) as SessionEndReason | null;
  sessionStorage.removeItem(SESSION_END_REASON_KEY);
  return reason;
}
