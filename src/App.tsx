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

/**
 * Rota `/` condicional (NAD-6): usuários com pedidos nos últimos 90 dias
 * veem a HomePage personalizada; novos usuários mantêm o fluxo atual.
 *
 * CR-003: a elegibilidade é reavaliada a cada entrada na rota (mount do
 * componente), e não apenas uma vez pós-splash. Assim, um usuário novo que
 * finaliza o primeiro pedido na sessão passa a ver a HomePage ao voltar
 * para `/` — sem depender de reload.
 */
function HomeRoute() {
  const hasHistory = hasRecentOrders();
  return hasHistory ? <HomePage /> : <MenuPage />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => sessionStorage.getItem('splash_shown') === null
  );

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/cardapio" element={<MenuPage />} />
        <Route path="/pedido/:id" element={<OrderDetailPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/finalizar" element={<CheckoutPage />} />
        <Route path="/enderecos" element={<AddressPage />} />
      </Route>
    </Routes>
  );
}
