import { Clock } from 'lucide-react';

type AvisoEntregaEmailProps = {
  reenviado?: boolean;
};

export function AvisoEntregaEmail({ reenviado = false }: AvisoEntregaEmailProps) {
  return (
    <div
      role="note"
      className="bg-surface border-control text-text-2 rounded-inner flex items-start gap-3 border p-4 text-sm leading-6"
    >
      <Clock className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
      <div>
        <p className="text-text font-semibold">
          O e-mail pode levar até 2 minutos para chegar.
        </p>
        <p>
          Se não aparecer na caixa de entrada, confira o spam e a aba Promoções.
          Se estiver no spam, marque como “Não é spam”.
        </p>
        {reenviado && (
          <p>
            Se você pediu um novo link, use sempre o e-mail mais recente: os
            anteriores deixam de valer.
          </p>
        )}
      </div>
    </div>
  );
}
