const { verifyToken, getClientIp, enforceRateLimit, authAudit } = require('../auth/_utils');

const EXPORTS = {
    public_snapshot: {
        formats: ['pdf'],
        maxRows: 0
    },
    limited_export: {
        formats: ['pdf', 'csv'],
        maxRows: 1000
    },
    full_export: {
        formats: ['pdf', 'csv', 'json'],
        maxRows: 50000
    }
};

function parseCookie(header, key) {
    if (!header) return null;
    const raw = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${key}=`));
    if (!raw) return null;
    return decodeURIComponent(raw.slice(key.length + 1));
}

function resolveEntitlement(email) {
    const normalized = String(email || '').toLowerCase();
    if (!normalized) return 'public_snapshot';
    if (normalized.endsWith('@weareobsidian.co.uk') || normalized.endsWith('@obsidiandynamics.co.uk')) return 'full_export';
    return 'limited_export';
}

module.exports = async (request, response) => {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
    try {
        const ip = getClientIp(request);
        const rl = enforceRateLimit({ bucket: 'exports', key: ip, limit: 20, windowSeconds: 60 });
        if (!rl.allowed) return response.status(429).json({ error: 'Rate limit exceeded' });

        const exportType = String(request.body?.export_type || 'public_snapshot').trim();
        const format = String(request.body?.format || 'pdf').trim().toLowerCase();
        const targetProduct = String(request.body?.product || 'atlas').trim().toLowerCase();

        const sessionToken = parseCookie(request.headers.cookie, 'od_dev_session');
        const session = sessionToken ? verifyToken(sessionToken) : null;
        const entitlement = resolveEntitlement(session?.email);

        const requested = EXPORTS[exportType];
        if (!requested) return response.status(400).json({ error: 'Unsupported export_type' });
        if (!requested.formats.includes(format)) return response.status(400).json({ error: 'Unsupported format for export_type' });

        const entitlementOrder = ['public_snapshot', 'limited_export', 'full_export'];
        if (entitlementOrder.indexOf(exportType) > entitlementOrder.indexOf(entitlement)) {
            return response.status(403).json({ error: 'Insufficient entitlement for requested export_type' });
        }

        const downloadUrl = `/snapshots/${targetProduct}/${exportType}/latest.${format}`;
        authAudit('export_request', {
            ip,
            email: session?.email || null,
            entitlement,
            exportType,
            format,
            product: targetProduct
        });

        return response.status(200).json({
            ok: true,
            entitlement,
            export_type: exportType,
            format,
            max_rows: requested.maxRows,
            download_url: downloadUrl
        });
    } catch (error) {
        return response.status(500).json({ error: 'Unable to process export request' });
    }
};

