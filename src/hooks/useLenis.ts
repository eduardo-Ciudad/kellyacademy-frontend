import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function useLenis() {
  useEffect(() => {
    const media = gsap.matchMedia();

    media.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: 0.1, anchors: true });
      const updateScrollTrigger = () => {
        ScrollTrigger.update();
      };
      const raf = (time: number) => {
        lenis.raf(time * 1000);
      };

      lenis.on('scroll', updateScrollTrigger);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      return () => {
        lenis.off('scroll', updateScrollTrigger);
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    return () => media.revert();
  }, []);
}
