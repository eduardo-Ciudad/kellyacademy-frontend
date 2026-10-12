import { type ReactNode, Suspense } from 'react';

export function LazyRoute({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="bg-bg min-h-screen" />}>
      {children}
    </Suspense>
  );
}
