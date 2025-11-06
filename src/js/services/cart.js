import { storage } from './storage.js';
import { clone } from '../utils/clone.js';

const STORAGE_KEY = 'cart_items';

function loadCart() {
  return storage.get(STORAGE_KEY, []);
}

function persistCart(items) {
  storage.set(STORAGE_KEY, items);
  return items;
}

export function getCartItems() {
  return clone(loadCart());
}

export function getCartCount() {
  return loadCart().reduce((total, item) => total + item.qty, 0);
}

export function addToCart(productId, qty = 1) {
  const items = loadCart();
  const existing = items.find((item) => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ id: productId, qty });
  }
  persistCart(items);
  return clone(items);
}

export function updateCartItem(productId, qty) {
  const items = loadCart();
  const existing = items.find((item) => item.id === productId);
  if (!existing) return clone(items);
  existing.qty = qty;
  if (existing.qty <= 0) {
    return removeFromCart(productId);
  }
  persistCart(items);
  return clone(items);
}

export function removeFromCart(productId) {
  const items = loadCart().filter((item) => item.id !== productId);
  persistCart(items);
  return clone(items);
}

export function clearCart() {
  persistCart([]);
}
