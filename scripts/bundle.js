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
  'toast.js',
  'storage.js',
  'services.js',
  'state.js',
  'cart.js',
  'admin.js',
  'auth.js',
  'router.js',
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

function loadEmbeddedData() {
  if (!fs.existsSync(staticDataDir)) {
    return null;
  }

  const data = {};
  const manifest = ['products', 'blogs', 'categories', 'provinces'];

  manifest.forEach((key) => {
    const filePath = path.join(staticDataDir, `${key}.json`);
    if (!fs.existsSync(filePath)) {
      return;
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      data[key] = JSON.parse(raw);
    } catch (error) {
      console.warn(`Failed to embed ${key}.json:`, error.message);
    }
  });

  return Object.keys(data).length > 0 ? data : null;
}

function buildBundle() {
  fs.mkdirSync(distDir, { recursive: true });

  const parts = [];

  const embeddedData = loadEmbeddedData();
  if (embeddedData) {
    const snippet = `// ---- embedded-data ----\nconst EMBEDDED_DATA = Object.freeze(${JSON.stringify(embeddedData, null, 2)});\nif (typeof globalThis !== 'undefined') {\n  if (!globalThis.__HDK_BOOTSTRAP_DATA__) {\n    globalThis.__HDK_BOOTSTRAP_DATA__ = EMBEDDED_DATA;\n  }\n}\n`;
    parts.push(snippet);
  }

  sources.forEach((file) => {
    const filePath = path.join(srcDir, file);
    ensureFileExists(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    parts.push(`// ---- ${file} ----\n${content.trim()}\n`);
  });

  const banner = `/* HDKALA bundle generated: ${new Date().toISOString()} */\n`;
  const bundle = `${banner}${parts.join('\n')}`;

  fs.writeFileSync(outputFile, bundle, 'utf8');
  console.log(`Bundled ${sources.length} files into ${path.relative(projectRoot, outputFile)}`);

  return embeddedData;
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

function injectEmbeddedDataIntoHtml(embeddedData) {
  if (!embeddedData) {
    return;
  }

  const indexFile = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexFile)) {
    return;
  }

  const scriptId = 'hdk-bootstrap-data';
  const serialized = JSON.stringify(embeddedData);
  const scriptTag = `<script id="${scriptId}" type="application/json">${serialized}</script>`;

  let html = fs.readFileSync(indexFile, 'utf8');
  const scriptPattern = new RegExp(`<script id="${scriptId}"[\s\S]*?<\/script>`, 'i');

  if (scriptPattern.test(html)) {
    html = html.replace(scriptPattern, scriptTag);
  } else {
    const marker = '<!-- Main JavaScript Files -->';
    if (html.includes(marker)) {
      html = html.replace(marker, `${scriptTag}\n  ${marker}`);
    } else {
      html = html.replace('</body>', `  ${scriptTag}\n</body>`);
    }
  }

  fs.writeFileSync(indexFile, html, 'utf8');
  console.log(`Embedded bootstrap data into ${path.relative(projectRoot, indexFile)}`);
}

const embeddedData = buildBundle();
copyStaticData();
injectEmbeddedDataIntoHtml(embeddedData);
