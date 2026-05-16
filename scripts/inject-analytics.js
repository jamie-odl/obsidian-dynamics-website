// Inject Vercel Web Analytics + Speed Insights scripts before the closing </body>
// of every HTML file (idempotent — re-running is a no-op).
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));

const marker = '_vercel/insights/script.js';
const snippet =
    '<script defer src="/_vercel/insights/script.js"></script>\n' +
    '<script defer src="/_vercel/speed-insights/script.js"></script>\n';

let changed = 0;
for (const file of files) {
    const fp = path.join(root, file);
    const txt = fs.readFileSync(fp, 'utf8');
    if (txt.includes(marker)) continue;
    if (!/<\/body>/i.test(txt)) continue;
    const out = txt.replace(/<\/body>/i, snippet + '</body>');
    fs.writeFileSync(fp, out, 'utf8');
    changed++;
    console.log('injected:', file);
}
console.log('Total:', changed);
