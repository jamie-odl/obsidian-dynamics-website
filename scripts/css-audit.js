// Lightweight CSS dead-class audit: find class selectors in styles.css
// that are never referenced anywhere in HTML/JS.
// Conservative — flags only "almost certainly dead" classes (no element/id/pseudo selectors involved).

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function walk(dir, exts, out = []) {
    for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
        if (name.name === 'node_modules' || name.name.startsWith('.')) continue;
        const p = path.join(dir, name.name);
        if (name.isDirectory()) walk(p, exts, out);
        else if (exts.some(e => name.name.endsWith(e))) out.push(p);
    }
    return out;
}

const used = new Set();

// HTML class="..." values + JS string literals
const sources = walk(root, ['.html', '.js']);
for (const file of sources) {
    if (file.endsWith('styles.css')) continue;
    if (file.includes(path.join('scripts', 'css-audit'))) continue;
    const txt = fs.readFileSync(file, 'utf8');

    // class="foo bar baz" / className="foo bar"
    for (const m of txt.matchAll(/\bclass(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/g)) {
        for (const tok of m[1].split(/\s+/)) if (tok) used.add(tok);
    }
    // classList.add('x'), classList.toggle('x'), etc.
    for (const m of txt.matchAll(/classList\.(?:add|toggle|remove|replace|contains)\s*\(\s*['"`]([^'"`]+)['"`]/g)) {
        used.add(m[1]);
    }
    // document.createElement etc.: any single token that LOOKS like a CSS class — e.g. "feature-card", "btn-primary"
    // (very loose — catches strings like 'feature-card feature-card--priority')
    for (const m of txt.matchAll(/['"`]([a-z][a-z0-9_-]{1,}(?:\s+[a-z][a-z0-9_-]{1,})*)['"`]/g)) {
        const v = m[1];
        if (/^[a-z][-a-z0-9_]*(?:--[-a-z0-9_]+)?(?:__[-a-z0-9_]+)?$/.test(v)) used.add(v);
        for (const t of v.split(/\s+/)) {
            if (/^[a-z][-a-z0-9_]*(?:--[-a-z0-9_]+)?(?:__[-a-z0-9_]+)?$/.test(t)) used.add(t);
        }
    }
}

const css = fs.readFileSync(path.join(root, 'css', 'styles.css'), 'utf8');

// Extract class names defined in CSS selectors.
// We only care about classes that appear as the SOLE qualifier (no parent element/id) of at least one selector
// — those are the highest-confidence "remove" candidates.
const definedAll = new Set();
const ruleRe = /([^{}]+)\{[^{}]*\}/g;
let m;
while ((m = ruleRe.exec(css)) !== null) {
    const selList = m[1].split(',').map(s => s.trim()).filter(Boolean);
    for (const sel of selList) {
        for (const c of sel.matchAll(/\.([A-Za-z_][\w-]+)/g)) definedAll.add(c[1]);
    }
}

const dead = [...definedAll].filter(c => !used.has(c)).sort();

console.log('Used classes (HTML/JS):', used.size);
console.log('Defined classes (CSS):', definedAll.size);
console.log('Dead candidates:', dead.length);
console.log('---');
for (const d of dead) console.log(d);
