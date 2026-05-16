// Replace the Google Fonts <link> block in every HTML file with self-hosted equivalents.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));

const blockRe =
    /[ \t]*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[^>]*>\r?\n[ \t]*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\r?\n[ \t]*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]+">\r?\n/;

const replacement =
    '    <link rel="preload" href="/fonts/ibm-plex-sans-400.woff2" as="font" type="font/woff2" crossorigin>\n' +
    '    <link rel="preload" href="/fonts/outfit-600.woff2" as="font" type="font/woff2" crossorigin>\n' +
    '    <link rel="stylesheet" href="css/fonts.css">\n';

let changed = 0;
for (const file of files) {
    const fp = path.join(root, file);
    const txt = fs.readFileSync(fp, 'utf8');
    if (!blockRe.test(txt)) continue;
    const next = txt.replace(blockRe, replacement);
    if (next !== txt) {
        fs.writeFileSync(fp, next, 'utf8');
        changed++;
        console.log('swapped:', file);
    }
}
console.log('Total:', changed);
