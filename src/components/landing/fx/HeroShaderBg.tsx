import { noiseDataUri } from '@/components/landing/fx/noise';

export function HeroShaderBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#04051a]"
    >
      <div className="hero-shader-blob hero-shader-blob-blue desk:left-[-10vw] desk:blur-[140px] absolute top-[42%] left-[-16vw] h-[min(700px,78vw)] w-[min(1100px,96vw)] rounded-[50%] bg-[#1410c0] opacity-85 blur-[90px]" />
      <div className="hero-shader-blob hero-shader-blob-violet desk:blur-[150px] absolute top-[58%] left-[38vw] h-[min(520px,62vw)] w-[min(800px,78vw)] rounded-[50%] bg-[#4a1aa8] opacity-70 blur-[90px]" />
      <div className="hero-shader-blob hero-shader-blob-teal desk:right-[-8vw] desk:blur-[150px] absolute top-[-18%] right-[-22vw] h-[min(620px,76vw)] w-[min(900px,90vw)] rounded-[50%] bg-[#10434d] opacity-75 blur-[90px]" />

      <div
        className="absolute inset-0 opacity-16 mix-blend-overlay"
        style={{ backgroundImage: `url("${noiseDataUri}")` }}
      />
      <div className="to-bg absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-b from-transparent" />
    </div>
  );
}
