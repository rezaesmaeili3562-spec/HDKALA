const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src', 'js');
const distDir = path.join(projectRoot, 'dist');
const outputFile = path.join(distDir, 'app.bundle.js');
const staticDataDir = path.join(projectRoot, 'src', 'data');
const distDataDir = path.join(distDir, 'data');

const sources = [
  'core.js',
  'storage.js',
  'services.js',
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

function copyStaticData() {
  if (!fs.existsSync(staticDataDir)) {
    return;
  }

  fs.mkdirSync(distDataDir, { recursive: true });

  const entries = fs.readdirSync(staticDataDir, { withFileTypes: true });
  entries.forEach((entry) => {
    const srcPath = path.join(staticDataDir, entry.name);
    const destPath = path.join(distDataDir, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      fs.readdirSync(srcPath).forEach((child) => {
        fs.copyFileSync(path.join(srcPath, child), path.join(destPath, child));
      });
      return;
    }

    fs.copyFileSync(srcPath, destPath);
  });

  console.log(`Copied static data to ${path.relative(projectRoot, distDataDir)}`);
}

buildBundle();
copyStaticData();
