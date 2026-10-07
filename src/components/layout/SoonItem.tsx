import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

export function SoonItem({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => toast('Disponível em breve')}
      className="focus-ring rounded-input text-text-3 hover:bg-surface-2 flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm font-semibold transition-colors"
    >
      <Icon size={20} aria-hidden="true" />
      <span className="flex-1">{label}</span>
      <span className="rounded-pill bg-control text-text-2 px-2 py-1 text-[10px] font-semibold">
        Em breve
      </span>
    </button>
  );
}
