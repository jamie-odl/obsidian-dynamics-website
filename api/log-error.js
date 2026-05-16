// Lightweight client-side error sink.
// Receives error and unhandledrejection events from the marketing site,
// trims them to a bounded payload, rate-limits per IP, and structured-logs
// to stdout. Vercel persists these logs for triage; you can later route them
// to Datadog / Sentry / a warehouse without changing the client contract.
//
// Contract:
//   POST /api/log-error
//   Content-Type: application/json
//   Body: { message, source, line, col, stack, page, ua, kind }
//
// Returns 204 on success, 400 if malformed, 429 if rate-limited.

const rate = new Map();
const LIMIT = 30; // events per window per IP
const WINDOW = 60; // seconds

function getIp(request) {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) return String(forwarded).split(',')[0].trim();
    return (request.socket && request.socket.remoteAddress) || 'unknown';
}

function allow(ip) {
    const now = Math.floor(Date.now() / 1000);
    const cur = rate.get(ip);
    if (!cur || cur.resetAt <= now) {
        rate.set(ip, { count: 1, resetAt: now + WINDOW });
        return true;
    }
    if (cur.count >= LIMIT) return false;
    cur.count += 1;
    return true;
}

function trim(value, max) {
    if (value == null) return '';
    const s = String(value);
    return s.length > max ? s.slice(0, max) + '…' : s;
}

module.exports = async (request, response) => {
    if (request.method === 'OPTIONS') {
        response.setHeader('Allow', 'POST');
        return response.status(204).end();
    }
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).end();
    }

    const ip = getIp(request);
    if (!allow(ip)) return response.status(429).end();

    let body = request.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { return response.status(400).end(); }
    }
    if (!body || typeof body !== 'object') return response.status(400).end();

    const event = {
        at: new Date().toISOString(),
        kind: trim(body.kind, 32) || 'error',
        message: trim(body.message, 500),
        source: trim(body.source, 300),
        line: Number.isFinite(+body.line) ? +body.line : null,
        col: Number.isFinite(+body.col) ? +body.col : null,
        stack: trim(body.stack, 1500),
        page: trim(body.page, 300),
        ua: trim(body.ua, 200),
        referrer: trim(body.referrer, 300)
    };

    console.log(JSON.stringify({ client_error: event }));
    return response.status(204).end();
};
