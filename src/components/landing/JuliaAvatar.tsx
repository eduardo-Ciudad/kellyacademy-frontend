import juliaAvatar from '@/assets/julia-avatar.webp';

type JuliaAvatarProps = {
  size: number;
  loading?: 'eager' | 'lazy';
};

export function JuliaAvatar({ size, loading = 'lazy' }: JuliaAvatarProps) {
  return (
    <img
      src={juliaAvatar}
      alt="Julia, assistente da Kelly Academy"
      width={size}
      height={size}
      loading={loading}
      decoding="async"
      className="shrink-0 rounded-full"
      style={{ width: size, height: size }}
    />
  );
}
