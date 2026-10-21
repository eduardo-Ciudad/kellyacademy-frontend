import { useCallback, useMemo, useRef } from 'react';

const sessionFailures = new Set<string>();

export function tourStorageKey(userId: string) {
  return `kelly:tour:v1:${userId}`;
}

export function useTourStorage(userId: string) {
  const key = tourStorageKey(userId);
  const failedRef = useRef(sessionFailures.has(key));

  const isCompleted = useCallback(() => {
    if (failedRef.current) return true;
    try {
      return window.localStorage.getItem(key) === 'concluido';
    } catch {
      failedRef.current = true;
      sessionFailures.add(key);
      return true;
    }
  }, [key]);

  const complete = useCallback(() => {
    if (failedRef.current) return false;
    try {
      window.localStorage.setItem(key, 'concluido');
      return true;
    } catch {
      failedRef.current = true;
      sessionFailures.add(key);
      return false;
    }
  }, [key]);

  return useMemo(() => ({ isCompleted, complete }), [complete, isCompleted]);
}
