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

const AUTH_PAGES = new Set([
  'developer-login.html',
  'developer-central.html',
  'developer-api.html',
  'access-denied.html'
]);

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

// Every root marketing HTML path serves the holding page (cleanUrls → /about etc.)
for (const name of fs.readdirSync(root)) {
  if (!name.endsWith('.html')) continue;
  if (AUTH_PAGES.has(name)) {
    copyFile(name);
    continue;
  }
  fs.copyFileSync(offline, path.join(dist, name));
}

// Nested writing/*.html also becomes the holding page
const writingDir = path.join(root, 'writing');
if (fs.existsSync(writingDir)) {
  fs.mkdirSync(path.join(dist, 'writing'), { recursive: true });
  for (const name of fs.readdirSync(writingDir)) {
    if (!name.endsWith('.html')) continue;
    fs.copyFileSync(offline, path.join(dist, 'writing', name));
  }
}

fs.copyFileSync(offline, path.join(dist, 'index.html'));
fs.copyFileSync(offline, path.join(dist, '404.html'));
fs.copyFileSync(offline, path.join(dist, 'offline.html'));

['favicon.ico', 'site.webmanifest'].forEach(copyFile);
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

console.log('offline-dist ready (holding page on all marketing paths + admin auth)');
