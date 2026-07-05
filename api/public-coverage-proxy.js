function backendBase() {
    const base =
        process.env.OBSIDIAN_INTELLIGENCE_API_URL ||
        'http://127.0.0.1:8000';
    return base.replace(/\/$/, '');
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
        const body = await upstreamRes.text();
        response.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'application/json');
        response.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
        return response.status(upstreamRes.status).send(body);
    } catch (error) {
        return response.status(502).json({
            detail: 'Coverage API unreachable. Is the backend running and OBSIDIAN_INTELLIGENCE_API_URL set?'
        });
    }
};
