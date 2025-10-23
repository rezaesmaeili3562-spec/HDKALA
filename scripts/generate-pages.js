const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'dist', 'index.html');
const outputDir = path.join(__dirname, '..', 'dist', 'pages');
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

function adjustAssetPaths(html) {
  return html
    .replace(/href="\.\/output\.css"/g, 'href="../output.css"')
    .replace(/src="\.\//g, 'src="../');
}

function injectHash(template, hash) {
  const safeHash = hash.replace(/'/g, "\\'");
  const injection = `${placeholder}\n  <script>window.__INITIAL_HASH__ = '${safeHash}';</script>`;
  const withHash = template.replace(placeholder, injection);
  return adjustAssetPaths(withHash);
}

function main() {
  const template = fs.readFileSync(templatePath, 'utf8');
  ensureTemplate(template);
  fs.mkdirSync(outputDir, { recursive: true });

  pages.forEach(page => {
    const output = injectHash(template, page.hash);
    const outputPath = path.join(outputDir, page.file);
    fs.writeFileSync(outputPath, output, 'utf8');
    console.log(`Generated ${path.relative(process.cwd(), outputPath)} for hash ${page.hash}`);
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
