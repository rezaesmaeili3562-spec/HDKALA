import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import Toasts from './Toasts';

// قالب اصلی: هدر + محتوا + فوتر + کشوی سبد و اعلان‌ها
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toasts />
    </div>
  );
}
