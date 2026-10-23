// @vitest-environment jsdom

import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MaintenancePage } from './MaintenancePage';

describe('MaintenancePage', () => {
  afterEach(cleanup);

  it('renderiza a mensagem e os contatos da manutenção', () => {
    render(createElement(MaintenancePage));

    expect(
      screen.getByRole('heading', { name: 'Servidor em manutenção' }),
    ).toBeTruthy();
    expect(screen.getByText('Por favor, volte mais tarde.')).toBeTruthy();
    expect(
      screen.getByText('Para mais informações, entre em contato:'),
    ).toBeTruthy();

    const whatsapp = screen.getByRole('link', { name: '(17) 99100-9238' });
    expect(whatsapp.getAttribute('href')).toBe('https://wa.me/5517991009238');
    expect(whatsapp.getAttribute('target')).toBe('_blank');
    expect(whatsapp.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
