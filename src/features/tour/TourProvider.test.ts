// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TourProvider, useTour } from './TourProvider';
import { tourStorageKey } from './useTourStorage';

vi.mock('@/hooks/useUsuario', () => ({
  useUsuario: () => ({
    nome: 'Kelly',
    iniciais: 'K',
    email: 'kelly@example.com',
  }),
}));

const key = tourStorageKey('kelly@example.com');

function matchMedia(matches = false) {
  return vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? true : matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function Targets({
  omit,
  onTargetClick,
}: {
  omit?: string;
  onTargetClick?: () => void;
}) {
  return createElement(
    'div',
    null,
    ['temas', 'nova-redacao', 'repertorio', 'evolucao', 'correcoes-hoje']
      .filter((target) => target !== omit)
      .map((target) =>
        createElement(
          'button',
          {
            key: target,
            'data-tour': target,
            onClick: target === 'temas' ? onTargetClick : undefined,
          },
          target,
        ),
      ),
  );
}

function ReviewButton() {
  const { openTour } = useTour();
  return createElement(
    'button',
    { type: 'button', onClick: openTour },
    'Rever tour de boas-vindas',
  );
}

function renderTour(
  children: ReactNode = createElement(Targets),
  initialRoute = '/',
) {
  return render(
    createElement(
      MemoryRouter,
      { initialEntries: [initialRoute] },
      createElement(TourProvider, null, children),
    ),
  );
}

beforeEach(() => {
  window.localStorage.clear();
  window.matchMedia = matchMedia();
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('tour de boas-vindas', () => {
  it('abre no primeiro acesso e permanece fechado quando já foi concluído', async () => {
    const first = renderTour();
    expect(
      await screen.findByRole('heading', {
        name: 'Primeira vez na Kelly Academy?',
      }),
    ).toBeTruthy();
    first.unmount();

    window.localStorage.setItem(key, 'concluido');
    renderTour();
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', {
          name: 'Primeira vez na Kelly Academy?',
        }),
      ).toBeNull();
    });
  });

  it('não abre automaticamente fora da rota inicial', async () => {
    renderTour(createElement(Targets), '/temas');
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', {
          name: 'Primeira vez na Kelly Academy?',
        }),
      ).toBeNull();
    });
  });

  it('pular grava a conclusão e mostra o aviso final', async () => {
    const user = userEvent.setup();
    renderTour();
    await user.click(
      await screen.findByRole('button', { name: 'Já conheço, pular' }),
    );
    expect(window.localStorage.getItem(key)).toBe('concluido');
    expect((await screen.findByRole('status')).textContent).toContain(
      'Pronto!',
    );
  });

  it('navega com Próximo e Voltar e termina com Começar no passo 5', async () => {
    const user = userEvent.setup();
    renderTour();
    await user.click(
      await screen.findByRole('button', { name: 'Fazer o tour · 1 minuto' }),
    );
    expect(await screen.findByText('PASSO 1 DE 5')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Próximo' }));
    expect(await screen.findByText('PASSO 2 DE 5')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(await screen.findByText('PASSO 1 DE 5')).toBeTruthy();
    for (let index = 0; index < 4; index += 1)
      await user.click(screen.getByRole('button', { name: 'Próximo' }));
    expect(await screen.findByText('PASSO 5 DE 5')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Começar' })).toBeTruthy();
  });

  it('bloqueia cliques no alvo durante um passo', async () => {
    const onTargetClick = vi.fn();
    const user = userEvent.setup();
    renderTour(createElement(Targets, { onTargetClick }));
    await user.click(
      await screen.findByRole('button', { name: 'Fazer o tour · 1 minuto' }),
    );
    await user.click(await screen.findByTestId('tour-interaction-blocker'));
    expect(onTargetClick).not.toHaveBeenCalled();
  });

  it('remove da sequência um passo cujo alvo não existe', async () => {
    const user = userEvent.setup();
    renderTour(createElement(Targets, { omit: 'repertorio' }));
    await user.click(
      await screen.findByRole('button', { name: 'Fazer o tour · 1 minuto' }),
    );
    expect(await screen.findByText('PASSO 1 DE 4')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Próximo' }));
    await user.click(screen.getByRole('button', { name: 'Próximo' }));
    expect(
      await screen.findByRole('heading', { name: 'Veja sua nota evoluir' }),
    ).toBeTruthy();
    expect(screen.queryByText('Repertório pronto para usar')).toBeNull();
  });

  it('Esc encerra o tour e devolve o foco ao elemento anterior', async () => {
    window.localStorage.setItem(key, 'concluido');
    const user = userEvent.setup();
    renderTour(createElement(ReviewButton));
    const review = screen.getByRole('button', {
      name: 'Rever tour de boas-vindas',
    });
    review.focus();
    await user.click(review);
    expect(await screen.findByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(review);
  });

  it('a ação Rever tour abre novamente na tela de boas-vindas', async () => {
    window.localStorage.setItem(key, 'concluido');
    const user = userEvent.setup();
    renderTour(createElement(ReviewButton));
    await user.click(
      screen.getByRole('button', { name: 'Rever tour de boas-vindas' }),
    );
    expect(
      await screen.findByRole('heading', {
        name: 'Primeira vez na Kelly Academy?',
      }),
    ).toBeTruthy();
  });

  it('não quebra a página quando o localStorage lança erro', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage indisponível');
    });
    const { container } = renderTour(
      createElement('main', null, 'Área logada'),
    );
    expect(container.textContent).toContain('Área logada');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
