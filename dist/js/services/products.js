import { storage } from './storage.js';
import { clone } from '../utils/clone.js';
import { SAMPLE_PRODUCTS } from '../data/sample-data.js';

const STORAGE_KEY = 'products';

let productCache = null;

export function loadProducts() {
  if (!productCache) {
    productCache = storage.get(STORAGE_KEY, SAMPLE_PRODUCTS);
  }
  return clone(productCache);
}

export function saveProducts(products) {
  productCache = clone(products);
  storage.set(STORAGE_KEY, productCache);
}

export function upsertProduct(product) {
  const products = loadProducts();
  const index = products.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    products[index] = { ...products[index], ...product };
  } else {
    products.unshift(product);
  }
  saveProducts(products);
  return product;
}

export function deleteProduct(productId) {
  const products = loadProducts().filter((item) => item.id !== productId);
  saveProducts(products);
}

export function getProductById(productId) {
  return loadProducts().find((item) => item.id === productId) ?? null;
}

export function getFeaturedProducts() {
  return loadProducts().filter((item) => item.discount > 0 || ['hot', 'new'].includes(item.status)).slice(0, 8);
}

export function getLatestProducts(limit = 12) {
  return loadProducts().slice(0, limit);
}

export function getBrands() {
  return Array.from(new Set(loadProducts().map((item) => item.brand))).filter(Boolean).sort();
}

export function filterProducts({
  search = '',
  category = 'all',
  minPrice,
  maxPrice,
  discount,
  brand = 'all',
  stock = 'all',
  rating = 0
} = {}) {
  const lowerSearch = search.trim().toLowerCase();
  const products = loadProducts();
  return products.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (brand !== 'all' && item.brand !== brand) return false;
    if (rating && item.rating < Number(rating)) return false;
    if (discount && item.discount < Number(discount)) return false;
    if (stock === 'in' && item.stock <= 0) return false;
    if (stock === 'out' && item.stock > 0) return false;
    if (minPrice && item.price < Number(minPrice)) return false;
    if (maxPrice && item.price > Number(maxPrice)) return false;
    if (lowerSearch && !item.name.toLowerCase().includes(lowerSearch)) return false;
    return true;
  });
}

export function paginateProducts(products, page = 1, perPage = 12) {
  const total = products.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * perPage;
  return {
    page: safePage,
    pages,
    total,
    items: products.slice(start, start + perPage)
  };
}

export function formatPrice(value) {
  return `${Number(value).toLocaleString('fa-IR')} تومان`;
}
