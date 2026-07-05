// POST /api/contact — deliver contact form submissions to the team inbox.
// Requires RESEND_API_KEY on Vercel (verify weareobsidian.co.uk or obsidiandynamics.co.uk domain).
// Env: CONTACT_TO (default jamie@obsidiandynamics.co.uk)
//      CONTACT_FROM (default We Are Obsidian <contact@weareobsidian.co.uk>)

const rate = new Map();
const LIMIT = 8;
const WINDOW = 60;

const VALID_INTEREST = new Set([
    'pilot',
    'support',
    'general',
    'acheronvault',
    'blackglass',
    'charongate',
    'platform',
    'onboarding',
    'account-operations'
]);

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
    const s = String(value).trim();
    return s.length > max ? s.slice(0, max) : s;
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function interestLabel(value) {
    const map = {
        pilot: 'Obsidian Node pilot',
        support: 'Portal support',
        general: 'General',
        acheronvault: 'Acheron Vault',
        blackglass: 'Blackglass',
        charongate: 'Charon Gate',
        platform: 'Platform / API',
        onboarding: 'Onboarding',
        'account-operations': 'Account operations'
    };
    return map[value] || value || 'Not specified';
}

async function sendViaResend({ to, from, replyTo, subject, html, text }) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return { ok: false, error: 'RESEND_API_KEY is not configured' };

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from,
            to: [to],
            reply_to: replyTo,
            subject,
            html,
            text
        })
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => '');
        return { ok: false, error: 'Resend error ' + response.status + ': ' + detail.slice(0, 300) };
    }
    return { ok: true };
}

module.exports = async (request, response) => {
    if (request.method === 'OPTIONS') {
        response.setHeader('Allow', 'POST');
        return response.status(204).end();
    }
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const ip = getIp(request);
    if (!allow(ip)) {
        return response.status(429).json({ error: 'Too many requests. Try again shortly.' });
    }

    let body = request.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch {
            return response.status(400).json({ error: 'Invalid JSON body' });
        }
    }
    if (!body || typeof body !== 'object') {
        return response.status(400).json({ error: 'Invalid request body' });
    }

    // Honeypot — bots fill hidden fields; humans leave them empty.
    if (trim(body.company_website, 200) || trim(body.website, 200)) {
        return response.status(200).json({ ok: true });
    }

    const name = trim(body.name, 120);
    const email = trim(body.email, 254).toLowerCase();
    const organisation = trim(body.organisation, 200);
    const interest = trim(body.interest, 40).toLowerCase();
    const message = trim(body.message, 8000);
    const page = trim(body.page, 300);
    const intent = trim(body.intent, 80);

    if (!name || name.length < 2) {
        return response.status(400).json({ error: 'Name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return response.status(400).json({ error: 'A valid email is required.' });
    }
    if (!message || message.length < 10) {
        return response.status(400).json({ error: 'Message must be at least 10 characters.' });
    }
    if (interest && !VALID_INTEREST.has(interest)) {
        return response.status(400).json({ error: 'Invalid interest selection.' });
    }
    const resolvedInterest = interest || (intent === 'pilot' ? 'pilot' : intent === 'support' ? 'support' : '');

    const to = trim(process.env.CONTACT_TO, 254) || 'jamie@obsidiandynamics.co.uk';
    const from = trim(process.env.CONTACT_FROM, 254)
        || trim(process.env.AUTH_EMAIL_FROM, 254)
        || 'We Are Obsidian <contact@weareobsidian.co.uk>';
    const interestText = interestLabel(resolvedInterest || 'general');
    const subjectParts = ['Contact'];
    if (interest) subjectParts.push(interestText);
    if (intent) subjectParts.push(intent.replace(/-/g, ' '));
    subjectParts.push('—', name);
    const subject = subjectParts.join(' ').slice(0, 180);

    const text = [
        'New contact form submission',
        '',
        'Name: ' + name,
        'Email: ' + email,
        organisation ? 'Organisation: ' + organisation : null,
        'Interest: ' + interestText,
        intent ? 'Intent: ' + intent : null,
        page ? 'Page: ' + page : null,
        'IP: ' + ip,
        '',
        'Message:',
        message
    ].filter(Boolean).join('\n');

    const html = [
        '<h2>New contact form submission</h2>',
        '<p><strong>Name:</strong> ' + escapeHtml(name) + '</p>',
        '<p><strong>Email:</strong> <a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + '</a></p>',
        organisation ? '<p><strong>Organisation:</strong> ' + escapeHtml(organisation) + '</p>' : '',
        '<p><strong>Interest:</strong> ' + escapeHtml(interestText) + '</p>',
        intent ? '<p><strong>Intent:</strong> ' + escapeHtml(intent) + '</p>' : '',
        page ? '<p><strong>Page:</strong> ' + escapeHtml(page) + '</p>' : '',
        '<hr>',
        '<pre style="white-space:pre-wrap;font-family:monospace;font-size:14px;">' + escapeHtml(message) + '</pre>'
    ].join('');

    const delivery = await sendViaResend({
        to,
        from,
        replyTo: email,
        subject,
        html,
        text
    });

    if (!delivery.ok) {
        console.log(JSON.stringify({
            contact_form_failed: {
                at: new Date().toISOString(),
                error: delivery.error,
                name,
                email,
                interest,
                intent,
                page,
                ip
            }
        }));
        return response.status(503).json({
            error: 'Unable to send your message right now. Email jamie@obsidiandynamics.co.uk directly.'
        });
    }

    console.log(JSON.stringify({
        contact_form_sent: {
            at: new Date().toISOString(),
            to,
            name,
            email,
            interest,
            intent,
            page,
            ip
        }
    }));

    return response.status(200).json({ ok: true });
};
