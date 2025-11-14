import { renderHTML, setActiveNavigation, showNotification } from './ui.js';

const routes = new Map();
let currentControllerCleanup = null;

function parseHash() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) {
    return { name: 'home', params: {} };
  }
  const [name, param] = hash.split('/');
  return { name, params: param ? { id: param } : {} };
}

export function registerRoute(name, config) {
  routes.set(name, config);
}

export async function navigate(name, params = {}) {
  const target = routes.get(name) ?? routes.get('home');
  if (!target) {
    showNotification('صفحه مورد نظر یافت نشد', 'warning');
    return;
  }

  if (currentControllerCleanup) {
    currentControllerCleanup();
    currentControllerCleanup = null;
  }

  const container = document.getElementById('app');
  await renderHTML(container, target.html);

  setActiveNavigation(name);

  if (typeof target.controller === 'function') {
    currentControllerCleanup = target.controller(container, params) ?? null;
  }
}

function handleHashChange() {
  const { name, params } = parseHash();
  if (!routes.has(name)) {
    window.location.hash = '#home';
    return;
  }
  navigate(name, params);
}

export function startRouter() {
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}
