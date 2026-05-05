// ============================================
// Global References
// ============================================
let cubeBrowser = null;
let resumeTabs = null;
let portfolioFilter = null;
let portfolioProjects = null;

// ============================================
// CSS 3D Website Cube
// ============================================
class CubeBrowser {
    constructor() {
        this.cube = document.getElementById('site-cube');
        this.sections = ['home', 'about', 'resume', 'portfolio', 'contact'];
        this.currentSection = 'home';
        this.rotations = {
            home: 'rotateX(0deg) rotateY(0deg)',
            about: 'rotateX(0deg) rotateY(-90deg)',
            resume: 'rotateX(-90deg) rotateY(0deg)',
            portfolio: 'rotateX(90deg) rotateY(0deg)',
            contact: 'rotateX(0deg) rotateY(90deg)'
        };

        this.init();
    }

    init() {
        const initialSection = window.location.hash.replace('#', '');
        if (this.rotations[initialSection]) {
            this.currentSection = initialSection;
        }

        this.bindEvents();
        this.rotateToSection(this.currentSection, true);
    }

    bindEvents() {
        document.addEventListener('keydown', (event) => this.onKeyPress(event));
    }

    onKeyPress(event) {
        const editableElement = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
        if (editableElement) return;

        const currentIndex = this.sections.indexOf(this.currentSection);

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % this.sections.length;
            this.rotateToSection(this.sections[nextIndex]);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = (currentIndex - 1 + this.sections.length) % this.sections.length;
            this.rotateToSection(this.sections[prevIndex]);
        }
    }

    rotateToSection(sectionId, immediate = false) {
        if (!this.cube || !this.rotations[sectionId]) return;

        this.currentSection = sectionId;
        this.cube.classList.toggle('is-transitioning', !immediate);

        if (immediate) {
            this.cube.style.transition = 'none';
        }

        this.cube.style.transform = `translateZ(calc(var(--cube-depth) * -1)) ${this.rotations[sectionId]}`;

        document.querySelectorAll('.section').forEach(section => {
            const isActive = section.id === sectionId;
            section.classList.toggle('active', isActive);
            section.setAttribute('aria-hidden', String(!isActive));
            if (isActive) {
                section.scrollTop = 0;
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
        });

        document.getElementById('scroll-top')?.classList.remove('visible');
        document.dispatchEvent(new CustomEvent('sectionchange', { detail: { sectionId } }));
        window.history.replaceState(null, '', `#${sectionId}`);

        if (immediate) {
            requestAnimationFrame(() => {
                this.cube.style.transition = '';
            });
        } else {
            window.setTimeout(() => {
                this.cube.classList.remove('is-transitioning');
            }, 950);
        }
    }
}

