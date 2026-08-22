// ─────────────────────────────────────────────────────────────
//  تعریف مسیرهای برنامه — فروشگاه و پنل مدیریت
// ─────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Layout, RequireAdmin, RequireAuth } from './components';
import {
  AboutPage,
  CartPage,
  CheckoutPage,
  ContactPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  ProductDetailPage,
  ProductsPage,
  ProfilePage,
  SignupPage,
  WishlistPage
} from './pages';
import {
  AdminCommentsPage,
  AdminCouponsPage,
  AdminDashboardPage,
  AdminLayout,
  AdminLoginPage,
  AdminOrdersPage,
  AdminProductsPage,
  AdminSettingsPage,
  AdminUsersPage
} from './admin';
import { useStore } from './store';

/** اسکرول به بالای صفحه در هر تغییر مسیر */
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, search]);
  return null;
}

/** همگام‌سازی کلاس دارک‌مود روی <html> */
function ThemeSync() {
  const theme = useStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <ThemeSync />
      <Routes>
        {/* پنل مدیریت */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="comments" element={<AdminCommentsPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* فروشگاه */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
