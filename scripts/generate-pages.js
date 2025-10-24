const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'src', 'templates', 'index.html');
const distDir = path.join(__dirname, '..', 'dist');
const templateDir = path.join(__dirname, '..', 'src', 'templates');
const legacyDistPagesDir = path.join(distDir, 'pages');
const legacyTemplatePagesDir = path.join(templateDir, 'pages');
const dataAttr = 'data-page="home"';
const templateStaticPrefix = '../static/';
const distStaticPrefix = './static/';

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

function injectPage(template, slug) {
  return template.replace(dataAttr, `data-page="${slug}"`);
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
}

function transformForDist(html) {
  return html.split(templateStaticPrefix).join(distStaticPrefix);
}

function copyBaseTemplate(template) {
  writeFile(path.join(distDir, 'index.html'), transformForDist(template));
}

function removeLegacyDirectories() {
  [legacyDistPagesDir, legacyTemplatePagesDir].forEach(dir => {
    fs.rmSync(dir, { recursive: true, force: true });
  });
}

function main() {
  const template = fs.readFileSync(templatePath, 'utf8');
  ensureTemplate(template);

  removeLegacyDirectories();

  copyBaseTemplate(template);

  pages.forEach(page => {
    const templateOutput = injectPage(template, page.slug);
    const distOutput = transformForDist(templateOutput);
    const distOutputPath = path.join(distDir, page.file);
    const templateOutputPath = path.join(templateDir, page.file);

    writeFile(distOutputPath, distOutput);
    writeFile(templateOutputPath, templateOutput);

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
