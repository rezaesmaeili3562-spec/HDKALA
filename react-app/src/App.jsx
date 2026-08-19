import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './admin/components/RequireAdmin';
import AdminLayout from './admin/components/AdminLayout';
import { useStore } from './store/useStore';
import PageLoader from './components/PageLoader';

// بارگذاری تنبل صفحات برای کاهش حجم باندل اولیه
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./admin/pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./admin/pages/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('./admin/pages/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('./admin/pages/AdminUsersPage'));
const AdminCommentsPage = lazy(() => import('./admin/pages/AdminCommentsPage'));
const AdminCouponsPage = lazy(() => import('./admin/pages/AdminCouponsPage'));
const AdminSettingsPage = lazy(() => import('./admin/pages/AdminSettingsPage'));

// اسکرول به بالای صفحه در هر تغییر مسیر
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
}

// همگام‌سازی کلاس دارک‌مود روی <html>
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
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
      </Suspense>
    </>
  );
}
