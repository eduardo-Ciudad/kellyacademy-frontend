import { useCorrecoesHoje } from '@/hooks/useCorrecoesHoje';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export function CorrecoesHojeCard({ mobile = false }: { mobile?: boolean }) {
  const { usadas, limite, isLoading, isError } = useCorrecoesHoje();

  if (isError) return null;

  const percentage =
    usadas !== undefined && limite
      ? `${Math.min((usadas / limite) * 100, 100)}%`
      : '0%';

  return (
    <div
      className={cn(
        'bg-surface rounded-inner flex flex-col gap-2.5 p-4',
        mobile && 'rounded-[16px] px-4 py-3.5',
      )}
    >
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-text-2 font-medium">Correções hoje</span>
        {isLoading ? (
          <Skeleton className="h-4 w-14" />
        ) : (
          <span className="tabular text-text font-bold">
            {usadas} de {limite}
          </span>
        )}
      </div>
      <div
        className="bg-control rounded-pill h-1.5 overflow-hidden"
        aria-label={
          isLoading
            ? 'Carregando correções usadas hoje'
            : `${usadas} de ${limite} correções usadas hoje`
        }
      >
        <div
          className="bg-accent rounded-pill h-full transition-[width]"
          style={{ width: percentage }}
        />
      </div>
      {!mobile && (
        <span className="text-text-3 text-xs">Renova à meia-noite</span>
      )}
    </div>
  );
}
