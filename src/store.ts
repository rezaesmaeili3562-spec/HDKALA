// ─────────────────────────────────────────────────────────────
//  استور سراسری (Zustand) — تنها منبع حقیقت فروشگاه و ادمین
//  داده‌ها در localStorage ذخیره می‌شوند و بین رفرش باقی می‌مانند.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from './utils';
import { ADMIN_DEMO, DEFAULT_SETTINGS } from './types';
import { defaultCoupons, defaultSettings, seedProducts } from './data';
import type {
  AdminSession,
  CartItem,
  CommentsMap,
  Coupon,
  Order,
  OrderStatus,
  Product,
  ProductComment,
  PublicUser,
  StoreSettings,
  ToastItem,
  UserAccount
} from './types';

const catalog: Product[] = seedProducts.map((p) => ({
  ...p,
  active: p.active !== false,
  features: p.features || [],
  specs: p.specs || {},
  colors: p.colors || []
}));

export interface AuthResult {
  ok: boolean;
  message?: string;
}

export interface CouponResult {
  ok: boolean;
  message?: string;
  coupon?: Coupon;
}

export interface StoreState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  cartOpen: boolean;
  mobileMenuOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;

  toasts: ToastItem[];
  toast: (message: string, type?: ToastItem['type']) => void;
  dismissToast: (id: string) => void;

  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  comments: CommentsMap;
  addComment: (
    productId: string,
    comment: Omit<ProductComment, 'id' | 'productId' | 'approved'> & { approved?: boolean }
  ) => void;
  approveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;

  user: PublicUser | null;
  users: UserAccount[];
  login: (phone: string, password: string) => AuthResult;
  loginDemo: () => void;
  signup: (data: { name: string; phone: string; email?: string; password: string }) => AuthResult;
  updateUser: (patch: Partial<Pick<UserAccount, 'name' | 'email'>>) => void;
  logout: () => void;
  setUserDisabled: (userId: string, disabled: boolean) => void;

  orders: Order[];
  placeOrder: (
    order: Omit<Order, 'id' | 'items' | 'status' | 'createdAt' | 'userId'> & {
      userId?: string | null;
    }
  ) => Order;
  cancelOrder: (orderId: string) => void;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;

  products: Product[];
  upsertProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  coupons: Coupon[];
  upsertCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: string) => void;
  validateCoupon: (code: string, subtotal: number) => CouponResult;
  incrementCouponUsage: (code: string) => void;

  settings: StoreSettings;
  updateSettings: (patch: Partial<StoreSettings>) => void;

  admin: AdminSession | null;
  loginAdmin: (username: string, password: string) => AuthResult;
  logoutAdmin: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ─────────── تم ───────────
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),

      // ─────────── رابط کاربری (کشو و منو) ───────────
      cartOpen: false,
      mobileMenuOpen: false,
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      openMobileMenu: () => set({ mobileMenuOpen: true }),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),

      // ─────────── اعلان‌ها ───────────
      toasts: [],
      toast: (message, type = 'success') => {
        const id = uid('t');
        set({ toasts: [...get().toasts, { id, message, type }] });
        setTimeout(() => {
          set({ toasts: get().toasts.filter((t) => t.id !== id) });
        }, 3500);
      },
      dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      // ─────────── سبد خرید ───────────
      cart: [],
      addToCart: (product, qty = 1) => {
        if (!product || product.stock <= 0) return;
        const cart = get().cart;
        const existing = cart.find((i) => i.productId === product.id);
        let next: CartItem[];
        if (existing) {
          next = cart.map((i) =>
            i.productId === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i
          );
        } else {
          next = [
            ...cart,
            {
              productId: product.id,
              name: product.name,
              image: product.image,
              price: product.price,
              discount: product.discount || 0,
              stock: product.stock,
              qty: Math.min(qty, product.stock)
            }
          ];
        }
        set({ cart: next, cartOpen: true });
        get().toast(`«${product.name}» به سبد خرید اضافه شد`);
      },
      setQty: (productId, qty) =>
        set({
          cart: get().cart.map((i) =>
            i.productId === productId ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i
          )
        }),
      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((i) => i.productId !== productId) }),
      clearCart: () => set({ cart: [] }),

      // ─────────── علاقه‌مندی‌ها ───────────
      wishlist: [],
      toggleWishlist: (productId) => {
        const wishlist = get().wishlist;
        const has = wishlist.includes(productId);
        set({
          wishlist: has ? wishlist.filter((id) => id !== productId) : [...wishlist, productId]
        });
        get().toast(has ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد');
      },

      // ─────────── دیدگاه‌ها ───────────
      comments: {},
      addComment: (productId, comment) => {
        const entry: ProductComment = {
          id: uid('c'),
          productId,
          name: comment.name,
          rating: comment.rating,
          text: comment.text,
          createdAt: comment.createdAt || new Date().toISOString(),
          approved: Boolean(comment.approved)
        };
        set({
          comments: {
            ...get().comments,
            [productId]: [entry, ...(get().comments[productId] || [])]
          }
        });
        get().toast('دیدگاه شما ثبت شد و پس از تأیید مدیر نمایش داده می‌شود', 'info');
      },
      approveComment: (commentId) => {
        const comments = { ...get().comments };
        Object.keys(comments).forEach((pid) => {
          comments[pid] = comments[pid].map((c) =>
            c.id === commentId ? { ...c, approved: true } : c
          );
        });
        set({ comments });
        get().toast('دیدگاه تأیید شد');
      },
      deleteComment: (commentId) => {
        const comments = { ...get().comments };
        Object.keys(comments).forEach((pid) => {
          comments[pid] = comments[pid].filter((c) => c.id !== commentId);
        });
        set({ comments });
        get().toast('دیدگاه حذف شد', 'info');
      },

      // ─────────── کاربران و احراز هویت ───────────
      user: null,
      users: [],
      login: (phone, password) => {
        const found = get().users.find((u) => u.phone === phone && u.password === password);
        if (!found) return { ok: false, message: 'شماره موبایل یا رمز عبور اشتباه است' };
        if (found.disabled) return { ok: false, message: 'این حساب کاربری غیرفعال شده است' };
        const { password: _pw, ...publicUser } = found;
        set({ user: publicUser });
        get().toast(`خوش آمدید، ${found.name} عزیز`);
        return { ok: true };
      },
      loginDemo: () => {
        let demo = get().users.find((u) => u.phone === '09120000000');
        if (!demo) {
          demo = {
            id: uid('u'),
            name: 'کاربر دمو',
            phone: '09120000000',
            email: 'demo@hdkala.ir',
            password: 'demo1234',
            disabled: false,
            createdAt: new Date().toISOString()
          };
          set({ users: [...get().users, demo] });
        }
        if (demo.disabled) {
          get().toast('حساب دمو غیرفعال است', 'error');
          return;
        }
        const { password: _pw, ...publicUser } = demo;
        set({ user: publicUser });
        get().toast('به حساب دمو وارد شدید');
      },
      signup: (data) => {
        const exists = get().users.find((u) => u.phone === data.phone);
        if (exists) return { ok: false, message: 'این شماره موبایل قبلاً ثبت شده است' };
        const newUser: UserAccount = {
          id: uid('u'),
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          password: data.password,
          disabled: false,
          createdAt: new Date().toISOString()
        };
        const { password: _pw, ...publicUser } = newUser;
        set({ users: [...get().users, newUser], user: publicUser });
        get().toast('ثبت‌نام با موفقیت انجام شد. خوش آمدید!');
        return { ok: true };
      },
      updateUser: (patch) => {
        const user = get().user;
        if (!user) return;
        set({
          user: { ...user, ...patch },
          users: get().users.map((u) => (u.id === user.id ? { ...u, ...patch } : u))
        });
        get().toast('اطلاعات حساب با موفقیت ذخیره شد');
      },
      logout: () => {
        set({ user: null });
        get().toast('از حساب کاربری خارج شدید');
      },
      setUserDisabled: (userId, disabled) => {
        const users = get().users.map((u) => (u.id === userId ? { ...u, disabled } : u));
        const current = get().user;
        set({
          users,
          user: current?.id === userId && disabled ? null : current
        });
        get().toast(disabled ? 'کاربر غیرفعال شد' : 'کاربر فعال شد');
      },

      // ─────────── سفارش‌ها ───────────
      orders: [],
      placeOrder: (order) => {
        const user = get().user;
        const newOrder: Order = {
          id: 'HDK-' + Math.floor(100000 + Math.random() * 900000),
          ...order,
          userId: order.userId ?? user?.id ?? null,
          items: get().cart,
          status: 'در حال پردازش',
          createdAt: new Date().toISOString()
        };
        set({ orders: [newOrder, ...get().orders], cart: [] });
        if (order.couponCode) {
          get().incrementCouponUsage(order.couponCode);
        }
        return newOrder;
      },
      cancelOrder: (orderId) =>
        set({
          orders: get().orders.map((o) => (o.id === orderId ? { ...o, status: 'لغو شده' } : o))
        }),
      setOrderStatus: (orderId, status) => {
        set({ orders: get().orders.map((o) => (o.id === orderId ? { ...o, status } : o)) });
        get().toast('وضعیت سفارش به‌روز شد');
      },

      // ─────────── محصولات (مشترک بین فروشگاه و ادمین) ───────────
      products: catalog,
      upsertProduct: (product) => {
        const products = get().products;
        const exists = products.some((p) => p.id === product.id);
        const next = exists
          ? products.map((p) => (p.id === product.id ? product : p))
          : [product, ...products];
        // همگام‌سازی سبد خرید با اطلاعات جدید محصول
        const cart = get().cart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                name: product.name,
                image: product.image,
                price: product.price,
                discount: product.discount || 0,
                stock: product.stock,
                qty: Math.min(item.qty, Math.max(1, product.stock || 1))
              }
            : item
        );
        set({ products: next, cart });
        get().toast(exists ? 'محصول ویرایش شد' : 'محصول جدید ثبت شد');
      },
      deleteProduct: (productId) => {
        set({
          products: get().products.filter((p) => p.id !== productId),
          cart: get().cart.filter((i) => i.productId !== productId),
          wishlist: get().wishlist.filter((id) => id !== productId)
        });
        get().toast('محصول حذف شد', 'info');
      },

      // ─────────── کوپن‌های تخفیف ───────────
      coupons: defaultCoupons,
      upsertCoupon: (coupon) => {
        const coupons = get().coupons;
        const exists = coupons.some((c) => c.id === coupon.id);
        const next = exists
          ? coupons.map((c) => (c.id === coupon.id ? coupon : c))
          : [coupon, ...coupons];
        set({ coupons: next });
        get().toast(exists ? 'کد تخفیف ویرایش شد' : 'کد تخفیف ساخته شد');
      },
      deleteCoupon: (couponId) => {
        set({ coupons: get().coupons.filter((c) => c.id !== couponId) });
        get().toast('کد تخفیف حذف شد', 'info');
      },
      validateCoupon: (code, subtotal) => {
        const normalized = code.trim().toUpperCase();
        if (!normalized) return { ok: false, message: 'کد تخفیف را وارد کنید' };
        const coupon = get().coupons.find((c) => c.code.toUpperCase() === normalized);
        if (!coupon || !coupon.active)
          return { ok: false, message: 'کد تخفیف نامعتبر یا غیرفعال است' };
        if (coupon.minOrder > 0 && subtotal < coupon.minOrder) {
          return { ok: false, message: 'مبلغ سفارش برای این کد کافی نیست' };
        }
        return { ok: true, coupon };
      },
      incrementCouponUsage: (code) => {
        const normalized = code.trim().toUpperCase();
        set({
          coupons: get().coupons.map((c) =>
            c.code.toUpperCase() === normalized ? { ...c, usageCount: c.usageCount + 1 } : c
          )
        });
      },

      // ─────────── تنظیمات فروشگاه ───────────
      settings: defaultSettings,
      updateSettings: (patch) => {
        set({ settings: { ...get().settings, ...patch } });
        get().toast('تنظیمات فروشگاه ذخیره شد');
      },

      // ─────────── نشست مدیر ───────────
      admin: null,
      loginAdmin: (username, password) => {
        if (username.trim() === ADMIN_DEMO.username && password === ADMIN_DEMO.password) {
          set({
            admin: {
              username: ADMIN_DEMO.username,
              name: ADMIN_DEMO.name,
              loggedInAt: new Date().toISOString()
            }
          });
          get().toast('به پنل مدیریت خوش آمدید');
          return { ok: true };
        }
        return { ok: false, message: 'نام کاربری یا رمز عبور نادرست است' };
      },
      logoutAdmin: () => {
        set({ admin: null });
        get().toast('از پنل مدیریت خارج شدید', 'info');
      }
    }),
    {
      name: 'hdkala-store',
      partialize: (s) => ({
        theme: s.theme,
        cart: s.cart,
        wishlist: s.wishlist,
        comments: s.comments,
        user: s.user,
        users: s.users,
        orders: s.orders,
        products: s.products,
        coupons: s.coupons,
        settings: s.settings,
        admin: s.admin
      }),
      merge: (persisted, current) => {
        const stored = (persisted || {}) as Partial<StoreState>;
        // بازیابی امن دیدگاه‌های ذخیره‌شده از نسخه‌های قبلی
        const comments: CommentsMap = {};
        Object.entries(stored.comments || {}).forEach(([pid, list]) => {
          comments[pid] = (list || []).map((c) => ({
            id: c.id || uid('c'),
            productId: c.productId || pid,
            name: c.name,
            rating: c.rating,
            text: c.text,
            createdAt: c.createdAt,
            approved: Boolean(c.approved)
          }));
        });
        return {
          ...current,
          ...stored,
          comments,
          products:
            stored.products && stored.products.length > 0 ? stored.products : current.products,
          coupons: stored.coupons && stored.coupons.length > 0 ? stored.coupons : current.coupons,
          settings: { ...DEFAULT_SETTINGS, ...(stored.settings || {}) }
        };
      }
    }
  )
);

