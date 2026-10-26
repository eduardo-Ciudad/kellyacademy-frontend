import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { rotaTemBotaoJulia } from '@/lib/julia';

export function JuliaRouteGate({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return rotaTemBotaoJulia(pathname) ? children : null;
}
