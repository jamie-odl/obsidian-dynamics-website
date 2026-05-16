// Safer CSS pruner.
// - Collects classes used in HTML/JS (including '.x' style selectors in JS strings).
// - Tokenises styles.css into rules (top-level + @media nested), preserving order.
// - For each rule, splits selectors by comma. Keeps selector if:
//     * it has no class names at all (element / id / pseudo only), OR
//     * any of its classes is in the USED set.
// - If all selectors are dropped, the rule is removed.
// - Comments are preserved.
//
// Usage: node scripts/css-prune.js [--write]

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const cssPath = path.join(root, 'css', 'styles.css');
const WRITE = process.argv.includes('--write');

function walk(dir, exts, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(p, exts, out);
        else if (exts.some(e => entry.name.endsWith(e))) out.push(p);
    }
    return out;
}

const used = new Set();
const sources = walk(root, ['.html', '.js']);
for (const file of sources) {
    if (file === cssPath || file.includes(path.join('scripts', 'css-'))) continue;
    const txt = fs.readFileSync(file, 'utf8');
    // class attributes
    for (const m of txt.matchAll(/\bclass(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/g)) {
        for (const t of m[1].split(/\s+/)) if (t) used.add(t);
    }
    // classList ops
    for (const m of txt.matchAll(/classList\.(?:add|toggle|remove|replace|contains)\s*\(\s*['"`]([^'"`]+)['"`]/g)) {
        used.add(m[1]);
    }
    // string literals carrying class tokens — single class or whitespace list
    for (const m of txt.matchAll(/['"`]([a-z][a-z0-9_-]*(?:\s+[a-z][a-z0-9_-]*)*)['"`]/g)) {
        for (const t of m[1].split(/\s+/)) {
            if (/^[a-z][-a-z0-9_]*$/.test(t)) used.add(t);
        }
    }
    // CSS-style selectors inside JS strings: '.foo', '.foo .bar', '.foo--mod', etc.
    for (const m of txt.matchAll(/['"`]([^'"`<>]{1,200})['"`]/g)) {
        for (const c of m[1].matchAll(/\.([A-Za-z_][\w-]+)/g)) used.add(c[1]);
    }
}

const src = fs.readFileSync(cssPath, 'utf8');

function extractClassesFromSelector(selector) {
    return [...selector.matchAll(/\.([A-Za-z_][\w-]+)/g)].map(m => m[1]);
}

function pruneSelectorList(selList) {
    return selList
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .filter(sel => {
            const cls = extractClassesFromSelector(sel);
            if (cls.length === 0) return true; // element/id/pseudo only
            return cls.some(c => used.has(c));
        });
}

// Tokenise. Simple state machine: walk chars, track depth (for @media + nested), capture rules.
let out = '';
let i = 0;
const n = src.length;
let removedRules = 0;
let droppedSelectors = 0;

function skipComment(j) {
    if (src[j] === '/' && src[j + 1] === '*') {
        const end = src.indexOf('*/', j + 2);
        if (end === -1) return n;
        return end + 2;
    }
    return -1;
}

function readUntilBraceOrSemi(j) {
    let depth = 0;
    while (j < n) {
        const c = src[j];
        const cs = skipComment(j);
        if (cs !== -1) { j = cs; continue; }
        if (c === '{') return j;
        if (c === '}') return j;
        if (c === ';' && depth === 0) return j;
        j++;
    }
    return j;
}

function matchBrace(j) {
    let depth = 1;
    j++;
    while (j < n && depth > 0) {
        const cs = skipComment(j);
        if (cs !== -1) { j = cs; continue; }
        if (src[j] === '{') depth++;
        else if (src[j] === '}') depth--;
        j++;
    }
    return j;
}

function processBlock(start, end) {
    // Process a region [start, end) which is a sequence of rules / at-rules / comments / whitespace.
    let local = '';
    let j = start;
    while (j < end) {
        const c = src[j];

        // whitespace pass-through
        if (/\s/.test(c)) { local += c; j++; continue; }

        // comment pass-through
        const cs = skipComment(j);
        if (cs !== -1) { local += src.slice(j, cs); j = cs; continue; }

        // at-rule
        if (c === '@') {
            const headerEnd = readUntilBraceOrSemi(j);
            const header = src.slice(j, headerEnd);
            if (src[headerEnd] === ';') {
                local += header + ';';
                j = headerEnd + 1;
                continue;
            }
            if (src[headerEnd] === '{') {
                const blockEnd = matchBrace(headerEnd); // index after }
                const innerStart = headerEnd + 1;
                const innerEnd = blockEnd - 1;
                // Nested rules inside @media / @supports / @container
                const isNested = /^@(?:media|supports|container|layer|document)/.test(header.trim());
                if (isNested) {
                    const inner = processBlock(innerStart, innerEnd);
                    // If inner has no actual rules (only whitespace/comments), drop the at-rule entirely
                    const stripped = inner.replace(/\/\*[\s\S]*?\*\//g, '').trim();
                    if (stripped.length === 0) {
                        removedRules++;
                        j = blockEnd;
                        continue;
                    }
                    local += header + '{' + inner + '}';
                } else {
                    // @keyframes, @font-face etc. — keep as-is
                    local += src.slice(j, blockEnd);
                }
                j = blockEnd;
                continue;
            }
            // No body, no semi — bail
            local += src.slice(j, headerEnd);
            j = headerEnd;
            continue;
        }

        // selector rule
        const selEnd = readUntilBraceOrSemi(j);
        if (src[selEnd] !== '{') {
            // malformed; pass through
            local += src.slice(j, selEnd + 1);
            j = selEnd + 1;
            continue;
        }
        const selectorRaw = src.slice(j, selEnd);
        const blockEnd = matchBrace(selEnd);
        const body = src.slice(selEnd, blockEnd); // includes { ... }
        const keptSelectors = pruneSelectorList(selectorRaw);
        const originalSelectors = selectorRaw.split(',').map(s => s.trim()).filter(Boolean);
        droppedSelectors += originalSelectors.length - keptSelectors.length;
        if (keptSelectors.length === 0) {
            removedRules++;
            j = blockEnd;
            continue;
        }
        const newSelector = keptSelectors.join(', ');
        local += newSelector + ' ' + body;
        j = blockEnd;
    }
    return local;
}

const out2 = processBlock(0, n);

console.log('Used classes (HTML/JS):', used.size);
console.log('Rules removed:', removedRules);
console.log('Selectors dropped within surviving rules:', droppedSelectors);
console.log('Original size:', src.length, 'bytes');
console.log('Pruned size:', out2.length, 'bytes');
console.log('Saved:', src.length - out2.length, 'bytes (' + Math.round(((src.length - out2.length) / src.length) * 100) + '%)');

if (WRITE) {
    fs.writeFileSync(cssPath, out2, 'utf8');
    console.log('Wrote', cssPath);
}
