import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '../utils/format';

// ---------- فروشگاه مرکزی state برنامه ----------
// سبد خرید، علاقه‌مندی، کاربر، سفارش‌ها، تم و وضعیت UI
// همه چیز به‌صورت خودکار در localStorage ماندگار می‌شود (به‌جز UI موقت)
export const useStore = create(
  persist(
    (set, get) => ({
      // ===== تم =====
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),

      // ===== UI =====
      cartOpen: false,
      mobileMenuOpen: false,
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      openMobileMenu: () => set({ mobileMenuOpen: true }),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),

      // ===== اعلان‌ها (Toast) =====
      toasts: [],
      toast: (message, type = 'success') => {
        const id = uid('t');
        set({ toasts: [...get().toasts, { id, message, type }] });
        setTimeout(() => {
          set({ toasts: get().toasts.filter((t) => t.id !== id) });
        }, 3500);
      },
      dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      // ===== سبد خرید =====
      cart: [],
      addToCart: (product, qty = 1) => {
        if (!product || product.stock <= 0) return;
        const cart = get().cart;
        const existing = cart.find((i) => i.productId === product.id);
        let next;
        if (existing) {
          next = cart.map((i) =>
            i.productId === product.id
              ? { ...i, qty: Math.min(i.qty + qty, product.stock) }
              : i
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
            i.productId === productId
              ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) }
              : i
          )
        }),
      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((i) => i.productId !== productId) }),
      clearCart: () => set({ cart: [] }),

      // ===== علاقه‌مندی =====
      wishlist: [],
      toggleWishlist: (productId) => {
        const wishlist = get().wishlist;
        const has = wishlist.includes(productId);
        set({ wishlist: has ? wishlist.filter((id) => id !== productId) : [...wishlist, productId] });
        get().toast(has ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد');
      },

      // ===== نظرات =====
      comments: {},
      addComment: (productId, comment) =>
        set({
          comments: {
            ...get().comments,
            [productId]: [comment, ...(get().comments[productId] || [])]
          }
        }),

      // ===== احراز هویت (mock) =====
      user: null,
      users: [],
      login: (phone, password) => {
        const found = get().users.find((u) => u.phone === phone && u.password === password);
        if (!found) return { ok: false, message: 'شماره موبایل یا رمز عبور اشتباه است' };
        set({ user: { ...found, password: undefined } });
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
            password: 'demo1234'
          };
          set({ users: [...get().users, demo] });
        }
        set({ user: { ...demo, password: undefined } });
        get().toast('به حساب دمو وارد شدید');
      },
      signup: (data) => {
        const exists = get().users.find((u) => u.phone === data.phone);
        if (exists) return { ok: false, message: 'این شماره موبایل قبلاً ثبت شده است' };
        const newUser = { id: uid('u'), ...data };
        set({ users: [...get().users, newUser], user: { ...newUser, password: undefined } });
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

      // ===== سفارش‌ها =====
      orders: [],
      placeOrder: (order) => {
        const newOrder = {
          id: 'HDK-' + Math.floor(100000 + Math.random() * 900000),
          ...order,
          items: get().cart,
          status: 'در حال پردازش',
          createdAt: new Date().toISOString()
        };
        set({ orders: [newOrder, ...get().orders], cart: [] });
        return newOrder;
      },
      cancelOrder: (orderId) =>
        set({
          orders: get().orders.map((o) => (o.id === orderId ? { ...o, status: 'لغو شده' } : o))
        })
    }),
    {
      name: 'hdkala-react',
      partialize: (s) => ({
        theme: s.theme,
        cart: s.cart,
        wishlist: s.wishlist,
        comments: s.comments,
        user: s.user,
        users: s.users,
        orders: s.orders
      })
    }
  )
);

// مجموع و قیمت‌ها را از استور بیرون می‌کشیم
export const selectCartSummary = (s) => s.cart;
