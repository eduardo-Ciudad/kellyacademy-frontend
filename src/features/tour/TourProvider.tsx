import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useUsuario } from '@/hooks/useUsuario';
import { TourOverlay } from './TourOverlay';
import { useTourStorage } from './useTourStorage';

export type TourScreen = 'closed' | 'welcome' | 'steps' | 'toast';

type TourContextValue = {
  screen: TourScreen;
  stepIndex: number;
  openTour: () => void;
  begin: () => void;
  setStepIndex: (step: number) => void;
  finish: () => void;
  closeToast: () => void;
};

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: PropsWithChildren) {
  const { email } = useUsuario();
  const location = useLocation();
  const userId = email.trim().toLowerCase();
  const { isCompleted, complete } = useTourStorage(userId);
  const [screen, setScreen] = useState<TourScreen>('closed');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (location.pathname !== '/' || !userId || isCompleted()) return;
    setScreen('welcome');
  }, [isCompleted, location.pathname, userId]);

  const openTour = useCallback(() => {
    setStepIndex(0);
    setScreen('welcome');
  }, []);

  const finish = useCallback(() => {
    complete();
    setScreen('toast');
  }, [complete]);

  const value = useMemo<TourContextValue>(
    () => ({
      screen,
      stepIndex,
      openTour,
      begin: () => {
        setStepIndex(0);
        setScreen('steps');
      },
      setStepIndex,
      finish,
      closeToast: () => setScreen('closed'),
    }),
    [finish, openTour, screen, stepIndex],
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      <TourOverlay />
    </TourContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTour() {
  const context = useContext(TourContext);
  if (!context)
    throw new Error('useTour deve ser usado dentro de TourProvider.');
  return context;
}
