import { useEffect, useRef, useState } from 'react';

export const REVEAL_THRESHOLD = 0.15;

export function useRevealOnEnter<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || revealed) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: REVEAL_THRESHOLD },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed]);

  return { ref, revealed };
}
