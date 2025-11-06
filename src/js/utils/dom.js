export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export function on(event, selector, handler, scope = document) {
  scope.addEventListener(event, (evt) => {
    const target = evt.target.closest(selector);
    if (target) {
      handler(evt, target);
    }
  });
}

export function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function create(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.className) {
    element.className = options.className;
  }
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      element.dataset[key] = value;
    });
  }
  if (options.text) {
    element.textContent = options.text;
  }
  if (Array.isArray(options.children)) {
    options.children.forEach((child) => {
      if (child) {
        element.appendChild(child);
      }
    });
  }
  return element;
}
