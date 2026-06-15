// Generate 1200×630 Open Graph PNGs for each product (no external deps).
// Usage: node scripts/generate-og-images.js

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..');
const imgDir = path.join(root, 'img');

const PORCELAIN = [0xf8, 0xf6, 0xf3];
const TEAL = [0x0c, 0x4a, 0x4e];
const TEAL_MID = [0x14, 0x7a, 0x82];
const SLATE = [0x5c, 0x65, 0x6d];
const OBSIDIAN = [0x1a, 0x1f, 0x24];

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
    ihdr[8] = 8;
    ihdr[9] = 6;
    const rowBytes = width * 4;
    const raw = Buffer.alloc((rowBytes + 1) * height);
    for (let y = 0; y < height; y++) {
        raw[(rowBytes + 1) * y] = 0;
        rgba.copy(raw, (rowBytes + 1) * y + 1, rowBytes * y, rowBytes * (y + 1));
    }
    const idat = zlib.deflateSync(raw, { level: 9 });
    return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

function setPx(buf, w, x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= w) return;
    const i = (y * w + x) * 4;
    if (i < 0 || i >= buf.length) return;
    buf[i] = r;
    buf[i + 1] = g;
    buf[i + 2] = b;
    buf[i + 3] = a;
}

function fillRect(buf, w, h, x0, y0, x1, y1, rgb, alpha) {
    for (let y = Math.max(0, y0); y < Math.min(h, y1); y++) {
        for (let x = Math.max(0, x0); x < Math.min(w, x1); x++) {
            setPx(buf, w, x, y, rgb[0], rgb[1], rgb[2], alpha);
        }
    }
}

// 5×7 uppercase bitmap font (row-major, # = ink)
const FONT = {
    A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
    C: ['.####', '#...', '#...', '#...', '#...', '#...', '.####'],
    D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
    E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
    G: ['.####', '#....', '#....', '#.###', '#...#', '#...#', '.####'],
    H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
    K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
    L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
    N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
    O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
    S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
    T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
    U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
    W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
    Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
    ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
    '.': ['.....', '.....', '.....', '.....', '.....', '..#..', '..#..'],
    '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....']
};

function drawText(buf, w, h, text, x, y, scale, rgb) {
    let cursor = x;
    for (const ch of text.toUpperCase()) {
        const glyph = FONT[ch] || FONT[' '];
        for (let row = 0; row < glyph.length; row++) {
            for (let col = 0; col < glyph[row].length; col++) {
                if (glyph[row][col] !== '#') continue;
                for (let sy = 0; sy < scale; sy++) {
                    for (let sx = 0; sx < scale; sx++) {
                        setPx(buf, w, cursor + col * scale + sx, y + row * scale + sy, rgb[0], rgb[1], rgb[2], 255);
                    }
                }
            }
        }
        cursor += (glyph[0].length + 1) * scale;
    }
}

function drawMark(buf, w, h, cx, cy, size) {
    const half = Math.floor(size / 2);
    const x0 = cx - half;
    const y0 = cy - half;
    const x1 = cx + half;
    const y1 = cy + half;
    const radius = Math.round(size * 12 / 64);
    const strokeHalf = Math.max(2, Math.round(size * 4 / 64 / 2));
    const sx0 = x0 + Math.round(size * 16 / 64);
    const sx1 = x0 + Math.round(size * 48 / 64);
    const sy = y0 + Math.round(size * 32 / 64);

    function inRoundedRect(x, y) {
        if (x < x0 || x > x1 || y < y0 || y > y1) return false;
        const rcx = x < x0 + radius ? x0 + radius : x > x1 - radius ? x1 - radius : x;
        const rcy = y < y0 + radius ? y0 + radius : y > y1 - radius ? y1 - radius : y;
        const dx = x - rcx;
        const dy = y - rcy;
        return dx * dx + dy * dy <= radius * radius;
    }

    function onStroke(x, y) {
        const vx = sx1 - sx0;
        const vy = 0;
        let t = ((x - sx0) * vx) / (vx * vx);
        if (t < 0) t = 0;
        else if (t > 1) t = 1;
        const px = sx0 + t * vx - x;
        const py = sy - y;
        return px * px + py * py <= strokeHalf * strokeHalf;
    }

    for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
            if (!inRoundedRect(x, y)) continue;
            const stroke = onStroke(x, y);
            const r = stroke ? PORCELAIN[0] : TEAL[0];
            const g = stroke ? PORCELAIN[1] : TEAL[1];
            const b = stroke ? PORCELAIN[2] : TEAL[2];
            setPx(buf, w, x, y, r, g, b, 255);
        }
    }
}

function renderOg({ filename, tag, title, subtitle }) {
    const width = 1200;
    const height = 630;
    const buf = Buffer.alloc(width * height * 4);
    fillRect(buf, width, height, 0, 0, width, height, PORCELAIN, 255);
    fillRect(buf, width, height, 0, 0, width, 6, TEAL, 255);
    fillRect(buf, width, height, 0, height - 120, width, height, TEAL, 255);
    drawMark(buf, width, height, 104, 104, 96);
    drawText(buf, width, height, 'OBSIDIAN DYNAMICS', 180, 72, 4, TEAL);
    drawText(buf, width, height, tag, 80, 200, 5, TEAL_MID);
    drawText(buf, width, height, title, 80, 280, 6, OBSIDIAN);
    drawText(buf, width, height, subtitle, 80, 380, 4, SLATE);
    const png = encodePNG(width, height, buf);
    fs.writeFileSync(path.join(imgDir, filename), png);
    console.log('wrote', filename, '(' + Math.round(png.length / 1024) + ' KB)');
}

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

renderOg({
    filename: 'og-node.png',
    tag: 'MK.II NODE',
    title: 'RUGGED EDGE INTELLIGENCE',
    subtitle: 'POWER COMPUTE AND SENSING'
});
renderOg({
    filename: 'og-platform.png',
    tag: 'PLATFORM',
    title: 'INGEST EVALUATE ALERT',
    subtitle: 'SIGNED COMPLIANCE EVIDENCE'
});
renderOg({
    filename: 'og-use-cases.png',
    tag: 'USE CASES',
    title: 'NOISE VIBRATION SEISMIC',
    subtitle: 'CONSTRUCTION RAIL AND DEMOLITION'
});
