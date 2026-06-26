const { verifyToken, getUserRole } = require('./auth/_utils');

const HOP_BY_HOP = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailers',
    'transfer-encoding',
    'upgrade',
    'host',
    'content-length',
    'cookie'
]);

function parseCookie(cookieHeader) {
    const raw = String(cookieHeader || '');
    const map = {};
    raw.split(';').forEach((part) => {
        const idx = part.indexOf('=');
        if (idx === -1) return;
        const key = part.slice(0, idx).trim();
        const value = part.slice(idx + 1).trim();
        try {
            map[key] = decodeURIComponent(value);
        } catch {
            map[key] = value;
        }
    });
    return map;
}

function backendBase() {
    const base = process.env.CIVITAS_API_URL || 'http://127.0.0.1:8000';
    return base.replace(/\/$/, '');
}

async function requireAdminSession(request) {
    try {
        const host = request.headers.host;
        const proto = request.headers['x-forwarded-proto'] || 'https';
        const origin = `${proto}://${host}`;
        const sessionRes = await fetch(`${origin}/api/auth/session`, {
            headers: { cookie: request.headers.cookie || '' },
            cache: 'no-store'
        });
        if (!sessionRes.ok) return false;
        const data = await sessionRes.json();
        return Boolean(data.authenticated && data.role === 'admin');
    } catch {
        const cookies = parseCookie(request.headers.cookie);
        try {
            const payload = verifyToken(cookies.od_dev_session);
            const role = payload && payload.email ? getUserRole(payload.email) : null;
            return Boolean(payload && payload.type === 'session' && role === 'admin');
        } catch {
            return false;
        }
    }
}

function buildUpstreamQuery(query) {
    const params = new URLSearchParams();
    Object.entries(query || {}).forEach(([key, value]) => {
        if (key === 'upstream') return;
        if (Array.isArray(value)) {
            value.forEach((entry) => params.append(key, String(entry)));
            return;
        }
        if (value != null && value !== '') params.set(key, String(value));
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

function upstreamPathFromQuery(query) {
    const raw = query && query.upstream;
    if (Array.isArray(raw)) return raw.map(encodeURIComponent).join('/');
    return String(raw || '').split('/').map(encodeURIComponent).join('/');
}

async function readBody(request) {
    if (request.method === 'GET' || request.method === 'HEAD') return undefined;

    // Vercel pre-parses JSON bodies into request.body; stream listeners never fire.
    const parsed = request.body;
    if (parsed !== undefined && parsed !== null) {
        if (Buffer.isBuffer(parsed)) return parsed;
        if (typeof parsed === 'string') return Buffer.from(parsed);
        return Buffer.from(JSON.stringify(parsed));
    }

    const chunks = [];
    for await (const chunk of request) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

module.exports = async (request, response) => {
    if (!(await requireAdminSession(request))) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    const upstreamPath = upstreamPathFromQuery(request.query);
    if (!upstreamPath) {
        return response.status(400).json({ error: 'Missing upstream path' });
    }

    const target = `${backendBase()}/${upstreamPath}${buildUpstreamQuery(request.query)}`;

    const headers = {};
    Object.entries(request.headers).forEach(([key, value]) => {
        if (HOP_BY_HOP.has(key.toLowerCase())) return;
        if (value == null) return;
        headers[key] = Array.isArray(value) ? value.join(', ') : value;
    });

    try {
        const body = await readBody(request);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 55000);
        let upstream;
        try {
            upstream = await fetch(target, {
                method: request.method,
                headers,
                body: body && body.length ? body : undefined,
                cache: 'no-store',
                signal: controller.signal
            });
        } finally {
            clearTimeout(timeout);
        }

        response.status(upstream.status);
        upstream.headers.forEach((value, key) => {
            if (HOP_BY_HOP.has(key.toLowerCase())) return;
            response.setHeader(key, value);
        });
        const buffer = Buffer.from(await upstream.arrayBuffer());
        return response.send(buffer);
    } catch (error) {
        return response.status(502).json({
            error: 'Bad gateway',
            detail: 'Intelligence API unreachable. Is the backend running and CIVITAS_API_URL set?'
        });
    }
};
