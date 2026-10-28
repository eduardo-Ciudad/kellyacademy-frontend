import type { Tema } from '@/types/api';

export function rotuloTema(tema: Pick<Tema, 'origem' | 'ano'>): string {
  if (tema.origem === 'PERSONALIZADO') return 'Meu tema';
  if (tema.origem === 'AUTORAL') return 'Autoral';
  if (tema.origem === 'PREVISAO') {
    return tema.ano !== null ? `Possível ${tema.ano}` : 'Tema possível';
  }
  return tema.ano !== null ? `ENEM ${tema.ano}` : 'ENEM';
}
