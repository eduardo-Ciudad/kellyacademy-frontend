import { LegalPage } from '@/components/legal/LegalPage';
import { Button } from '@/components/ui/Button';
import { cookies } from '@/content/legal/cookies';
import { openCookiePreferences } from '@/lib/consent';
import { usePageMeta } from '@/lib/usePageMeta';

export function Cookies() {
  usePageMeta({
    title: 'Política de Cookies — Kelly Academy',
    description: cookies.description,
    path: '/cookies',
  });

  return (
    <LegalPage
      doc={cookies}
      relatedDocuments={[
        { label: 'Política de Privacidade', to: '/privacidade' },
        { label: 'Termos de Uso', to: '/termos' },
      ]}
      sectionActions={{
        controle: (
          <Button
            type="button"
            variant="outline"
            onClick={openCookiePreferences}
            className="mt-2"
          >
            Alterar preferências de cookies
          </Button>
        ),
      }}
    />
  );
}
