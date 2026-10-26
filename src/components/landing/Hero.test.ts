// @vitest-environment jsdom

import { createElement, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

let reducedMotion = false;

vi.mock('motion/react', async () => {
  const React = await import('react');
  const motionComponent = (tag: ElementType) =>
    React.forwardRef<HTMLElement, ComponentPropsWithoutRef<'div'> & {
      initial?: string;
      animate?: string;
      variants?: { hidden?: { opacity?: number } };
    }>(function MotionComponent(
      { initial, animate, variants, ...props },
      ref,
    ) {
      return React.createElement(tag, {
        ...props,
        ref,
        'data-entry-animation': initial && animate ? `${initial}-${animate}` : undefined,
        'data-initial-opacity':
          initial === 'hidden' ? variants?.hidden?.opacity : undefined,
      });
    });

  return {
    motion: {
      div: motionComponent('div'),
      h1: motionComponent('h1'),
      p: motionComponent('p'),
    },
    useReducedMotion: () => reducedMotion,
  };
});

vi.mock('@/components/landing/fx/HeroShaderBg', () => ({
  HeroShaderBg: () => null,
}));

import { Hero } from '@/components/landing/Hero';

function renderHero() {
  return render(createElement(MemoryRouter, null, createElement(Hero)));
}

describe('Hero', () => {
  afterEach(() => {
    cleanup();
    reducedMotion = false;
  });

  it('mantém CTAs e microtexto opacos desde o estado inicial', () => {
    renderHero();

    const primary = screen.getByRole('link', {
      name: /Corrigir minha redação grátis/i,
    });
    const secondary = screen.getByRole('link', { name: 'Ver como funciona' });
    const microcopy = screen.getByText(/3 correções grátis por dia/i);

    expect(primary.closest('[data-initial-opacity]')?.getAttribute('data-initial-opacity')).toBe('1');
    expect(secondary.closest('[data-initial-opacity]')?.getAttribute('data-initial-opacity')).toBe('1');
    expect(microcopy.getAttribute('data-initial-opacity')).toBe('1');
  });

  it('não aplica animação de entrada com movimento reduzido', () => {
    reducedMotion = true;
    const { container } = renderHero();

    expect(container.querySelector('[data-entry-animation]')).toBeNull();
  });
});