// ============================================
// Navigation & Section Management
// ============================================
class Navigation {
    constructor() {
        this.header = document.querySelector('.header');
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.menuToggle = document.getElementById('menu-toggle');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
        
        this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.navbar.classList.remove('active');
                this.menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    handleNavClick(e, link) {
        e.preventDefault();
        
        const sectionId = link.getAttribute('data-section');
        
        // Rotate cube to section
        if (cubeBrowser) {
            cubeBrowser.rotateToSection(sectionId);
        }
        
        // Update active nav link
        this.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Close mobile menu
        this.navbar.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    toggleMobileMenu() {
        this.navbar.classList.toggle('active');
        this.menuToggle.setAttribute('aria-expanded', String(this.navbar.classList.contains('active')));
    }
}

// ============================================
// Typing Animation
// ============================================
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = wait;
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.element.innerHTML = this.txt;
        
        let typeSpeed = 100;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ============================================
// Resume Tabs
// ============================================
class ResumeTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.contents = document.querySelectorAll('.tab-content');
        this.transitionTimer = null;
        
        this.init();
    }
    
    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
            tab.addEventListener('keydown', (event) => this.handleKeydown(event, tab));
        });

        const initialTab = new URLSearchParams(window.location.search).get('resumeTab');
        const targetTab = document.querySelector(`.tab-btn[data-tab="${initialTab}"]`);
        if (targetTab) {
            this.switchTab(targetTab, true);
        }
    }
    
    switchTab(tab, skipHistory = false) {
        const targetId = tab.getAttribute('data-tab');
        const activeContent = document.querySelector('.tab-content.active');
        const nextContent = document.getElementById(targetId);

        if (!nextContent || activeContent === nextContent) return;
        
        // Update tabs
        this.tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        window.clearTimeout(this.transitionTimer);
        activeContent?.classList.add('is-leaving');

        this.transitionTimer = window.setTimeout(() => {
            this.contents.forEach(content => {
                content.classList.remove('active', 'is-leaving');
            });

            nextContent.classList.add('active');

            if (targetId === 'skills') {
                this.animateSkillBars();
            }

            this.scrollResumeToPanels();
            document.dispatchEvent(new CustomEvent('scrollcontentchange'));
        }, activeContent ? 220 : 0);

        if (!skipHistory) {
            const url = new URL(window.location.href);
            url.hash = 'resume';
            url.searchParams.set('resumeTab', targetId);
            window.history.replaceState(null, '', url);
        }
    }

    scrollResumeToPanels() {
        const resumeSection = document.getElementById('resume');
        const tabs = document.querySelector('.resume-tabs');
        if (!resumeSection || !tabs) return;

        resumeSection.scrollTo({
            top: Math.max(tabs.offsetTop - 20, 0),
            behavior: 'smooth'
        });
    }

    handleKeydown(event, tab) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

        event.preventDefault();
        const tabs = Array.from(this.tabs);
        const currentIndex = tabs.indexOf(tab);
        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = tabs.length - 1;
        }

        tabs[nextIndex].focus();
        this.switchTab(tabs[nextIndex]);
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.style.width = '0';
            setTimeout(() => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            }, 100);
        });
    }
}

// ============================================
// Portfolio Filter
// ============================================
class PortfolioFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.items = document.querySelectorAll('.portfolio-item');
        
        this.init();
    }
    
    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filter(btn));
        });

        const initialFilter = new URLSearchParams(window.location.search).get('portfolioFilter');
        const targetFilter = document.querySelector(`.filter-btn[data-filter="${initialFilter}"]`);
        if (targetFilter) {
            this.filter(targetFilter, true);
        }
    }
    
    filter(btn, skipHistory = false) {
        const filter = btn.getAttribute('data-filter');
        
        // Update buttons
        this.filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        
        // Filter items
        this.items.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.classList.add('hidden');
            }
        });

        if (!skipHistory) {
            const url = new URL(window.location.href);
            url.hash = 'portfolio';
            url.searchParams.set('portfolioFilter', filter);
            window.history.replaceState(null, '', url);
        }

        document.dispatchEvent(new CustomEvent('scrollcontentchange'));
    }
}

