// Shared domain types used by the storefront and the admin panel.

export type CategoryId = 'electronics' | 'fashion' | 'home' | 'books' | 'sports' | string;

export type ProductBadge = 'new' | 'hot' | 'bestseller' | '';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  discount: number;
  rating: number;
  ratingCount: number;
  stock: number;
  brand: string;
  status: ProductBadge;
  image: string;
  views: number;
  created: string;
  desc: string;
  features: string[];
  specs: Record<string, string>;
  colors: string[];
  active?: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  stock: number;
  qty: number;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  disabled?: boolean;
  createdAt?: string;
}

export type PublicUser = Omit<UserAccount, 'password'>;

export const ORDER_STATUSES = ['در حال پردازش', 'ارسال‌شده', 'تحویل‌شده', 'لغو شده'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderReceiver {
  name: string;
  phone: string;
  email: string;
}

export interface OrderAddress {
  province: string;
  city: string;
  fullAddress: string;
  postal: string;
}

export interface Order {
  id: string;
  userId: string | null;
  receiver: OrderReceiver;
  address: OrderAddress;
  shippingMethod: string;
  shippingLabel?: string;
  paymentMethod: string;
  paymentLabel?: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: string;
  total: number;
  subtotal: number;
  discount: number;
  couponDiscount?: number;
  couponCode?: string;
  shipping: number;
}

export interface ProductComment {
  id: string;
  productId: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
  approved: boolean;
}

export type CommentsMap = Record<string, ProductComment[]>;

export type CouponType = 'percent' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  active: boolean;
  minOrder: number;
  usageCount: number;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  shippingFee: number;
  expressFee: number;
  freeShippingOver: number;
}

export interface AdminSession {
  username: string;
  name: string;
  loggedInAt: string;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface CartSummary {
  count: number;
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shipping: number;
  total: number;
}

export interface CartSummaryOptions {
  shippingFee?: number;
  expressFee?: number;
  freeShippingOver?: number;
  coupon?: Coupon | null;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'HDKALA',
  shippingFee: 30000,
  expressFee: 60000,
  freeShippingOver: 500000
};

export const ADMIN_DEMO = {
  username: 'admin',
  password: 'admin1234',
  name: 'مدیر فروشگاه'
} as const;

export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  'در حال پردازش': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'ارسال‌شده': 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  'تحویل‌شده': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  'لغو شده': 'bg-rose-500/15 text-rose-500'
};

export const PRODUCT_IMAGE_OPTIONS = [
  './images/p01-headphones.jpg',
  './images/p02-phone.jpg',
  './images/p03-laptop.jpg',
  './images/p04-tablet.jpg',
  './images/p05-camera.jpg',
  './images/p06-console.jpg',
  './images/p07-speaker.jpg',
  './images/p08-smartwatch.jpg',
  './images/p09-sneakers.jpg',
  './images/p10-watch.jpg',
  './images/p11-tshirt.jpg',
  './images/p12-backpack.jpg',
  './images/p13-sofa.jpg',
  './images/p14-airfryer.jpg',
  './images/p15-vacuum.jpg',
  './images/p16-cookware.jpg',
  './images/p17-book1.jpg',
  './images/p18-book2.jpg',
  './images/p19-book3.jpg',
  './images/p20-dumbbells.jpg',
  './images/hero-headphones.jpg'
] as const;
