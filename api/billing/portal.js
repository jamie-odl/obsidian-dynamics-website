async function createPortalSession({ customerId, origin }) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is not configured');

    const returnUrl = process.env.BILLING_PORTAL_RETURN_URL || `${origin}/account-operations.html`;
    const body = new URLSearchParams();
    body.append('customer', customerId);
    body.append('return_url', returnUrl);

    const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Stripe billing portal session failed: ${errText}`);
    }
    return response.json();
}

async function findCustomerByEmail(email) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const query = new URLSearchParams({ email, limit: '1' }).toString();
    const response = await fetch(`https://api.stripe.com/v1/customers?${query}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${stripeKey}` }
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Stripe customer lookup failed: ${errText}`);
    }
    const payload = await response.json();
    return payload.data && payload.data.length ? payload.data[0] : null;
}

module.exports = async (request, response) => {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
    try {
        const email = String(request.body?.email || '').trim().toLowerCase();
        if (!email) return response.status(400).json({ error: 'Email is required' });

        const customer = await findCustomerByEmail(email);
        if (!customer) return response.status(404).json({ error: 'Customer not found for this email' });

        const origin = `${request.headers['x-forwarded-proto'] || 'https'}://${request.headers.host}`;
        const session = await createPortalSession({ customerId: customer.id, origin });
        return response.status(200).json({ url: session.url });
    } catch (error) {
        return response.status(500).json({ error: 'Unable to create billing portal session' });
    }
};
