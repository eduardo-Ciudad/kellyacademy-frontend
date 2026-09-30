import { AlertTriangle, Info } from 'lucide-react';
import { competencias } from '@/lib/competencias';
import type { Tema } from '@/types/api';

export function TemaInfo({ tema }: { tema: Tema }) {
  return (
    <div className="flex flex-col gap-4">
      <section className="bg-surface rounded-card flex flex-col gap-2.5 px-[22px] py-5">
        <span className="text-text-3 text-xs font-semibold">Proposta</span>
        <p className="text-text-body text-[15px] leading-[1.6]">
          Redija um texto dissertativo-argumentativo sobre o tema{' '}
          <strong className="text-text">“{tema.titulo}”</strong>, apresentando
          proposta de intervenção que respeite os direitos humanos.
        </p>
        <div className="bg-surface-2 text-text-3 rounded-[10px] px-3 py-2.5 text-[13px] leading-5">
          <Info className="mr-2 inline" size={15} aria-hidden="true" />
          {tema.textosMotivadores || 'Textos motivadores em breve'}
        </div>
      </section>

      <section className="bg-surface rounded-card px-[22px] py-5">
        <h2 className="text-text text-[15px] font-bold">
          O que a IA vai avaliar
        </h2>
        <div className="mt-3.5 flex flex-col gap-3">
          {competencias.map((competencia) => (
            <div
              key={competencia.numero}
              className="text-text-body flex items-start gap-2.5 text-sm"
            >
              <span
                className={`w-7 shrink-0 text-xs font-bold ${competencia.colorClass}`}
              >
                {competencia.codigo}
              </span>
              <span className="leading-[1.45]">{competencia.nome}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-warning-bg flex gap-2.5 rounded-[16px] px-4 py-3.5 text-[13px] leading-[1.5] text-[#E8D9B0]">
        <AlertTriangle
          className="text-warning mt-0.5 shrink-0"
          size={16}
          aria-hidden="true"
        />
        Textos com menos de 80 palavras são anulados, como no ENEM.
      </div>
    </div>
  );
}
