import { Link, Outlet } from 'react-router-dom';
import CartBadge from './CartBadge';

export default function Layout() {
  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-red-600 text-white px-4 py-3 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight">🍕 Cardápio Digital</Link>
          <CartBadge />
        </div>
      </header>
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}
