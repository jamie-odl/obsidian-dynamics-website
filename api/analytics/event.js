const crypto = require('crypto');

const analyticsRate = new Map();

function getIp(request) {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) return String(forwarded).split(',')[0].trim();
    return request.socket?.remoteAddress || 'unknown';
}

function allowEvent(bucket, key, limit, windowSeconds) {
    const now = Math.floor(Date.now() / 1000);
    const composed = `${bucket}:${key}`;
    const current = analyticsRate.get(composed);
    if (!current || current.resetAt <= now) {
        analyticsRate.set(composed, { count: 1, resetAt: now + windowSeconds });
        return true;
    }
    if (current.count >= limit) return false;
    current.count += 1;
    analyticsRate.set(composed, current);
    return true;
}

module.exports = async (request, response) => {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
    try {
        const ip = getIp(request);
        const allowed = allowEvent('analytics', ip, 120, 60);
        if (!allowed) return response.status(429).json({ error: 'Rate limit exceeded' });

        const body = request.body || {};
        const eventType = String(body.eventType || '').trim();
        const page = String(body.page || '').trim();
        if (!eventType || !page) return response.status(400).json({ error: 'eventType and page are required' });

        const payload = {
            at: new Date().toISOString(),
            eventType,
            page,
            referrer: String(body.referrer || '').trim(),
            target: String(body.target || '').trim(),
            tier: String(body.tier || '').trim(),
            sessionHint: crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 16)
        };

        // Scaffold sink: structured logs can be routed to Datadog/SIEM/warehouse.
        console.log(JSON.stringify({ analytics_event: payload }));
        return response.status(202).json({ accepted: true });
    } catch (error) {
        return response.status(500).json({ error: 'Unable to process analytics event' });
    }
};

