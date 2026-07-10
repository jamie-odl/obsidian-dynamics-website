/**
 * Builds a minimal static output that replaces the public marketing site
 * with the offline holding page, while keeping Civitas admin auth pages.
 *
 * Admin rewrites and /api stay in vercel.json / api/ at repo root.
 *
 * Restore live marketing: set vercel.json buildCommand to null and
 * outputDirectory to ".", then redeploy (see DEPLOY.md).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'offline-dist');

function copyFile(rel) {
  const from = path.join(root, rel);
  const to = path.join(dist, rel);
  if (!fs.existsSync(from)) {
    console.warn('skip missing:', rel);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(rel) {
  const from = path.join(root, rel);
  if (!fs.existsSync(from)) {
    console.warn('skip missing dir:', rel);
    return;
  }
  fs.cpSync(from, path.join(dist, rel), { recursive: true });
}

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

// Admin / developer auth surface (required: /admin redirects here for login)
[
  'developer-login.html',
  'developer-central.html',
  'developer-api.html',
  'access-denied.html',
  'favicon.ico',
  'site.webmanifest'
].forEach(copyFile);

copyDir('css');
copyDir('fonts');
copyDir('js');
copyDir('img');

fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  [
    'User-agent: *',
    'Disallow: /',
    '',
    'User-agent: *',
    'Allow: /developer-login',
    'Allow: /admin',
    ''
  ].join('\n'),
  'utf8'
);

console.log('offline-dist ready (holding page + admin auth pages)');
