const crypto = require('crypto');

const TOKEN_TTL_SECONDS = 15 * 60;
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const rateLimitStore = new Map();
const consumedMagicLinks = new Map();

function getSecret() {
    const secret = process.env.AUTH_TOKEN_SECRET;
    if (!secret) throw new Error('AUTH_TOKEN_SECRET is not configured');
    return secret;
}

function getBaseUrl(request) {
    const host = request.headers.host;
    const proto = request.headers['x-forwarded-proto'] || 'https';
    return `${proto}://${host}`;
}

function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
}

function getAllowlist() {
    const raw = process.env.DEVELOPER_ALLOWLIST || '';
    return raw.split(',').map((email) => normalizeEmail(email)).filter(Boolean);
}

function isAllowlisted(email) {
    const allowlist = getAllowlist();
    return allowlist.includes(normalizeEmail(email));
}

function signToken(payload, ttlSeconds) {
    const body = {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + ttlSeconds
    };
    const encoded = Buffer.from(JSON.stringify(body)).toString('base64url');
    const sig = crypto.createHmac('sha256', getSecret()).update(encoded).digest('base64url');
    return `${encoded}.${sig}`;
}

function verifyToken(token) {
    if (!token || token.indexOf('.') === -1) return null;
    const [encoded, signature] = token.split('.');
    const expected = crypto.createHmac('sha256', getSecret()).update(encoded).digest('base64url');
    if (!signature || signature.length !== expected.length) return null;
    const isValidSig = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!isValidSig) return null;

    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
}

function serializeSessionCookie(token) {
    const isSecure = process.env.NODE_ENV !== 'development';
    return [
        `od_dev_session=${token}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        `Max-Age=${SESSION_TTL_SECONDS}`,
        isSecure ? 'Secure' : ''
    ].filter(Boolean).join('; ');
}

function clearSessionCookie() {
    const isSecure = process.env.NODE_ENV !== 'development';
    return [
        'od_dev_session=',
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        'Max-Age=0',
        isSecure ? 'Secure' : ''
    ].filter(Boolean).join('; ');
}

function getClientIp(request) {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) return String(forwarded).split(',')[0].trim();
    return request.socket?.remoteAddress || 'unknown';
}

function enforceRateLimit({ bucket, key, limit, windowSeconds }) {
    const now = Math.floor(Date.now() / 1000);
    const composed = `${bucket}:${key}`;
    const current = rateLimitStore.get(composed);
    if (!current || current.resetAt <= now) {
        rateLimitStore.set(composed, { count: 1, resetAt: now + windowSeconds });
        return { allowed: true, remaining: limit - 1 };
    }
    if (current.count >= limit) return { allowed: false, remaining: 0, retryAfter: current.resetAt - now };
    current.count += 1;
    rateLimitStore.set(composed, current);
    return { allowed: true, remaining: limit - current.count };
}

function markMagicLinkConsumed(jti, ttlSeconds) {
    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
    consumedMagicLinks.set(jti, expiresAt);
}

function isMagicLinkConsumed(jti) {
    const expiresAt = consumedMagicLinks.get(jti);
    if (!expiresAt) return false;
    const now = Math.floor(Date.now() / 1000);
    if (expiresAt <= now) {
        consumedMagicLinks.delete(jti);
        return false;
    }
    return true;
}

function authAudit(event, metadata) {
    const payload = {
        at: new Date().toISOString(),
        event,
        ...metadata
    };
    console.log(JSON.stringify(payload));
}

module.exports = {
    TOKEN_TTL_SECONDS,
    SESSION_TTL_SECONDS,
    getBaseUrl,
    normalizeEmail,
    isAllowlisted,
    signToken,
    verifyToken,
    serializeSessionCookie,
    clearSessionCookie,
    getClientIp,
    enforceRateLimit,
    markMagicLinkConsumed,
    isMagicLinkConsumed,
    authAudit
};
