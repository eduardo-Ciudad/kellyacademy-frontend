import { Copy, ExternalLink, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import {
  dadoAntigo,
  DIFICULDADE_LABELS,
  FUNCAO_ARGUMENTATIVA_LABELS,
  PAPEL_REPERTORIO_LABELS,
  seloRisco,
  seloSaturacao,
  TIPO_ENTIDADE_LABELS,
  TIPO_EVIDENCIA_LABELS,
  TIPO_FONTE_LABELS,
} from '@/lib/repertorio';
import type { Repertorio } from '@/types/api';

export function RepertorioDetalhe({ repertorio }: { repertorio: Repertorio }) {
  const risco = seloRisco(repertorio.riscoUso);
  const saturacao = seloSaturacao(repertorio.saturacao);

  async function copiarExemplo() {
    if (!repertorio.exemploAplicacao) return;
    try {
      await navigator.clipboard.writeText(repertorio.exemploAplicacao);
      toast.success('Exemplo copiado');
    } catch {
      toast.error('Não foi possível copiar');
    }
  }

  return (
    <article className="space-y-6">
      <header>
        <p className="text-text-3 text-xs font-semibold tracking-[0.05em] uppercase">
          {repertorio.tipoDescricao ?? TIPO_ENTIDADE_LABELS[repertorio.tipo]}
        </p>
        <h2 className="text-text mt-2 text-2xl leading-tight font-bold">
          {repertorio.nome}
        </h2>
        {repertorio.subtitulo && (
          <p className="text-text-2 mt-1.5 text-sm leading-relaxed">
            {repertorio.subtitulo}
          </p>
        )}
        {(repertorio.area || repertorio.pais) && (
          <p className="text-text-3 mt-2 text-xs">
            {[repertorio.area, repertorio.pais].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {risco && (
            <Badge className="bg-warning-bg text-warning">{risco}</Badge>
          )}
          {saturacao && (
            <Badge
              className={
                repertorio.saturacao === 'LOW'
                  ? 'bg-accent-tint text-accent-text'
                  : 'bg-control text-text-2'
              }
            >
              {saturacao}
            </Badge>
          )}
          {repertorio.dificuldade && (
            <Badge className="bg-control text-text-2">
              {DIFICULDADE_LABELS[repertorio.dificuldade]}
            </Badge>
          )}
        </div>
      </header>

      {repertorio.ideiaCentral && (
        <Section title="O que é">
          <p>{repertorio.ideiaCentral}</p>
        </Section>
      )}

      {repertorio.lembreNaProva && (
        <Section title="Lembre na prova">
          <div className="bg-accent-tint border-accent-text text-text rounded-inner border-l-4 p-4 text-[15px] leading-relaxed font-medium">
            {repertorio.lembreNaProva}
          </div>
        </Section>
      )}

      <section>
        <h3 className="text-text text-sm font-bold">
          Que problemas ajuda a explicar
        </h3>
        {repertorio.problemas.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {repertorio.problemas.map((problema) => (
              <Badge key={problema.slug} className="bg-control text-text-2">
                {problema.nome}
              </Badge>
            ))}
          </div>
        )}
        {repertorio.funcoesArgumentativas.length > 0 && (
          <>
            <h4 className="text-text-2 mt-4 text-xs font-bold">
              Para que serve no texto
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {repertorio.funcoesArgumentativas.map((funcao) => (
                <Badge key={funcao} className="bg-accent-tint text-accent-text">
                  {FUNCAO_ARGUMENTATIVA_LABELS[funcao]}
                </Badge>
              ))}
            </div>
          </>
        )}
        <p className="text-text-3 mt-3 text-xs">
          {PAPEL_REPERTORIO_LABELS[repertorio.papel]}
        </p>
      </section>

      {repertorio.comoUsar && (
        <Section title="Como usar">
          <p>{repertorio.comoUsar}</p>
        </Section>
      )}

      {repertorio.exemploAplicacao && (
        <Section title="Exemplo de aplicação">
          <div className="bg-surface-2 rounded-inner lg:bg-bg p-4">
            <p>{repertorio.exemploAplicacao}</p>
            <button
              type="button"
              onClick={() => void copiarExemplo()}
              className="focus-ring text-accent-text mt-3 flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-semibold"
            >
              <Copy size={16} aria-hidden="true" /> Copiar exemplo
            </button>
          </div>
        </Section>
      )}

      {(repertorio.erroComum ||
        repertorio.riscoUso === 'HIGH' ||
        repertorio.riscoUso === 'MEDIUM') && (
        <section className="bg-warning-bg rounded-inner p-4">
          <h3 className="text-warning flex items-center gap-2 text-sm font-bold">
            <TriangleAlert size={18} aria-hidden="true" /> Erro comum — evite
          </h3>
          {repertorio.erroComum && (
            <p className="text-text mt-2 text-sm leading-relaxed">
              {repertorio.erroComum}
            </p>
          )}
          {repertorio.riscoUso === 'HIGH' && (
            <p className="text-text mt-2 text-sm leading-relaxed font-semibold">
              Este repertório é usado errado com frequência. Confira se ele
              realmente sustenta o seu argumento.
            </p>
          )}
          {repertorio.riscoUso === 'MEDIUM' && (
            <p className="text-text-2 mt-2 text-sm">
              Risco moderado de uso errado.
            </p>
          )}
        </section>
      )}

      {repertorio.fontes.length > 0 && (
        <Section title="Fontes">
          <ul className="space-y-2">
            {repertorio.fontes.map((fonte, index) => (
              <li key={`${fonte.tipo}-${fonte.descricao}-${index}`}>
                <span className="text-text-3 mr-2 text-xs font-semibold">
                  {TIPO_FONTE_LABELS[fonte.tipo]}
                </span>
                {fonte.url ? (
                  <a
                    href={fonte.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring text-accent-text hover:text-accent-text-hover inline-flex min-h-11 items-center gap-1 rounded-lg text-sm font-semibold"
                  >
                    {fonte.descricao}{' '}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-text-body text-sm">
                    {fonte.descricao}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {repertorio.evidencia && (
        <Section title="Evidência">
          <div className="flex flex-wrap gap-1.5">
            {repertorio.evidencia.tipos.map((tipo) => (
              <Badge key={tipo} className="bg-control text-text-2">
                {TIPO_EVIDENCIA_LABELS[tipo]}
              </Badge>
            ))}
          </div>
          {repertorio.evidencia.populacao && (
            <p className="mt-3">
              <strong className="text-text">Quem foi pesquisado:</strong>{' '}
              {repertorio.evidencia.populacao}
            </p>
          )}
          {repertorio.evidencia.ano !== null && (
            <p className="mt-2">
              <strong className="text-text">Ano:</strong>{' '}
              {repertorio.evidencia.ano}
            </p>
          )}
          {dadoAntigo(repertorio.evidencia.ano, new Date().getFullYear()) && (
            <p className="bg-warning-bg text-text mt-3 rounded-lg p-3 text-sm leading-relaxed">
              Dado de {repertorio.evidencia.ano}. Confira se há uma edição mais
              recente antes de citar números.
            </p>
          )}
        </Section>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-text text-sm font-bold">{title}</h3>
      <div className="text-text-body mt-2 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Badge({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`rounded-pill inline-flex px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
