import type { MouseEvent } from 'react';

export function scrollToLandingAnchor(
  event: MouseEvent<HTMLAnchorElement>,
  href: `#${string}`,
) {
  if (!window.matchMedia('(max-width: 959px)').matches) return;

  const target = document.querySelector<HTMLElement>(href);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
    block: 'start',
  });
  window.history.replaceState(null, '', href);
}
