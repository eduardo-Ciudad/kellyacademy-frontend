import { Crop, Files, Smartphone, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const DICAS = [
  { Icon: Sun, cor: 'text-warning', texto: 'Boa luz, sem sombra na folha' },
  { Icon: Crop, cor: 'text-c1', texto: 'Todas as linhas dentro do quadro' },
  {
    Icon: Smartphone,
    cor: 'text-c3',
    texto: 'Câmera reta, de cima, sem inclinar',
  },
  { Icon: Files, cor: 'text-c2', texto: 'Não coube? Use 2 fotos, na ordem' },
] as const;

export function DicasFoto({ destacar = false }: { destacar?: boolean }) {
  return (
    <div
      className={cn(
        'bg-surface rounded-card grid grid-cols-2 gap-1 p-2 outline-2 outline-transparent lg:grid-cols-4 lg:bg-transparent lg:p-0',
        destacar && 'outline-warning/40',
      )}
    >
      {DICAS.map(({ Icon, cor, texto }) => (
        <div
          key={texto}
          className="rounded-inner lg:bg-surface flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:p-4"
        >
          <span
            className={cn(
              'bg-surface-2 flex size-9 shrink-0 items-center justify-center rounded-[10px]',
              cor,
            )}
          >
            <Icon size={18} />
          </span>
          <span className="text-text-2 text-[13px] leading-[1.35]">
            {texto}
          </span>
        </div>
      ))}
    </div>
  );
}
