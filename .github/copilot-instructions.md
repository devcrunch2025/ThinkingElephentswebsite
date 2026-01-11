# Copilot / AI Agent Instructions for Thinking Elephents Ad Fims website

## Quick context ✅
- Static HTML/CSS/JS website (no build system). Primary files live at the repo root (`index.html`, `about.html`, etc.) and assets under `asset/` (css, js, img, video).
- Project uses jQuery + Bootstrap (CDNs), Font Awesome, Magnific Popup, Isotope (CDNs). See `index.html` for exact CDN includes.
- The repo contains a helpful human-maintained guide: `instruction.html`. Refer to it for high-level content-editing notes.

## Big picture & structure 🔧
- Each page is a standalone HTML template (e.g., `index.html`, `about.html`, `service.html`). Edit page content directly in those files.
- Assets:
  - CSS: `asset/css/style.css`, `animate.css`, `aos.css` (main styling and animations)
  - JS: `asset/js/*.js` (component behaviors: `gallery.js`, `count-timer.js`, `scroll.js`, `testimonial-active-item.js`)
  - Images & video: `asset/img/*`, `asset/video/*`, plus `home.mp4` at repo root used by hero section
- Key interactive components:
  - Hero video: `index.html` uses `<video src="home.mp4">` — served from repo root.
  - Counters: uses `<span class="count" data-number="...">` (see `index.html`) and `asset/js/count-timer.js`.
  - Portfolio gallery: relies on Isotope and specific markup: `.portfolio-section #container`, `.grid-item` with `data-filter` attributes, and `.filters a[data-filter]` (see `asset/js/gallery.js`).
  - Navbar state: `asset/js/scroll.js` toggles `.scrolled` when `$(window).scrollTop() > 20`.
  - Navigation transition: `asset/js/nav-video-transition.js` intercepts internal links and plays `asset/video/navigation-video.mp4` (falling back to `home.mp4`) before navigating; opt-out per-link with `data-no-nav-video` or adjust the `TIMEOUT` constant in the script.

## Conventions & patterns 📌
- Minimal tooling: edits are made directly to files; do not add complex build steps unless a maintainer asks.
- jQuery-first: most JS assumes jQuery is loaded via CDN before custom scripts.
- DOM structure matters: many scripts expect exact class/ID names (e.g., `.portfolio-section .grid`, `.testimonial-section .indicators li`, `.count`, etc.). Change markup carefully and update corresponding JS selectors.
- Assets are referenced with relative paths (e.g., `asset/img/logo.png`), so keep those paths stable when renaming or moving files.

## How to run & test locally ▶️
- Quick preview: open `index.html` in a browser (double-click or use VS Code Live Server extension).
- Recommended (avoids video/CORS quirks): run a simple HTTP server in the project root:
  - Python: `python -m http.server 8000` (then open `http://localhost:8000/`)
  - Node: `npx serve . -l 5000` or `npx http-server` if available
- Test interactive features in browser DevTools (Console, Network, Responsive mode). Check console for JS errors (missing selectors or CDN failures).

## Debugging tips 🐞
- If a feature isn't working, open DevTools → Console / Network:
  - Missing CDN: check `Network` for 4xx/5xx on CDN URLs in `index.html`.
  - Selector mismatch: search for the class/ID in HTML and corresponding JS. Example: counters require `<span class="count" data-number="X"></span>`.
  - Gallery/pagination: ensure `.grid-item` elements are present inside `#container` with appropriate `data-filter` attributes.
- For quick changes, use `CTRL+F` in your editor (already recommended in `instruction.html`).

## PR guidance & safety checks ✅
- Keep changes small and focused (one page or component per PR).
- Provide before/after screenshots for visual changes (especially for layout or hero/video updates).
- Verify on desktop and mobile widths (Bootstrap responsive classes are used heavily).

## Files to inspect for context (short list) 📁
- `instruction.html` — human guide to content and assets
- `index.html` — homepage and most interactions
- `about.html`, `service.html`, `portfolio.html`, `blog.html`, `contact.html` — page templates
- `asset/css/style.css` — main stylesheet
- `asset/js/gallery.js`, `asset/js/count-timer.js`, `asset/js/scroll.js`, `asset/js/testimonial-active-item.js` — key behaviors

---
If anything above is unclear or you want more examples/snippets (e.g., exact HTML sample for the gallery or counter), tell me which part to expand and I’ll update the file. Thanks — ready for feedback! 🙌