import { useAuth } from '@/lib/auth';
import { getStoredName } from '@/lib/session';

export const usuarioQueryKey = ['usuarios', 'me'] as const;

export function nomeDoUsuario(nome: string | null | undefined, email: string) {
  return nome?.trim() || email.split('@')[0] || 'Estudante';
}

export function useUsuario() {
  const { session } = useAuth();
  const email = session?.email ?? '';
  const nome = nomeDoUsuario(getStoredName(email), email);
  const iniciais = nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return { nome, iniciais: iniciais || 'E', email };
}