// ============================================
// Portfolio Project Panel
// ============================================
class PortfolioProjects {
    constructor() {
        this.panel = document.getElementById('project-panel');
        this.title = document.getElementById('project-panel-title');
        this.kicker = document.getElementById('project-panel-kicker');
        this.description = document.getElementById('project-panel-description');
        this.meta = document.getElementById('project-panel-meta');
        this.primaryAction = document.querySelector('[data-project-primary]');
        this.secondaryAction = document.querySelector('[data-project-secondary]');
        this.closeButton = document.querySelector('[data-project-close]');
        this.activeTrigger = null;
        this.activeProject = null;
        this.activeAction = 'code';
        this.projects = {
            ecommerce: {
                title: 'E-Commerce Platform',
                type: 'Web App',
                description: 'A full-stack storefront with product browsing, cart flows, checkout states, and admin-ready product structure.',
                tags: ['React', 'Node.js', 'MongoDB'],
                demo: 'https://example.com/e-commerce-platform',
                code: 'https://github.com/yourusername/e-commerce-platform'
            },
            fitness: {
                title: 'Fitness Tracker App',
                type: 'Mobile App',
                description: 'A cross-platform workout tracker for goals, progress history, and Firebase-backed user data.',
                tags: ['React Native', 'Firebase'],
                demo: 'https://example.com/fitness-tracker-app',
                code: 'https://github.com/yourusername/fitness-tracker-app'
            },
            tasks: {
                title: 'Task Management Dashboard',
                type: 'Web App',
                description: 'A productivity dashboard with project views, task states, team-oriented filtering, and reporting-ready data.',
                tags: ['Vue.js', 'Express', 'PostgreSQL'],
                demo: 'https://example.com/task-management-dashboard',
                code: 'https://github.com/yourusername/task-management-dashboard'
            },
            brand: {
                title: 'Brand Identity System',
                type: 'Design',
                description: 'A cohesive identity package covering color, typography, component rules, and reusable visual assets.',
                tags: ['Figma', 'Illustrator'],
                demo: 'https://example.com/brand-identity-system',
                code: 'https://example.com/brand-identity-system/details'
            },
            chat: {
                title: 'Real-time Chat Application',
                type: 'Web App',
                description: 'A WebSocket-based chat experience with live messaging, presence states, and scalable session handling.',
                tags: ['Socket.io', 'React', 'Redis'],
                demo: 'https://example.com/realtime-chat-application',
                code: 'https://github.com/yourusername/realtime-chat-application'
            },
            recipe: {
                title: 'Recipe Finder App',
                type: 'Mobile App',
                description: 'An AI-assisted recipe finder that turns preferences and ingredients into practical cooking suggestions.',
                tags: ['Flutter', 'Python', 'TensorFlow'],
                demo: 'https://example.com/recipe-finder-app',
                code: 'https://github.com/yourusername/recipe-finder-app'
            }
        };

        this.init();
    }

    init() {
        if (!this.panel) return;

        document.querySelectorAll('[data-project-action]').forEach(link => {
            link.addEventListener('click', (event) => this.openFromLink(event, link));
        });

        this.closeButton?.addEventListener('click', () => this.close());
        this.panel.addEventListener('click', (event) => {
            if (event.target === this.panel) {
                this.close();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.panel.classList.contains('active')) {
                this.close();
            }
        });
    }

    openFromLink(event, link) {
        event.preventDefault();

        const item = link.closest('.portfolio-item');
        const project = this.projects[item?.dataset.project];
        if (!project) return;

        this.activeTrigger = link;
        this.open(project, link.dataset.projectAction);
    }

    open(project, action) {
        this.activeProject = project;
        this.activeAction = action === 'details' ? 'details' : 'code';
        this.kicker.textContent = action === 'code' ? 'Code Overview' : project.type;
        this.title.textContent = project.title;
        this.description.textContent = project.description;
        this.meta.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');

        this.primaryAction.onclick = () => this.showActionResult('demo');
        this.secondaryAction.onclick = () => this.showActionResult(this.activeAction);

        this.primaryAction.innerHTML = '<i class="bx bx-link-external"></i>Open Demo';
        this.secondaryAction.innerHTML = action === 'details'
            ? '<i class="bx bx-show"></i>View Details'
            : '<i class="bx bxl-github"></i>View Code';

        this.panel.classList.add('active');
        this.panel.setAttribute('aria-hidden', 'false');
        this.closeButton?.focus();
    }

    showActionResult(action) {
        if (!this.activeProject) return;

        const targetUrl = action === 'demo' ? this.activeProject.demo : this.activeProject.code;
        const actionLabels = {
            demo: 'Demo Preview',
            code: 'Code Summary',
            details: 'Design Details'
        };

        this.kicker.textContent = actionLabels[action];
        this.description.textContent = action === 'demo'
            ? `${this.activeProject.title} demo preview is active. Add your deployed URL later to connect this button to a live build.`
            : `${this.activeProject.title} ${action === 'details' ? 'details' : 'code'} view is active. Add your final URL later to connect this button externally.`;

        this.meta.innerHTML = [
            ...this.activeProject.tags,
            targetUrl
        ].map(tag => `<span>${tag}</span>`).join('');

    }

