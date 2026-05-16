// Rasterise the brand mark to PNGs at every size the modern web expects,
// and write a multi-size favicon.ico. No external deps — we re-draw the
// shapes from scratch since the SVG is trivial. PowerShell + System.Drawing
// would also work but Node is portable.
//
// Output:
//   img/favicon-16.png
//   img/favicon-32.png
//   img/favicon-48.png
//   img/apple-touch-icon.png  (180x180)
//   img/icon-192.png
//   img/icon-512.png
//   img/icon-maskable-512.png (with safe-zone padding)
//   favicon.ico               (16 + 32 + 48 multi-size)
//
// Usage: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..');
const imgDir = path.join(root, 'img');

const TEAL = [0x0c, 0x4a, 0x4e];      // #0c4a4e
const PORCELAIN = [0xf8, 0xf6, 0xf3]; // #f8f6f3

// Draw the brand mark on a size×size RGBA buffer.
// `pad` is the fraction of the canvas that should be transparent on each side
// (used for the maskable icon to keep the mark in the safe zone).
function drawMark(size, pad = 0) {
    const buf = Buffer.alloc(size * size * 4); // RGBA
    const inset = Math.round(size * pad);
    const inner = size - inset * 2;
    const radius = Math.round(inner * 12 / 64);

    function setPx(x, y, r, g, b, a) {
        const i = (y * size + x) * 4;
        buf[i] = r;
        buf[i + 1] = g;
        buf[i + 2] = b;
        buf[i + 3] = a;
    }

    function inRoundedRect(x, y, x0, y0, x1, y1, r) {
        if (x < x0 || x > x1 || y < y0 || y > y1) return false;
        // Corners
        const cx = x < x0 + r ? x0 + r : x > x1 - r ? x1 - r : x;
        const cy = y < y0 + r ? y0 + r : y > y1 - r ? y1 - r : y;
        const dx = x - cx;
        const dy = y - cy;
        return dx * dx + dy * dy <= r * r;
    }

    function onStroke(x, y, x0, y0, x1, y1, halfWidth) {
        // Capsule: distance from point to segment <= halfWidth
        const vx = x1 - x0;
        const vy = y1 - y0;
        const len2 = vx * vx + vy * vy;
        let t = ((x - x0) * vx + (y - y0) * vy) / len2;
        if (t < 0) t = 0;
        else if (t > 1) t = 1;
        const px = x0 + t * vx - x;
        const py = y0 + t * vy - y;
        return px * px + py * py <= halfWidth * halfWidth;
    }

    const rectX0 = inset;
    const rectY0 = inset;
    const rectX1 = size - inset;
    const rectY1 = size - inset;

    // Stroke positions scaled from 16..48 in 64-space.
    const sx0 = inset + Math.round(inner * 16 / 64);
    const sx1 = inset + Math.round(inner * 48 / 64);
    const sy = inset + Math.round(inner * 32 / 64);
    const strokeHalf = Math.max(1, Math.round(inner * 4 / 64 / 2));

    // Crude 4x super-sample for AA.
    const SS = 4;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let inside = 0;
            let onStr = 0;
            for (let sy2 = 0; sy2 < SS; sy2++) {
                for (let sx2 = 0; sx2 < SS; sx2++) {
                    const xx = x + (sx2 + 0.5) / SS;
                    const yy = y + (sy2 + 0.5) / SS;
                    if (inRoundedRect(xx, yy, rectX0, rectY0, rectX1, rectY1, radius)) inside++;
                    if (onStroke(xx, yy, sx0, sy, sx1, sy, strokeHalf)) onStr++;
                }
            }
            const insideA = inside / (SS * SS);
            const strokeA = onStr / (SS * SS);
            if (insideA <= 0) {
                setPx(x, y, 0, 0, 0, 0);
                continue;
            }
            // Blend stroke over teal
            const r = Math.round(TEAL[0] * (1 - strokeA) + PORCELAIN[0] * strokeA);
            const g = Math.round(TEAL[1] * (1 - strokeA) + PORCELAIN[1] * strokeA);
            const b = Math.round(TEAL[2] * (1 - strokeA) + PORCELAIN[2] * strokeA);
            setPx(x, y, r, g, b, Math.round(insideA * 255));
        }
    }
    return buf;
}

// Minimal PNG encoder for RGBA buffers (uses zlib for IDAT compression).
function encodePNG(width, height, rgba) {
    function crc32(buf) {
        let c;
        const table = [];
        for (let n = 0; n < 256; n++) {
            c = n;
            for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            table[n] = c;
        }
        let crc = -1;
        for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
        return (crc ^ -1) >>> 0;
    }
    function chunk(type, data) {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length, 0);
        const typeBuf = Buffer.from(type, 'ascii');
        const crcBuf = Buffer.alloc(4);
        crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
        return Buffer.concat([len, typeBuf, data, crcBuf]);
    }

    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;   // bit depth
    ihdr[9] = 6;   // colour type RGBA
    ihdr[10] = 0;  // compression
    ihdr[11] = 0;  // filter
    ihdr[12] = 0;  // interlace

    // Filter each row with filter 0 (None).
    const rowBytes = width * 4;
    const raw = Buffer.alloc((rowBytes + 1) * height);
    for (let y = 0; y < height; y++) {
        raw[(rowBytes + 1) * y] = 0;
        rgba.copy(raw, (rowBytes + 1) * y + 1, rowBytes * y, rowBytes * (y + 1));
    }
    const idat = zlib.deflateSync(raw, { level: 9 });

    return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// Build a multi-image ICO from a list of (size, pngBuf).
// The ICO format is happy with raw PNGs for sizes >= 16.
function encodeICO(entries) {
    const count = entries.length;
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);     // type 1 = icon
    header.writeUInt16LE(count, 4);
    const dirs = [];
    const datas = [];
    let offset = 6 + 16 * count;
    for (const { size, png } of entries) {
        const d = Buffer.alloc(16);
        d[0] = size === 256 ? 0 : size;
        d[1] = size === 256 ? 0 : size;
        d[2] = 0;                    // palette
        d[3] = 0;                    // reserved
        d.writeUInt16LE(1, 4);       // colour planes
        d.writeUInt16LE(32, 6);      // bits per pixel
        d.writeUInt32LE(png.length, 8);
        d.writeUInt32LE(offset, 12);
        dirs.push(d);
        datas.push(png);
        offset += png.length;
    }
    return Buffer.concat([header, ...dirs, ...datas]);
}

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

const targets = [
    { name: 'favicon-16.png', size: 16, pad: 0 },
    { name: 'favicon-32.png', size: 32, pad: 0 },
    { name: 'favicon-48.png', size: 48, pad: 0 },
    { name: 'apple-touch-icon.png', size: 180, pad: 0 },
    { name: 'icon-192.png', size: 192, pad: 0 },
    { name: 'icon-512.png', size: 512, pad: 0 },
    { name: 'icon-maskable-512.png', size: 512, pad: 0.1 } // ~10% safe-zone
];

const icoSources = [];
for (const t of targets) {
    const rgba = drawMark(t.size, t.pad);
    const png = encodePNG(t.size, t.size, rgba);
    fs.writeFileSync(path.join(imgDir, t.name), png);
    console.log('wrote', t.name, '(' + Math.round(png.length / 1024) + ' KB)');
    if (t.size === 16 || t.size === 32 || t.size === 48) icoSources.push({ size: t.size, png });
}

const ico = encodeICO(icoSources);
fs.writeFileSync(path.join(root, 'favicon.ico'), ico);
console.log('wrote favicon.ico (' + Math.round(ico.length / 1024) + ' KB)');
