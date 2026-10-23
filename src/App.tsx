import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnalyticsConsent } from '@/components/consent/AnalyticsConsent';
import { AuthProvider } from '@/lib/auth';
import { isMaintenanceMode } from '@/lib/maintenance';
import { queryClient } from '@/lib/queryClient';
import { MaintenancePage } from '@/pages/MaintenancePage';
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

function Application() {
  const toastPosition = useDesktopToastPosition();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <AnalyticsConsent />
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

export function App() {
  if (isMaintenanceMode()) {
    return (
      <>
        <MaintenancePage />
        <AnalyticsConsent />
      </>
    );
  }

  return <Application />;
}
