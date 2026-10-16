import { Link } from 'react-router-dom';
import { usePageMeta } from '@/lib/usePageMeta';

export function NotFound() {
  usePageMeta({
    title: 'Página não encontrada — Kelly Academy',
    noindex: true,
  });
  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-center">
      <div>
        <p className="tabular text-accent-text text-sm font-semibold">404</p>
        <h1 className="text-text mt-2 text-[28px] font-normal">
          Página não encontrada
        </h1>
        <Link
          to="/"
          className="focus-ring rounded-pill bg-accent mt-6 inline-flex min-h-11 items-center px-6 font-semibold text-white"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
