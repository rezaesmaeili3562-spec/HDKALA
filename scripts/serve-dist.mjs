import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', 'dist');
const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 4173;

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url ?? '/', `http://${req.headers.host}`).pathname);
    let filePath = path.join(rootDir, urlPath);

    const stats = await fs.stat(filePath).catch(() => undefined);

    if (stats?.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!stats) {
      // Fallback to SPA routing by serving index.html
      filePath = path.join(rootDir, 'index.html');
    }

    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
      '.webp': 'image/webp',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2'
    };

    res.writeHead(200, { 'Content-Type': mimeTypes[ext] ?? 'application/octet-stream' });
    res.end(data);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error: ' + (error instanceof Error ? error.message : String(error)));
  }
});

server.listen(port, () => {
  console.log(`✅ پیش‌نمایش محلی آماده است: http://localhost:${port}`);
  console.log('برای پایان‌دادن Ctrl+C را فشار دهید.');
});
