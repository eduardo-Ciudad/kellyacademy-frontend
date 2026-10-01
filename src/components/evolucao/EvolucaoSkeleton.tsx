import { Skeleton } from '@/components/ui/Skeleton';

export function EvolucaoSkeleton() {
  return (
    <div className="px-5 pt-5 lg:px-0 lg:pt-0" aria-label="Carregando evolução">
      <div className="flex items-end justify-between">
        <div>
          <Skeleton className="h-8 w-44" />
          <Skeleton className="mt-2 h-5 w-72 max-w-[75vw]" />
        </div>
        <Skeleton className="hidden h-11 w-36 lg:block" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 lg:mt-6 lg:gap-4">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-[74px] lg:h-[118px]" />
        ))}
      </div>
      <Skeleton className="mt-4 h-40 lg:mt-6 lg:h-24" />
      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_344px] lg:gap-6">
        <Skeleton className="h-[300px] lg:h-[390px]" />
        <Skeleton className="h-[420px] lg:h-[390px]" />
      </div>
    </div>
  );
}
