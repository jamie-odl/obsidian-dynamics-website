const PLAN_TO_PRICE_ENV = {
    skygrid_starter: 'PRICE_SKYGRID_STARTER',
    skygrid_professional: 'PRICE_SKYGRID_PROFESSIONAL',
    skygrid_enterprise: 'PRICE_SKYGRID_ENTERPRISE'
};

async function createCheckoutSession({ priceId, origin }) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is not configured');

    const successUrl = process.env.BILLING_SUCCESS_URL || `${origin}/contact.html?billing=success`;
    const cancelUrl = process.env.BILLING_CANCEL_URL || `${origin}/contact.html?billing=cancel`;

    const body = new URLSearchParams();
    body.append('mode', 'subscription');
    body.append('success_url', successUrl);
    body.append('cancel_url', cancelUrl);
    body.append('line_items[0][price]', priceId);
    body.append('line_items[0][quantity]', '1');
    body.append('allow_promotion_codes', 'true');
    body.append('billing_address_collection', 'required');

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Stripe checkout session failed: ${errText}`);
    }
    return response.json();
}

module.exports = async (request, response) => {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
    try {
        const plan = String(request.body?.plan || '').trim();
        const priceEnvKey = PLAN_TO_PRICE_ENV[plan];
        if (!priceEnvKey) return response.status(400).json({ error: 'Unsupported plan' });

        const priceId = process.env[priceEnvKey];
        if (!priceId) return response.status(500).json({ error: `Missing env var: ${priceEnvKey}` });

        const origin = `${request.headers['x-forwarded-proto'] || 'https'}://${request.headers.host}`;
        const session = await createCheckoutSession({ priceId, origin });
        return response.status(200).json({ url: session.url });
    } catch (error) {
        return response.status(500).json({ error: 'Unable to create checkout session' });
    }
};
