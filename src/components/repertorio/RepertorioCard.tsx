import { TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  seloRisco,
  seloSaturacao,
  TIPO_ENTIDADE_LABELS,
} from '@/lib/repertorio';
import type { RepertorioResumo } from '@/types/api';

export function RepertorioCard({
  repertorio,
  query,
}: {
  repertorio: RepertorioResumo;
  query: string;
}) {
  const risco = seloRisco(repertorio.riscoUso);
  const saturacao = seloSaturacao(repertorio.saturacao);
  const problemas = repertorio.problemas.slice(0, 2);
  const restantes = repertorio.problemas.length - problemas.length;

  return (
    <Link
      to={`/repertorio/${encodeURIComponent(repertorio.codigo)}${query ? `?${query}` : ''}`}
      className="focus-ring bg-surface rounded-card hover:bg-surface-2 flex min-h-44 flex-col p-5 transition-colors"
    >
      <div className="flex items-start gap-3">
        <span className="text-text-3 min-w-0 flex-1 text-xs font-semibold tracking-[0.04em] uppercase">
          {repertorio.tipoDescricao ?? TIPO_ENTIDADE_LABELS[repertorio.tipo]}
        </span>
        {(risco || saturacao) && (
          <span className="flex shrink-0 flex-wrap justify-end gap-1.5">
            {risco && (
              <span className="bg-warning-bg text-warning rounded-pill inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold">
                <TriangleAlert size={12} aria-hidden="true" /> {risco}
              </span>
            )}
            {saturacao && (
              <span
                className={`rounded-pill px-2 py-1 text-[11px] font-semibold ${
                  repertorio.saturacao === 'LOW'
                    ? 'bg-accent-tint text-accent-text'
                    : 'bg-control text-text-2'
                }`}
              >
                {saturacao}
              </span>
            )}
          </span>
        )}
      </div>
      <h2 className="text-text mt-2 text-base leading-snug font-semibold">
        {repertorio.nome}
      </h2>
      {repertorio.subtitulo && (
        <p className="text-text-2 mt-1 text-[13px] leading-relaxed">
          {repertorio.subtitulo}
        </p>
      )}
      {repertorio.lembreNaProva && (
        <div className="mt-4">
          <span className="text-text-3 block text-[11px] font-bold tracking-[0.05em] uppercase">
            Lembre na prova
          </span>
          <p className="text-text-body mt-1 line-clamp-2 text-sm leading-relaxed">
            {repertorio.lembreNaProva}
          </p>
        </div>
      )}
      {repertorio.problemas.length > 0 && (
        <span className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {problemas.map((problema) => (
            <span
              key={problema.slug}
              className="bg-control text-text-2 rounded-pill px-2.5 py-1 text-[13px]"
            >
              {problema.nome}
            </span>
          ))}
          {restantes > 0 && (
            <span className="bg-control text-text-2 rounded-pill px-2.5 py-1 text-[13px]">
              +{restantes}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
