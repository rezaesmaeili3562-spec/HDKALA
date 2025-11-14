import { loadCart, saveCart } from './state.js';

let cartCache = loadCart();

function persist() {
  saveCart(cartCache);
}

export function getCart() {
  return [...cartCache];
}

export function getCartItem(id) {
  return cartCache.find((item) => item.id === id) ?? null;
}

export function addToCart(product, quantity = 1) {
  const existing = getCartItem(product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartCache.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity });
  }
  persist();
  return getCart();
}

export function updateCartItem(id, quantity) {
  cartCache = cartCache
    .map((item) => (item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item))
    .filter((item) => item.quantity > 0);
  persist();
  return getCart();
}

export function removeFromCart(id) {
  cartCache = cartCache.filter((item) => item.id !== id);
  persist();
  return getCart();
}

export function clearCart() {
  cartCache = [];
  persist();
  return getCart();
}

export function getCartSummary() {
  const subtotal = cartCache.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 5000000 || subtotal === 0 ? 0 : 250000;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}
