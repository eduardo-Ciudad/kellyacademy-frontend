import { useMediaQuery } from '@/hooks/useMediaQuery';

export function useIsMobileLanding() {
  return useMediaQuery('(max-width: 959px)');
}
