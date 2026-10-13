import { useRef, type KeyboardEvent } from 'react';

type UseRovingTabsOptions = {
  count: number;
  onSelect: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
};

export function useRovingTabs({
  count,
  onSelect,
  orientation = 'vertical',
}: UseRovingTabsOptions) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (
      (orientation === 'vertical' && event.key === 'ArrowDown') ||
      (orientation === 'horizontal' && event.key === 'ArrowRight')
    )
      nextIndex = (index + 1) % count;
    if (
      (orientation === 'vertical' && event.key === 'ArrowUp') ||
      (orientation === 'horizontal' && event.key === 'ArrowLeft')
    )
      nextIndex = (index - 1 + count) % count;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = count - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    onSelect(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return { tabRefs, onKeyDown };
}
