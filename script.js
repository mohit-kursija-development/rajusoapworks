// Raju Soap Works — shared script for all pages (home, about, products, contact, 404).
// One flat file loaded everywhere; each feature block below guards itself on the DOM
// element it needs, so it is a no-op on pages that don't use that feature.

// Production URL — used only for absolute URLs inside structured data (JSON-LD),
// which must always point at the live site regardless of where the page is opened.
const SITE_URL = 'https://rajusoapworks.com/';

// Path back to the site root, derived from this script's own URL. script.js always
// lives at the project root, so whatever prefix a page used to load it ('script.js'
// from the root, '../script.js' from /about/, /products/, /contact/) resolves to the
// root here. Everything the browser actually fetches or navigates to is built from
// this, so the site works identically over http(s) and opened directly via file://.
const SITE_ROOT = document.currentScript ? document.currentScript.src.replace(/script\.js(?:[?#].*)?$/, '') : '';

// Honour the OS "reduce motion" setting: animations become instant state changes.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// Footer year (every page)
// ---------------------------------------------------------------------------
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Reveal on scroll — adds .is-visible to [data-reveal] elements as they enter
// the viewport. Falls back to showing everything if IntersectionObserver is
// unavailable or motion is reduced.
// ---------------------------------------------------------------------------
function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // reveal once, then stop watching
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

// ---------------------------------------------------------------------------
// Sticky header state — compacts the bar once the page scrolls
// ---------------------------------------------------------------------------
function initHeaderScrollState() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    ticking = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
}

// ---------------------------------------------------------------------------
// Back-to-top button
// ---------------------------------------------------------------------------
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;
  const update = () => {
    btn.classList.toggle('is-visible', window.scrollY > 600);
    ticking = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// ---------------------------------------------------------------------------
// Animated stat counters — count up once the band scrolls into view
// ---------------------------------------------------------------------------
function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  const run = el => {
    const target = Number(el.dataset.countTo) || 0;

    // The markup already carries the real number, so a skipped animation still
    // shows correct data — only animate when motion is welcome.
    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic keeps the count fast at first, then settles
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(run);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

// ---------------------------------------------------------------------------
// Hero image rotator (home page) — crossfades the three artworks and keeps
// clickable indicators in sync. Clicking the image pauses/resumes.
// ---------------------------------------------------------------------------
function initHero() {
  const stage = document.getElementById('heroStage');
  const dotsWrap = document.getElementById('heroDots');
  if (!stage || !dotsWrap) return;

  const slides = Array.from(stage.querySelectorAll('.hero-slide'));
  if (slides.length < 2) return;

  let index = slides.findIndex(s => s.classList.contains('is-active'));
  if (index < 0) index = 0;
  let paused = false;
  let timer = null;
  const DELAY = 5000;

  // Build one indicator per slide
  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-dot' + (i === index ? ' is-active' : '');
    dot.setAttribute('aria-label', `Show image ${i + 1} of ${slides.length}`);
    dot.addEventListener('click', () => {
      show(i);
      restart();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', String(i === index));
    });
  }

  function start() {
    if (prefersReducedMotion || paused) return;
    timer = window.setInterval(() => show(index + 1), DELAY);
  }

  function restart() {
    window.clearInterval(timer);
    start();
  }

  // Click the artwork to pause/resume the rotation
  stage.addEventListener('click', e => {
    if (e.target.closest('.hero-dot')) return;
    paused = !paused;
    if (paused) {
      window.clearInterval(timer);
    } else {
      start();
    }
  });

  // Don't burn cycles while the tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.clearInterval(timer);
    } else {
      restart();
    }
  });

  start();
}

// ---------------------------------------------------------------------------
// Product catalog — shared data drives the products grid, the home-page
// marquee and the Product/ItemList structured data.
// ---------------------------------------------------------------------------
const products = [
  {
    "id": 1,
    "name": "Raju Gota 5 pcs",
    "image": "/raju_long_pack.jpeg",
    "Packet Contains": "5 Cake",
    "Box Of": "10 Packets"
  },
  {
    "id": 2,
    "name": "Raju Coconut 4 pcs",
    "image": "/raju_coconut_four_pack.jpeg",
    "Packet Contains": "4 Cake",
    "Box Of": "10 Packets"
  },
  {
    "id": 3,
    "name": "Baghicha 6 pcs",
    "image": "/baghicha_six_pack_front.jpeg",
    "Packet Contains": "6 Cake",
    "Box Of": "12 Packets"
  },
  {
    "id": 4,
    "name": "Baghicha 5 pcs",
    "image": "/baghicha_long_pack.jpeg",
    "Packet Contains": "5 Cake",
    "Box Of": "10 Packets"
  },
  {
    "id": 5,
    "name": "Raju Gota Single",
    "image": "/raju_single_green.jpeg",
    "Packet Contains": "1 Cake",
    "Box Of": "50 Packets"
  },
  {
    "id": 6,
    "name": "Raju Coconut Single",
    "image": "/raju_coconut_single.jpeg",
    "Packet Contains": "1 Cake",
    "Box Of": "60 / 30 Packets"
  },
  {
    "id": 7,
    "name": "Raju Gota Single",
    "image": "/raju_single.jpeg",
    "Packet Contains": "1 Cake",
    "Box Of": "60 Packets"
  },
  {
    "id": 8,
    "name": "Anil Single",
    "image": "/anil_single.jpeg",
    "Packet Contains": "1 Cake",
    "Box Of": "50 Packets"
  },
  {
    "id": 9,
    "name": "Baghicha Single",
    "image": "/baghicha_single_pack.png",
    "Packet Contains": "1 Cake",
    "Box Of": "50 Packets"
  },
  {
    "id": 10,
    "name": "Raju Super Single",
    "image": "/raju_super_single.jpeg",
    "Packet Contains": "1 Cake",
    "Box Of": "60 Packets"
  }
];

