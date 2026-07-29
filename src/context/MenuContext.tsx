import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuData } from '../types/menu';
import { loadMenu } from '../utils/loadMenu';

interface MenuContextValue {
  menu: MenuData | null;
  loading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextValue>({ menu: null, loading: true, error: null });

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenu()
      .then(setMenu)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MenuContext.Provider value={{ menu, loading, error }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
