import { useEffect, useState } from 'react';
import { useRedacoes } from '@/hooks/useRedacoes';
import { useUsuario } from '@/hooks/useUsuario';
import { getStoredSession } from '@/lib/session';

const TIME_ZONE = 'America/Sao_Paulo';
const LIMIT = 3;
const LIMIT_CHANGED_EVENT = 'studymind:limite-diario-alterado';

type ForcedLimit = { expiresAt: number };

function dateKey(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function limitKey(email: string) {
  return `studymind:limiteDiario:${email.trim().toLowerCase()}`;
}

function getForcedLimit(email: string) {
  if (!email) return false;
  const key = limitKey(email);
  const raw = localStorage.getItem(key);
  if (!raw) return false;
  try {
    const stored = JSON.parse(raw) as ForcedLimit;
    if (stored.expiresAt > Date.now()) return true;
  } catch {
    // Valor inválido é descartado abaixo.
  }
  localStorage.removeItem(key);
  return false;
}

export function marcarLimiteAtingido(retryAfter: number) {
  const email = getStoredSession()?.email;
  if (!email) return;
  localStorage.setItem(
    limitKey(email),
    JSON.stringify({
      expiresAt: Date.now() + retryAfter * 1000,
    } satisfies ForcedLimit),
  );
  window.dispatchEvent(new Event(LIMIT_CHANGED_EVENT));
}

export function useCorrecoesHoje() {
  const { data: redacoes = [] } = useRedacoes();
  const { email } = useUsuario();
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const sync = () => setRevision((value) => value + 1);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') sync();
    };
    window.addEventListener('storage', sync);
    window.addEventListener(LIMIT_CHANGED_EVENT, sync);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(LIMIT_CHANGED_EVENT, sync);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const usadas = (() => {
    void revision;
    if (getForcedLimit(email)) return LIMIT;
    const today = dateKey(new Date());
    return Math.min(
      redacoes.filter(
        (redacao) =>
          redacao.status === 'AVALIADA' &&
          dateKey(new Date(redacao.enviadaEm)) === today,
      ).length,
      LIMIT,
    );
  })();

  // TODO(backend): não existe endpoint de correções restantes.
  return { usadas, limite: LIMIT, atingido: usadas >= LIMIT };
}
