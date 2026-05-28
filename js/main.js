/* ============================================================
   OBSIDIAN DYNAMICS — Main JavaScript
   ============================================================ */

/* ----- Client-side error sink (registered before DOMContentLoaded) ----- */
(function attachErrorSink() {
    if (typeof window === 'undefined') return;
    if (window.__obsidianErrorSinkAttached) return;
    window.__obsidianErrorSinkAttached = true;

    let sent = 0;
    const MAX_PER_PAGE = 5;
    const seen = new Set();

    function fingerprint(payload) {
        return (payload.message || '') + '|' + (payload.source || '') + '|' + (payload.line || 0);
    }

    function send(payload) {
        if (sent >= MAX_PER_PAGE) return;
        const key = fingerprint(payload);
        if (seen.has(key)) return;
        seen.add(key);
        sent += 1;

        const body = JSON.stringify(payload);
        try {
            if (navigator.sendBeacon) {
                const blob = new Blob([body], { type: 'application/json' });
                if (navigator.sendBeacon('/api/log-error', blob)) return;
            }
        } catch (_) {}
        try {
            fetch('/api/log-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
                keepalive: true
            }).catch(() => {});
        } catch (_) {}
    }

    window.addEventListener('error', function (event) {
        send({
            kind: 'error',
            message: event && event.message,
            source: event && event.filename,
            line: event && event.lineno,
            col: event && event.colno,
            stack: event && event.error && event.error.stack,
            page: window.location.pathname,
            ua: navigator.userAgent,
            referrer: document.referrer || ''
        });
    });

    window.addEventListener('unhandledrejection', function (event) {
        const reason = event && event.reason;
        send({
            kind: 'unhandledrejection',
            message: reason && (reason.message || String(reason)),
            stack: reason && reason.stack,
            page: window.location.pathname,
            ua: navigator.userAgent,
            referrer: document.referrer || ''
        });
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    // Typography loads via @import in css/styles.css (IBM Plex — matches blackglass-console).

    const prefersReducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    function injectAmbientLayer() {
        if (document.getElementById('ambientLayer')) return;
        const layer = document.createElement('div');
        layer.id = 'ambientLayer';
        layer.className = 'ambient-layer';
        layer.setAttribute('aria-hidden', 'true');
        const skip = document.querySelector('.skip-to-content');
        if (skip && skip.parentNode === document.body) {
            skip.insertAdjacentElement('afterend', layer);
        } else {
            document.body.insertBefore(layer, document.body.firstChild);
        }
    }
    injectAmbientLayer();

    let ambientPointerPending = false;
    let ambientLastX = 0;
    let ambientLastY = 0;
    function bindAmbientPointer() {
        if (prefersReducedMotionMq.matches) return;
        document.addEventListener(
            'mousemove',
            (e) => {
                if (window.innerWidth < 768) return;
                ambientLastX = e.clientX;
                ambientLastY = e.clientY;
                if (ambientPointerPending) return;
                ambientPointerPending = true;
                requestAnimationFrame(() => {
                    ambientPointerPending = false;
                    const x = (ambientLastX / window.innerWidth) * 100;
                    const y = (ambientLastY / window.innerHeight) * 100;
                    document.documentElement.style.setProperty('--pointer-x', `${x}%`);
                    document.documentElement.style.setProperty('--pointer-y', `${y}%`);
                });
            },
            { passive: true }
        );
    }
    bindAmbientPointer();
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            document.documentElement.style.setProperty('--pointer-x', '50%');
            document.documentElement.style.setProperty('--pointer-y', '36%');
        }
    });

    // --- Website Version + Global Brand Shell ---
    const SITE_VERSION = 'v2.14.0';
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.documentElement.setAttribute('data-site-version', SITE_VERSION);
    const analyticsEndpoint = '/api/analytics/event';

    const CONSENT_STORAGE_KEY = 'od_analytics_consent';

    function getAnalyticsConsent() {
        try {
            const v = localStorage.getItem(CONSENT_STORAGE_KEY);
            if (v === 'granted') return true;
            if (v === 'denied') return false;
            return null;
        } catch {
            return null;
        }
    }

    function setAnalyticsConsent(granted) {
        try {
            localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'granted' : 'denied');
        } catch {
            // ignore quota / private mode
        }
    }

    function sendAnalyticsEvent(eventType, extra) {
        if (getAnalyticsConsent() !== true) return;
        const payload = {
            eventType,
            page: currentPage,
            referrer: document.referrer || '',
            ...extra
        };
        const body = JSON.stringify(payload);
        if (navigator.sendBeacon) {
            const blob = new Blob([body], { type: 'application/json' });
            navigator.sendBeacon(analyticsEndpoint, blob);
            return;
        }
        fetch(analyticsEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body
        }).catch(() => {});
    }

    function getPrimaryLogoMarkup() {
        return '<span class="logo-text">OBSIDIAN <span class="logo-accent">DYNAMICS</span></span>';
    }

    function getStandardNavMarkup(activePage) {
        const items = [
            { href: '/products.html', label: 'Products' },
            { href: '/pricing.html', label: 'Pricing' },
            { href: '/writing.html', label: 'Writing' },
            { href: '/trust-center.html', label: 'Trust' },
            { href: '/contact.html', label: 'Contact' }
        ];
        const path = (typeof window !== 'undefined' && window.location && window.location.pathname) || '';
        const inWritingDir = /^\/writing\//.test(path);
        const productPages = new Set([
            'products.html',
            'acheronvault.html',
            'blackglass.html',
            'charongate.html'
        ]);
        const trustPages = new Set([
            'trust-center.html',
            'security.html',
            'privacy.html',
            'terms.html'
        ]);
        return items.map((item) => {
            const bare = item.href.replace(/^\//, '');
            const isActive = bare === activePage
                || (item.href === '/writing.html' && inWritingDir)
                || (item.href === '/products.html' && productPages.has(activePage))
                || (item.href === '/trust-center.html' && trustPages.has(activePage));
            return '<a href="' + item.href + '" class="nav-link' + (isActive ? ' active' : '') + '">' + item.label + '</a>';
        }).join('');
    }

    function injectCookieConsentBar() {
        if (document.getElementById('cookieConsentBar')) return;
        if (getAnalyticsConsent() !== null) return;
        const skipPages = new Set([
            'developer-central.html',
            'developer-login.html',
            'access-denied.html',
            'onboarding.html',
            'onboarding-charongate.html',
            'onboarding-blackglass.html',
            'account-operations.html',
            '404.html'
        ]);
        if (skipPages.has(currentPage)) return;

        const bar = document.createElement('div');
        bar.id = 'cookieConsentBar';
        bar.className = 'cookie-consent-bar';
        bar.setAttribute('role', 'dialog');
        bar.setAttribute('aria-live', 'polite');
        bar.setAttribute('aria-label', 'Cookies and analytics');
        bar.innerHTML =
            '<div class="cookie-consent-bar__inner">' +
            '  <p class="cookie-consent-bar__text">We use essential cookies to run this site. Optional analytics help us improve pages. See our <a href="privacy.html#cookies">Privacy Policy</a>.</p>' +
            '  <div class="cookie-consent-bar__actions">' +
            '    <button type="button" class="btn btn-ghost" data-cookie-choice="essential">Essential only</button>' +
            '    <button type="button" class="btn btn-primary" data-cookie-choice="analytics">Accept analytics</button>' +
            '  </div>' +
            '</div>';

        bar.addEventListener('click', (ev) => {
            const btn = ev.target.closest('[data-cookie-choice]');
            if (!btn) return;
            const choice = btn.getAttribute('data-cookie-choice');
            if (choice === 'analytics') {
                setAnalyticsConsent(true);
                sendAnalyticsEvent('page_view', {});
            } else {
                setAnalyticsConsent(false);
            }
            bar.remove();
            document.body.classList.remove('has-cookie-consent');
        });

        document.body.appendChild(bar);
        document.body.classList.add('has-cookie-consent');
    }

    function applyGlobalBrandShell() {
        // Normalize all logo marks to new brand asset.
        document.querySelectorAll('.nav-logo').forEach((logo) => {
            logo.innerHTML = getPrimaryLogoMarkup();
        });

        // Normalize top navigation links site-wide.
        const navLinks = document.getElementById('navLinks');
        if (navLinks) {
            navLinks.innerHTML = getStandardNavMarkup(currentPage);
        }

        // Normalize footer, and include version for review tracking.
        const footer = document.querySelector('.footer');
        const footerMarkup =
            '<div class="footer-grid">' +
            '  <div class="footer-brand">' +
            '    <a href="/index.html" class="nav-logo" aria-label="Obsidian Dynamics home">' + getPrimaryLogoMarkup() + '</a>' +
            '    <p class="footer-tagline">Acheron Vault · Blackglass · Charon Gate · fewer moving parts.</p>' +
            '    <p class="footer-company-info">Obsidian Dynamics Limited · Company No. 16663833<br><span class="footer-address">Lytchett House<br>13 Freeland Park, Wareham Road<br>Poole · Dorset · BH16 6FA · United Kingdom</span></p>' +
            '  </div>' +
            '  <div class="footer-links"><h4>Work</h4><ul><li><a href="/acheronvault.html">Acheron Vault</a></li><li><a href="/blackglass.html">Blackglass</a></li><li><a href="/charongate.html">Charon Gate</a></li><li><a href="/products.html">Compare</a></li><li><a href="/pricing.html">Pricing</a></li><li><a href="/tools.html">Tools</a></li></ul></div>' +
            '  <div class="footer-links"><h4>Live</h4><ul><li><a href="https://blackglasssec.com" target="_blank" rel="noopener noreferrer">blackglasssec.com</a></li><li><a href="https://charongate.com" target="_blank" rel="noopener noreferrer">charongate.com</a></li><li><a href="/trust-center.html">Trust</a></li></ul></div>' +
            '  <div class="footer-links"><h4>Company</h4><ul><li><a href="/writing.html">Writing</a></li><li><a href="/about.html">About</a></li><li><a href="/contact.html">Contact</a></li><li><a href="/privacy.html">Privacy</a></li><li><a href="/security.html">Security</a></li><li><a href="/terms.html">Terms</a></li></ul></div>' +
            '</div>' +
            '<div class="footer-bottom">' +
            '  <p>&copy; 2026 Obsidian Dynamics Limited</p>' +
            '  <div class="footer-legal"><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms of Service</a></div>' +
            '</div>';

        if (!footer) {
            const generatedFooter = document.createElement('footer');
            generatedFooter.className = 'footer';
            generatedFooter.setAttribute('role', 'contentinfo');
            generatedFooter.innerHTML = '<div class="container">' + footerMarkup + '</div>';
            document.body.appendChild(generatedFooter);
            return;
        }
        const footerContainer = footer.querySelector('.container');
        if (!footerContainer) return;
        footerContainer.innerHTML = footerMarkup;
    }

    function normalizeCtaLanguage() {
        const ctaMap = [
            { from: /book demo|request demo|schedule demo/gi, to: 'Discuss Scope' },
            { from: /book a pilot scoping call|request .*pilot/gi, to: 'Discuss Operational Scope' },
            { from: /^view pricing$/gi, to: 'View Access by Tier' },
            { from: /^view platform and pricing$/gi, to: 'View Platform Access' },
            { from: /start trial|get started/gi, to: 'Discuss Scope' },
            { from: /^request onboarding support$/gi, to: 'Discuss Onboarding Scope' },
            { from: /^request credentials$/gi, to: 'Open Credentials Request' }
        ];
        document.querySelectorAll('a.btn, button.btn, a.nav-cta').forEach((el) => {
            const label = (el.textContent || '').trim();
            if (!label) return;
            for (const item of ctaMap) {
                if (item.from.test(label)) {
                    el.textContent = item.to;
                    break;
                }
            }
        });
    }

    function injectOperationalTrustStrip() {
        const main = document.querySelector('main');
        if (!main || document.getElementById('operationalTrustStrip')) return;
        const strip = document.createElement('section');
        strip.id = 'operationalTrustStrip';
        strip.className = 'operational-trust-strip';
        strip.setAttribute('aria-label', 'Operational trust and freshness');
        strip.innerHTML =
            '<div class="container">' +
            '  <div class="operational-trust-grid">' +
            '    <article class="operational-trust-card"><h3>Tenant isolation</h3><p>Every query is scoped. Exports and replays stay inside the workspace boundary.</p></article>' +
            '    <article class="operational-trust-card"><h3>Honest semantics</h3><p>At-least-once delivery, advisory findings, plain language on what ships.</p></article>' +
            '    <article class="operational-trust-card"><h3>Evidence trail</h3><p>Timestamps, signed deliveries, and exports your auditor can act on.</p></article>' +
            '  </div>' +
            '  <div class="operational-trust-links">' +
            '    <a href="blackglass.html">Blackglass</a><a href="https://blackglasssec.com" target="_blank" rel="noopener noreferrer">blackglasssec.com</a><a href="charongate.html">Charon Gate</a><a href="trust-center.html">Trust Center</a><a href="security.html">Security</a>' +
            '  </div>' +
            '</div>';
        main.appendChild(strip);
    }

    function markMediaForPerformance() {
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
            img.decoding = 'async';
            img.fetchPriority = 'low';
        });
    }

    function ensureSeoMetaDefaults() {
        const privateSeoBlock = new Set([
            'developer-central.html',
            'developer-login.html',
            'access-denied.html',
            'onboarding.html',
            'onboarding-charongate.html',
            'onboarding-blackglass.html',
            'account-operations.html',
            '404.html'
        ]);
        if (privateSeoBlock.has(currentPage)) {
            return;
        }
        const siteOrigin = 'https://obsidiandynamics.co.uk';
        const path = window.location.pathname || '/';
        const absoluteUrl = siteOrigin + path;
        const title = (document.title || 'Obsidian Dynamics').trim();
        const descTag = document.querySelector('meta[name="description"]');
        const description = ((descTag && descTag.getAttribute('content')) || '').trim()
            || 'Blackglass: operational integrity for Linux hosts — fleet baselines, finding triage, evidence exports. Charon Gate: webhook reliability with DLQ and replay.';
        const defaultOgImage = siteOrigin + '/img/og-image.jpg';

        function upsertMeta(attrName, attrValue, content) {
            let tag = document.head.querySelector('meta[' + attrName + '="' + attrValue + '"]');
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute(attrName, attrValue);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        }

        let canonical = document.head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        if (!canonical.getAttribute('href')) {
            canonical.setAttribute('href', absoluteUrl);
        }

        const rawCanon = canonical.getAttribute('href') || '';
        if (rawCanon.startsWith(siteOrigin)) {
            let p = rawCanon.slice(siteOrigin.length) || '/';
            if (p.endsWith('.html')) {
                p = p.slice(0, -5);
                if (p === '' || p === '/index') p = '/';
            }
            if (!p.startsWith('/')) p = '/' + p;
            canonical.setAttribute('href', siteOrigin + (p === '/' ? '/' : p));
        }

        upsertMeta('property', 'og:type', 'website');
        upsertMeta('property', 'og:title', title);
        upsertMeta('property', 'og:description', description);
        upsertMeta('property', 'og:url', canonical.getAttribute('href') || absoluteUrl);
        upsertMeta('property', 'og:site_name', 'Obsidian Dynamics');
        upsertMeta('property', 'og:locale', 'en_GB');
        upsertMeta('property', 'og:image', defaultOgImage);
        upsertMeta('property', 'og:image:width', '1200');
        upsertMeta('property', 'og:image:height', '630');
        upsertMeta('property', 'og:image:type', 'image/jpeg');
        upsertMeta('property', 'og:image:alt', 'Obsidian Dynamics — Blackglass and Charon Gate');

        upsertMeta('name', 'twitter:card', 'summary_large_image');
        upsertMeta('name', 'twitter:title', title);
        upsertMeta('name', 'twitter:description', description);
        upsertMeta('name', 'twitter:image', defaultOgImage);
        upsertMeta('name', 'twitter:image:alt', 'Obsidian Dynamics — Blackglass and Charon Gate');

        upsertMeta('name', 'theme-color', '#f8f6f3');
    }

    function enablePremiumEntrance() {
        document.body.classList.add('page-ready');
    }

    function applyUnifiedPageShell() {
        document.body.classList.add('unified-page-shell');
        const main = document.querySelector('main');
        if (!main) return;
        Array.from(main.children).forEach((section) => {
            if (section.tagName === 'SECTION') {
                section.classList.add('section-frame');
            }
        });
    }

    function simplifyInformationDensity() {
        document.body.classList.add('ui-simple-mode');

        const denseGridSelectors = [
            '.features-grid',
            '.services-grid',
            '.capabilities-grid',
            '.proof-chip-grid',
            '.mini-case-grid',
            '.role-cta-grid',
            '.trust-grid',
            '.methodology-grid',
            '.analyst-steps',
            '.access-tier-grid',
            '.download-option-grid'
        ];

        const cardSelectors = [
            '.feature-card',
            '.service-card',
            '.capability-card',
            '.trust-card',
            '.case-card',
            '.role-cta-card',
            '.access-tier-card',
            '.download-option',
            '.proof-chip',
            '.mini-case-card',
            '.methodology-item',
            '.analyst-step'
        ].join(',');

        denseGridSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((grid) => {
                const cards = Array.from(grid.querySelectorAll(':scope > ' + cardSelectors));
                if (cards.length <= 3) return;

                grid.classList.add('is-simplified-grid');
                cards.forEach((card, index) => {
                    if (index < 3) return;
                    card.classList.add('is-collapsed-card');
                    card.hidden = true;
                });

                if (grid.nextElementSibling && grid.nextElementSibling.classList.contains('simple-expand-btn')) return;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'simple-expand-btn';
                btn.textContent = 'Show more';
                btn.setAttribute('aria-expanded', 'false');
                btn.addEventListener('click', () => {
                    const expanded = btn.getAttribute('aria-expanded') === 'true';
                    cards.forEach((card, index) => {
                        if (index < 3) return;
                        card.hidden = expanded;
                    });
                    btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                    btn.textContent = expanded ? 'Show more' : 'Show less';
                });
                grid.insertAdjacentElement('afterend', btn);
            });
        });

        document.querySelectorAll('.hero-actions, .page-hero__actions, .cta-actions').forEach((group) => {
            const buttons = Array.from(group.querySelectorAll('.btn'));
            if (buttons.length <= 1) return;
            buttons.forEach((btn, index) => {
                if (index === 0) return;
                btn.classList.add('btn-is-secondary-simple');
            });
        });
    }

    applyGlobalBrandShell();
    normalizeCtaLanguage();
    markMediaForPerformance();
    ensureSeoMetaDefaults();
    applyUnifiedPageShell();
    simplifyInformationDensity();
    enablePremiumEntrance();
    injectCookieConsentBar();
    if (getAnalyticsConsent() === true) {
        sendAnalyticsEvent('page_view', {});
    }

    // --- Developer Portal Access Guard ---
    const protectedPages = new Set([
        'developer-central.html',
        'onboarding.html',
        'onboarding-charongate.html',
        'onboarding-blackglass.html',
        'account-operations.html'
    ]);
    const privateFacingPages = new Set([
        ...protectedPages,
        'developer-login.html',
        'access-denied.html',
        '404.html'
    ]);

    function renderDeveloperSessionControls(email) {
        const navLinks = document.getElementById('navLinks');
        if (!navLinks) return;

        const existingChip = navLinks.querySelector('.nav-auth-chip');
        if (!existingChip) {
            const chip = document.createElement('span');
            chip.className = 'nav-auth-chip';
            chip.textContent = 'Signed in: ' + email;
            navLinks.appendChild(chip);
        }

        const existingBtn = navLinks.querySelector('.nav-logout-btn');
        if (!existingBtn) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'nav-cta nav-logout-btn';
            btn.textContent = 'Logout';
            btn.addEventListener('click', async () => {
                try {
                    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                } catch (error) {
                    // continue to force navigation even if request errors
                }
                window.location.href = 'developer-login.html';
            });
            navLinks.appendChild(btn);
        }
    }

    function enforceDeveloperPortalAccess() {
        if (!protectedPages.has(currentPage)) return;

        fetch('/api/auth/session', { credentials: 'include' })
            .then((res) => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then((data) => {
                if (!data || !data.authenticated) {
                    window.location.href = 'developer-login.html?next=' + encodeURIComponent(currentPage);
                    return;
                }
                renderDeveloperSessionControls(data.email || 'developer');
            })
            .catch(() => {
                window.location.href = 'developer-login.html?next=' + encodeURIComponent(currentPage);
            });
    }
    enforceDeveloperPortalAccess();

    function applyPrivatePageNoIndex() {
        if (!privateFacingPages.has(currentPage)) return;
        let tag = document.querySelector('meta[name="robots"]');
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('name', 'robots');
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', 'noindex, nofollow, noarchive');
    }
    applyPrivatePageNoIndex();

    // --- Particle Canvas ---
    const canvas = document.getElementById('particleCanvas');
    const prefersReducedMotion = prefersReducedMotionMq.matches;
    const enableParticles = canvas && !prefersReducedMotion && window.innerWidth >= 768;
    if (enableParticles) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -1000;
        let mouseY = -1000;
        let particleRafId = 0;
        let tabHidden = document.visibilityState === 'hidden';

        function particleTargetCount() {
            const w = window.innerWidth;
            if (w < 520) return 38;
            if (w < 900) return 52;
            if (w < 1400) return 72;
            return 88;
        }

        let CONNECTION_DIST = 148;
        const MOUSE_DIST = 210;

        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            CONNECTION_DIST = window.innerWidth < 640 ? 110 : 148;
            rebalanceParticles();
        }

        function rebalanceParticles() {
            const target = particleTargetCount();
            const w = window.innerWidth;
            const h = window.innerHeight;
            while (particles.length < target) {
                particles.push(createParticle(w, h));
            }
            while (particles.length > target) {
                particles.pop();
            }
            particles.forEach((p) => {
                if (p.x > w) p.x = w;
                if (p.y > h) p.y = h;
            });
        }

        function createParticle(w, h) {
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.42,
                vy: (Math.random() - 0.5) * 0.42,
                radius: Math.random() * 1.35 + 0.45,
                opacity: Math.random() * 0.28 + 0.08,
                hue: Math.random() < 0.22 ? 'g' : 'b'
            };
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function stepParticle(p, w, h) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_DIST && dist > 0.01) {
                const force = ((MOUSE_DIST - dist) / MOUSE_DIST) * 0.024;
                p.vx -= dx * force;
                p.vy -= dy * force;
            }
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const cap = 1.15;
            if (speed > cap) {
                p.vx = (p.vx / speed) * cap;
                p.vy = (p.vy / speed) * cap;
            }
        }

        function drawParticle(p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            if (p.hue === 'g') {
                ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity * 0.92})`;
            } else {
                ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
            }
            ctx.fill();
        }

        function animateParticles() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p) => {
                stepParticle(p, w, h);
                drawParticle(p);
            });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const a = 0.055 * (1 - dist / CONNECTION_DIST);
                        const g =
                            particles[i].hue === 'g' || particles[j].hue === 'g';
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = g
                            ? `rgba(45, 212, 115, ${a * 0.85})`
                            : `rgba(59, 130, 246, ${a})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            particleRafId = requestAnimationFrame(animateParticles);
        }

        rebalanceParticles();
        particleRafId = requestAnimationFrame(animateParticles);

        document.addEventListener('visibilitychange', () => {
            tabHidden = document.visibilityState === 'hidden';
            if (tabHidden) {
                if (particleRafId) {
                    cancelAnimationFrame(particleRafId);
                    particleRafId = 0;
                }
                return;
            }
            if (!particleRafId) {
                particleRafId = requestAnimationFrame(animateParticles);
            }
        });

        function stopParticleLoop() {
            if (particleRafId) {
                cancelAnimationFrame(particleRafId);
                particleRafId = 0;
            }
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
        prefersReducedMotionMq.addEventListener('change', () => {
            if (prefersReducedMotionMq.matches) stopParticleLoop();
        });
    } else if (canvas) {
        canvas.style.display = 'none';
    }

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = scrollY;
        }, { passive: true });
    }

    // --- Mobile Nav Toggle + backdrop ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const mqDrawer = window.matchMedia('(max-width: 768px)');
    let navBackdropEl = null;

    function ensureNavBackdrop() {
        if (navBackdropEl) return navBackdropEl;
        navBackdropEl = document.createElement('div');
        navBackdropEl.className = 'nav-drawer-backdrop';
        navBackdropEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(navBackdropEl);
        navBackdropEl.addEventListener('click', () => {
            closeMobileNav();
        });
        return navBackdropEl;
    }

    function syncNavBackdrop() {
        const open = mqDrawer.matches && navLinks && navLinks.classList.contains('active');
        if (!mqDrawer.matches) {
            if (navBackdropEl) navBackdropEl.classList.remove('is-active');
            document.body.classList.remove('nav-drawer-open');
            return;
        }
        ensureNavBackdrop();
        navBackdropEl.classList.toggle('is-active', open);
        document.body.classList.toggle('nav-drawer-open', open);
    }

    function closeMobileNav() {
        if (!navToggle || !navLinks) return;
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        syncNavBackdrop();
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            syncNavBackdrop();
        });
        navLinks.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });
        mqDrawer.addEventListener('change', syncNavBackdrop);
        window.addEventListener('resize', syncNavBackdrop);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        closeMobileNav();
    });

    // --- Counter Animation ---
    function animateCounter(el, target) {
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const update = () => {
            current += step;
            if (current >= target) {
                el.textContent = target.toLocaleString();
                return;
            }
            el.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
        };
        update();
    }
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'), 10);
                    if (!isNaN(target)) animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => counterObserver.observe(c));
    }

    // --- Scroll Reveal (Intersection Observer) ---
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.11, rootMargin: '0px 0px -28px 0px' }
    );

    const fadeSelectors = [
        '.feature-card',
        '.service-card',
        '.metric-card',
        '.step-item',
        '.cta-card',
        '.company-info-card',
        '.contact-info-card',
        '.contact-form-wrapper',
        '.capability-card',
        '.process-step',
        '.case-card',
        '.trust-card',
        '.section-header',
        '.operational-trust-card',
        '.proof-chip',
        '.role-cta-card'
    ];
    document.querySelectorAll(fadeSelectors.join(', ')).forEach((el) => {
        el.classList.add('fade-in');
        revealObserver.observe(el);
    });

    document
        .querySelectorAll('.hero-content > *:not(.hero-grid-overlay), .page-hero > *:not(.hero-grid-overlay)')
        .forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.setProperty('--reveal-delay', `${Math.min(i, 12) * 68}ms`);
            revealObserver.observe(el);
        });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Click analytics for CTA and trust links ---
    document.addEventListener('click', (event) => {
        const target = event.target.closest('a,button');
        if (!target) return;
        const isTracked = target.classList.contains('btn')
            || target.classList.contains('nav-cta')
            || target.closest('.operational-trust-links')
            || target.closest('[data-track-section]');
        if (!isTracked) return;
        sendAnalyticsEvent('cta_click', {
            target: (target.textContent || '').trim().slice(0, 120),
            href: target.getAttribute('href') || '',
            tier: target.dataset.tier || '',
            section: target.dataset.trackSection || (target.closest('[data-track-section]') && target.closest('[data-track-section]').getAttribute('data-track-section')) || ''
        });
    });

    // --- Developer portal tabbed management console ---
    document.querySelectorAll('[data-portal-tabs]').forEach((tabsRoot) => {
        const tabs = Array.from(tabsRoot.querySelectorAll('[data-tab-target]'));
        const panels = Array.from(tabsRoot.querySelectorAll('[data-tab-panel]'));
        if (!tabs.length || !panels.length) return;

        const activate = (targetKey) => {
            tabs.forEach((tab) => {
                const active = tab.getAttribute('data-tab-target') === targetKey;
                tab.classList.toggle('is-active', active);
                tab.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            panels.forEach((panel) => {
                const active = panel.getAttribute('data-tab-panel') === targetKey;
                panel.classList.toggle('is-active', active);
                panel.hidden = !active;
            });
        };

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => activate(tab.getAttribute('data-tab-target')));
        });
    });

    // --- Email Reveal Button ---
    const emailRevealBtn = document.getElementById('emailRevealBtn');
    if (emailRevealBtn) {
        emailRevealBtn.addEventListener('click', () => {
            const container = emailRevealBtn.parentElement;
            // Build email from parts to avoid scraping
            const user = 'jamie';
            const domain = 'obsidiandynamics';
            const tld = 'co.uk';
            const addr = user + '@' + domain + '.' + tld;
            const revealedEl = document.createElement('div');
            revealedEl.className = 'email-revealed';
            const mailLink = document.createElement('a');
            mailLink.href = 'mailto:' + addr;
            mailLink.textContent = addr;
            revealedEl.appendChild(mailLink);
            emailRevealBtn.replaceWith(revealedEl);
        });
    }

    // --- Contact Form Handler ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const params = new URLSearchParams(window.location.search);
        const roleParam = (params.get('role') || '').toLowerCase();
        const intentParam = (params.get('intent') || '').toLowerCase();
        const productParam = (params.get('product') || '').toLowerCase();
        const interestField = document.getElementById('interest');
        const messageField = document.getElementById('message');
        const roleToInterest = {
            operations: 'platform',
            risk: 'platform',
            insurance: 'platform',
            integration: 'platform'
        };
        if (interestField && roleToInterest[roleParam]) {
            interestField.value = roleToInterest[roleParam];
        }
        const productToInterest = {
            acheronvault: 'acheronvault',
            blackglass: 'blackglass',
            charongate: 'charongate'
        };
        if (interestField && productToInterest[productParam]) {
            interestField.value = productToInterest[productParam];
        }
        if (messageField && (roleParam || intentParam || productParam) && !messageField.value.trim()) {
            const roleLabel = roleParam ? roleParam.charAt(0).toUpperCase() + roleParam.slice(1) : '';
            const intentLabel = intentParam ? intentParam.replace(/-/g, ' ') : 'briefing';
            const productNames = {
                acheronvault: 'Acheron Vault',
                blackglass: 'Blackglass',
                charongate: 'Charon Gate'
            };
            const productLabel = productNames[productParam] || '';
            let opener = 'Hello Obsidian team, ';
            if (intentParam === 'beta' && productLabel) {
                opener += 'we would like to join the ' + productLabel + ' beta. ';
            } else if (intentParam && productLabel) {
                opener += 'we would like a ' + intentLabel + ' for ' + productLabel + '. ';
            } else if (productLabel) {
                opener += 'we are evaluating ' + productLabel + '. ';
            } else if (roleLabel) {
                opener += 'we would like a ' + roleLabel + ' ' + intentLabel + '. ';
            } else {
                opener += 'we would like to discuss scope. ';
            }
            messageField.value = opener;
        }

        const formStatus = document.getElementById('formStatus');
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const origText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
            }

            const honeypot = contactForm.querySelector('[name="company_website"]');
            const payload = {
                name: (document.getElementById('name') && document.getElementById('name').value) || '',
                email: (document.getElementById('email') && document.getElementById('email').value) || '',
                interest: (document.getElementById('interest') && document.getElementById('interest').value) || '',
                message: (document.getElementById('message') && document.getElementById('message').value) || '',
                company_website: honeypot ? honeypot.value : '',
                page: window.location.pathname + window.location.search,
                intent: intentParam || ''
            };

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error((data && data.error) || 'Unable to send message');
                }
                btn.textContent = 'Message sent';
                btn.style.background = 'var(--muted-green)';
                contactForm.reset();
                if (formStatus) {
                    formStatus.className = 'form-status form-status--success';
                    formStatus.textContent = 'Your message has been sent. We\'ll be in touch shortly.';
                }
                sendAnalyticsEvent('contact_submit', { interest: payload.interest, intent: payload.intent });
            } catch (err) {
                btn.textContent = origText;
                btn.disabled = false;
                if (formStatus) {
                    formStatus.className = 'form-status form-status--error';
                    formStatus.textContent = (err && err.message) || 'Unable to send. Email jamie@obsidiandynamics.co.uk directly.';
                }
                return;
            }

            setTimeout(() => {
                btn.textContent = origText;
                btn.style.background = '';
                btn.disabled = false;
                if (formStatus) {
                    formStatus.className = 'form-status';
                    formStatus.textContent = '';
                }
            }, 4000);
        });
    }

    // --- ROI Calculators (platform pages) ---
    const roiCalculators = document.querySelectorAll('[data-roi-calculator]');
    if (roiCalculators.length) {
        const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
        roiCalculators.forEach((calculator) => {
            const eventsInput = calculator.querySelector('[data-roi-events]');
            const costInput = calculator.querySelector('[data-roi-cost]');
            const reductionInput = calculator.querySelector('[data-roi-reduction]');
            const concentrationInput = calculator.querySelector('[data-roi-concentration]');
            const resultsEl = calculator.querySelector('[data-roi-results]');
            if (!eventsInput || !costInput || !reductionInput || !concentrationInput || !resultsEl) return;

            const recalc = () => {
                const events = Math.max(0, parseFloat(eventsInput.value) || 0);
                const cost = Math.max(0, parseFloat(costInput.value) || 0);
                const reductionPct = Math.min(100, Math.max(0, parseFloat(reductionInput.value) || 0));
                const concentrationPct = Math.min(100, Math.max(0, parseFloat(concentrationInput.value) || 0));
                const monthlyExposure = events * cost;
                const weightedExposure = monthlyExposure * (1 + (concentrationPct / 100));
                const monthlySavings = weightedExposure * (reductionPct / 100);
                const annualSavings = monthlySavings * 12;

                const exposureP = document.createElement('p');
                const weightedP = document.createElement('p');
                const monthlyP = document.createElement('p');
                const annualP = document.createElement('p');

                exposureP.textContent = 'Baseline monthly disruption exposure: ' + gbp.format(monthlyExposure);
                weightedP.textContent = 'Concentration-adjusted exposure: ' + gbp.format(weightedExposure);
                monthlyP.textContent = 'Estimated monthly savings from improved response: ' + gbp.format(monthlySavings);
                annualP.textContent = 'Estimated annualized savings: ' + gbp.format(annualSavings);

                resultsEl.replaceChildren(exposureP, weightedP, monthlyP, annualP);
            };

            [eventsInput, costInput, reductionInput, concentrationInput].forEach((el) => el.addEventListener('input', recalc));
            recalc();
        });
    }

    // --- aria-current="page" for active nav link ---
    const inWritingSection = /^\/writing\//.test(window.location.pathname || '');
    const productPages = new Set([
        'products.html',
        'acheronvault.html',
        'blackglass.html',
        'charongate.html'
    ]);
    const trustPages = new Set([
        'trust-center.html',
        'security.html',
        'privacy.html',
        'terms.html'
    ]);
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = (link.getAttribute('href') || '').replace(/^\//, '');
        const matchesPage = href === currentPage || (currentPage === '' && href === 'index.html');
        const matchesWritingSection = href === 'writing.html' && inWritingSection;
        const matchesProductSection = href === 'products.html' && productPages.has(currentPage);
        const matchesTrustSection = href === 'trust-center.html' && trustPages.has(currentPage);
        if (matchesPage || matchesWritingSection || matchesProductSection || matchesTrustSection) {
            link.setAttribute('aria-current', 'page');
        }
    });

    // --- Multi-option button consistency ---
    function applyMultiOptionButtonStyles() {
        const groupSelectors = [
            '.role-cta-grid',
            '.cta-actions',
            '.hero-actions',
            '.hero__actions',
            '.page-hero__actions'
        ];

        groupSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((group) => {
                const buttons = Array.from(group.querySelectorAll('.btn'));
                if (buttons.length < 3) return;

                group.classList.add('btn-group--multi');
                group.setAttribute('data-btn-count', String(buttons.length));

                buttons.forEach((btn, index) => {
                    btn.classList.add('btn-option');
                    btn.classList.remove('btn-option--1', 'btn-option--2', 'btn-option--3', 'btn-option--4');
                    btn.classList.add(`btn-option--${(index % 4) + 1}`);
                });
            });
        });
    }
    applyMultiOptionButtonStyles();
});
