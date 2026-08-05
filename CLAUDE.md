# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static multi-page marketing website for Raju Soap Works, a coconut oil soap manufacturer. No build tooling, no package manager, no framework — plain HTML/CSS/JS served as static files (deployed via GitHub Pages, per `CNAME`).

## Development

There is no build/lint/test pipeline. Every internal link and asset reference is **relative** (`css/styles.css` from the root, `../css/styles.css` from a subdirectory), so the site works both when opened directly via `file://` and when served over HTTP. You can double-click [index.html](index.html) to preview, or serve the project root with `python3 -m http.server` and visit `http://localhost:8000/`.

Do **not** switch these to root-relative (`/css/styles.css`) paths: they resolve against the filesystem root under `file://` and every asset 404s. Page links deliberately include the filename (`about/index.html`, not `about/`) for the same reason — a bare directory URL has no meaning to `file://`. Canonical/OG/JSON-LD/sitemap URLs stay absolute (`https://rajusoapworks.com/about/`), so search engines still index the clean directory URLs regardless of the link form.

## Architecture

The site is four real, separately-crawlable pages sharing one stylesheet and one script — not a single-page app with JS routing:

- **[index.html](index.html)** — Home (`/`)
- **[about/index.html](about/index.html)** — About Us (`/about/`)
- **[products/index.html](products/index.html)** — Products (`/products/`)
- **[contact/index.html](contact/index.html)** — Contact Us (`/contact/`)

Each is a full, independent HTML document (own `<title>`, meta description, canonical, Open Graph/Twitter tags, and JSON-LD `@graph`) with its own copy of the nav/footer markup — there's no template/include system, so shared markup is duplicated by hand across the four files. **When editing the nav, footer, or brand header, update all four pages together.** The correct nav link carries `class="nav-link active" aria-current="page"` hardcoded per page; there is no JS-driven active-state logic.

- **[script.js](script.js)** — one flat file loaded by all four pages. Each feature block guards itself on the DOM element it needs (e.g. the hero rotator bails out if `#heroImage` isn't on the page), so it's a safe no-op on pages that don't use that feature:
  - Footer year (`#current-year`), sticky-header state (`#siteHeader`), back-to-top (`#backToTop`), scroll reveal and counters — every page.
  - Hero crossfade + slide indicators — guarded on `#heroStage` (home only).
  - Product grid + modal + `Product`/`ItemList` JSON-LD injection — guarded on `#productGrid` (products page only).
  - "Best Sellers" marquee — guarded on `#marqueeTrack` (home only).
  - Contact form (inline per-field validation, submit spinner, toast) — guarded on `#callbackForm` (contact page only).

  Boot order matters: `initProductGrid()` and `initMarquee()` run **before** `initScrollReveal()`, because the grid injects its own `[data-reveal]` elements and the observer must exist after they do — otherwise those cards stay at `opacity: 0` forever.
- **Product catalog** — products are a hardcoded JS array (`products` in [script.js](script.js)), not fetched from a file or API. Each entry has `id`, `name`, `image` (path relative to `images/`, includes leading `/`), `Packet Contains`, `Box Of`. The same array drives the full product grid on `/products/`, the home-page carousel, and the generated `Product`/`ItemList` schema — adding a product to the array updates all three automatically.
- **Product links & modal** — each grid card and marquee item is a real `<a>` (crawlable, keyboard-focusable) pointing at `products/index.html#product-<id>`. On the products page, clicking one calls `e.preventDefault()` and opens the shared modal instead of navigating, updating the URL via `history.replaceState`. From the home page marquee the link is a normal navigation; on load, the products page checks `location.hash` and auto-opens that product's modal, so the deep links work with or without JS. The single `#customModal` (products page only) is managed by the `productModal` object, which handles focus trapping, `Escape`, backdrop click, body scroll lock, and restoring focus to the element that opened it.
- **Hero image rotator** — `#heroStage` holds the three `rsw_home_*.png` artworks stacked as `.hero-slide` elements; JS toggles `.is-active` for a true opacity crossfade (the old version swapped one `src`, which blinked) and keeps the `.hero-dot` indicators in sync. Rotates every 5s, pauses on click and while the tab is hidden, and doesn't rotate at all under reduced motion. Home page only.
- **Contact form** — submits via `fetch` to FormSubmit's AJAX endpoint (`https://formsubmit.co/ajax/<id>`), not a page redirect. Client-side validation (name/email/10-digit Indian mobile regex) runs before the request; results show as either the inline `#contact-success` alert or the `#popupMessage` error popup (`closePopup()` is exposed on `window` for the popup's inline `onclick`).
- **Styling** — Bootstrap 5.3.3 + Bootstrap Icons + Plus Jakarta Sans (Google Fonts), all via CDN, with the design system in [css/styles.css](css/styles.css). That file is organised into numbered sections (01 Tokens … 19 404 page); keep additions in the matching section rather than appending to the end.
  - **Tokens** live in `:root`: a brown ramp (`--brown-900` … `--brown-50`) built around the unchanged brand `--brown: #795548`, cream `--yellow: #fdfad5` (unchanged) plus `--amber` accent, a fluid type scale (`--step--1` … `--step-4`), spacing, radii, brown-tinted shadows, and easing/duration tokens. **Use the tokens, don't hard-code colours or px values.**
  - Button classes keep their original names for continuity: `.btn-yellow` is the solid-brown primary, `.btn-brown` is the cream secondary, `.btn-ghost` is for placement on brown backgrounds. (The names read backwards; they predate this redesign.)
  - The fluid type scale minimums are deliberately small — long words overflow a ~358px content box on 360–390px phones, and `body` has `overflow-x: hidden`, so an oversized minimum silently *clips* text rather than scrolling. Test any type-scale change at 390px width.
