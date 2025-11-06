import { clone } from '../utils/clone.js';

const PREFIX = 'HDK_';

export const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : clone(fallback);
    } catch (error) {
      console.warn('storage get failed', error);
      return clone(fallback);
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.warn('storage set failed', error);
    }
  }
};
