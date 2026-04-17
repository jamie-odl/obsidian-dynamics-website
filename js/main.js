/* ============================================================
   OBSIDIAN DYNAMICS — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Particle Canvas ---
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
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

    // --- Email Reveal Button ---
    const emailRevealBtn = document.getElementById('emailRevealBtn');
    if (emailRevealBtn) {
        emailRevealBtn.addEventListener('click', () => {
            const container = emailRevealBtn.parentElement;
            // Build email from parts to avoid scraping
            const user = 'jamie';
            const domain = 'projectskygrid';
            const tld = 'com';
            const addr = user + '@' + domain + '.' + tld;
            const revealedEl = document.createElement('div');
            revealedEl.className = 'email-revealed';
            revealedEl.innerHTML = '<a href="mailto:' + addr + '">' + addr + '</a>';
            emailRevealBtn.replaceWith(revealedEl);
        });
    }

    // --- Contact Form Handler ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
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

    // --- aria-current="page" for active nav link ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.setAttribute('aria-current', 'page');
        }
    });
});