- **Motion** — animations are driven by a small shared system, not per-component one-offs:
  - **Scroll reveal**: add `data-reveal="up|left|right|scale"` (optionally `style="--reveal-delay: 120ms"` to stagger) and `initScrollReveal()` adds `.is-visible` via `IntersectionObserver`. The hidden state is scoped to `.js [data-reveal]`, and an inline script in each `<head>` sets that class, so content is never hidden when JS is unavailable.
  - **Never hide content using an animation's `backwards`/`both` fill state.** If the animation doesn't run, the content stays invisible — this happened to the hero CTAs. `.is-visible` sets a real style, which is why the hero uses the reveal system too.
  - Everything is wrapped in a `prefers-reduced-motion: reduce` block that neutralises animation/transition durations, and `script.js` reads the same preference (`prefersReducedMotion`) to skip counters, the hero rotation and smooth scrolling.

### SEO surface

- Each page has its own `<title>`, meta description, canonical URL, geo tags, Open Graph/Twitter cards, and a page-scoped JSON-LD `@graph`. All four repeat a `LocalBusiness`/`Organization` node (same `@id`, `https://rajusoapworks.com/#business`) plus a page-specific `WebPage` node; About/Products/Contact also carry a two-item `BreadcrumbList` (Home → current page) and a visible `<nav aria-label="Breadcrumb">` trail that must match it. Home additionally carries `WebSite` and the `FAQPage` graph (kept in sync with the visible FAQ accordion — Google requires the answers to be visible on the page, not just in JSON-LD).
- The `Product`/`ItemList` schema on `/products/` is generated at runtime by `script.js` from the `products` array, so it can't drift from the grid.
- [sitemap.xml](sitemap.xml) lists all four URLs with per-page priority/changefreq and image entries; [robots.txt](robots.txt) points at it. [404.html](404.html) is `noindex` and links back to `/`, `/products/`, `/contact/`.
- Each page has exactly one `<h1>` (home: hero title; others: the page heading); nested content uses `<h2>`/`<h3>` in order.
- Absolute URLs (canonical, OG tags, JSON-LD, sitemap) use `https://rajusoapworks.com/` — the domain in `CNAME`. `SITE_URL` in [script.js](script.js) holds the JS-side copy. Update all of them together if the domain ever changes.

## Conventions

- No JS modules/bundler — [script.js](script.js) is a single flat file relying on guarded `DOMContentLoaded` listeners and global functions; keep additions consistent with this style rather than introducing a build step or per-page scripts.
- Internal navigation uses real relative `<a href="about/index.html">` / `<a href="../products/index.html">` links, not hash routing or `data-section` attributes. Adding a fifth page means: create `<name>/index.html` with the full head/nav/footer boilerplate (using `../` for every asset and sibling-page link), add its nav link (as `active` on itself, plain elsewhere) to **all** four existing pages' nav and footer, and add its URL to `sitemap.xml`.
- Image references in the `products` array omit the `images/` prefix; it's prepended at render time as `` `${SITE_ROOT}images${item.image}` ``. Keep new entries in that same format.
- `SITE_ROOT` in [script.js](script.js) is derived at load time from `document.currentScript.src` (stripping the trailing `script.js`). Because script.js always lives at the project root, this yields the correct absolute base URL no matter which page — root or subdirectory, `file://` or `http://` — loaded it. **Use `${SITE_ROOT}...` for anything the browser fetches or navigates to** from JS (image `src`, page `href`); a bare `/images/...` or `images/...` will break on one depth or the other. Note `document.currentScript` is only non-null during the script's initial synchronous run, which is why `SITE_ROOT` is captured at the top level rather than inside a `DOMContentLoaded` handler.
- When adding `width`/`height` attributes to an `<img>` (do — they prevent layout shift), make sure its CSS also sets `height: auto`. The attributes are presentational hints: if CSS only sets `width`, the height attribute is used literally and the aspect ratio breaks. This already bit `.home-img` and `.toggler-icon`.
- Images in [images/](images/) are recompressed in place (same filenames, same pixel dimensions — only re-encoded bytes) to keep page weight down. When adding new images, compress before committing: JPEGs at quality ~82 with `optimize`+`progressive`; PNGs via a lossless `optimize=True` pass, or palette quantization (256 colors) only when the image is fully opaque or has just binary (0/255) alpha — never quantize an image with soft/partial alpha (drop shadows, gradients), since a palette can't represent continuous alpha and will band it.
