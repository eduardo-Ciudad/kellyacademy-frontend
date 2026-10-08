import { usoHojeQueryKey, useUsoHoje } from '@/hooks/useUsoHoje';

export const correcoesHojeQueryKey = usoHojeQueryKey('CORRECAO');

export function useCorrecoesHoje() {
  return useUsoHoje('CORRECAO');
}
