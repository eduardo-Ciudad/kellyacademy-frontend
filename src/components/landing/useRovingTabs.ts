import { useRef, type KeyboardEvent } from 'react';

type UseRovingTabsOptions = {
  count: number;
  onSelect: (index: number) => void;
};

export function useRovingTabs({ count, onSelect }: UseRovingTabsOptions) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % count;
    if (event.key === 'ArrowUp') nextIndex = (index - 1 + count) % count;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = count - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    onSelect(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return { tabRefs, onKeyDown };
}
