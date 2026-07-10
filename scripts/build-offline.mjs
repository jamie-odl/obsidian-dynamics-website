/**
 * Builds a minimal static output that replaces the public marketing site
 * with the offline holding page. Admin rewrites and /api stay in vercel.json.
 *
 * Restore live marketing: set vercel.json buildCommand to null and
 * outputDirectory to ".", then redeploy (see DEPLOY.md).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'offline-dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const offline = path.join(root, 'offline.html');
if (!fs.existsSync(offline)) {
  console.error('offline.html missing');
  process.exit(1);
}

fs.copyFileSync(offline, path.join(dist, 'index.html'));
fs.copyFileSync(offline, path.join(dist, '404.html'));
fs.copyFileSync(offline, path.join(dist, 'offline.html'));

const favicon = path.join(root, 'favicon.ico');
if (fs.existsSync(favicon)) {
  fs.copyFileSync(favicon, path.join(dist, 'favicon.ico'));
}

fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  ['User-agent: *', 'Disallow: /', ''].join('\n'),
  'utf8'
);

console.log('offline-dist ready (marketing holding page)');
