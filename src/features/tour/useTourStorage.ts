import { useCallback, useMemo, useRef } from 'react';
import type { TourId } from './tourSteps';

const sessionFailures = new Set<string>();

export function tourStorageKey(userId: string, tourId: TourId = 'principal') {
  if (tourId === 'principal') return `kelly:tour:v1:${userId}`;
  return `kelly:tour-${tourId}:v1:${userId}`;
}

export function useTourStorage(userId: string, tourId: TourId = 'principal') {
  const key = tourStorageKey(userId, tourId);
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
