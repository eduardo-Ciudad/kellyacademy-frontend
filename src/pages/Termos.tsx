import { LegalPage } from '@/components/legal/LegalPage';
import { termos } from '@/content/legal/termos';
import { usePageMeta } from '@/lib/usePageMeta';

export function Termos() {
  usePageMeta({
    title: 'Termos de Uso — Kelly Academy',
    description: termos.description,
    path: '/termos',
  });

  return (
    <LegalPage
      doc={termos}
      relatedDocuments={[
        { label: 'Política de Privacidade', to: '/privacidade' },
        { label: 'Política de Cookies', to: '/cookies' },
      ]}
    />
  );
}
