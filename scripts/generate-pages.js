const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'src', 'templates', 'index.html');
const distDir = path.join(__dirname, '..', 'dist');
const distPagesDir = path.join(distDir, 'pages');
const templatePagesDir = path.join(__dirname, '..', 'src', 'templates', 'pages');
const dataAttr = 'data-page="home"';

const pages = [
  { file: 'home.html', slug: 'home' },
  { file: 'login.html', slug: 'login' },
  { file: 'products.html', slug: 'products' },
  { file: 'wishlist.html', slug: 'wishlist' },
  { file: 'compare.html', slug: 'compare' },
  { file: 'cart.html', slug: 'cart' },
  { file: 'checkout.html', slug: 'checkout' },
  { file: 'about.html', slug: 'about' },
  { file: 'contact.html', slug: 'contact' },
  { file: 'blog.html', slug: 'blog' },
  { file: 'profile.html', slug: 'profile' },
  { file: 'orders.html', slug: 'orders' },
  { file: 'addresses.html', slug: 'addresses' },
  { file: 'admin-login.html', slug: 'admin-login' },
  { file: 'admin.html', slug: 'admin' },
  { file: 'product-p1.html', slug: 'product:p1' }
];

function ensureTemplate(template) {
  if (!template.includes(dataAttr)) {
    throw new Error(`Template is missing ${dataAttr}`);
  }
}

function adjustAssetPaths(html, relativeRoot = '.') {
  const prefix = relativeRoot === '.' ? './' : relativeRoot.endsWith('/') ? relativeRoot : `${relativeRoot}/`;
  return html
    .replace(/href="\.\/static\//g, `href="${prefix}static/`)
    .replace(/src="\.\/static\//g, `src="${prefix}static/`)
    .replace(/href="\.\/pages\//g, `href="${prefix}pages/`)
    .replace(/href="\.\/index\.html/g, `href="${prefix}index.html`);
}

function injectPage(template, slug, assetRoot = '.') {
  const withData = template.replace(dataAttr, `data-page="${slug}"`);
  return adjustAssetPaths(withData, assetRoot);
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
    const output = injectPage(template, page.slug, '..');
    const distOutputPath = path.join(distPagesDir, page.file);
    const templateOutputPath = path.join(templatePagesDir, page.file);

    writeFile(distOutputPath, output);
    writeFile(templateOutputPath, output);

    console.log(
      `Generated ${path.relative(process.cwd(), distOutputPath)} and ${path.relative(process.cwd(), templateOutputPath)} for page ${page.slug}`
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
