import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Categoria, Sabor } from '../types/menu';
import FlavorSelector from './FlavorSelector';

// Fixtures compartilhados — vi.hoisted para o factory do vi.mock conseguir referenciá-los
const { CATEGORIAS, SABORES } = vi.hoisted(() => {
  const CATEGORIAS: Categoria[] = [
    { id: 'tradicionais', nome: 'Tradicionais', preco: 30 },
    { id: 'especiais', nome: 'Especiais', preco: 35 },
    { id: 'sensacionais', nome: 'Sensacionais', preco: 40 },
  ];
  const SABORES: Sabor[] = [
    { id: 'calabresa', nome: 'Calabresa', descricao: '', imagem: '', categoria_id: 'tradicionais' },
    { id: 'margherita', nome: 'Margherita', descricao: '', imagem: '', categoria_id: 'tradicionais' },
    { id: 'portuguesa', nome: 'Portuguesa', descricao: '', imagem: '', categoria_id: 'especiais' },
    { id: 'catupiry', nome: 'Catupiry', descricao: '', imagem: '', categoria_id: 'especiais' },
    { id: 'chocolate', nome: 'Chocolate', descricao: '', imagem: '', categoria_id: 'sensacionais' },
  ];
  return { CATEGORIAS, SABORES };
});

// FlavorSelector usa useMenu().getCategoriaNome — mock determinístico, sem fetch real
vi.mock('../context/MenuContext', () => ({
  useMenu: () => ({
    menu: null,
    loading: false,
    error: null,
    getCategoriaNome: (id: string) => CATEGORIAS.find(c => c.id === id)?.nome,
  }),
}));

const GRUPOS = CATEGORIAS.map(cat => ({
  categoria: cat,
  sabores: SABORES.filter(s => s.categoria_id === cat.id),
}));

const CHOCOLATE = SABORES[4];

// Container do indicador sticky (aria-live="polite") onde o preço total da pizza
// é exibido — separado do preço por categoria e do botão "Adicionar ao carrinho".
function indicadorPrecoHTML() {
  const live = document.querySelector('[aria-live="polite"]');
  return live ? (live.parentElement as HTMLElement) : null;
}

// Assere o preço total exibido no indicador sticky (distinto do preço por categoria
// e do botão "Adicionar ao carrinho", que repetem o mesmo texto de moeda).
function expectTotalPrice(valor: string) {
  const indicador = indicadorPrecoHTML();
  expect(indicador).not.toBeNull();
  expect(indicador!.textContent).toContain(valor);
}

function expectSemAdicional() {
  const indicador = indicadorPrecoHTML();
  expect(indicador!.textContent).not.toContain('(+R$ 5,00 3º sabor)');
}

let scrollIntoViewStub: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // jsdom não implementa scrollIntoView — stub para observar as chamadas (US4)
  scrollIntoViewStub = vi.fn();
  Element.prototype.scrollIntoView = scrollIntoViewStub as unknown as typeof Element.prototype.scrollIntoView;
});

afterEach(() => {
  // @ts-expect-error — restaura o prototype do jsdom
  delete Element.prototype.scrollIntoView;
  cleanup();
});

function renderSelector(preselectedSabor?: Sabor) {
  const onConfirm = vi.fn();
  const utils = render(
    <FlavorSelector
      grupos={GRUPOS}
      categorias={CATEGORIAS}
      preselectedSabor={preselectedSabor}
      onConfirm={onConfirm}
    />
  );
  return { ...utils, onConfirm };
}

function flavorButton(nome: RegExp | string) {
  return screen.getByRole('button', { name: nome }) as HTMLButtonElement;
}

function clickFlavor(nome: RegExp | string) {
  fireEvent.click(flavorButton(nome));
}

function isPressed(btn: HTMLButtonElement, esperado: boolean) {
  expect(btn.getAttribute('aria-pressed')).toBe(String(esperado));
}

