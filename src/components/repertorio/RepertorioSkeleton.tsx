import { Skeleton } from '@/components/ui/Skeleton';

export function RepertorioSkeleton() {
  return (
    <div className="mt-5" role="status" aria-label="Carregando repertórios">
      <div className="grid gap-3 lg:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-52" />
        ))}
      </div>
      <span className="sr-only">Carregando repertórios…</span>
    </div>
  );
}
