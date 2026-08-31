import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import WhatsAppButton from './components/WhatsAppButton';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmPage from './pages/ConfirmPage';
import GalleryPage from './pages/GalleryPage';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/confirm" element={<ConfirmPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
