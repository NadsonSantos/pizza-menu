import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CartBottomSheet from './CartBottomSheet';

const EXIT_MS = 300;

function stubMatchMedia(matches: boolean) {
  const mq = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  vi.stubGlobal('matchMedia', vi.fn(() => mq));
  return mq;
}

interface SheetProps {
  itemCount: number;
  total: number;
  onExitComplete?: () => void;
}

function sheetElement({ itemCount, total, onExitComplete = vi.fn() }: SheetProps) {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<CartBottomSheet itemCount={itemCount} total={total} onExitComplete={onExitComplete} />} />
        <Route path="/carrinho" element={<div>PÁGINA DO CARRINHO</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  stubMatchMedia(false);
  // jsdom não dispara rAF de forma confiável — converte em setTimeout para controle via timers
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) =>
    window.setTimeout(() => cb(performance.now()), 16)
  );
  vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('CartBottomSheet (CR-002 — testes da máquina de estados entering/exiting)', () => {
  it('renderiza plural "1 item" e total formatado via formatCurrency', () => {
    render(sheetElement({ itemCount: 1, total: 45 }));
    expect(screen.getByText('1 item')).toBeTruthy();
    expect(screen.getByText('R$ 45,00')).toBeTruthy();
  });

  it('renderiza plural "N itens" e total formatado via formatCurrency', () => {
    render(sheetElement({ itemCount: 3, total: 90 }));
    expect(screen.getByText('3 itens')).toBeTruthy();
    expect(screen.getByText('R$ 90,00')).toBeTruthy();
  });

  it('card é um único elemento interativo acessível por teclado — link com href, sem botão aninhado (CR-001)', () => {
    render(sheetElement({ itemCount: 2, total: 90 }));
    const link = screen.getByRole('link', { name: /ver carrinho/i });
    // âncora nativa: focável e acionável via Enter pelo navegador
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/carrinho');
    // sem tab stops duplicados nem aninhamento de interativos
    expect(within(link).queryByRole('button')).toBeNull();
  });

  it('clique no card navega para /carrinho', async () => {
    render(sheetElement({ itemCount: 2, total: 90 }));
    fireEvent.click(screen.getByRole('link', { name: /ver carrinho/i }));
    expect(await screen.findByText('PÁGINA DO CARRINHO')).toBeTruthy();
  });

  it('transição itemCount 1 → 0 dispara onExitComplete via transitionend', () => {
    const onExitComplete = vi.fn();
    const { rerender } = render(sheetElement({ itemCount: 1, total: 45, onExitComplete }));

    rerender(sheetElement({ itemCount: 0, total: 0, onExitComplete }));

    const link = screen.getByRole('link');
    const wrapper = link.parentElement;
    expect(wrapper).not.toBeNull();
    fireEvent.transitionEnd(wrapper!, { propertyName: 'transform' });
    expect(onExitComplete).toHaveBeenCalledTimes(1);
  });

  it('transição itemCount 1 → 0 dispara onExitComplete via fallback de timeout (sem transitionend)', () => {
    vi.useFakeTimers();
    const onExitComplete = vi.fn();
    const { rerender } = render(sheetElement({ itemCount: 1, total: 45, onExitComplete }));

    rerender(sheetElement({ itemCount: 0, total: 0, onExitComplete }));

    act(() => {
      vi.advanceTimersByTime(EXIT_MS + 100);
    });
    expect(onExitComplete).toHaveBeenCalledTimes(1);
  });

  it('congela os últimos valores durante a saída — sem "0 itens / R$ 0,00" (CR-004)', () => {
    const onExitComplete = vi.fn();
    const { rerender } = render(sheetElement({ itemCount: 2, total: 90, onExitComplete }));

    rerender(sheetElement({ itemCount: 0, total: 0, onExitComplete }));

    // enquanto desliza para baixo, ainda exibe os últimos valores reais
    expect(screen.getByText('2 itens')).toBeTruthy();
    expect(screen.getByText('R$ 90,00')).toBeTruthy();
    expect(screen.queryByText('0 itens')).toBeNull();
    expect(screen.queryByText('R$ 0,00')).toBeNull();
  });

  it('com prefers-reduced-motion, a saída desmonta imediatamente, sem animação (CR-001)', () => {
    stubMatchMedia(true);
    const onExitComplete = vi.fn();
    const { rerender } = render(sheetElement({ itemCount: 1, total: 45, onExitComplete }));

    // monta já visível (entering=false) — sem double rAF
    expect(screen.getByText('1 item')).toBeTruthy();

    rerender(sheetElement({ itemCount: 0, total: 0, onExitComplete }));

    // unmount imediato, sem depender de transitionend nem de timeout
    expect(onExitComplete).toHaveBeenCalledTimes(1);
  });
});
