import {
  AlertCircle,
  Camera,
  Lock,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { DicasFoto } from '@/components/transcricao/DicasFoto';
import { cn } from '@/lib/utils';
import type { Foto } from '@/components/transcricao/foto';

export type AvisoCaptura = {
  tipo: 'erro' | 'recusada' | 'indisponivel';
  mensagem: string;
  repetir?: boolean;
};
type Props = {
  fotos: Foto[];
  preparando: boolean;
  aviso?: AvisoCaptura;
  restantes?: number;
  atingido: boolean;
  linkEditor: string;
  onAdicionar: (files: File[]) => void;
  onTrocar: (indice: number, file: File) => void;
  onRemover: (indice: number) => void;
  onLer: () => void;
};

function Saldo({ restantes, atingido }: Pick<Props, 'restantes' | 'atingido'>) {
  if (atingido)
    return (
      <p className="text-warning text-sm">
        Você usou as transcrições de hoje. Elas liberam à meia-noite.
      </p>
    );
  return (
    <p className="text-text-2 flex items-center gap-2 text-sm">
      <span className="bg-success size-2 rounded-full" />
      <span>
        <strong className="text-text">{restantes ?? '—'}</strong>{' '}
        {restantes === 1 ? 'transcrição restante' : 'transcrições restantes'}{' '}
        hoje
      </span>
    </p>
  );
}

export function CapturaFoto(props: Props) {
  const {
    fotos,
    preparando,
    aviso,
    restantes,
    atingido,
    linkEditor,
    onAdicionar,
    onTrocar,
    onRemover,
    onLer,
  } = props;
  const cameraRef = useRef<HTMLInputElement>(null);
  const galeriaRef = useRef<HTMLInputElement>(null);
  const trocaRef = useRef<HTMLInputElement>(null);
  const trocaIndice = useRef(0);
  const [drag, setDrag] = useState(false);
  function lerInput(
    event: ChangeEvent<HTMLInputElement>,
    callback: (files: File[]) => void,
  ) {
    callback(Array.from(event.target.files ?? []));
    event.target.value = '';
  }
  function drop(event: DragEvent) {
    event.preventDefault();
    setDrag(false);
    if (preparando) return;
    onAdicionar(Array.from(event.dataTransfer.files));
  }
  const recusada = aviso?.tipo === 'recusada';
  return (
    <div className="flex flex-1 flex-col">
      <input
        ref={cameraRef}
        hidden
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => lerInput(e, onAdicionar)}
      />
      <input
        ref={galeriaRef}
        hidden
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => lerInput(e, onAdicionar)}
      />
      <input
        ref={trocaRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) =>
          lerInput(e, ([file]) => file && onTrocar(trocaIndice.current, file))
        }
      />
      <div className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-5 px-4 py-6 lg:px-8 lg:py-10">
        {aviso &&
          (aviso.tipo === 'recusada' ? (
            <div
              role="alert"
              className="bg-danger-banner rounded-inner px-4 py-3"
            >
              <strong className="text-danger-text block text-sm">
                Não encontramos uma redação legível nesta foto
              </strong>
              <span className="text-text-2 mt-1 block text-sm">
                Esta tentativa não foi descontada. Tire outra seguindo as dicas.
              </span>
            </div>
          ) : (
            <div
              role="alert"
              className={cn(
                'rounded-inner flex items-center gap-3 px-4 py-3 text-sm',
                aviso.tipo === 'erro'
                  ? 'bg-danger-bg text-danger'
                  : 'bg-warning-bg text-warning',
              )}
            >
              <AlertCircle size={17} className="shrink-0" />
              <span className="flex-1">{aviso.mensagem}</span>
              {aviso.repetir && (
                <button className="font-semibold underline" onClick={onLer}>
                  Tentar de novo
                </button>
              )}
            </div>
          ))}
        <div className="text-center">
      <h1 className="text-text text-2xl font-normal tracking-[-0.02em] lg:text-[30px]">
            {fotos.length ? (
              `${fotos.length} ${fotos.length === 1 ? 'foto pronta' : 'fotos prontas'}`
            ) : (
              <>
                <span className="lg:hidden">Fotografe a folha inteira</span>
                <span className="hidden lg:inline">
                  Envie a foto da sua redação
                </span>
              </>
            )}
          </h1>
          <p className="text-text-2 mt-2 text-sm lg:text-[15px]">
            {fotos.length === 1 ? (
              'Se o texto continuar em outra folha, adicione a foto 2.'
            ) : fotos.length === 2 ? (
              'A ordem importa: a foto 1 é o começo do texto.'
            ) : (
              <>
                A IA lê sua letra e você revisa o texto
                <span className="hidden lg:inline">
                  , lado a lado com a foto,
                </span>{' '}
                antes de enviar para correção.
              </>
            )}
          </p>
        </div>
        {!fotos.length ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={drop}
            className={cn(
              'bg-photo-drop border-control rounded-card hidden h-[300px] cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed lg:flex',
              drag && 'border-accent',
            )}
          >
            <input
              hidden
              type="file"
              accept="image/*"
              multiple
              disabled={preparando}
              onChange={(e) => lerInput(e, onAdicionar)}
            />
            <span className="bg-accent-tint text-accent-text rounded-card flex size-16 items-center justify-center">
              <Upload size={28} />
            </span>
            <strong className="text-text text-lg">
              Arraste até 2 fotos para cá
            </strong>
            <span className="text-text-3 text-sm">
              JPEG, PNG ou WebP · a foto 1 é o começo do texto
            </span>
            <span className="bg-accent rounded-pill px-5 py-3 text-sm font-semibold text-white">
              Escolher do computador
            </span>
          </label>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 lg:gap-5">
              {fotos.map((foto, indice) => (
                <article
                  key={foto.id}
                  className={cn(
                    'bg-surface rounded-card relative overflow-hidden outline-2 outline-transparent',
                    recusada && 'outline-danger',
                  )}
                >
                  <div className="bg-photo-view flex h-[230px] items-center justify-center lg:h-[320px]">
                    <img
                      src={foto.url}
                      alt={`Pré-visualização da foto ${indice + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="bg-accent absolute top-3 left-3 flex size-7 items-center justify-center rounded-full text-xs font-bold text-white">
                    {indice + 1}
                  </span>
                  <div className="flex items-center gap-2 p-3">
                    <span className="text-text flex-1 text-sm font-semibold">
                      {indice ? 'Continuação' : 'Início'}
                    </span>
                    <button
                      aria-label={`Trocar a foto ${indice + 1}`}
                      disabled={preparando}
                      onClick={() => {
                        trocaIndice.current = indice;
                        trocaRef.current?.click();
                      }}
                      className="focus-ring bg-control flex size-9 items-center justify-center rounded-full disabled:opacity-60"
                    >
                      <RefreshCw size={15} />
                    </button>
                    <button
                      aria-label={`Remover a foto ${indice + 1}`}
                      disabled={preparando}
                      onClick={() => onRemover(indice)}
                      className="focus-ring bg-control text-danger flex size-9 items-center justify-center rounded-full disabled:opacity-60"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
              {fotos.length < 2 && (
                <button
                  disabled={preparando}
                  onClick={() => galeriaRef.current?.click()}
                  className="border-control text-text-2 focus-ring rounded-card flex min-h-[230px] flex-col items-center justify-center gap-2 border-2 border-dashed disabled:opacity-60 lg:min-h-[320px]"
                >
                  <Upload size={24} />
                  <strong>Adicionar foto 2</strong>
                </button>
              )}
            </div>
            <p className="text-text-3 text-center text-xs">
              Máximo de 2 fotos por redação.
            </p>
          </>
        )}
        <DicasFoto destacar={recusada} />
        {!fotos.length && (
          <div className="lg:hidden">
            <Saldo restantes={restantes} atingido={atingido} />
          </div>
        )}
        {fotos.length > 0 && (
          <div className="bg-surface rounded-card flex flex-col items-center gap-4 p-4 lg:flex-row">
            <div className="flex-1">
              <p className="text-text-2 text-sm">
                Usa <strong className="text-text">1</strong> das suas{' '}
                <strong className="text-text">{restantes ?? '—'}</strong>{' '}
                transcrições restantes hoje
              </p>
            </div>
            <Button
              onClick={onLer}
              disabled={preparando || atingido}
              loading={preparando}
              className="w-full lg:w-auto"
            >
              Ler a redação
            </Button>
            {recusada && (
              <Link
                to={linkEditor}
                className="text-accent-text text-sm font-semibold underline"
              >
                Digitar a redação
              </Link>
            )}
          </div>
        )}
        <p className="text-text-3 flex items-start justify-center gap-2 text-center text-xs leading-[1.5]">
          <Lock size={14} className="mt-0.5 shrink-0" />A foto vai para a IA do
          Google só para ler o texto e não fica guardada na Kelly Academy. No plano
          gratuito, o Google pode usar o conteúdo para melhorar os produtos
          dele.
        </p>
      </div>
      {!fotos.length && (
        <footer className="border-border-subtle bg-bg sticky bottom-0 grid grid-cols-2 gap-3 border-t px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] lg:hidden">
          <Button
            disabled={preparando}
            onClick={() => cameraRef.current?.click()}
            className="disabled:opacity-60"
          >
            <Camera size={17} />
            Tirar foto
          </Button>
          <Button
            variant="secondary"
            disabled={preparando}
            onClick={() => galeriaRef.current?.click()}
            className="disabled:opacity-60"
          >
            Escolher da galeria
          </Button>
        </footer>
      )}
    </div>
  );
}
