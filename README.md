# Ethan Hakaj — Portfolio

A fully custom single-page portfolio website built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no bundler — just static files with a modern red tech aesthetic and a full animation stack powered by CDN libraries.

**Live Site:** [ethanhakaj.github.io/portfolio](https://github.com/ethanhakaj3515/portfolio)

---

## Features

-  Dark red/orange gradient theme with glitch text and typewriter animations
-  Physics-based smooth scroll via Lenis
-  Interactive particle network in the hero section
-  3D tilt effect on project cards with glare reflection
-  Custom magnetic cursor with button pull effect
-  Text scramble animation on nav link hover
-  GSAP ScrollTrigger word-by-word heading reveals on scroll
-  Animated project category filtering (All / Web / Mobile / Design)
-  Async contact form with email relay via formsubmit.co
-  Fully responsive — touch-safe (animations degrade gracefully on mobile)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| HTML5 / CSS3 / JavaScript (ES6+) | — | Core structure, styling, logic |
| GSAP + ScrollTrigger | 3.12.5 | Page intro, filter transitions, word reveals |
| Lenis | 1.0.42 | Smooth scroll with physics-based lerp |
| tsParticles | 2.12.0 | Hero background particle network |
| VanillaTilt | 1.8.1 | 3D tilt on project cards |
| Boxicons | 2.1.4 | Icon set |
| Inter (Google Fonts) | — | Primary typeface |
| formsubmit.co | — | Contact form email relay (no backend needed) |

All libraries are loaded from CDN (jsDelivr / unpkg) — no npm, no build process.

---

## Project Structure


---

## How It Works

### Animations

Six animation systems run simultaneously, each handling a different interaction layer:

**GSAP** drives the page intro sequence (elements cascade in on load), the project filter transitions (cards stagger out then back in), and the ScrollTrigger word reveals (section headings rise word-by-word from behind overflow masks as you scroll).

**Lenis** replaces native scroll with a lerp-based smooth scroll, hooked into GSAP's ticker so both run on the same animation frame. The scroll-to-top button calls `lenis.scrollTo()` for consistency.

**tsParticles** renders an interactive canvas behind the hero section. 70 nodes drift and draw connecting lines within 130px of each other. Mouse position is tracked globally so particles repulse away from the cursor even though the canvas sits behind the content.

**VanillaTilt** applies 3D perspective tilt to every project card. The card follows the cursor up to 10° on both axes, scales up slightly, and shows a glare sweep. Only initialised on pointer-capable devices (`(hover: hover) and (pointer: fine)`).

**Custom Magnetic Cursor** hides the system cursor and replaces it with a dot (instant) and a ring (lerp-lagged). Buttons physically pull toward the cursor as you hover them and elastically spring back on leave.

**Text Scramble** cycles random characters on nav link hover before revealing the real word left-to-right — built in ~30 lines of vanilla JS, no library.

### Project Filtering

Filter tabs use `<input type="radio">` elements with CSS-styled `<label>` pills. On selection, the `ProjectFilter` class intercepts the `change` event, stagger-animates visible cards out via GSAP, swaps visibility with `display: none/''`, then stagger-animates matching cards back in. A `_busy` flag prevents animation interruption during transitions.

### Contact Form

On submit, the form POSTs as JSON to **formsubmit.co** via `fetch()` using their AJAX endpoint — no backend required. On success, a confirmation banner animates in and auto-dismisses after 6 seconds. On network failure, it falls back to a native HTML form submit.

---

## Running Locally

No install required. Just serve the folder with any static file server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .

# Or simply open index.html in your browser
