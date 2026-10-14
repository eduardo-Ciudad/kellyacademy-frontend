import { SparkIcon } from '@/components/ui/SparkIcon';

export function DashboardPlaceholder({ title }: { title: string }) {
  return (
    <section>
      <p className="text-accent-text text-sm font-semibold">
        Kelly Academy
      </p>
      <h1 className="text-text mt-1 text-[28px] font-normal tracking-[-0.02em]">
        {title}
      </h1>
      <div className="rounded-card border-border-subtle bg-surface mt-8 border p-8 text-center sm:p-12">
        <span className="rounded-inner bg-accent-tint text-accent-text mx-auto flex size-12 items-center justify-center">
          <SparkIcon size={25} />
        </span>
        <h2 className="text-text mt-5 text-lg font-normal">
          Base pronta para receber os dados
        </h2>
        <p className="text-text-2 mx-auto mt-2 max-w-md text-sm leading-6">
          Esta área será implementada nas próximas etapas, preservando o shell e
          a navegação responsiva.
        </p>
      </div>
    </section>
  );
}
