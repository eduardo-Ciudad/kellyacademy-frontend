import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/routes';

function useDesktopToastPosition() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia('(min-width: 1024px)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const updatePosition = () => setIsDesktop(media.matches);
    media.addEventListener('change', updatePosition);
    return () => media.removeEventListener('change', updatePosition);
  }, []);

  return isDesktop ? 'top-right' : 'top-center';
}

export function App() {
  const toastPosition = useDesktopToastPosition();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position={toastPosition}
          toastOptions={{
            classNames: {
              toast: '!rounded-inner !border-control !bg-surface !text-text',
              description: '!text-text-2',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
