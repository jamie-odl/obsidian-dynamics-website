/* ============================================================
   OBSIDIAN DYNAMICS — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Website Version + Global Brand Shell ---
    const SITE_VERSION = 'v2.4.3';
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.documentElement.setAttribute('data-site-version', SITE_VERSION);
    const analyticsEndpoint = '/api/analytics/event';

    function sendAnalyticsEvent(eventType, extra) {
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
            { href: 'platform.html', label: 'Platform' },
            { href: 'products.html', label: 'Products' },
            { href: 'api.html', label: 'API' },
            { href: 'use-cases.html', label: 'Use Cases' },
            { href: 'intelligence.html', label: 'Intelligence' },
            { href: 'about.html', label: 'Company' },
            { href: 'contact.html', label: 'Contact' }
        ];
        return items.map((item) => {
            const isActive = item.href === activePage || (activePage === 'index.html' && item.href === 'platform.html');
            return '<a href="' + item.href + '" class="nav-link' + (isActive ? ' active' : '') + '">' + item.label + '</a>';
        }).join('') + '<a href="contact.html" class="nav-cta">Contact Team</a>';
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
            '    <a href="index.html" class="nav-logo" aria-label="Obsidian Dynamics home">' + getPrimaryLogoMarkup() + '</a>' +
            '    <p class="footer-tagline">Operational risk intelligence across air, sea, and transition networks.</p>' +
            '    <p class="footer-company-info">Obsidian Dynamics Limited · Company No. 16663833</p>' +
            '  </div>' +
            '  <div class="footer-links"><h4>Platform</h4><ul><li><a href="platform.html">Platform</a></li><li><a href="products.html">Products</a></li><li><a href="api.html">API</a></li></ul></div>' +
            '  <div class="footer-links"><h4>Intelligence</h4><ul><li><a href="use-cases.html">Use Cases</a></li><li><a href="intelligence.html">Intelligence</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
            '  <div class="footer-links"><h4>Company</h4><ul><li><a href="about.html">Company</a></li><li><a href="trust-center.html">Trust Center</a></li><li><a href="status.html">Status</a></li><li><a href="security.html">Security</a></li><li><a href="privacy.html">Privacy</a></li><li><a href="terms.html">Terms</a></li></ul></div>' +
            '</div>' +
            '<div class="footer-bottom">' +
            '  <p>&copy; 2026 Obsidian Dynamics Limited. Review Build <span class="site-version-inline">' + SITE_VERSION + '</span></p>' +
            '  <div class="footer-legal"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Service</a></div>' +
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

    function addVersionBadge() {
        const existing = document.getElementById('siteVersionBadge');
        if (existing) return;
        const badge = document.createElement('div');
        badge.id = 'siteVersionBadge';
        badge.className = 'site-version-badge';
        badge.textContent = 'Review Build ' + SITE_VERSION;
        badge.setAttribute('aria-label', 'Review build version ' + SITE_VERSION);
        document.body.appendChild(badge);
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
            '    <article class="operational-trust-card"><h3>Data Freshness</h3><p>Signals refresh on governed cadences. Timestamp every panel and export.</p></article>' +
            '    <article class="operational-trust-card"><h3>Source Provenance</h3><p>Every score links to input source class, confidence, and replay context.</p></article>' +
            '    <article class="operational-trust-card"><h3>Platform Reliability</h3><p>Track live uptime and incident communications from the status surface.</p></article>' +
            '  </div>' +
            '  <div class="operational-trust-links">' +
            '    <a href="status.html">Open Status</a><a href="trust-center.html">Trust Center</a><a href="methodology.html">Methodology</a>' +
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
        const siteOrigin = 'https://obsidiandynamics.co.uk';
        const path = window.location.pathname || '/';
        const absoluteUrl = siteOrigin + path;
        const title = (document.title || 'Obsidian Dynamics').trim();
        const descTag = document.querySelector('meta[name="description"]');
        const description = ((descTag && descTag.getAttribute('content')) || '').trim()
            || 'Operational risk intelligence across air, sea, and transition networks.';
        const defaultOgImage = siteOrigin + '/img/logo.svg';

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

        upsertMeta('property', 'og:type', 'website');
        upsertMeta('property', 'og:title', title);
        upsertMeta('property', 'og:description', description);
        upsertMeta('property', 'og:url', canonical.getAttribute('href') || absoluteUrl);
        upsertMeta('property', 'og:site_name', 'Obsidian Dynamics');
        upsertMeta('property', 'og:locale', 'en_GB');
        upsertMeta('property', 'og:image', defaultOgImage);

        upsertMeta('name', 'twitter:card', 'summary_large_image');
        upsertMeta('name', 'twitter:title', title);
        upsertMeta('name', 'twitter:description', description);
        upsertMeta('name', 'twitter:image', defaultOgImage);
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
    addVersionBadge();
    normalizeCtaLanguage();
    injectOperationalTrustStrip();
    markMediaForPerformance();
    ensureSeoMetaDefaults();
    applyUnifiedPageShell();
    simplifyInformationDensity();
    enablePremiumEntrance();
    sendAnalyticsEvent('page_view', {});

    // --- Developer Portal Access Guard ---
    const protectedPages = new Set([
        'developer-central.html',
        'onboarding.html',
        'onboarding-skygrid.html',
        'onboarding-strait-signal.html',
        'onboarding-relaypoint.html',
        'onboarding-atlas.html',
        'account-operations.html'
    ]);
    const privateFacingPages = new Set([
        ...protectedPages,
        'developer-login.html',
        'access-denied.html'
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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -1000;
        let mouseY = -1000;
        const PARTICLE_COUNT = 60;
        const CONNECTION_DIST = 150;
        const MOUSE_DIST = 200;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_DIST) {
                    const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.02;
                    this.vx -= dx * force;
                    this.vy -= dy * force;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / CONNECTION_DIST)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
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

    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
        });
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

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
    const fadeEls = document.querySelectorAll(
        '.feature-card, .service-card, .metric-card, .step-item, .cta-card, .company-info-card, .contact-info-card, .contact-form-wrapper, .capability-card, .process-step, .case-card, .trust-card'
    );
    if (fadeEls.length) {
        fadeEls.forEach(el => el.classList.add('fade-in'));
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        fadeEls.forEach(el => revealObserver.observe(el));
    }

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
            || target.closest('.operational-trust-links');
        if (!isTracked) return;
        sendAnalyticsEvent('cta_click', {
            target: (target.textContent || '').trim().slice(0, 120),
            href: target.getAttribute('href') || '',
            tier: target.dataset.tier || ''
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
        if (messageField && (roleParam || intentParam) && !messageField.value.trim()) {
            const roleLabel = roleParam ? roleParam.charAt(0).toUpperCase() + roleParam.slice(1) : 'General';
            const intentLabel = intentParam ? intentParam.replace(/-/g, ' ') : 'briefing request';
            messageField.value = 'Hello Obsidian team, we would like a ' + roleLabel + ' briefing regarding ' + intentLabel + '.';
        }

        const formStatus = document.getElementById('formStatus');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const origText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
            }
            // Simulate send (replace with actual endpoint)
            setTimeout(() => {
                btn.textContent = 'Message Sent ✓';
                btn.style.background = 'var(--gradient-strait)';
                contactForm.reset();
                if (formStatus) {
                    formStatus.className = 'form-status form-status--success';
                    formStatus.textContent = 'Your message has been sent. We\'ll be in touch shortly.';
                }
                setTimeout(() => {
                    btn.textContent = origText;
                    btn.style.background = '';
                    btn.disabled = false;
                    if (formStatus) {
                        formStatus.className = 'form-status';
                        formStatus.textContent = '';
                    }
                }, 3000);
            }, 1500);
        });
    }

    // --- ROI Calculators (Atlas / Platform) ---
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
                monthlyP.textContent = 'Estimated monthly savings from Atlas: ' + gbp.format(monthlySavings);
                annualP.textContent = 'Estimated annualized savings: ' + gbp.format(annualSavings);

                resultsEl.replaceChildren(exposureP, weightedP, monthlyP, annualP);
            };

            [eventsInput, costInput, reductionInput, concentrationInput].forEach((el) => el.addEventListener('input', recalc));
            recalc();
        });
    }

    // --- aria-current="page" for active nav link ---
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
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
