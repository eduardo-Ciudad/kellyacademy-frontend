import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Foto } from '@/components/transcricao/foto';
import { cn } from '@/lib/utils';

export function VisualizadorFoto({ fotos }: { fotos: Foto[] }) {
  const [indice, setIndice] = useState(0);
  const [zoom, setZoom] = useState(100);
  useEffect(() => {
    if (indice >= fotos.length) setIndice(0);
  }, [fotos.length, indice]);
  return (
    <section className="bg-photo-view relative flex min-h-0 flex-1 flex-col">
      {fotos.length > 1 && (
        <div className="bg-photo-pill/90 rounded-pill absolute top-3 left-3 z-10 flex p-1">
          {fotos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndice(i)}
              className={cn(
                'focus-ring rounded-pill px-3 py-2 text-xs font-semibold',
                i === indice ? 'bg-control text-text' : 'text-text-2',
              )}
            >
              <span className="lg:hidden">Foto {i + 1}</span>
              <span className="hidden lg:inline">
                Foto {i + 1} · {i ? 'continuação' : 'início'}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="bg-photo-pill/90 rounded-pill absolute top-3 right-3 z-10 flex items-center p-1">
        <button
          aria-label="Diminuir zoom"
          disabled={zoom === 100}
          onClick={() => setZoom((z) => z - 50)}
          className="focus-ring flex size-9 items-center justify-center rounded-full disabled:opacity-40"
        >
          <Minus size={16} />
        </button>
        <span className="tabular w-12 text-center text-xs font-semibold">
          {zoom}%
        </span>
        <button
          aria-label="Aumentar zoom"
          disabled={zoom === 300}
          onClick={() => setZoom((z) => z + 50)}
          className="focus-ring flex size-9 items-center justify-center rounded-full disabled:opacity-40"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex min-h-[360px] flex-1 items-start justify-center overflow-auto px-4 pt-16 pb-4">
        <img
          src={fotos[indice]?.url}
          alt={`Foto ${indice + 1} da redação`}
          className="h-auto max-w-none object-contain"
          style={{ width: `${zoom}%` }}
        />
      </div>
    </section>
  );
}
