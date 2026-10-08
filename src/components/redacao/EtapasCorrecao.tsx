import { Lock } from 'lucide-react';
import { EtapasProgresso } from '@/components/redacao/EtapasProgresso';
import { SparkIcon } from '@/components/ui/SparkIcon';
import type { Tema } from '@/types/api';

const ETAPAS = [
  'Texto recebido',
  'Lendo a estrutura do texto',
  'Avaliando as 5 competências',
  'Montando o diagnóstico',
] as const;
const AVANCOS = [3000, 8000] as const;

export function EtapasCorrecao({ tema }: { tema: Tema }) {
  return (
    <EtapasProgresso
      tema={tema}
      icone={<SparkIcon size={30} />}
      titulo="Corrigindo sua redação"
      duracao="Costuma levar de 10 a 30 segundos."
      rotuloCabecalho="Corrigindo…"
      etapas={ETAPAS}
      avancosMs={AVANCOS}
      rodape={
        <>
          <Lock className="mt-0.5 shrink-0" size={15} />
          Se a correção falhar, seu texto continua salvo e a tentativa não é
          descontada.
        </>
      }
    />
  );
}
