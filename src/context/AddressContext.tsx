import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { Address, AddressState, AddressAction, AddressContextValue } from '../types/address';

const STORAGE_KEY = 'pizza-menu-addresses';
const MAX_ADDRESSES = 2;

const initialState: AddressState = {
  addresses: [],
  selectedId: null,
};

function isValidStoredAddress(value: unknown): value is Address {
  if (typeof value !== 'object' || value === null) return false;
  const addr = value as Record<string, unknown>;
  return (
    typeof addr.id === 'string' &&
    typeof addr.rua === 'string' &&
    addr.rua.trim().length > 0 &&
    typeof addr.numero === 'string' &&
    addr.numero.trim().length > 0 &&
    typeof addr.complemento === 'string' &&
    typeof addr.pontoReferencia === 'string'
  );
}

function loadFromStorage(): AddressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return initialState;

    const data = parsed as Record<string, unknown>;
    if (!Array.isArray(data.addresses)) return initialState;

    const addresses = data.addresses.filter(isValidStoredAddress).slice(0, MAX_ADDRESSES);
    const selectedId =
      typeof data.selectedId === 'string' && addresses.some(a => a.id === data.selectedId)
        ? data.selectedId
        : null;

    return { addresses, selectedId };
  } catch {
    // localStorage indisponível ou payload inválido — fallback silencioso
    return initialState;
  }
}

function addressReducer(state: AddressState, action: AddressAction): AddressState {
  switch (action.type) {
    case 'ADD': {
      if (state.addresses.length >= MAX_ADDRESSES) return state;
      const addresses = [...state.addresses, action.address];
      return { addresses, selectedId: state.selectedId ?? action.address.id };
    }
    case 'REMOVE': {
      const addresses = state.addresses.filter(a => a.id !== action.id);
      const selectedId = state.selectedId === action.id ? null : state.selectedId;
      return { addresses, selectedId };
    }
    case 'SELECT':
      return { ...state, selectedId: action.id };
    default:
      return state;
  }
}

const AddressContext = createContext<AddressContextValue | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(addressReducer, undefined, loadFromStorage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage indisponível — endereços não persistem, app segue funcional
    }
  }, [state]);

  const addAddress = (addr: Omit<Address, 'id'>) => {
    dispatch({ type: 'ADD', address: { ...addr, id: crypto.randomUUID() } });
  };

  const removeAddress = (id: string) => {
    dispatch({ type: 'REMOVE', id });
  };

  const selectAddress = (id: string | null) => {
    dispatch({ type: 'SELECT', id });
  };

  const getSelectedAddress = (id?: string | null): Address | undefined => {
    return state.addresses.find(a => a.id === (id ?? state.selectedId));
  };

  return (
    <AddressContext.Provider
      value={{ state, addAddress, removeAddress, selectAddress, getSelectedAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddress must be inside AddressProvider');
  return ctx;
}
