document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('developerLoginForm');
    var status = document.getElementById('developerLoginStatus');
    if (!form || !status) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        status.className = 'form-status';
        status.textContent = '';
        var emailInput = document.getElementById('developerEmail');
        var email = (emailInput && emailInput.value ? emailInput.value : '').trim();
        if (!email) return;

        var params = new URLSearchParams(window.location.search);
        var next = params.get('next') || 'developer-central.html';

        try {
            var response = await fetch('/api/auth/request-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, next: next })
            });
            if (response.status === 403) {
                window.location.href = 'access-denied.html';
                return;
            }
            if (!response.ok) throw new Error('Request failed');
            status.className = 'form-status form-status--success';
            status.textContent = 'Login link sent. Check your email to complete 2FA sign-in.';
        } catch (error) {
            status.className = 'form-status form-status--error';
            status.textContent = 'Unable to send login link. Verify allowlist access or contact operations.';
        }
    });
});
