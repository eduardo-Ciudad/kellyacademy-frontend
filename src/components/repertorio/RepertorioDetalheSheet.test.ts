// @vitest-environment jsdom
import { createElement, createRef, useRef, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import * as Dialog from '@radix-ui/react-dialog';
import {
  RepertorioDialogFrame,
} from '@/components/repertorio/RepertorioDetalheSheet';
import {
  caminhoListaRepertorio,
  detalheRepertorioAberto,
} from '@/lib/repertorioDialog';
import { REPERTORIO_GRID_CLASS } from '@/pages/Repertorio';

afterEach(cleanup);

function DialogHarness() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  return createElement(
    'div',
    null,
    createElement(
      'button',
      { ref: openerRef, type: 'button', onClick: () => setOpen(true) },
      'Abrir repertório',
    ),
    createElement(
      Dialog.Root,
      { open, onOpenChange: setOpen },
      open
        ? createElement(
            Dialog.Portal,
            null,
            createElement(
              RepertorioDialogFrame,
              { title: 'Título do repertório', openerRef },
              createElement('p', null, 'Conteúdo'),
            ),
          )
        : null,
    ),
  );
}

describe('painel de detalhe do repertório', () => {
  it('mantém a mesma grade com o detalhe fechado ou aberto', () => {
    expect(REPERTORIO_GRID_CLASS).toBe('mt-5 grid gap-3 lg:grid-cols-2');
    expect(REPERTORIO_GRID_CLASS).not.toContain('grid-cols-1');
  });

  it('abre por código de rota e volta à lista preservando filtros', () => {
    expect(detalheRepertorioAberto('paulo-freire')).toBe(true);
    expect(detalheRepertorioAberto(undefined)).toBe(false);
    expect(caminhoListaRepertorio('q=educacao&tipo=PERSON')).toBe(
      '/repertorio?q=educacao&tipo=PERSON',
    );
  });

  it('fecha pelo X e devolve o foco ao card de origem', async () => {
    const user = userEvent.setup();
    render(createElement(DialogHarness));
    const opener = screen.getByRole('button', { name: 'Abrir repertório' });
    await user.click(opener);
    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('fecha com Esc e com clique no overlay', async () => {
    const user = userEvent.setup();
    render(createElement(DialogHarness));
    const opener = screen.getByRole('button', { name: 'Abrir repertório' });
    await user.click(opener);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(opener);
    await user.click(screen.getByTestId('repertorio-overlay'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('expõe semântica modal e título acessível', () => {
    const openerRef = createRef<HTMLElement>();
    render(
      createElement(
        Dialog.Root,
        { open: true },
        createElement(
          Dialog.Portal,
          null,
          createElement(
            RepertorioDialogFrame,
            { title: 'Título do repertório', openerRef },
            'Conteúdo',
          ),
        ),
      ),
    );
    const dialog = screen.getByRole('dialog', { name: 'Título do repertório' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });
});
