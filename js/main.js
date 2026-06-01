'use strict';

/* ─── Project data ──────────────────────────────────────────────────────────── */
const PROJECTS = {
    ecommerce: {
        kicker: 'Web Application',
        title:  'E-Commerce Platform',
        desc:   'A full-stack e-commerce solution with product management, shopping cart, Stripe payment processing, and an admin dashboard. Built with React and Node.js/Express backed by MongoDB.',
        tags:   ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
        demo:   'https://github.com/ethanhakaj3515',
        code:   'https://github.com/ethanhakaj3515',
    },
    fitness: {
        kicker: 'Mobile App',
        title:  'Fitness Tracker App',
        desc:   'Cross-platform mobile app for tracking workouts, calories, and fitness goals. Real-time progress charts, custom workout plans, and cloud sync via Firebase.',
        tags:   ['React Native', 'Firebase', 'Expo', 'Redux'],
        demo:   'https://github.com/ethanhakaj3515',
        code:   'https://github.com/ethanhakaj3515',
    },
    tasks: {
        kicker: 'Web Application',
        title:  'Task Management Dashboard',
        desc:   'Productivity-focused task dashboard with drag-and-drop boards, real-time collaboration, reporting analytics, and integrations with Slack and Google Calendar.',
        tags:   ['Vue.js', 'Express', 'PostgreSQL', 'Socket.io'],
        demo:   'https://github.com/ethanhakaj3515',
        code:   'https://github.com/ethanhakaj3515',
    },
    brand: {
        kicker: 'Design',
        title:  'Brand Identity System',
        desc:   'Complete brand identity for a tech startup: logo, typography, color palette, brand guidelines, and full marketing collateral suite, designed and delivered in Figma.',
        tags:   ['Figma', 'Illustrator', 'Photoshop', 'Design System'],
        demo:   null,
        code:   null,
    },
    chat: {
        kicker: 'Web Application',
        title:  'Real-time Chat App',
        desc:   'WebSocket-powered messaging app with private and group chats, file sharing, read receipts, and emoji reactions. Scales horizontally with Redis pub/sub.',
        tags:   ['Socket.io', 'React', 'Redis', 'Node.js', 'PostgreSQL'],
        demo:   'https://github.com/ethanhakaj3515',
        code:   'https://github.com/ethanhakaj3515',
    },
    recipe: {
        kicker: 'Mobile App',
        title:  'Recipe Finder App',
        desc:   'AI-powered recipe suggestions based on available ingredients. Personalised meal plans, nutritional info, and grocery delivery integration via a Python/FastAPI backend.',
        tags:   ['Flutter', 'Python', 'TensorFlow', 'Firebase', 'FastAPI'],
        demo:   'https://github.com/ethanhakaj3515',
        code:   'https://github.com/ethanhakaj3515',
    },
};

/* ─── Typewriter ────────────────────────────────────────────────────────────── */
class TypeWriter {
    constructor(el, roles, { typeSpeed = 100, deleteSpeed = 55, pause = 2200 } = {}) {
        this.el          = el;
        this.roles       = roles;
        this.typeSpeed   = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.pause       = pause;
        this.index       = 0;
        this.charIndex   = 0;
        this.deleting    = false;
        if (el) this._tick();
    }

    _tick() {
        const role = this.roles[this.index];
        if (!this.deleting && this.charIndex < role.length) {
            this.el.textContent = role.slice(0, ++this.charIndex);
            setTimeout(() => this._tick(), this.typeSpeed);
        } else if (!this.deleting) {
            this.deleting = true;
            setTimeout(() => this._tick(), this.pause);
        } else if (this.charIndex > 0) {
            this.el.textContent = role.slice(0, --this.charIndex);
            setTimeout(() => this._tick(), this.deleteSpeed);
        } else {
            this.deleting = false;
            this.index = (this.index + 1) % this.roles.length;
            setTimeout(() => this._tick(), 420);
        }
    }
}

/* ─── Navbar ────────────────────────────────────────────────────────────────── */
class NavBar {
    constructor() {
        this.header   = document.getElementById('header');
        this.navbar   = document.getElementById('navbar');
        this.menuBtn  = document.getElementById('menu-btn');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id], .banner[id]');

