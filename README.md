# Portfolio Website

## Overview

This repository contains a personal portfolio website built with static HTML, CSS, and JavaScript.

- `index.html` — page structure and content
- `css/style.css` — styles, layout, typography, and visual design
- `js/main.js` — interactive behavior and application logic

## Features

- 3D cube navigation between sections
- Responsive header and mobile menu
- Animated typing text on the home section
- Tabbed resume section with keyboard navigation
- Portfolio filtering by category
- Portfolio detail panel for project actions
- Downloadable resume text file
- Contact form using `mailto:` submission
- Scroll-to-top button for long sections

## HTML structure

The page is divided into sections:

- `#home`
- `#about`
- `#resume`
- `#portfolio`
- `#contact`

Navigation links use `data-section` attributes so JavaScript can rotate the cube and activate the matching section.

The portfolio items use `data-category` and `data-project` attributes for filtering and dynamic project details.

## CSS

The stylesheet defines:

- color palette using CSS variables (`--primary`, `--dark`, `--text`, etc.)
- layout and spacing values
- global reset and base styles
- hover and focus states
- animation helpers for interactive UI elements

## JavaScript architecture

The application logic is organized into classes for each feature:

1. `CubeBrowser`
   - Controls the 3D cube rotation
   - Maps section IDs to CSS transform states
   - Activates the visible section and updates the URL hash
   - Prevents scroll wheel events from unexpectedly moving the page

2. `Navigation`
   - Handles nav link clicks and mobile menu toggling
   - Updates active navigation state

3. `TypeWriter`
   - Animates text in the home section by typing and deleting words

4. `ResumeTabs`
   - Switches resume content tabs
   - Updates browser history state
   - Supports keyboard navigation
   - Animates skill bars when active

5. `PortfolioFilter`
   - Filters portfolio items by category
   - Hides non-matching items and updates state

6. `PortfolioProjects`
   - Opens project detail panel from portfolio item actions
   - Loads project metadata and action buttons
   - Closes panel on overlay click or Escape key

7. `PortfolioImages`
   - Generates inline SVG preview images for project cards

8. `ResumeDownload`
   - Creates a downloadable plain-text resume from page content

9. `ContactForm`
   - Builds a `mailto:` link with submitted form data
   - Shows temporary success feedback

10. `ScrollToTop`
    - Displays the scroll-to-top button when a section is scrollable
    - Smoothly scrolls the active section back to top

11. `ButtonActions`
    - Global click handler for fallback behavior
    - Ensures links and buttons route through the right JavaScript interactions

## Initialization

On page load, the script initializes the cube, navigation, typing animation, resume tabs, portfolio filter, project panel, resume download button, contact form, and scroll-to-top control.

Internal anchor links are also intercepted to keep the cube interface working correctly.

## Notes

This is a static site and does not include a backend. The contact form uses the user's email client, and the resume download generates a `.txt` file in the browser.