function productImagePath(item) {
  return `${SITE_ROOT}images${item.image}`;
}

function productAlt(item) {
  return `${item.name} — coconut oil washing soap pack by Raju Soap Works`;
}

function productDescription(item) {
  return `${item.name} coconut oil washing soap by Raju Soap Works. 100% vegetarian and Jain-friendly, made with no animal fats. Each packet contains ${item['Packet Contains']}, supplied in a box of ${item['Box Of']}.`;
}

// ---------------------------------------------------------------------------
// Product modal — shared by the grid; traps focus, locks scroll, restores focus
// ---------------------------------------------------------------------------
const productModal = {
  root: null,
  lastFocused: null,

  init() {
    this.root = document.getElementById('customModal');
    if (!this.root) return;

    const closeBtn = document.getElementById('modalClose');
    closeBtn.addEventListener('click', () => this.close());

    // Click the backdrop (but not the panel) to dismiss
    this.root.addEventListener('click', e => {
      if (e.target === this.root) this.close();
    });

    document.addEventListener('keydown', e => {
      if (!this.isOpen()) return;
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'Tab') {
        this.trapFocus(e);
      }
    });
  },

  isOpen() {
    return this.root && this.root.classList.contains('is-open');
  },

  trapFocus(e) {
    const focusables = this.root.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  },

  open(product) {
    if (!this.root) return;

    this.lastFocused = document.activeElement;

    const img = document.getElementById('modalProductImage');
    if (product.image) {
      img.src = productImagePath(product);
      img.alt = productAlt(product);
      img.style.display = '';
    } else {
      img.style.display = 'none';
    }

    document.getElementById('modalProductName').textContent = product.name || '';
    document.getElementById('modalProductPieces').textContent = product['Packet Contains'] || '';
    document.getElementById('modalProductPacks').textContent = product['Box Of'] || '';

    this.root.hidden = false;
    // Next frame, so the transition has a start state to animate from
    requestAnimationFrame(() => this.root.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    document.getElementById('modalClose').focus();
  },

  close() {
    if (!this.root) return;

    this.root.classList.remove('is-open');
    document.body.style.overflow = '';

    const finish = () => {
      this.root.hidden = true;
    };
    if (prefersReducedMotion) {
      finish();
    } else {
      window.setTimeout(finish, 320);
    }

    if (this.lastFocused) this.lastFocused.focus();
  }
};

// ---------------------------------------------------------------------------
// Product grid (products page)
// ---------------------------------------------------------------------------
function initProductGrid() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  products.forEach((item, i) => {
    const col = document.createElement('div');
    col.className = 'col-6 col-lg-3';
    col.id = `product-${item.id}`;
    col.setAttribute('data-reveal', 'up');
    col.style.setProperty('--reveal-delay', `${(i % 4) * 80}ms`);

    col.innerHTML = `
      <a class="product-card" href="#product-${item.id}">
        <div class="product-media">
          <img
            src="${productImagePath(item)}"
            alt="${productAlt(item)}"
            loading="lazy"
            decoding="async"
            onerror="this.style.display='none'"
          >
        </div>
        <div class="product-body">
          <h3 class="product-title">${item.name}</h3>
          <div class="product-meta">
            <span class="chip">${item['Packet Contains']} / packet</span>
            <span class="chip">Box of ${item['Box Of']}</span>
          </div>
        </div>
      </a>
    `;

    col.querySelector('.product-card').addEventListener('click', e => {
      e.preventDefault();
      productModal.open(item);
      history.replaceState(null, '', `#product-${item.id}`);
    });

    grid.appendChild(col);
  });

  injectProductSchema();

  // Deep link: /products/#product-<id> (e.g. from the home page marquee)
  // opens that product's modal and scrolls its card into view.
  const match = window.location.hash.match(/^#product-(\d+)$/);
  if (match) {
    const product = products.find(p => p.id === Number(match[1]));
    if (product) {
      productModal.open(product);
      document.getElementById(`product-${product.id}`)?.scrollIntoView({ block: 'center' });
    }
  }
}

