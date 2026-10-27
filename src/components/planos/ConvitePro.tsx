import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { RecursoPro } from '@/types/api';

const textos: Record<RecursoPro, { titulo: string; descricao: string }> = {
  JULIA: {
    titulo: 'A Júlia está disponível no plano Pro',
    descricao:
      'Ela explica cada ponto da sua correção, competência por competência.',
  },
  TEMAS_POSSIVEIS: {
    titulo: 'Os possíveis temas do ENEM 2026 estão no plano Pro',
    descricao:
      'Uma lista pesquisada com os temas mais prováveis, com eixo e argumentos para treinar.',
  },
  REPERTORIO_COMPLETO: {
    titulo: 'Este repertório está no plano Pro',
    descricao:
      'No Grátis você tem um repertório por problema social. O Pro libera todos.',
  },
};

export function ConvitePro({
  recurso,
  variante = 'inline',
}: {
  recurso: RecursoPro;
  variante?: 'inline' | 'sheet';
}) {
  const texto = textos[recurso];
  return (
    <section
      className={cn(
        'border-accent-outline bg-accent-tint rounded-card border px-5 py-6 text-center',
        variante === 'sheet' &&
          'flex min-h-[360px] flex-col items-center justify-center',
      )}
    >
      <span className="bg-surface text-accent-text border-accent-outline mx-auto flex size-10 items-center justify-center rounded-full border">
        <Lock size={18} aria-hidden="true" />
        <span className="sr-only">Recurso do plano Pro</span>
      </span>
      <h2 className="text-text mt-4 text-xl leading-tight font-semibold">
        {texto.titulo}
      </h2>
      <p className="text-text-2 mx-auto mt-2 max-w-lg text-sm leading-6">
        {texto.descricao}
      </p>
      <Link
        to="/planos"
        className="focus-ring bg-accent hover:bg-accent-hover rounded-pill mt-5 inline-flex min-h-11 items-center justify-center px-5 text-sm font-semibold text-white"
      >
        Ver o plano Pro
      </Link>
    </section>
  );
}
