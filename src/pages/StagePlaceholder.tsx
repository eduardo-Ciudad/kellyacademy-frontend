export function StagePlaceholder({ title }: { title: string }) {
  return (
    <main className="bg-bg flex min-h-screen items-center justify-center px-5">
      <h1 className="text-text text-[28px] font-bold">{title}</h1>
    </main>
  );
}
