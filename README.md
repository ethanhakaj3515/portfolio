Portfolio — Project Description
Overview
A fully custom single-page portfolio website built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no bundler. The site is deployed as static files and designed to showcase Ethan Hakaj's work as a web developer and UI/UX designer, with a dark red/orange modern tech aesthetic.

Visual Design
The design is built around a dark background (#080810) with a signature red-to-orange gradient (#e63946 → #ff6b35) used consistently across headings, buttons, accents, and interactive states. A teal highlight (#06d6a0) appears as a contrast accent in availability indicators. Typography is Inter (900 weight for headings, variable weights for body), loaded via Google Fonts. All spacing, radii, and transitions are defined as CSS custom properties (--r, --r-lg, --ease, --nav-h, etc.) for consistency across the entire stylesheet.

Page Structure
The site is a single scrollable page divided into four sections:

Home (Banner) — Full-viewport hero with profile photo, glitch name animation, typewriter role, bio, CTA buttons, and social links
Skills — Three skill groups (Frontend, Backend, Tools) with animated progress bars
Projects — Filterable 6-card grid (All / Web / Mobile / Design categories)
Contact — Two-column layout with info card and contact form
Animation Stack
Six animation systems run simultaneously, each handling a different layer of interactivity:

1. GSAP (GreenSock Animation Platform) — CDN
Used for the page intro sequence (elements cascade in on load via a GSAP timeline), the project filter transitions (cards stagger-fade out upward, then new cards cascade in from below), and the word reveal on section headings (each word rises from behind a hidden overflow mask as you scroll to each section, powered by ScrollTrigger).

2. Lenis Smooth Scroll — CDN (@studio-freight/lenis)
Replaces native browser scroll with a physics-based lerp scroll. Hooked into GSAP's ticker (gsap.ticker.add) so both run on the same animation frame. The lerp value (0.8) keeps it very close to native speed with just a hint of glide. The scroll-to-top button uses window._lenis.scrollTo() for consistency.

3. tsParticles — CDN
Renders an interactive particle network on an HTML5 canvas layered behind the hero section. 70 floating nodes in red/orange tones drift slowly and draw connecting lines within 130px of each other. Mouse position is tracked globally (detectsOn: 'window') so particles repulse away from the cursor even though the canvas sits behind the content. Clicking spawns new particles.

4. VanillaTilt — CDN
Applies 3D perspective tilt to every project card on pointer-capable devices. As the cursor moves over a card, the card tilts up to 10° on both axes with a scale(1.04) lift and a subtle glare reflection that sweeps across the surface. On mouse leave, it springs back with a smooth reset transition. Initialised only on devices that pass (hover: hover) and (pointer: fine) to exclude touch screens.

5. Custom Magnetic Cursor — Pure GSAP
The system cursor is hidden on desktop (cursor: none) and replaced with two DOM elements: a small red dot that snaps instantly to the mouse position, and a larger ring that follows with a lerp (0.13 per frame via the GSAP ticker). The ring expands and fills slightly when hovering links, buttons, or cards. All .btn elements have an additional magnetic pull — as the cursor moves over them, the button physically follows via GSAP (x * 0.3, y * 0.3) and elastically springs back on mouse leave (elastic.out(1, 0.4)).

6. Text Scramble — Pure JS
Hovering any nav link triggers a character scramble: the link's text is replaced frame-by-frame with random characters from !<>-_\/[]{}=+*^?#@$%, then revealed left-to-right at a rate of 0.38 characters per 28ms interval until the original word is fully restored. No library — around 30 lines of vanilla JS.

Key JavaScript Classes
Class	Responsibility
TypeWriter	Cycles through role strings with typed/deleted animation
NavBar	Scroll-spy active link, hamburger menu, click-outside close
SkillBars	IntersectionObserver triggers bar fill animations
ScrollReveal	IntersectionObserver fade-up for skill groups, cards, form
ProjectFilter	GSAP-powered category filtering with stagger in/out
PortfolioModal	CSS class-based modal for project detail panel
ContactForm	Async POST to formsubmit.co with success/fallback handling
ScrollTop	Shows/hides back-to-top button, uses Lenis for smooth scroll
MagneticCursor	Custom cursor dot + ring + magnetic button pull
TextScramble	Nav link hover scramble effect
Project Filtering
Filter tabs (All / Web / Mobile / Design) use <input type="radio"> elements with CSS-styled <label> pills. When a tab is selected, the ProjectFilter class intercepts the change event, uses GSAP to stagger-animate the currently visible cards out (opacity → 0, y → -16, scale → 0.93), swaps which cards are displayed with display: none/'', then stagger-animates the matching cards back in (opacity → 1, y → 0). A _busy flag prevents animation interruption during transitions.

Contact Form
Built with standard HTML5 form elements. On submit, the form POSTs as JSON to formsubmit.co (a free email relay service) via fetch() with the ajax endpoint. On success, a confirmation banner animates in and resets after 6 seconds. If the fetch fails, the form falls back to a native HTML submit.

Tools & Libraries Used
Tool	Version	Purpose
GSAP	3.12.5	Intro animation, filter transitions, word reveals, cursor
GSAP ScrollTrigger	3.12.5	Scroll-based word reveal triggers
Lenis	1.0.42	Smooth scroll with physics-based lerp
tsParticles	2.12.0	Hero background particle network
VanillaTilt	1.8.1	3D tilt on project cards
Boxicons	2.1.4	Icon set (nav, skills, contact, social)
Inter (Google Fonts)	—	Primary typeface
formsubmit.co	—	Contact form email relay
All libraries are loaded from jsDelivr or unpkg CDNs — no npm, no node_modules, no build process. The entire project is plain files that can be opened in any browser or served from any static host.
