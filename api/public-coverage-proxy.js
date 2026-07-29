const fs = require('fs');
const path = require('path');

function backendBase() {
    const base =
        process.env.OBSIDIAN_INTELLIGENCE_API_URL ||
        'http://127.0.0.1:8000';
    return base.replace(/\/$/, '');
}

function bundledSnapshot() {
    const snapshotPath = path.join(__dirname, 'coverage-snapshot.json');
    return fs.readFileSync(snapshotPath, 'utf8');
}

module.exports = async function handler(request, response) {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET');
        return response.status(405).json({ detail: 'Method not allowed' });
    }

    const upstream = `${backendBase()}/api/public/coverage`;

    try {
        const upstreamRes = await fetch(upstream, {
            headers: { accept: 'application/json' },
            cache: 'no-store'
        });
        if (upstreamRes.ok) {
            const body = await upstreamRes.text();
            response.setHeader(
                'Content-Type',
                upstreamRes.headers.get('content-type') || 'application/json'
            );
            response.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
            response.setHeader('X-Coverage-Source', 'live');
            return response.status(upstreamRes.status).send(body);
        }
    } catch (_error) {
        /* fall through to bundled snapshot */
    }

    try {
        const body = bundledSnapshot();
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
        response.setHeader('X-Coverage-Source', 'snapshot');
        return response.status(200).send(body);
    } catch (_error) {
        return response.status(502).json({
            detail: 'Coverage API unreachable and bundled snapshot missing. Is OBSIDIAN_INTELLIGENCE_API_URL set?'
        });
    }
};
