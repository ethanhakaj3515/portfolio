// ============================================
// Global References
// ============================================
let cubeBrowser = null;

// ============================================
// Three.js 3D Cube Browser
// ============================================
class CubeBrowser {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            2000
        );
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true, 
            alpha: true 
        });
        
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.targetSectionRotation = null;
        this.isRotatingToSection = false;
        this.currentSection = 'home';
        this.sections = ['home', 'about', 'resume', 'portfolio', 'contact'];
        this.cubeFaces = {};
        this.mainCube = null;
        
        this.init();
    }
    
    init() {
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0a0a0f, 1);
        
        // Camera position
        this.camera.position.z = 100;
        
        // Create the main cube
        this.createCube();
        this.createLights();
        
        // Events
        this.bindEvents();
        
        // Start animation
        this.animate();
    }
    
    createCube() {
        const size = 150;
        const geometry = new THREE.BoxGeometry(size, size, size);
        
        // Create materials for each face with distinct colors
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0x6c63ff }), // right - about
            new THREE.MeshPhongMaterial({ color: 0x5a52d9 }), // left - contact
            new THREE.MeshPhongMaterial({ color: 0x8b85ff }), // top - resume
            new THREE.MeshPhongMaterial({ color: 0x6c63ff }), // bottom - portfolio
            new THREE.MeshPhongMaterial({ color: 0x6c63ff }), // front - home
            new THREE.MeshPhongMaterial({ color: 0x4a3f8f })  // back - hidden
        ];
        
        this.mainCube = new THREE.Mesh(geometry, materials);
        this.scene.add(this.mainCube);
        
        // Add wireframe edges for visual effect
        const edges = new THREE.EdgesGeometry(geometry);
        const wireframe = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 })
        );
        this.mainCube.add(wireframe);
        
        // Add content to each face using canvas textures
        this.createFaceTextures();
    }
    
    createFaceTextures() {
        // Map sections to face indices
        const faceMap = {
            'home': 4,      // front
            'about': 0,     // right
            'resume': 2,    // top
            'portfolio': 3, // bottom
            'contact': 1    // left
        };
        
        // Create canvas textures for each section
        Object.entries(faceMap).forEach(([section, faceIndex]) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            
            const ctx = canvas.getContext('2d');
            
            // Background
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Border
            ctx.strokeStyle = '#6c63ff';
            ctx.lineWidth = 4;
            ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
            
            // Content
            this.drawSectionContent(ctx, section, canvas.width, canvas.height);
            
            // Create texture
            const texture = new THREE.CanvasTexture(canvas);
            texture.magFilter = THREE.NearestFilter;
            
            // Apply to face
            const material = new THREE.MeshPhongMaterial({ 
                map: texture,
                color: 0xffffff
            });
            
            this.mainCube.material[faceIndex] = material;
        });
    }
    
    drawSectionContent(ctx, section, width, height) {
        ctx.fillStyle = '#e4e4e7';
        ctx.font = 'bold 48px "Lato", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let title = '';
        let subtitle = '';
        let details = [];
        
        switch(section) {
            case 'home':
                title = 'Your Name';
                subtitle = 'Full Stack Developer';
                details = ['Building Digital', 'Experiences', 'Click to Navigate'];
                break;
            case 'about':
                title = 'About Me';
                subtitle = 'Let\'s Get to Know';
                details = ['5+ Years Experience', 'Full Stack Developer', 'Problem Solver'];
                break;
            case 'resume':
                title = 'Resume';
                subtitle = 'Professional Journey';
                details = ['Experience', 'Skills', 'Education'];
                break;
            case 'portfolio':
                title = 'Portfolio';
                subtitle = 'Recent Projects';
                details = ['E-Commerce', 'Mobile Apps', 'Dashboards'];
                break;
            case 'contact':
                title = 'Contact';
                subtitle = 'Let\'s Connect';
                details = ['Get in Touch', 'Discuss Projects', 'Build Together'];
                break;
        }
        
        // Title
        ctx.fillStyle = '#e4e4e7';
        ctx.font = 'bold 60px "Lato", sans-serif';
        ctx.fillText(title, width / 2, height / 2 - 150);
        
        // Subtitle
        ctx.fillStyle = '#9ca3af';
        ctx.font = '32px "Lato", sans-serif';
        ctx.fillText(subtitle, width / 2, height / 2 - 50);
        
        // Details
        ctx.fillStyle = '#6c63ff';
        ctx.font = '28px "Lato", sans-serif';
        details.forEach((detail, i) => {
            ctx.fillText(detail, width / 2, height / 2 + 80 + i * 80);
        });
        
        // Instructions
        ctx.fillStyle = '#6c63ff';
        ctx.font = '20px "Lato", sans-serif';
        ctx.fillText('Use navigation to rotate', width / 2, height - 100);
    }
    
    createLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x6c63ff, 1, 1000);
        pointLight.position.set(150, 150, 150);
        this.scene.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(0xff6584, 0.5, 1000);
        pointLight2.position.set(-150, -150, 150);
        this.scene.add(pointLight2);
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('keydown', (e) => this.onKeyPress(e));
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        if (!this.isRotatingToSection) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
    }
    
    onKeyPress(event) {
        const currentIndex = this.sections.indexOf(this.currentSection);
        
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            const nextIndex = (currentIndex + 1) % this.sections.length;
            this.rotateToSection(this.sections[nextIndex]);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            const prevIndex = (currentIndex - 1 + this.sections.length) % this.sections.length;
            this.rotateToSection(this.sections[prevIndex]);
        }
    }
    
    rotateToSection(sectionId) {
        const rotations = {
            'home': { x: 0, y: 0 },
            'about': { x: 0, y: -Math.PI / 2 },
            'resume': { x: Math.PI / 2, y: 0 },
            'portfolio': { x: -Math.PI / 2, y: 0 },
            'contact': { x: 0, y: Math.PI / 2 }
        };
        
        if (rotations[sectionId]) {
            this.currentSection = sectionId;
            this.targetSectionRotation = rotations[sectionId];
            this.isRotatingToSection = true;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.isRotatingToSection && this.targetSectionRotation) {
            // Smoothly interpolate to section rotation
            this.targetRotation.x += (this.targetSectionRotation.x - this.targetRotation.x) * 0.08;
            this.targetRotation.y += (this.targetSectionRotation.y - this.targetRotation.y) * 0.08;
            
            // Check if rotation is close enough
            const tolerance = 0.01;
            if (Math.abs(this.targetRotation.x - this.targetSectionRotation.x) < tolerance &&
                Math.abs(this.targetRotation.y - this.targetSectionRotation.y) < tolerance) {
                this.isRotatingToSection = false;
                this.targetRotation.x = this.targetSectionRotation.x;
                this.targetRotation.y = this.targetSectionRotation.y;
                this.targetSectionRotation = null;
            }
        } else if (!this.isRotatingToSection) {
            // Gentle mouse-based rotation when not animating
            this.targetRotation.x += (this.mouse.y * 0.3 - this.targetRotation.x) * 0.05;
            this.targetRotation.y += (this.mouse.x * 0.3 - this.targetRotation.y) * 0.05;
        }
        
        this.mainCube.rotation.x = this.targetRotation.x;
        this.mainCube.rotation.y = this.targetRotation.y;
        
        this.renderer.render(this.scene, this.camera);
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
    }
    
    toggleMobileMenu() {
        this.navbar.classList.toggle('active');
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
        
        this.init();
    }
    
    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }
    
    switchTab(tab) {
        const targetId = tab.getAttribute('data-tab');
        
        // Update tabs
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update content
        this.contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetId) {
                content.classList.add('active');
                
                // Animate skill bars if skills tab
                if (targetId === 'skills') {
                    this.animateSkillBars();
                }
            }
        });
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
    }
    
    filter(btn) {
        const filter = btn.getAttribute('data-filter');
        
        // Update buttons
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
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
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message (you can customize this)
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
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
    }
    
    toggleVisibility() {
        if (window.scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js background
    cubeBackground = new CubeBackground();
    
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
    new ResumeTabs();
    
    // Initialize portfolio filter
    new PortfolioFilter();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize scroll to top
    new ScrollToTop();
    
    // Handle internal links with data-section
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
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
});
