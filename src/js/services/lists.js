import { storage } from './storage.js';
import { clone } from '../utils/clone.js';

const WISHLIST_KEY = 'wishlist';
const COMPARE_KEY = 'compare';

function loadList(key) {
  return storage.get(key, []);
}

function saveList(key, list) {
  storage.set(key, list);
  return list;
}

function toggleEntry(key, productId) {
  const list = loadList(key);
  const exists = list.includes(productId);
  const next = exists ? list.filter((id) => id !== productId) : [...list, productId];
  saveList(key, next);
  return next;
}

export function getWishlist() {
  return clone(loadList(WISHLIST_KEY));
}

export function toggleWishlist(productId) {
  return clone(toggleEntry(WISHLIST_KEY, productId));
}

export function clearWishlist() {
  saveList(WISHLIST_KEY, []);
}

export function getCompareList() {
  return clone(loadList(COMPARE_KEY));
}

export function toggleCompare(productId) {
  return clone(toggleEntry(COMPARE_KEY, productId));
}

export function clearCompare() {
  saveList(COMPARE_KEY, []);
}
