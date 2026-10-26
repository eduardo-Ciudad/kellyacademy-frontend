import { AuthLayout } from '@/components/auth/AuthLayout';

type AuthRouteFallbackProps = {
  variant: 'login' | 'cadastro';
};

export function AuthRouteFallback({ variant }: AuthRouteFallbackProps) {
  return (
    <AuthLayout variant={variant} showMobileIntro={variant === 'cadastro'}>
      <div
        aria-busy="true"
        aria-label="Carregando"
        className="mt-8 flex flex-1 flex-col lg:my-auto lg:w-[420px] lg:flex-none"
      >
        <div className="motion-safe:animate-pulse">
          <div className="h-10 w-36 rounded-lg bg-[#1b1d29]" />
          <div className="mt-2 h-6 w-56 max-w-full rounded-md bg-[#1b1d29]" />

          <div className="mt-6 flex flex-col gap-4">
            <SkeletonField />
            <SkeletonField />
          </div>

          <div className="mt-6 h-[50px] w-full rounded-full bg-[#1d2240]" />
          <div className="mx-auto mt-5 h-5 w-52 max-w-[75%] rounded-md bg-[#1b1d29]" />
        </div>
      </div>
    </AuthLayout>
  );
}

function SkeletonField() {
  return (
    <div>
      <div className="mb-2 h-5 w-20 rounded-md bg-[#1b1d29]" />
      <div className="h-12 w-full rounded-xl border border-[#1f2130] bg-[#161823]" />
    </div>
  );
}
