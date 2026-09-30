import { useCorrecoesHoje } from '@/hooks/useCorrecoesHoje';
import { cn } from '@/lib/utils';

export function CorrecoesHojeCard({ mobile = false }: { mobile?: boolean }) {
  const { usadas, limite } = useCorrecoesHoje();
  const percentage = `${(usadas / limite) * 100}%`;

  return (
    <div
      className={cn(
        'bg-surface rounded-inner flex flex-col gap-2.5 p-4',
        mobile && 'rounded-[16px] px-4 py-3.5',
      )}
    >
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-text-2 font-medium">Correções hoje</span>
        <span className="tabular text-text font-bold">
          {usadas} de {limite}
        </span>
      </div>
      <div
        className="bg-control rounded-pill h-1.5 overflow-hidden"
        aria-label={`${usadas} de ${limite} correções usadas hoje`}
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
