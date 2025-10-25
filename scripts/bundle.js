const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src', 'js');
const distDir = path.join(projectRoot, 'dist');
const outputFile = path.join(distDir, 'app.bundle.js');

const sources = [
  'core.js',
  'storage.js',
  'state.js',
  'router.js',
  'admin.js',
  'cart.js',
  'auth.js',
  'toast.js',
  'filters.js',
  'pages.js',
  'ui.js',
  'validation.js',
  'components.js',
  'utils.js',
  'constants.js'
];

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Source file not found: ${path.relative(projectRoot, filePath)}`);
  }
}

function buildBundle() {
  fs.mkdirSync(distDir, { recursive: true });

  const parts = sources.map((file) => {
    const filePath = path.join(srcDir, file);
    ensureFileExists(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    return `// ---- ${file} ----\n${content.trim()}\n`;
  });

  const banner = `/* HDKALA bundle generated: ${new Date().toISOString()} */\n`;
  const bundle = `${banner}${parts.join('\n')}`;

  fs.writeFileSync(outputFile, bundle, 'utf8');
  console.log(`Bundled ${sources.length} files into ${path.relative(projectRoot, outputFile)}`);
}

buildBundle();
