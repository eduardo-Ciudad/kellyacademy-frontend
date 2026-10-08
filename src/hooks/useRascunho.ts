import { useCallback, useEffect, useRef, useState } from 'react';
import type { OrigemRedacao, TipoRedacao } from '@/types/api';

export type Rascunho = {
  texto: string;
  tipo: TipoRedacao;
  origem?: OrigemRedacao;
  atualizadoEm: string;
};

function draftKey(email: string, temaId: string) {
  return `studymind:rascunho:${email.trim().toLowerCase()}:${temaId}`;
}

export function gravarRascunho(
  email: string,
  temaId: string,
  rascunho: Omit<Rascunho, 'atualizadoEm'>,
) {
  if (!email || !temaId) return;
  localStorage.setItem(
    draftKey(email, temaId),
    JSON.stringify({ ...rascunho, atualizadoEm: new Date().toISOString() }),
  );
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
  origem,
}: {
  email: string;
  temaId: string;
  texto: string;
  tipo: TipoRedacao;
  origem: OrigemRedacao;
}) {
  const [salvo, setSalvo] = useState(() =>
    Boolean(carregarRascunho(email, temaId)),
  );
  const disabledRef = useRef(false);
  const latestRef = useRef({ texto, tipo, origem });
  latestRef.current = { texto, tipo, origem };

  const salvarAgora = useCallback(() => {
    if (!email || !temaId || disabledRef.current) return;
    gravarRascunho(email, temaId, latestRef.current);
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
  }, [salvarAgora, texto, tipo, origem]);

  useEffect(() => {
    const handleBeforeUnload = () => salvarAgora();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [salvarAgora]);

  return { salvo, salvarAgora, apagar };
}