describe('FlavorSelector — US1: confirmação explícita do 3º sabor (NAD-8)', () => {
  it('com 2 sabores selecionados, tocar num 3º abre o modal sem aplicar a seleção (FR-002/FR-003)', () => {
    renderSelector();
    clickFlavor(/calabresa/i);
    clickFlavor(/margherita/i);
    expect(screen.queryByRole('dialog')).toBeNull();

    clickFlavor(/portuguesa/i);

    const dialog = screen.getByRole('dialog');
    // texto da mensagem dividido em <strong> — matcher por conteúdo concatenado
    expect(within(dialog).getByText((content) => content.includes('comporta até'))).toBeTruthy();
    expect(within(dialog).getByText((content) => content.includes('R$ 5,00'))).toBeTruthy();
    expect(within(dialog).getByText(/portuguesa/i)).toBeTruthy();
    // o sabor candidato ainda NÃO entrou na seleção enquanto o modal está aberto
    isPressed(flavorButton(/portuguesa/i), false);
    // preço permanece o de 2 sabores (base 30) — nenhuma mudança antes da confirmação
    expectTotalPrice('R$ 30,00');
  });

  it('"Adicionar" inclui o 3º sabor e o preço sobe R$ 5,00 (FR-005)', () => {
    renderSelector();
    clickFlavor(/calabresa/i);
    clickFlavor(/margherita/i);
    clickFlavor(/portuguesa/i);

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    isPressed(flavorButton(/portuguesa/i), true);
    // base 35 (Especiais) + R$ 5,00 do 3º sabor = 40
    expectTotalPrice('R$ 40,00');
    const indicador = indicadorPrecoHTML();
    expect(indicador!.textContent).toContain('(+R$ 5,00 3º sabor)');
  });

  it('"Cancelar" fecha o modal sem alterar seleção nem preço (FR-006/SC-003)', () => {
    renderSelector();
    clickFlavor(/calabresa/i);
    clickFlavor(/margherita/i);
    clickFlavor(/portuguesa/i);

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    isPressed(flavorButton(/portuguesa/i), false);
    isPressed(flavorButton(/calabresa/i), true);
    isPressed(flavorButton(/margherita/i), true);
    expectTotalPrice('R$ 30,00');
    expectSemAdicional();
  });

  it('tocar no backdrop equivale a "Cancelar" (edge case da spec)', () => {
    renderSelector();
    clickFlavor(/calabresa/i);
    clickFlavor(/margherita/i);
    clickFlavor(/portuguesa/i);

    const backdrop = screen.getByRole('dialog').parentElement;
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);

    expect(screen.queryByRole('dialog')).toBeNull();
    isPressed(flavorButton(/portuguesa/i), false);
  });

  it('com 3 sabores, o 4º segue bloqueado e a mensagem de máximo é explícita (FR-007)', () => {
    renderSelector();
    clickFlavor(/calabresa/i);
    clickFlavor(/margherita/i);
    clickFlavor(/portuguesa/i);
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));

    // mensagem explícita de máximo no indicador
    expect(screen.getByText(/máximo 3 sabores/i)).toBeTruthy();
    // botão do 4º sabor desabilitado; clique não abre modal
    const chocolate = flavorButton(/chocolate/i);
    expect(chocolate.disabled).toBe(true);
    fireEvent.click(chocolate);
    expect(screen.queryByRole('dialog')).toBeNull();
    isPressed(flavorButton(/chocolate/i), false);
  });

  it('desselecionar de 3 → 2 remove o adicional sem abrir modal (edge case da spec)', () => {
    renderSelector();
    clickFlavor(/calabresa/i);
    clickFlavor(/margherita/i);
    clickFlavor(/portuguesa/i);
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));
    expectTotalPrice('R$ 40,00');

    clickFlavor(/calabresa/i);

    expect(screen.queryByRole('dialog')).toBeNull();
    expectTotalPrice('R$ 35,00'); // base 35, sem adicional
    expectSemAdicional();
  });
});

describe('FlavorSelector — US2: labels claros (2 sabores padrão / 3º + R$ 5,00)', () => {
  it('sem sabores: "Inclui até 2 sabores como padrão"', () => {
    renderSelector();
    expect(screen.getByText('Inclui até 2 sabores como padrão')).toBeTruthy();
  });

  it('1 sabor: "1 sabor • até 2 no padrão"', () => {
    renderSelector();
    clickFlavor(/calabresa/i);
    expect(screen.getByText('1 sabor • até 2 no padrão')).toBeTruthy();
  });

  it('2 sabores: "2 sabores (padrão) • 3º sabor + R$ 5,00"', () => {
    renderSelector();
    clickFlavor(/calabresa/i);
    clickFlavor(/margherita/i);
    expect(screen.getByText('2 sabores (padrão) • 3º sabor + R$ 5,00')).toBeTruthy();
  });

  it('3 sabores: "3º sabor + R$ 5,00 aplicado • máximo 3 sabores"', () => {
    renderSelector();
    clickFlavor(/calabresa/i);
    clickFlavor(/margherita/i);
    clickFlavor(/portuguesa/i);
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));
    expect(screen.getByText('3º sabor + R$ 5,00 aplicado • máximo 3 sabores')).toBeTruthy();
  });
});

describe('FlavorSelector — US4: rolagem automática até o sabor pré-selecionado', () => {
  it('com preselectedSabor, rola uma única vez com scrollIntoView smooth/center (FR-010/FR-011)', () => {
    renderSelector(CHOCOLATE);
    expect(scrollIntoViewStub).toHaveBeenCalledTimes(1);
    expect(scrollIntoViewStub).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });

    // interação posterior não dispara nova rolagem automática
    clickFlavor(/calabresa/i);
    expect(scrollIntoViewStub).toHaveBeenCalledTimes(1);
  });

  it('sem preselectedSabor, nenhuma rolagem automática (a lista inicia no topo)', () => {
    renderSelector();
    expect(scrollIntoViewStub).not.toHaveBeenCalled();

    clickFlavor(/calabresa/i);
    expect(scrollIntoViewStub).not.toHaveBeenCalled();
  });
});