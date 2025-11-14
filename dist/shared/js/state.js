const storage = typeof window !== 'undefined' ? window.localStorage : null;

const STORAGE_KEYS = {
  CART: 'hdkala_cart',
  USER: 'hdkala_user'
};

export function loadCart() {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Failed to read cart from storage', error);
    return [];
  }
}

export function saveCart(items) {
  if (!storage) return;
  storage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
}

export function loadUser() {
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to read user from storage', error);
    return null;
  }
}

export function saveUser(user) {
  if (!storage) return;
  storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function clearUser() {
  if (!storage) return;
  storage.removeItem(STORAGE_KEYS.USER);
}
