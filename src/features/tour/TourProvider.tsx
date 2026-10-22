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
import type { TourId } from './tourSteps';
import { useTourStorage } from './useTourStorage';

export type TourScreen = 'closed' | 'welcome' | 'steps' | 'toast';

type TourContextValue = {
  screen: TourScreen;
  tourId: TourId;
  stepIndex: number;
  openTour: () => void;
  startTour: (id: TourId) => void;
  isTourCompleted: (id: TourId) => boolean;
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
  const principalStorage = useTourStorage(userId);
  const juliaStorage = useTourStorage(userId, 'julia');
  const [screen, setScreen] = useState<TourScreen>('closed');
  const [tourId, setTourId] = useState<TourId>('principal');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (
      location.pathname !== '/' ||
      !userId ||
      principalStorage.isCompleted()
    )
      return;
    setTourId('principal');
    setScreen('welcome');
  }, [location.pathname, principalStorage, userId]);

  const startTour = useCallback((id: TourId) => {
    setTourId(id);
    setStepIndex(0);
    setScreen(id === 'principal' ? 'welcome' : 'steps');
  }, []);

  const openTour = useCallback(() => {
    startTour('principal');
  }, [startTour]);

  const isTourCompleted = useCallback(
    (id: TourId) =>
      id === 'principal'
        ? principalStorage.isCompleted()
        : juliaStorage.isCompleted(),
    [juliaStorage, principalStorage],
  );

  const finish = useCallback(() => {
    if (tourId === 'principal') principalStorage.complete();
    else juliaStorage.complete();
    setScreen('toast');
  }, [juliaStorage, principalStorage, tourId]);

  const value = useMemo<TourContextValue>(
    () => ({
      screen,
      tourId,
      stepIndex,
      openTour,
      startTour,
      isTourCompleted,
      begin: () => {
        setStepIndex(0);
        setScreen('steps');
      },
      setStepIndex,
      finish,
      closeToast: () => setScreen('closed'),
    }),
    [finish, isTourCompleted, openTour, screen, startTour, stepIndex, tourId],
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
