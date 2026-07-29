import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MenuPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/finalizar" element={<CheckoutPage />} />
      </Route>
    </Routes>
  );
}
