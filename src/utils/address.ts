import { Address } from '../types/address';

export function formatAddress(
  addr: Pick<Address, 'rua' | 'numero' | 'complemento' | 'pontoReferencia'>
): string {
  const parts = [`${addr.rua}, ${addr.numero}`];
  if (addr.complemento.trim()) parts.push(`(${addr.complemento.trim()})`);
  if (addr.pontoReferencia.trim()) parts.push(`— Ref: ${addr.pontoReferencia.trim()}`);
  return parts.join(' ');
}