        this._bindMenu();
        this._bindScroll();
        this._bindLinks();
    }

    _bindMenu() {
        this.menuBtn.addEventListener('click', () => {
            const open = this.navbar.classList.toggle('open');
            this.menuBtn.setAttribute('aria-expanded', open);
            this.menuBtn.querySelector('i').className = open ? 'bx bx-x' : 'bx bx-menu';
        });

        document.addEventListener('click', e => {
            if (
                this.navbar.classList.contains('open') &&
                !this.navbar.contains(e.target) &&
                !this.menuBtn.contains(e.target)
            ) this._closeMenu();
        });
    }

    _bindLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this._closeMenu());
        });
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', () => this._closeMenu());
        });
    }

    _closeMenu() {
        this.navbar.classList.remove('open');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        this.menuBtn.querySelector('i').className = 'bx bx-menu';
    }

    _bindScroll() {
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        window.addEventListener('scroll', () => {
            /* active link by scroll position */
            let current = '';
            this.sections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - navH - 60) current = sec.id;
            });
            this.navLinks.forEach(l => {
                l.classList.toggle('active', l.getAttribute('href') === '#' + current);
            });
        }, { passive: true });
    }
}

/* ─── Skill Bars (IntersectionObserver) ─────────────────────────────────────── */
class SkillBars {
    constructor() {
        this.fills   = document.querySelectorAll('.fill[data-pct]');
        this.section = document.getElementById('skills');
        this.done    = false;
        if (!this.section) return;

        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !this.done) {
                this.done = true;
                this.fills.forEach(el => {
                    el.style.width = Math.min(100, parseInt(el.dataset.pct, 10) || 0) + '%';
                });
                obs.disconnect();
            }
        }, { threshold: 0.2 });
        obs.observe(this.section);
    }
}

/* ─── Scroll-reveal (IntersectionObserver) ──────────────────────────────────── */
class ScrollReveal {
    constructor() {
        const targets = document.querySelectorAll(
            '.skill-group, .proj-card, .contact-info, .c-form'
            /* .sec-head excluded — GSAP word reveal handles those headings */
        );
        targets.forEach(el => el.classList.add('reveal'));

        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(el => obs.observe(el));
    }
}

/* ─── Portfolio Modal ───────────────────────────────────────────────────────── */
class PortfolioModal {
    constructor() {
        this.modal    = document.getElementById('modal');
        this.closeBtn = document.getElementById('modal-close');
        this.kicker   = document.getElementById('modal-kicker');
        this.title    = document.getElementById('modal-title');
        this.desc     = document.getElementById('modal-desc');
        this.tagsEl   = document.getElementById('modal-tags');
        this.demoBtn  = document.getElementById('modal-demo');
        this.codeBtn  = document.getElementById('modal-code');
        this._bind();
    }

    _bind() {
        document.addEventListener('click', e => {
            const btn = e.target.closest('[data-pact]');
            if (!btn) return;
            e.preventDefault();
            const card = btn.closest('[data-pid]');
            if (!card) return;
            this._handleAction(card.dataset.pid, btn.dataset.pact);
        });

        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', e => { if (e.target === this.modal) this.close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
    }

    _handleAction(pid, action) {
        const p = PROJECTS[pid];
        if (!p) return;
        if (action === 'demo' && p.demo) { window.open(p.demo, '_blank', 'noopener,noreferrer'); return; }
        if (action === 'code' && p.code) { window.open(p.code, '_blank', 'noopener,noreferrer'); return; }
        this.open(p);
    }

    open(p) {
        this.kicker.textContent = p.kicker;
        this.title.textContent  = p.title;
        this.desc.textContent   = p.desc;
        this.tagsEl.innerHTML   = p.tags.map(t => `<span>${t}</span>`).join('');
        this._wireBtn(this.demoBtn, p.demo);
        this._wireBtn(this.codeBtn, p.code);
        this.modal.classList.add('open');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        this.closeBtn.focus();
    }

    _wireBtn(btn, url) {
        btn.style.display = url ? '' : 'none';
        btn.onclick = url ? () => window.open(url, '_blank', 'noopener,noreferrer') : null;
    }

