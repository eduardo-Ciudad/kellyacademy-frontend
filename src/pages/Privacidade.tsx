import { LegalPage } from '@/components/legal/LegalPage';
import { privacidade } from '@/content/legal/privacidade';
import { usePageMeta } from '@/lib/usePageMeta';

export function Privacidade() {
  usePageMeta({
    title: 'Política de Privacidade — Kelly Academy',
    description: privacidade.description,
    path: '/privacidade',
  });

  return (
    <LegalPage
      doc={privacidade}
      related={{ label: 'Termos de Uso', to: '/termos' }}
    />
  );
}
