const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'src', 'static');
const targetDir = path.join(__dirname, '..', 'dist', 'static');

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Static source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
  copyDirectory(sourceDir, targetDir);
  console.log(`Copied static assets to ${path.relative(process.cwd(), targetDir)}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
