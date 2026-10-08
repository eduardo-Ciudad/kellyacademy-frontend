import { ArrowLeft, Camera, Check } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { VisualizadorFoto } from '@/components/transcricao/VisualizadorFoto';
import { cn } from '@/lib/utils';
import {
  contarLinhasEscritas,
  posicoesIlegiveis,
  resumoIlegiveis,
} from '@/lib/transcricao';
import type { Foto } from '@/components/transcricao/foto';
import type { Tema } from '@/types/api';

type Props = {
  tema: Tema;
  fotos: Foto[];
  texto: string;
  onTextoChange: (texto: string) => void;
  onVoltar: () => void;
  onUsar: () => void;
};

export function RevisaoTranscricao({
  tema,
  fotos,
  texto,
  onTextoChange,
  onVoltar,
  onUsar,
}: Props) {
  const [aba, setAba] = useState<'foto' | 'texto'>('texto');
  const [trechoAtual, setTrechoAtual] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trechos = useMemo(() => posicoesIlegiveis(texto), [texto]);
  const linhas = contarLinhasEscritas(texto);
  const palavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const motivo = !texto.trim()
    ? 'O texto está vazio.'
    : trechos.length
      ? 'Troque ou apague o trecho ilegível para continuar.'
      : '';
  function irParaTrecho() {
    if (!trechos.length) return;
    setAba('texto');
    const trecho = trechos[trechoAtual % trechos.length];
    setTrechoAtual((valor) => (valor + 1) % trechos.length);
    window.setTimeout(() => {
      const area = textareaRef.current;
      area?.blur();
      area?.setSelectionRange(trecho.inicio, trecho.fim);
      area?.focus();
    }, 0);
  }
  return (
    <main className="bg-bg flex min-h-[100svh] flex-col lg:h-[100svh] lg:overflow-hidden">
      <header className="border-border-subtle flex shrink-0 items-center gap-3 border-b px-4 py-3 lg:h-[68px] lg:px-8 lg:py-0">
        <button
          type="button"
          onClick={onVoltar}
          aria-label="Voltar para as fotos"
          className="focus-ring bg-surface flex size-11 shrink-0 items-center justify-center rounded-full lg:size-10"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <span className="text-text block font-semibold">
            Revise antes de enviar
          </span>
          <span className="text-text-3 block truncate text-xs">
            {tema.titulo}
          </span>
        </div>
        <div className="hidden gap-2 lg:flex">
          <Button variant="secondary" onClick={onVoltar}>
            <Camera size={16} />
            Outras fotos
          </Button>
          <Button
            onClick={onUsar}
            disabled={Boolean(motivo)}
            title={motivo || undefined}
          >
            <Check size={16} />
            Usar este texto
          </Button>
        </div>
      </header>
      <div className="bg-surface rounded-pill mx-4 mt-3 grid grid-cols-2 p-1 lg:hidden">
        {(['foto', 'texto'] as const).map((item) => (
          <button
            key={item}
            onClick={() => setAba(item)}
            className={cn(
              'focus-ring rounded-pill py-2 text-sm font-semibold capitalize',
              aba === item ? 'bg-control text-text' : 'text-text-2',
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-2">
        <div className={cn('min-h-0', aba !== 'foto' && 'hidden lg:block')}>
          <VisualizadorFoto fotos={fotos} />
        </div>
        <section
          className={cn(
            'flex min-h-0 flex-1 flex-col gap-3 p-4 lg:p-6',
            aba !== 'texto' && 'hidden lg:flex',
          )}
        >
          <div className="bg-accent-tint rounded-inner text-text-body px-4 py-3 text-sm leading-[1.5]">
            Corrija só o que a leitura errou.{' '}
            <strong className="text-text">
              Os erros que são seus continuam valendo na correção.
            </strong>
          </div>
          {trechos.length > 0 && (
            <div className="bg-warning-bg rounded-inner text-warning flex items-center gap-3 px-4 py-3 text-sm">
              <span className="flex-1">
                <strong>{resumoIlegiveis(trechos)}</strong>
                <span className="hidden lg:inline">
                  {' '}
                  · compare com a foto e troque `[ilegível]` pela palavra certa
                </span>
              </span>
              <button
                type="button"
                onClick={irParaTrecho}
                className="focus-ring shrink-0 font-semibold underline"
              >
                Ir para o trecho
              </button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={texto}
            onChange={(event) => onTextoChange(event.target.value)}
            spellCheck={false}
            aria-label="Texto transcrito"
            className="bg-surface rounded-card text-text min-h-[420px] flex-1 resize-none p-5 leading-[1.8] outline-none lg:min-h-0 lg:p-7"
          />
          <div className="text-text-2 tabular hidden items-center gap-5 text-[13px] lg:flex">
            <span>
              <strong className="text-text">{linhas}</strong> linhas escritas
            </span>
            <span>
              <strong className="text-text">{palavras}</strong> palavras
            </span>
            <span className="ml-auto">Na folha do ENEM: de 7 a 30 linhas</span>
          </div>
        </section>
      </div>
      <footer className="border-border-subtle bg-bg sticky bottom-0 flex flex-col gap-2 border-t px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] lg:hidden">
        <div className="text-text-2 tabular flex justify-between text-xs">
          <span>
            <strong className="text-text">{linhas}</strong> linhas escritas
          </span>
          <span
            className={aba === 'foto' && trechos.length ? 'text-warning' : ''}
          >
            {aba === 'foto' && trechos.length
              ? `${trechos.length} ${trechos.length === 1 ? 'trecho ilegível' : 'trechos ilegíveis'}`
              : 'ENEM: de 7 a 30 linhas'}
          </span>
        </div>
        <Button
          onClick={onUsar}
          disabled={Boolean(motivo)}
          aria-describedby={motivo ? 'motivo-bloqueio' : undefined}
          className="h-[52px]"
        >
          <Check size={17} />
          Usar este texto
        </Button>
        {motivo && (
          <p id="motivo-bloqueio" className="text-danger text-center text-xs">
            {motivo}
          </p>
        )}
      </footer>
    </main>
  );
}
