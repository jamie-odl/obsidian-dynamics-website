// Replace the lone <link rel="icon" type="image/svg+xml" href="img/favicon.svg">
// with the full favicon + PWA manifest set on every HTML file.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));

const old = /[ \t]*<link rel="icon" type="image\/svg\+xml" href="img\/favicon\.svg">\r?\n/;
const replacement =
    '    <link rel="icon" href="/favicon.ico" sizes="32x32">\n' +
    '    <link rel="icon" type="image/svg+xml" href="/img/favicon.svg">\n' +
    '    <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png">\n' +
    '    <link rel="manifest" href="/site.webmanifest">\n' +
    '    <meta name="theme-color" content="#f8f6f3">\n';

let changed = 0;
for (const file of files) {
    const fp = path.join(root, file);
    const txt = fs.readFileSync(fp, 'utf8');
    if (!old.test(txt)) continue;
    // Avoid double theme-color on pages (privacy/terms) that already have one.
    const hasTheme = /<meta name="theme-color"/.test(txt);
    const out = txt.replace(
        old,
        hasTheme
            ? replacement.replace(/    <meta name="theme-color".*\n/, '')
            : replacement
    );
    if (out !== txt) {
        fs.writeFileSync(fp, out, 'utf8');
        changed++;
        console.log('updated:', file);
    }
}
console.log('Total:', changed);
