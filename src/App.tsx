import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MenuPage from './pages/MenuPage';
import HomePage from './pages/HomePage';
import OrderDetailPage from './pages/OrderDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AddressPage from './pages/AddressPage';
import SplashScreen from './components/SplashScreen';
import { hasRecentOrders } from './utils/orderHistory';

export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => sessionStorage.getItem('splash_shown') === null
  );

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // NAD-6: usuários com pedidos nos últimos 90 dias vão para a HomePage
  // personalizada; novos usuários mantêm o fluxo atual (MenuPage direto).
  const hasHistory = hasRecentOrders();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={hasHistory ? <HomePage /> : <MenuPage />} />
        <Route path="/cardapio" element={<MenuPage />} />
        <Route path="/pedido/:id" element={<OrderDetailPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/finalizar" element={<CheckoutPage />} />
        <Route path="/enderecos" element={<AddressPage />} />
      </Route>
    </Routes>
  );
}
