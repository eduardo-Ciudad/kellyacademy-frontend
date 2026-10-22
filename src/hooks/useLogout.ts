import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { juliaHabilitada } from '@/lib/julia';

export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return () => {
    if (juliaHabilitada)
      void api<void>('/julia/conversas', { method: 'DELETE' }).catch(
        () => undefined,
      );
    logout();
    void navigate('/entrar', { replace: true });
  };
}
