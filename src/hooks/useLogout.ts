import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return () => {
    logout();
    void navigate('/entrar', { replace: true });
  };
}
