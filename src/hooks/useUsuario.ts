import { useAuth } from '@/lib/auth';
import { getStoredName } from '@/lib/session';

export const usuarioQueryKey = ['usuarios', 'me'] as const;

export function useUsuario() {
  const { session } = useAuth();
  const email = session?.email ?? '';
  const nome = getStoredName(email) ?? email.split('@')[0] ?? 'Estudante';
  const iniciais = nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return { nome, iniciais: iniciais || 'E', email };
}
