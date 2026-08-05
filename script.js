// Raju Soap Works — shared script for all pages (home, about, products, contact).
// This is one flat file loaded on every page; each feature block below is guarded
// by checking for the DOM element it needs, so it's a no-op on pages that don't have it.

// Production URL — used only for absolute URLs inside structured data (JSON-LD),
// which must always point at the live site regardless of where the page is opened.
const SITE_URL = 'https://rajusoapworks.com/';

// Path back to the site root, derived from this script's own URL. script.js always
// lives at the project root, so whatever prefix a page used to load it ('script.js'
// from the root, '../script.js' from /about/, /products/, /contact/) resolves to the
// root here. Everything the browser actually fetches or navigates to is built from
// this, so the site works identically over http(s) and opened directly via file://.
const SITE_ROOT = document.currentScript ? document.currentScript.src.replace(/script\.js(?:[?#].*)?$/, '') : '';

// Set current year in footer (present on every page)
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Hero image rotator (home page only)
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const heroImage = document.getElementById('heroImage');
  if (!heroImage) return;

  const images = [
    `${SITE_ROOT}images/rsw_home_2.png`,
    `${SITE_ROOT}images/rsw_home_3.png`,
    `${SITE_ROOT}images/rsw_home_1.png`
  ];
  let current = 0;
  let paused = false;

  function changeImage() {
    if (paused) return;

    current = (current + 1) % images.length;

    heroImage.style.opacity = 0;

    setTimeout(() => {
      heroImage.src = images[current];
      heroImage.style.opacity = 1;
    }, 500);
  }

  heroImage.style.transition = 'opacity 0.5s ease';
  setInterval(changeImage, 3000);

  heroImage.addEventListener('click', function () {
    paused = !paused;
  });
});

// ---------------------------------------------------------------------------
// Product catalog — shared data drives the full grid (products page), the
// "Best Sellers" carousel (home page) and the Product/ItemList schema
// (products page). Store JSON here rather than fetching from a file.
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

// Shared copy used for image alt text and Product structured data
function productImagePath(item) {
  return `${SITE_ROOT}images${item.image}`;
}

function productAlt(item) {
  return `${item.name} — coconut oil washing soap pack by Raju Soap Works`;
}

function productDescription(item) {
  return `${item.name} coconut oil washing soap by Raju Soap Works. 100% vegetarian and Jain-friendly, made with no animal fats. Each packet contains ${item['Packet Contains']}, supplied in a box of ${item['Box Of']}.`;
}

function openProductModal(product) {
  const modalImage = document.getElementById('modalProductImage');
  if (product.image) {
    modalImage.src = productImagePath(product);
    modalImage.alt = productAlt(product);
    modalImage.style.display = 'block';
  } else {
    modalImage.style.display = 'none';
  }

  document.getElementById('modalProductName').textContent = product.name || '';
  document.getElementById('modalProductPieces').textContent = product['Packet Contains'] || '';
  document.getElementById('modalProductPacks').textContent = product['Box Of'] || '';

  document.getElementById('customModal').style.display = 'block';
}

function closeProductModal() {
  const modal = document.getElementById('customModal');
  if (modal) modal.style.display = 'none';
}

// ---------------------------------------------------------------------------
// Full product grid + modal (products page only)
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const productContainer = document.querySelector('.product');
  if (!productContainer) return;

  products.forEach(item => {
    const card = document.createElement('div');
    card.className = 'col-md-3 col-6 mb-3';
    card.id = `product-${item.id}`;

    card.innerHTML = `
        <a class="card h-100 text-decoration-none text-reset" href="#product-${item.id}">

            <div class="product-image-wrap">
                <img
                    src="${productImagePath(item)}"
                    alt="${productAlt(item)}"
                    loading="lazy"
                    decoding="async"
                    onerror="this.style.display='none'"
                >
            </div>

            <div class="card-body text-center">
                <h2 class="card-title h6 mb-1">${item.name}</h2>
                <p class="card-text small text-muted mb-0">${item['Packet Contains']} per packet &middot; Box of ${item['Box Of']}</p>
            </div>

        </a>
    `;

    card.querySelector('a').addEventListener('click', e => {
      e.preventDefault();
      openProductModal(item);
      history.replaceState(null, '', `#product-${item.id}`);
    });

    productContainer.appendChild(card);
  });

  // Product / ItemList structured data, generated from the same array that renders the grid
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

  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify(schema);
  document.head.appendChild(schemaScript);

  // Modal close handlers
  const closeBtn = document.querySelector('.custom-modal-close');
  closeBtn.addEventListener('click', closeProductModal);
  closeBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeProductModal();
    }
  });

  window.addEventListener('click', function (e) {
    const modal = document.getElementById('customModal');
    if (e.target === modal) modal.style.display = 'none';
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProductModal();
  });

  // Deep link support: /products/#product-<id> (e.g. from the home page carousel)
  // opens that product's modal automatically and scrolls its card into view.
  const hashMatch = window.location.hash.match(/^#product-(\d+)$/);
  if (hashMatch) {
    const product = products.find(p => p.id === Number(hashMatch[1]));
    if (product) {
      openProductModal(product);
      document.getElementById(`product-${product.id}`)?.scrollIntoView({ block: 'center' });
    }
  }
});

// ---------------------------------------------------------------------------
// "Best Sellers" carousel (home page only) — real links to the products page,
// so it's crawlable and works even before script.js finishes if middle-clicked.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.scroll-items');
  if (!track) return;

  const result = products.map(item => `
        <a class="card mx-1 w-100 text-decoration-none text-reset" href="${SITE_ROOT}products/index.html#product-${item.id}">
            <div class="product-image-wrap cust-width">
                <img src="${productImagePath(item)}" alt="${productAlt(item)}" loading="lazy" decoding="async" onerror="this.style.display='none'">
            </div>
        </a>
`).join('');

  // Two identical copies so the -50% marquee loop is seamless
  track.innerHTML = result + result;
});

// ---------------------------------------------------------------------------
// Contact form (contact page only)
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('callbackForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const popupText = document.getElementById('popupText');
    const popupMessage = document.getElementById('popupMessage');
    const successMessage = document.getElementById('contact-success');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    let error = '';

    if (!nameRegex.test(name)) {
      error = 'Please enter a valid name.';
    } else if (!emailRegex.test(email)) {
      error = 'Please enter a valid email address.';
    } else if (!phoneRegex.test(phone)) {
      error = 'Please enter a valid 10-digit mobile number.';
    } else if (message.length < 5) {
      error = 'Message should contain at least 5 characters.';
    }

    if (error) {
      popupText.textContent = error;
      popupMessage.style.display = 'block';
      return;
    }

    try {
      const response = await fetch(
        'https://formsubmit.co/ajax/9005f8cf26dc911de4546f409a6a5587',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
            _subject: 'New Website Enquiry'
          })
        }
      );

      const result = await response.json();

      if (result.success === 'true' || result.success === true) {
        successMessage.classList.remove('d-none');
        form.reset();

        setTimeout(() => {
          successMessage.classList.add('d-none');
        }, 2000);
      } else {
        popupText.textContent = 'Unable to submit form. Please try again.';
        popupMessage.style.display = 'block';
      }
    } catch (err) {
      popupText.textContent = 'Network error. Please try again later.';
      popupMessage.style.display = 'block';
      console.error(err);
    }
  });
});

// Close Popup Function (contact page)
function closePopup() {
  const popupMessage = document.getElementById('popupMessage');
  if (popupMessage) {
    popupMessage.style.display = 'none';
  }
}
window.closePopup = closePopup;
