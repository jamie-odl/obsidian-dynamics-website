const { verifyToken, isAllowlisted, getClientIp, enforceRateLimit, authAudit } = require('./_utils');

function parseCookie(cookieHeader) {
    const raw = String(cookieHeader || '');
    const pairs = raw.split(';').map((part) => part.trim());
    const map = {};
    pairs.forEach((pair) => {
        const idx = pair.indexOf('=');
        if (idx === -1) return;
        const key = pair.slice(0, idx);
        const value = pair.slice(idx + 1);
        map[key] = value;
    });
    return map;
}

module.exports = async (request, response) => {
    if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });

    try {
        const ip = getClientIp(request);
        const sessionRate = enforceRateLimit({
            bucket: 'session-ip',
            key: ip,
            limit: 120,
            windowSeconds: 60
        });
        if (!sessionRate.allowed) {
            authAudit('auth_session_rate_limited', { ip });
            return response.status(429).json({ authenticated: false });
        }

        const cookies = parseCookie(request.headers.cookie);
        const token = cookies.od_dev_session;
        const payload = verifyToken(token);
        if (!payload || payload.type !== 'session' || !isAllowlisted(payload.email)) {
            return response.status(401).json({ authenticated: false });
        }
        return response.status(200).json({ authenticated: true, email: payload.email });
    } catch (error) {
        return response.status(401).json({ authenticated: false });
    }
};