// ─────────── سلکتورها ───────────

/** دیدگاه‌های تأییدشده یک محصول */
export const selectApprovedComments =
  (productId: string) =>
  (s: StoreState): ProductComment[] =>
    (s.comments[productId] || []).filter((c) => c.approved);

/** کاتالوگ فعال (محصولات حذف‌شده یا غیرفعال نمایش داده نمی‌شوند) */
export const selectCatalog = (s: StoreState): Product[] =>
  s.products.filter((p) => p.active !== false);

// ─────────── لایه دسترسی به داده ───────────
// شبیه‌سازی تأخیر شبکه تا UI حالت لودینگ واقعی داشته باشد.

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function getProducts(): Promise<Product[]> {
  await delay(280);
  return [...selectCatalog(useStore.getState())];
}

export async function getProductById(id: string): Promise<Product> {
  await delay(180);
  const product = selectCatalog(useStore.getState()).find((p) => p.id === id);
  if (!product) throw new Error('PRODUCT_NOT_FOUND');
  return { ...product };
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

/** هوک محصولات فروشگاه با حالت لودینگ اولیه */
export function useProducts(): { products: Product[] | null; loading: boolean } {
  const products = useStore(selectCatalog);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 280);
    return () => clearTimeout(timer);
  }, []);

  return { products: ready ? products : null, loading: !ready };
}
