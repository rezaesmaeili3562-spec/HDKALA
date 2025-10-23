const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'src', 'templates', 'index.html');
const distDir = path.join(__dirname, '..', 'dist');
const distPagesDir = path.join(distDir, 'pages');
const templatePagesDir = path.join(__dirname, '..', 'src', 'templates', 'pages');
const placeholder = '<!-- PAGE_INITIALIZER -->';

const pages = [
  { file: 'home.html', hash: '#home' },
  { file: 'login.html', hash: '#login' },
  { file: 'products.html', hash: '#products' },
  { file: 'wishlist.html', hash: '#wishlist' },
  { file: 'compare.html', hash: '#compare' },
  { file: 'cart.html', hash: '#cart' },
  { file: 'checkout.html', hash: '#checkout' },
  { file: 'about.html', hash: '#about' },
  { file: 'contact.html', hash: '#contact' },
  { file: 'blog.html', hash: '#blog' },
  { file: 'profile.html', hash: '#profile' },
  { file: 'orders.html', hash: '#orders' },
  { file: 'addresses.html', hash: '#addresses' },
  { file: 'admin-login.html', hash: '#admin-login' },
  { file: 'admin.html', hash: '#admin' },
  { file: 'product-p1.html', hash: '#product:p1' }
];

function ensureTemplate(template) {
  if (!template.includes(placeholder)) {
    throw new Error(`Template is missing placeholder: ${placeholder}`);
  }
}

function adjustAssetPaths(html, relativeRoot = '.') {
  const prefix = relativeRoot === '.' ? './' : relativeRoot.endsWith('/') ? relativeRoot : `${relativeRoot}/`;
  return html
    .replace(/href="\.\/static\//g, `href="${prefix}static/`)
    .replace(/src="\.\/static\//g, `src="${prefix}static/`);
}

function injectHash(template, hash, assetRoot = '.') {
  const safeHash = hash.replace(/'/g, "\\'");
  const injection = `${placeholder}\n  <script>window.__INITIAL_HASH__ = '${safeHash}';</script>`;
  const withHash = template.replace(placeholder, injection);
  return adjustAssetPaths(withHash, assetRoot);
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
}

function copyBaseTemplate(template) {
  writeFile(path.join(distDir, 'index.html'), template);
}

function main() {
  const template = fs.readFileSync(templatePath, 'utf8');
  ensureTemplate(template);

  copyBaseTemplate(template);

  pages.forEach(page => {
    const output = injectHash(template, page.hash, '..');
    const distOutputPath = path.join(distPagesDir, page.file);
    const templateOutputPath = path.join(templatePagesDir, page.file);

    writeFile(distOutputPath, output);
    writeFile(templateOutputPath, output);

    console.log(
      `Generated ${path.relative(process.cwd(), distOutputPath)} and ${path.relative(process.cwd(), templateOutputPath)} for hash ${page.hash}`
    );
  });
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