// Product structured data, generated from the same array that renders the grid
function injectProductSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}products/#product-list`,
    name: 'Coconut oil soap bars by Raju Soap Works',
    numberOfItems: products.length,
    itemListElement: products.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': `${SITE_URL}products/#product-${item.id}`,
        name: item.name,
        sku: `RSW-${item.id}`,
        url: `${SITE_URL}products/#product-${item.id}`,
        description: productDescription(item),
        image: `${SITE_URL}images${item.image}`,
        category: 'Washing soap',
        material: 'Coconut oil',
        brand: { '@type': 'Brand', name: 'Raju Soap Works' },
        manufacturer: { '@id': `${SITE_URL}#business` },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Packet Contains', value: item['Packet Contains'] },
          { '@type': 'PropertyValue', name: 'Box Of', value: item['Box Of'] }
        ]
      }
    }))
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

// ---------------------------------------------------------------------------
// Best-sellers marquee (home page) — real links so it stays crawlable
// ---------------------------------------------------------------------------
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  const renderItem = (item, isClone) => `
      <a class="marquee-item" href="${SITE_ROOT}products/index.html#product-${item.id}"
         ${isClone ? 'aria-hidden="true" tabindex="-1"' : `aria-label="${item.name} — view details"`}>
        <div class="thumb">
          <img src="${productImagePath(item)}" alt="${isClone ? '' : productAlt(item)}" loading="lazy" decoding="async" onerror="this.style.display='none'">
        </div>
      </a>`;

  // Two identical copies so the -50% marquee loop is seamless. The second copy is
  // hidden from assistive tech and taken out of the tab order so the duplicated
  // links aren't announced or focusable twice.
  const original = products.map(item => renderItem(item, false)).join('');
  const clone = products.map(item => renderItem(item, true)).join('');
  track.innerHTML = original + clone;
}

// ---------------------------------------------------------------------------
// Contact form (contact page)
// ---------------------------------------------------------------------------
function initContactForm() {
  const form = document.getElementById('callbackForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('contact-success');

  const rules = {
    name: {
      test: v => /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v),
      message: 'Please enter a valid name.'
    },
    email: {
      test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Please enter a valid email address.'
    },
    phone: {
      test: v => /^[6-9]\d{9}$/.test(v),
      message: 'Please enter a valid 10-digit mobile number.'
    },
    message: {
      test: v => v.length >= 5,
      message: 'Message should contain at least 5 characters.'
    }
  };

  function setFieldError(id, message) {
    const field = document.getElementById(id);
    const slot = form.querySelector(`[data-error-for="${id}"]`);
    field.classList.toggle('is-invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (slot) slot.textContent = message || '';
  }

  function validateField(id) {
    const value = document.getElementById(id).value.trim();
    const ok = rules[id].test(value);
    setFieldError(id, ok ? '' : rules[id].message);
    return ok;
  }

  // Validate as the user leaves a field, and clear the error as they fix it
  Object.keys(rules).forEach(id => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('blur', () => validateField(id));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(id);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate everything, then focus the first problem field
    const failed = Object.keys(rules).filter(id => !validateField(id));
    if (failed.length) {
      const first = document.getElementById(failed[0]);
      first.focus();
      showPopup(rules[failed[0]].message);
      return;
    }

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://formsubmit.co/ajax/9005f8cf26dc911de4546f409a6a5587', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          phone: document.getElementById('phone').value.trim(),
          message: document.getElementById('message').value.trim(),
          _subject: 'New Website Enquiry'
        })
      });

      const result = await response.json();

      if (result.success === 'true' || result.success === true) {
        successMessage.classList.remove('d-none');
        form.reset();
        Object.keys(rules).forEach(id => setFieldError(id, ''));
        setTimeout(() => successMessage.classList.add('d-none'), 6000);
      } else {
        showPopup('Unable to submit form. Please try again.');
      }
    } catch (err) {
      showPopup('Network error. Please try again later.');
      console.error(err);
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
}

// ---------------------------------------------------------------------------
// Error toast (contact page)
// ---------------------------------------------------------------------------
let popupTimer = null;

function showPopup(message) {
  const popup = document.getElementById('popupMessage');
  const text = document.getElementById('popupText');
  if (!popup || !text) return;

  text.textContent = message;
  popup.classList.add('is-open');

  window.clearTimeout(popupTimer);
  popupTimer = window.setTimeout(closePopup, 5000);
}

function closePopup() {
  const popup = document.getElementById('popupMessage');
  if (popup) popup.classList.remove('is-open');
}

window.closePopup = closePopup;

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScrollState();
  initBackToTop();
  initHero();
  productModal.init();

  // Build dynamic content first — the product grid adds its own [data-reveal]
  // elements, which must exist before the reveal observer starts watching.
  initProductGrid();
  initMarquee();
  initContactForm();

  initScrollReveal();
  initCounters();
});
