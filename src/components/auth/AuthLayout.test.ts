// @vitest-environment jsdom

import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AuthLayout } from '@/components/auth/AuthLayout';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function LoginContent() {
  return createElement(
    'form',
    null,
    createElement('h1', null, 'Entrar'),
    createElement('label', { htmlFor: 'auth-email' }, 'E-mail'),
    createElement('input', { id: 'auth-email', type: 'email' }),
    createElement('label', { htmlFor: 'auth-senha' }, 'Senha'),
    createElement('input', { id: 'auth-senha', type: 'password' }),
    createElement('button', { type: 'submit' }, 'Entrar'),
  );
}

describe('AuthLayout', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('renderiza o hero e mantém o formulário de login acessível', () => {
    act(() =>
      root.render(
        createElement(
          AuthLayout,
          { variant: 'login' },
          createElement(LoginContent),
        ),
      ),
    );

    expect(container.textContent).toContain(
      'Descubra onde sua redação perde pontos.',
    );
    expect(container.querySelector('label[for="auth-email"]')).toBeTruthy();
    expect(container.querySelector('label[for="auth-senha"]')).toBeTruthy();
    expect(container.querySelector('button[type="submit"]')?.textContent).toBe(
      'Entrar',
    );
  });

  it('mantém um único h1 no layout de login', () => {
    act(() =>
      root.render(
        createElement(
          AuthLayout,
          { variant: 'login' },
          createElement(LoginContent),
        ),
      ),
    );

    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe('Entrar');
  });

  it('renderiza o hero no cadastro e remove o painel antigo', () => {
    act(() =>
      root.render(
        createElement(
          AuthLayout,
          { variant: 'cadastro' },
          createElement('h1', null, 'Crie sua conta'),
        ),
      ),
    );

    expect(container.textContent).toContain(
      'Descubra onde sua redação perde pontos.',
    );
    expect(container.textContent).not.toContain('Como funciona');
  });

  it('mantém um único h1 no layout de cadastro', () => {
    act(() =>
      root.render(
        createElement(
          AuthLayout,
          { variant: 'cadastro' },
          createElement('h1', null, 'Crie sua conta'),
        ),
      ),
    );

    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe('Crie sua conta');
  });
});
