import { useCallback, useEffect, useRef, useState } from 'react';
import type { TipoRedacao } from '@/types/api';

export type Rascunho = {
  texto: string;
  tipo: TipoRedacao;
  atualizadoEm: string;
};

function draftKey(email: string, temaId: string) {
  return `studymind:rascunho:${email.trim().toLowerCase()}:${temaId}`;
}

export function carregarRascunho(
  email: string,
  temaId: string,
): Rascunho | null {
  if (!email || !temaId) return null;
  const raw = localStorage.getItem(draftKey(email, temaId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Rascunho;
  } catch {
    return null;
  }
}

export function useRascunho({
  email,
  temaId,
  texto,
  tipo,
}: {
  email: string;
  temaId: string;
  texto: string;
  tipo: TipoRedacao;
}) {
  const [salvo, setSalvo] = useState(() =>
    Boolean(carregarRascunho(email, temaId)),
  );
  const disabledRef = useRef(false);
  const latestRef = useRef({ texto, tipo });
  latestRef.current = { texto, tipo };

  const salvarAgora = useCallback(() => {
    if (!email || !temaId || disabledRef.current) return;
    const draft: Rascunho = {
      ...latestRef.current,
      atualizadoEm: new Date().toISOString(),
    };
    localStorage.setItem(draftKey(email, temaId), JSON.stringify(draft));
    setSalvo(true);
  }, [email, temaId]);

  const apagar = useCallback(() => {
    disabledRef.current = true;
    localStorage.removeItem(draftKey(email, temaId));
    setSalvo(false);
  }, [email, temaId]);

  useEffect(() => {
    disabledRef.current = false;
  }, [email, temaId]);

  useEffect(() => {
    setSalvo(false);
    const timeoutId = window.setTimeout(salvarAgora, 500);
    return () => window.clearTimeout(timeoutId);
  }, [salvarAgora, texto, tipo]);

  useEffect(() => {
    const handleBeforeUnload = () => salvarAgora();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [salvarAgora]);

  return { salvo, salvarAgora, apagar };
}