    close() {
        this.panel.classList.remove('active');
        this.panel.setAttribute('aria-hidden', 'true');
        this.activeTrigger?.focus();
    }
}

// ============================================
// Portfolio Images
// ============================================
class PortfolioImages {
    constructor() {
        this.colors = {
            ecommerce: ['#6c63ff', '#43d9ad'],
            fitness: ['#ff6584', '#6c63ff'],
            tasks: ['#43d9ad', '#4a90d9'],
            brand: ['#ffc247', '#ff6584'],
            chat: ['#4a90d9', '#6c63ff'],
            recipe: ['#e94560', '#ffc247']
        };

        this.init();
    }

    init() {
        document.querySelectorAll('.portfolio-item').forEach(item => {
            const image = item.querySelector('img');
            const title = item.querySelector('.portfolio-info h3')?.textContent || 'Project';
            const project = item.dataset.project;
            const colors = this.colors[project] || ['#6c63ff', '#ff6584'];

            if (image) {
                image.src = this.createProjectImage(title, colors);
            }
        });
    }

    createProjectImage(title, colors) {
        const [start, end] = colors;
        const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
                <defs>
                    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0" stop-color="${start}"/>
                        <stop offset="1" stop-color="${end}"/>
                    </linearGradient>
                </defs>
                <rect width="900" height="600" fill="#111119"/>
                <rect x="70" y="70" width="760" height="460" rx="28" fill="url(#g)" opacity="0.9"/>
                <rect x="110" y="120" width="680" height="64" rx="14" fill="rgba(255,255,255,0.2)"/>
                <rect x="110" y="220" width="300" height="210" rx="18" fill="rgba(255,255,255,0.2)"/>
                <rect x="450" y="220" width="340" height="38" rx="10" fill="rgba(255,255,255,0.26)"/>
                <rect x="450" y="286" width="280" height="32" rx="10" fill="rgba(255,255,255,0.2)"/>
                <rect x="450" y="344" width="310" height="32" rx="10" fill="rgba(255,255,255,0.2)"/>
                <text x="450" y="505" text-anchor="middle" font-family="Lato, Arial, sans-serif" font-size="42" font-weight="700" fill="#ffffff">${safeTitle}</text>
            </svg>`;

        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }
}

// ============================================
// Resume Download
// ============================================
class ResumeDownload {
    constructor() {
        this.button = document.querySelector('[data-download-resume]');

        this.init();
    }

    init() {
        if (!this.button) return;

        this.button.addEventListener('click', (event) => this.downloadResume(event));
    }

    downloadResume(event) {
        event.preventDefault();

        const resumeSection = document.getElementById('resume');
        const aboutSection = document.getElementById('about');
        const resumeText = [
            document.querySelector('.glitch')?.textContent?.trim() || 'Your Name',
            '',
            'ABOUT',
            aboutSection?.innerText?.trim() || '',
            '',
            'RESUME',
            resumeSection?.innerText?.trim() || ''
        ].join('\n');

        const blob = new Blob([resumeText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');

        downloadLink.href = url;
        downloadLink.download = 'resume.txt';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        URL.revokeObjectURL(url);
    }
}

// ============================================
// Contact Form
// ============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        const subject = encodeURIComponent(data.subject || 'Portfolio inquiry');
        const body = encodeURIComponent(
            `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\n\n${data.message}`
        );

        window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;

        const btn = this.form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>Message Sent!</span><i class="bx bx-check"></i>';
        btn.style.background = '#43d9ad';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            this.form.reset();
        }, 3000);
    }
}

// ============================================
// Scroll to Top
// ============================================
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scroll-top');
        this.sections = document.querySelectorAll('.section');
        
        this.init();
    }
    
    init() {
        if (!this.button) return;

        this.sections.forEach(section => {
            section.addEventListener('scroll', () => this.updateVisibility(), { passive: true });
        });

        document.addEventListener('sectionchange', () => this.updateVisibility());
        document.addEventListener('scrollcontentchange', () => this.updateVisibility());
        window.addEventListener('resize', () => this.updateVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());

        this.updateVisibility();
    }
    
    getActiveSection() {
        return document.querySelector('.section.active');
    }

    updateVisibility() {
        const section = this.getActiveSection();
        const canScroll = section && section.scrollHeight > section.clientHeight + 1;

        if (canScroll && section.scrollTop > 80) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        const section = this.getActiveSection();
        if (!section) return;

        section.scrollTo({ top: 0, behavior: 'smooth' });
        requestAnimationFrame(() => this.updateVisibility());
    }
}

// ============================================
// Button Action Fallbacks
// ============================================
class ButtonActions {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (event) => this.handleClick(event), true);
    }

    handleClick(event) {
        const target = event.target.closest('a, button');
        if (!target) return;

        if (target.matches('[data-download-resume]')) {
            return;
        }

        if (target.matches('#menu-toggle')) {
            return;
        }

        if (target.matches('.nav-link')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            cubeBrowser?.rotateToSection(target.dataset.section);
            document.querySelector('.navbar')?.classList.remove('active');
            return;
        }

        if (target.matches('[data-section-target]')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            cubeBrowser?.rotateToSection(target.dataset.sectionTarget);
            document.querySelector('.navbar')?.classList.remove('active');
            return;
        }

        if (target.matches('a[href^="#"]')) {
            const sectionId = target.getAttribute('href').slice(1);
            if (cubeBrowser?.rotations?.[sectionId]) {
                event.preventDefault();
                event.stopImmediatePropagation();
                cubeBrowser.rotateToSection(sectionId);
                return;
            }
        }

        if (target.matches('.tab-btn')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            resumeTabs?.switchTab(target);
            return;
        }

        if (target.matches('.filter-btn')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            portfolioFilter?.filter(target);
            return;
        }

        if (target.matches('[data-project-action]')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            portfolioProjects?.openFromLink(event, target);
            return;
        }

        if (target.matches('[data-project-close]')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            portfolioProjects?.close();
            return;
        }

        if (target.matches('[data-project-primary]')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            portfolioProjects?.showActionResult('demo');
            return;
        }

        if (target.matches('[data-project-secondary]')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            portfolioProjects?.showActionResult(portfolioProjects?.activeAction || 'code');
        }
    }
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    cubeBrowser = new CubeBrowser();
    new ButtonActions();
    
    // Initialize navigation
    new Navigation();
    
    // Initialize typing animation
    const typedElement = document.querySelector('.typed-text');
    if (typedElement) {
        new TypeWriter(typedElement, [
            'Full Stack Developer',
            'UI/UX Designer',
            'Creative Problem Solver',
            'Tech Enthusiast'
        ], 2000);
    }
    
    // Initialize resume tabs
    resumeTabs = new ResumeTabs();
    
    // Initialize portfolio filter
    portfolioFilter = new PortfolioFilter();

    // Initialize portfolio project buttons
    portfolioProjects = new PortfolioProjects();

    // Generate reliable portfolio artwork
    new PortfolioImages();

    // Initialize resume download
    new ResumeDownload();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize scroll to top
    new ScrollToTop();
    
    // Handle internal links with data-section
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.defaultPrevented) return;

            const href = link.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                const sectionId = href.substring(1);
                const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                if (navLink) {
                    e.preventDefault();
                    navLink.click();
                }
            }
        });
    });

    const initialSection = window.location.hash.replace('#', '');
    if (initialSection) {
        cubeBrowser.rotateToSection(initialSection, true);
    }
});
