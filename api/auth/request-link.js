const {
    TOKEN_TTL_SECONDS,
    getBaseUrl,
    normalizeEmail,
    isAllowlisted,
    signToken,
    getClientIp,
    enforceRateLimit,
    authAudit
} = require('./_utils');
const crypto = require('crypto');

async function sendMagicLinkEmail({ to, link }) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.AUTH_EMAIL_FROM;
    if (!apiKey || !from) throw new Error('Email sender is not configured');

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from,
            to: [to],
            subject: 'Developer portal secure login link',
            html: `
                <p>Use this one-time login link to complete developer portal sign-in.</p>
                <p><a href="${link}">Complete secure sign-in</a></p>
                <p>This link expires in ${Math.floor(TOKEN_TTL_SECONDS / 60)} minutes.</p>
            `
        })
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Email send failed: ${body}`);
    }
}

module.exports = async (request, response) => {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

    try {
        const { email, next } = request.body || {};
        const normalizedEmail = normalizeEmail(email);
        const safeNext = typeof next === 'string' && next.endsWith('.html') ? next : 'developer-central.html';
        const ip = getClientIp(request);

        const requestRate = enforceRateLimit({
            bucket: 'request-link-ip',
            key: ip,
            limit: 6,
            windowSeconds: 60
        });
        if (!requestRate.allowed) {
            authAudit('auth_request_link_rate_limited', { ip, email: normalizedEmail || 'unknown' });
            return response.status(429).json({ error: 'Too many requests. Try again shortly.' });
        }

        if (!normalizedEmail || !isAllowlisted(normalizedEmail)) {
            authAudit('auth_request_link_denied', { ip, email: normalizedEmail || 'unknown', reason: 'not_allowlisted' });
            return response.status(403).json({ error: 'Account is not allowlisted' });
        }

        const token = signToken({
            email: normalizedEmail,
            type: 'magic_link',
            next: safeNext,
            jti: crypto.randomUUID()
        }, TOKEN_TTL_SECONDS);
        const verifyUrl = `${getBaseUrl(request)}/api/auth/verify?token=${encodeURIComponent(token)}`;

        await sendMagicLinkEmail({ to: normalizedEmail, link: verifyUrl });
        authAudit('auth_request_link_sent', { ip, email: normalizedEmail, next: safeNext });
        return response.status(200).json({ ok: true });
    } catch (error) {
        authAudit('auth_request_link_error', { error: String(error && error.message ? error.message : error) });
        return response.status(500).json({ error: 'Unable to process login request' });
    }
};
