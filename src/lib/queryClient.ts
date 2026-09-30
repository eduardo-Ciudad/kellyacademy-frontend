import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';

function shouldRetry(failureCount: number, error: unknown) {
  if (failureCount >= 1 || !(error instanceof ApiError)) return false;
  return (
    error.code === 'NETWORK' || error.code === 'TIMEOUT' || error.status >= 500
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: { retry: 0 },
  },
});
