import { JuliaMarca } from '@/components/julia/JuliaMarca';

type JuliaAvatarProps = {
  size: number;
  loading?: 'eager' | 'lazy';
};

export function JuliaAvatar({ size, loading = 'lazy' }: JuliaAvatarProps) {
  void loading;
  return (
    <JuliaMarca
      variante="principal"
      tamanho={size}
      titulo="Júlia, assistente da Kelly Academy"
      className="shrink-0"
    />
  );
}
