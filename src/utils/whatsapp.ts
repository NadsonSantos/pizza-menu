import { CartState } from '../types/cart';
import { formatCurrency } from './pricing';

export function formatWhatsAppMessage(
  state: CartState,
  pizzariaNome: string,
  subtotal: number,
  taxaEntrega: number,
  total: number
): string {
  const lines: string[] = [];
  lines.push(`🍕 *Pedido — ${pizzariaNome}*`);
  lines.push('');
  lines.push('*Itens:*');

  for (const item of state.items) {
    const qtd = item.quantidade > 1 ? `${item.quantidade}x ` : '';
    const nome = item.tipo === 'pizza' ? item.nome : item.nome;
    lines.push(`${qtd}${nome} — ${formatCurrency(item.precoUnitario * item.quantidade)}`);
    if (item.observacao) lines.push(`   Obs: ${item.observacao}`);
  }

  lines.push('');
  lines.push(`*Subtotal:* ${formatCurrency(subtotal)}`);
  if (taxaEntrega > 0) lines.push(`*Taxa de entrega:* ${formatCurrency(taxaEntrega)}`);
  lines.push(`*Total:* ${formatCurrency(total)}`);
  lines.push('');
  const entrega = state.delivery === 'entrega' ? 'Sim' : 'Retirada no local';
  lines.push(`*Entrega:* ${entrega}`);
  lines.push(`*Pagamento:* ${paymentLabel(state)}`);
  if (state.payment === 'dinheiro' && state.troco) lines.push(`*Troco para:* R$ ${state.troco}`);
  lines.push('');
  lines.push('_Obrigado pelo pedido!_');
  return lines.join('\n');
}

function paymentLabel(state: CartState): string {
  const map: Record<string, string> = { dinheiro: 'Dinheiro', cartao: 'Cartão', pix: 'PIX' };
  return map[state.payment ?? ''] ?? 'Não informado';
}

export function createWhatsAppLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function paymentLabelText(method: string): string {
  const map: Record<string, string> = { dinheiro: 'Dinheiro', cartao: 'Cartão', pix: 'PIX' };
  return map[method] ?? method;
}
