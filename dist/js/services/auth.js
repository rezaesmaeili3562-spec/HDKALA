import { storage } from './storage.js';
import { clone } from '../utils/clone.js';

const USERS_KEY = 'users';
const SESSION_KEY = 'session';

function loadUsers() {
  return storage.get(USERS_KEY, []);
}

function saveUsers(users) {
  storage.set(USERS_KEY, users);
}

export function registerUser({ name, email, password }) {
  const users = loadUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error('کاربری با این ایمیل موجود است.');
  }
  const user = { id: crypto.randomUUID(), name, email, password };
  users.push(user);
  saveUsers(users);
  storage.set(SESSION_KEY, { userId: user.id });
  return clone(user);
}

export function loginUser({ email, password }) {
  const users = loadUsers();
  const user = users.find((item) => item.email === email && item.password === password);
  if (!user) {
    throw new Error('اطلاعات ورود نامعتبر است.');
  }
  storage.set(SESSION_KEY, { userId: user.id });
  return clone(user);
}

export function logoutUser() {
  storage.set(SESSION_KEY, null);
}

export function getCurrentUser() {
  const session = storage.get(SESSION_KEY, null);
  if (!session) return null;
  const users = loadUsers();
  const user = users.find((item) => item.id === session.userId);
  return user ? clone(user) : null;
}
