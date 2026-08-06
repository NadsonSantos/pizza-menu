export interface Address {
  id: string;
  rua: string;
  numero: string;
  complemento: string;
  pontoReferencia: string;
}

export interface AddressState {
  addresses: Address[];
  selectedId: string | null;
}

export type AddressAction =
  | { type: 'ADD'; address: Address }
  | { type: 'REMOVE'; id: string }
  | { type: 'SELECT'; id: string | null };

export interface AddressContextValue {
  state: AddressState;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string | null) => void;
  getSelectedAddress: (id?: string | null) => Address | undefined;
}
