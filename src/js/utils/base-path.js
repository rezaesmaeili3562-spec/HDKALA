export function getBasePath() {
  return document.body?.dataset.base || '';
}

export function resolvePath(path) {
  const base = getBasePath();
  if (!base) return path;
  if (path.startsWith('/')) {
    if (base === '.') return `.${path}`;
    return `${base}${path}`;
  }
  return `${base}/${path}`;
}
