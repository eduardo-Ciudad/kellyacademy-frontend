import { Check, ChevronDown, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAlternarTemaPossivel } from '@/hooks/useTemasPossiveis';
import { cn } from '@/lib/utils';
import type { TemaPossivel } from '@/types/api';

type TemaPossivelCardProps = {
  tema: TemaPossivel;
  aberto: boolean;
  onAlternarAberto: () => void;
};

export function TemaPossivelCard({
  tema,
  aberto,
  onAlternarAberto,
}: TemaPossivelCardProps) {
  const painelId = `material-tema-${tema.id}`;
  const alternarTema = useAlternarTemaPossivel();

  return (
    <article className="bg-surface rounded-[18px] p-4 lg:p-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 lg:px-4 lg:py-[18px] lg:pl-[22px]">
        <div className="min-w-0 flex-1">
          <span className="text-text-3 block text-xs font-semibold lg:text-[13px]">
            {tema.eixo}
          </span>
          <h3 className="text-text mt-1 text-[15px] leading-[1.38] font-semibold lg:text-base lg:leading-[1.4]">
            {tema.titulo}
          </h3>
          <span className="text-text-2 mt-1 hidden text-[13px] lg:block">
            Grupo social: {tema.grupoSocial}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={tema.adicionado}
            disabled={alternarTema.isPending}
            onClick={() =>
              alternarTema.mutate({
                temaId: tema.id,
                adicionar: !tema.adicionado,
              })
            }
            className={cn(
              'focus-ring rounded-pill flex min-h-11 flex-1 items-center justify-center gap-1.5 border px-3.5 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 lg:flex-none lg:px-4',
              tema.adicionado
                ? 'border-accent-tint bg-accent-tint text-possivel'
                : 'border-control text-text bg-transparent',
            )}
          >
            {tema.adicionado ? (
              <Check size={16} strokeWidth={2.4} aria-hidden="true" />
            ) : (
              <Plus
                className="text-accent-text"
                size={16}
                strokeWidth={2.4}
                aria-hidden="true"
              />
            )}
            {tema.adicionado ? 'Na sua lista' : 'Adicionar'}
          </button>
          <button
            type="button"
            aria-expanded={aberto}
            aria-controls={painelId}
            aria-label={
              aberto ? 'Fechar material de estudo' : 'Ver material de estudo'
            }
            onClick={onAlternarAberto}
            className={cn(
              'focus-ring border-control text-text-body rounded-pill flex min-h-11 shrink-0 items-center justify-center gap-1.5 border px-4 text-sm font-semibold lg:size-11 lg:border-0 lg:p-0',
              aberto && 'bg-control',
            )}
          >
            <span className="lg:hidden">Estudar</span>
            <ChevronDown
              size={18}
              aria-hidden="true"
              className={cn(
                'transition-transform duration-200',
                aberto && 'rotate-180',
              )}
            />
          </button>
        </div>
      </div>

      {aberto && (
        <div
          id={painelId}
          className="border-border-subtle mt-3.5 flex flex-col gap-4 border-t pt-3.5 lg:mt-0 lg:gap-5 lg:px-[22px] lg:pt-5 lg:pb-[22px]"
        >
          <span className="text-text-2 text-[13px] lg:hidden">
            Grupo social: {tema.grupoSocial}
          </span>
          <MaterialSection title="Por que merece atenção">
            <p className="text-text text-sm leading-[1.55] lg:text-[15px] lg:leading-[1.6]">
              {tema.justificativa}
            </p>
          </MaterialSection>

          <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            <MaterialList
              title="Argumentos possíveis"
              items={tema.argumentos}
            />
            <MaterialList title="Leis e marcos" items={tema.marcosLegais} />
            <MaterialSection
              title={
                <span className="flex items-center gap-2">
                  Quem pode intervir
                  <span className="text-c5 bg-c5-bg rounded-pill px-2 py-0.5 text-[11px] font-bold">
                    C5
                  </span>
                </span>
              }
            >
              <div className="flex flex-wrap gap-1.5">
                {tema.agentesIntervencao.map((agente) => (
                  <span
                    key={agente}
                    className="bg-control rounded-pill text-text px-2.5 py-1 text-[13px]"
                  >
                    {agente}
                  </span>
                ))}
              </div>
              <span className="text-text-3 mt-2 hidden text-xs leading-[1.45] lg:block">
                Use na proposta de intervenção: quem faz, o quê e como.
              </span>
            </MaterialSection>
          </div>

          <div className="flex justify-end lg:pt-1">
            {tema.adicionado ? (
              <Link
                to={`/temas/${tema.id}/escrever`}
                className="focus-ring bg-accent hover:bg-accent-hover rounded-pill flex min-h-12 w-full items-center justify-center px-5 text-[15px] font-semibold text-white transition-colors lg:min-h-11 lg:w-auto"
              >
                Escrever sobre este tema →
              </Link>
            ) : (
              <span className="text-text-3 hidden text-sm lg:block">
                Adicione à sua lista para escrever sobre este tema.
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function MaterialSection({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <h4 className="text-text-2 text-[13px] font-bold">{title}</h4>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function MaterialList({ title, items }: { title: string; items: string[] }) {
  return (
    <MaterialSection title={title}>
      <ul className="text-text-body ml-[18px] list-disc space-y-1 text-sm leading-[1.45]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </MaterialSection>
  );
}