    close() {
        this.modal.classList.remove('open');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

/* ─── Contact Form ──────────────────────────────────────────────────────────── */
class ContactForm {
    constructor() {
        this.form    = document.getElementById('contact-form');
        this.banner  = document.getElementById('form-ok');
        if (!this.form) return;
        this.sendBtn = this.form.querySelector('.btn-send');
        this.label   = this.sendBtn.querySelector('span');
        this.banner.style.cssText = 'height:0;padding:0;margin:0;overflow:hidden;opacity:0';
        this._bind();
    }

    _bind() {
        this.form.addEventListener('submit', async e => {
            e.preventDefault();
            if (!this.form.checkValidity()) { this.form.reportValidity(); return; }
            this._setLoading(true);

            const payload = {
                firstName: document.getElementById('f-fname').value.trim(),
                lastName:  document.getElementById('f-lname').value.trim(),
                email:     document.getElementById('f-email').value.trim(),
                phone:     document.getElementById('f-phone').value.trim(),
                message:   document.getElementById('f-msg').value.trim(),
            };

            try {
                const res = await fetch('https://formsubmit.co/ajax/ethanhakaj@gmail.com', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body:    JSON.stringify(payload),
                });
                res.ok ? this._success() : this._fallback();
            } catch {
                this._fallback();
            }
        });
    }

    _setLoading(on) {
        this.sendBtn.disabled  = on;
        this.label.textContent = on ? 'Sending…' : 'Send Message';
    }

    _success() {
        this._setLoading(false);
        this.form.reset();
        this.banner.style.cssText = 'transition:all 0.4s ease';
        this.banner.style.height  = 'auto';
        this.banner.style.opacity = '1';
        this.banner.style.padding = '14px 16px';
        this.banner.style.marginTop = '14px';
        setTimeout(() => {
            this.banner.style.cssText = 'height:0;padding:0;margin:0;overflow:hidden;opacity:0;transition:all 0.35s ease';
        }, 6000);
    }

    _fallback() {
        this._setLoading(false);
        this.form.removeAttribute('novalidate');
        this.form.submit();
    }
}

/* ─── Scroll To Top ─────────────────────────────────────────────────────────── */
class ScrollTop {
    constructor() {
        this.btn = document.getElementById('scroll-top');
        if (!this.btn) return;
        window.addEventListener('scroll', () => {
            this.btn.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });
        this.btn.addEventListener('click', () => {
            window._lenis
                ? window._lenis.scrollTo(0, { duration: 1.5 })
                : window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ─── CV Download ───────────────────────────────────────────────────────────── */
function initDownloadCV() {
    document.querySelectorAll('[data-download-resume]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const a = document.createElement('a');
            a.href     = 'assets/resume.pdf';
            a.download = 'Ethan_Hakaj_Resume.pdf';
            a.click();
        });
    });
}

/* ─── Project card placeholder images ──────────────────────────────────────── */
function initCardImages() {
    const palette = {
        ecommerce: ['#e63946', '#ff6b35'],
        fitness:   ['#ff6b35', '#06d6a0'],
        tasks:     ['#06d6a0', '#4a90d9'],
        brand:     ['#ffc247', '#e63946'],
        chat:      ['#4a90d9', '#e63946'],
        recipe:    ['#06d6a0', '#ff6b35'],
    };
    document.querySelectorAll('.proj-card[data-pid]').forEach(card => {
        const img = card.querySelector('.card-img img');
        if (!img || img.getAttribute('src')) return;
        const pid = card.dataset.pid;
        const [c1, c2] = palette[pid] || ['#e63946', '#ff6b35'];
        const title = (PROJECTS[pid]?.title || pid).replace(/</g, '&lt;');
        img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
                <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
                </linearGradient></defs>
                <rect width="900" height="600" fill="#0f0f1a"/>
                <rect x="60" y="60" width="780" height="480" rx="24" fill="url(#g)" opacity="0.18"/>
                <rect x="100" y="120" width="700" height="56" rx="12" fill="rgba(255,255,255,0.08)"/>
                <rect x="100" y="210" width="320" height="200" rx="16" fill="rgba(255,255,255,0.08)"/>
                <rect x="460" y="210" width="340" height="36" rx="8" fill="rgba(255,255,255,0.10)"/>
                <rect x="460" y="268" width="280" height="28" rx="8" fill="rgba(255,255,255,0.07)"/>
                <rect x="460" y="320" width="310" height="28" rx="8" fill="rgba(255,255,255,0.07)"/>
                <text x="450" y="490" text-anchor="middle" font-family="Inter,Arial,sans-serif"
                      font-size="36" font-weight="700" fill="${c1}">${title}</text>
            </svg>`
        )}`;
    });
}

/* ─── Scroll-reveal CSS injection ──────────────────────────────────────────── */
function injectRevealStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.revealed {
            opacity: 1;
            transform: none;
        }
        .proj-card.reveal { transition-delay: calc(var(--i, 0) * 80ms); }
    `;
    document.head.appendChild(style);
    /* stagger project cards */
    document.querySelectorAll('.proj-card').forEach((el, i) => {
        el.style.setProperty('--i', i % 3);
    });
}

/* ─── Magnetic Cursor ───────────────────────────────────────────────────────── */
class MagneticCursor {
    constructor() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        if (typeof gsap === 'undefined') return;

        this.dot    = this._make('cursor-dot');
        this.ring   = this._make('cursor-ring');
        document.body.append(this.dot, this.ring);
        document.body.classList.add('cursor-active');

        this.target = { x: -200, y: -200 };
        this.pos    = { x: -200, y: -200 };

        this._track();
        this._hover();
        this._magnetic();
        this._visibility();
    }

    _make(cls) {
        const el = document.createElement('div');
        el.className = cls;
        return el;
    }

    _track() {
        document.addEventListener('mousemove', e => {
            this.target.x = e.clientX;
            this.target.y = e.clientY;
            gsap.set(this.dot, { x: e.clientX, y: e.clientY });
        }, { passive: true });

        /* Ring follows with lerp each GSAP tick */
        gsap.ticker.add(() => {
            this.pos.x += (this.target.x - this.pos.x) * 0.13;
            this.pos.y += (this.target.y - this.pos.y) * 0.13;
            gsap.set(this.ring, { x: this.pos.x, y: this.pos.y });
        });
    }

    _hover() {
        document.querySelectorAll('a, button, .proj-card, label').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.ring.classList.add('ring-hover');
                this.dot.classList.add('dot-hover');
            });
            el.addEventListener('mouseleave', () => {
                this.ring.classList.remove('ring-hover');
                this.dot.classList.remove('dot-hover');
            });
        });
    }

    /* Buttons physically pull toward the cursor */
    _magnetic() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left  - r.width  / 2;
                const y = e.clientY - r.top   - r.height / 2;
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    _visibility() {
        document.addEventListener('mouseleave', () => {
            gsap.to([this.dot, this.ring], { opacity: 0, duration: 0.2 });
        });
        document.addEventListener('mouseenter', () => {
            gsap.to([this.dot, this.ring], { opacity: 1, duration: 0.2 });
        });
    }
}

/* ─── Text Scramble ─────────────────────────────────────────────────────────── */
const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#@$%';

class TextScramble {
    constructor(el) {
        this.el   = el;
        this.orig = el.textContent;
        this._id  = null;
        el.addEventListener('mouseenter', () => this._run());
    }

    _run() {
        let iter = 0;
        clearInterval(this._id);
        this._id = setInterval(() => {
            this.el.textContent = this.orig
                .split('')
                .map((ch, i) => {
                    if (ch === ' ') return ' ';
                    if (i < Math.floor(iter)) return this.orig[i];
                    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                })
                .join('');

            if (iter >= this.orig.length) {
                clearInterval(this._id);
                this.el.textContent = this.orig; /* ensure clean final state */
            }
            iter += 0.38;
        }, 28);
    }
}

function initTextScramble() {
    document.querySelectorAll('.nav-link').forEach(el => new TextScramble(el));
}

/* ─── tsParticles Hero Background ───────────────────────────────────────────── */
async function initParticles() {
    if (typeof tsParticles === 'undefined') return;

    await tsParticles.load('tsparticles', {
        fpsLimit:      60,
        detectRetina:  true,
        background:    { color: 'transparent' },
        interactivity: {
            detectsOn: 'window',          /* track mouse through z-stack */
            events: {
                onHover: { enable: true,  mode: 'repulse' },
                onClick: { enable: true,  mode: 'push'    },
                resize:  true,
            },
            modes: {
                repulse: { distance: 120, duration: 0.5 },
                push:    { quantity: 3 },
            },
        },
        particles: {
            number: {
                value:   70,
                density: { enable: true, area: 900 },
            },
            color: {
                value: ['#e63946', '#ff6b35', '#c1121f', '#888899'],
            },
            opacity: {
                value:     { min: 0.08, max: 0.45 },
                animation: { enable: true, speed: 0.8, sync: false },
            },
            size: {
                value:     { min: 1, max: 2.8 },
                animation: { enable: true, speed: 1.5, sync: false },
            },
            links: {
                enable:   true,
                color:    '#e63946',
                opacity:  0.12,
                distance: 130,
                width:    1,
            },
            move: {
                enable:    true,
                speed:     0.6,
                direction: 'none',
                random:    true,
                straight:  false,
                outModes:  { default: 'bounce' },
            },
        },
    });
}

/* ─── Lenis Smooth Scroll ───────────────────────────────────────────────────── */
function initLenis() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
        lerp:            1.0,
        smoothWheel:     true,
        wheelMultiplier: 1.4,
    });

    window._lenis = lenis;

    /* Hook into GSAP ticker so scroll is locked to the animation frame */
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    } else {
        (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
}

/* ─── Vanilla Tilt (3-D project cards) ──────────────────────────────────────── */
function initTilt() {
    if (typeof VanillaTilt === 'undefined') return;
    /* Only on pointer-capable devices — tilt makes no sense on touch */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    VanillaTilt.init(document.querySelectorAll('.proj-card'), {
        max:          10,
        speed:        400,
        glare:        true,
        'max-glare':  0.10,
        scale:        1.04,
        perspective:  900,
        gyroscope:    false,
    });
}

/* ─── GSAP Word Reveal (ScrollTrigger) ──────────────────────────────────────── */
function initWordReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* Split text into masked word spans */
    document.querySelectorAll('.sec-head h1, .sec-head > span').forEach(el => {
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words
            .map(w => `<span class="wr-mask"><span class="wr-word">${w}</span></span>`)
            .join(' ');
        /* mark h2 so CSS can safely clear background-clip on the parent */
        if (el.tagName === 'H1') el.classList.add('words-split');

        gsap.fromTo(
            el.querySelectorAll('.wr-word'),
            { yPercent: 110, opacity: 0 },
            {
                yPercent: 0,
                opacity: 1,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 98%',        /* fire as soon as element peeks into view */
                    toggleActions: 'play none none none',
                    once: true,
                },
            }
        );
    });

    /* Refresh after setup so Lenis + ScrollTrigger positions are in sync */
    ScrollTrigger.refresh();
}

/* ─── Page intro animation ──────────────────────────────────────────────────── */
function initPageIntro() {
    if (typeof gsap === 'undefined') return;
    gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.header',          { y: -56, opacity: 0, duration: 0.7 })
        .from('.tagline',         { y: 24,  opacity: 0, duration: 0.5 }, '-=0.3')
        .from('.glitch',          { y: 24,  opacity: 0, duration: 0.5 }, '-=0.38')
        .from('.role',            { y: 20,  opacity: 0, duration: 0.45 }, '-=0.36')
        .from('.bio',             { y: 20,  opacity: 0, duration: 0.45 }, '-=0.36')
        .from('.cta-row',         { y: 18,  opacity: 0, duration: 0.4  }, '-=0.32')
        .from('.socials',         { y: 16,  opacity: 0, duration: 0.4  }, '-=0.30')
        .from('.banner-img',      { scale: 0.88, opacity: 0, duration: 0.65, ease: 'back.out(1.4)' }, '-=0.55');
}

/* ─── Project Filter (GSAP-powered) ─────────────────────────────────────────── */
class ProjectFilter {
    constructor() {
        this.inputs  = document.querySelectorAll('input[name="filter"]');
        this.cards   = document.querySelectorAll('.proj-card[data-cat]');
        if (!this.inputs.length) return;
        this._busy   = false;
        this._catMap = { 'f-all': 'all', 'f-web': 'web', 'f-mobile': 'mobile', 'f-design': 'design' };
        this.inputs.forEach(input => input.addEventListener('change', () => this._run(this._catMap[input.id] || 'all')));
    }

    _run(cat) {
        if (this._busy || typeof gsap === 'undefined') return;
        this._busy = true;

        const visible = [...this.cards].filter(c => c.style.display !== 'none');
        const toShow  = [...this.cards].filter(c => cat === 'all' || c.dataset.cat === cat);
        const toHide  = [...this.cards].filter(c => cat !== 'all' && c.dataset.cat !== cat);

        /* ── 1. Fade + lift out current cards ── */
        gsap.to(visible, {
            opacity: 0,
            y: -16,
            scale: 0.93,
            duration: 0.22,
            ease: 'power2.in',
            stagger: 0.03,
            onComplete: () => {
                /* ── 2. Swap visibility ── */
                toHide.forEach(c => { c.style.display = 'none'; });
                toShow.forEach(c => {
                    c.style.display = '';
                    gsap.set(c, { opacity: 0, y: 24, scale: 1 });
                });

                /* ── 3. Stagger fade in ── */
                gsap.to(toShow, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.42,
                    ease: 'power3.out',
                    stagger: 0.07,
                    onComplete: () => { this._busy = false; },
                });
            },
        });
    }
}

/* ─── Bootstrap ─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    injectRevealStyles();
    initParticles();
    initLenis();
    new MagneticCursor();
    new NavBar();
    new TypeWriter(
        document.querySelector('.typed'),
        ['Web Developer', 'Web Designer', 'UI/UX Designer'],
    );
    new SkillBars();
    new ScrollReveal();
    new ProjectFilter();
    new PortfolioModal();
    new ContactForm();
    new ScrollTop();
    initDownloadCV();
    initCardImages();
    initTilt();
    initTextScramble();
    initPageIntro();
    initWordReveal();
});
