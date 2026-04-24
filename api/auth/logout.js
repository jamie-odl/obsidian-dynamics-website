const { clearSessionCookie, getClientIp, authAudit } = require('./_utils');

module.exports = async (request, response) => {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
    const ip = getClientIp(request);
    response.setHeader('Set-Cookie', clearSessionCookie());
    authAudit('auth_logout', { ip });
    return response.status(200).json({ ok: true });
};
