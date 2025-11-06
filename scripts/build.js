import { promises as fs } from 'fs';
import path from 'path';

const root = new URL('..', import.meta.url).pathname;
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist');

async function emptyDir(dir) {
  try {
    const entries = await fs.readdir(dir);
    await Promise.all(entries.map(async (entry) => {
      await fs.rm(path.join(dir, entry), { recursive: true, force: true });
    }));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await fs.mkdir(dir, { recursive: true });
  }
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }));
}

async function main() {
  await fs.mkdir(distDir, { recursive: true });
  await emptyDir(distDir);
  await fs.mkdir(distDir, { recursive: true });
  await copyDir(path.join(srcDir, 'pages'), distDir);
  await copyDir(path.join(srcDir, 'js'), path.join(distDir, 'js'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
