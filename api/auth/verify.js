const {
    signToken,
    verifyToken,
    serializeSessionCookie,
    isAllowlisted,
    getUserRole,
    resolvePostLoginRedirect,
    isMagicLinkConsumed,
    markMagicLinkConsumed,
    getClientIp,
    enforceRateLimit,
    authAudit
} = require('./_utils');

module.exports = async (request, response) => {
    if (request.method !== 'GET') return response.status(405).send('Method not allowed');

    try {
        const token = request.query.token;
        const ip = getClientIp(request);
        const verifyRate = enforceRateLimit({
            bucket: 'verify-ip',
            key: ip,
            limit: 12,
            windowSeconds: 60
        });
        if (!verifyRate.allowed) {
            authAudit('auth_verify_rate_limited', { ip });
            return response.status(429).send('Too many verification attempts');
        }

        const payload = verifyToken(token);
        if (!payload || payload.type !== 'magic_link' || !isAllowlisted(payload.email) || !payload.jti) {
            authAudit('auth_verify_failed', { ip, reason: 'invalid_token' });
            return response.status(401).send('Invalid or expired token');
        }
        if (isMagicLinkConsumed(payload.jti)) {
            authAudit('auth_verify_failed', { ip, email: payload.email, reason: 'token_replay' });
            return response.status(401).send('This login link has already been used');
        }

        markMagicLinkConsumed(payload.jti, 15 * 60);

        const role = getUserRole(payload.email);
        if (!role) {
            authAudit('auth_verify_failed', { ip, email: payload.email, reason: 'not_allowlisted' });
            return response.status(401).send('Invalid or expired token');
        }

        const sessionToken = signToken({ email: payload.email, type: 'session', role }, 12 * 60 * 60);
        response.setHeader('Set-Cookie', serializeSessionCookie(sessionToken));
        const destination = resolvePostLoginRedirect(payload.email, payload.next);
        authAudit('auth_verify_success', { ip, email: payload.email, role, destination });
        return response.redirect(302, `/${destination}`);
    } catch (error) {
        authAudit('auth_verify_error', { error: String(error && error.message ? error.message : error) });
        return response.status(500).send('Unable to verify login');
    }
};
