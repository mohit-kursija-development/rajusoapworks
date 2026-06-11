// Section navigation logic
// Function to show a specific section
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });

  // Show selected section
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add('active');
  }

  // Update nav active state
  document.querySelectorAll('.nav-link[data-section]').forEach(nav => {
    nav.classList.toggle('active', nav.getAttribute('data-section') === sectionId);
  });
}

document.addEventListener("DOMContentLoaded", function () {

    const images = [
        "images/rsw_home_2.png",
        "images/rsw_home_3.png",
        "images/rsw_home_1.png",
    ];

    const heroImage = document.getElementById("heroImage");

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

    heroImage.style.transition = "opacity 0.5s ease";

    const interval = setInterval(changeImage, 3000);

    heroImage.addEventListener("click", function () {
        paused = !paused;
    });

});


// 1. On Page Load: Check if there is a saved section in localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedSection = localStorage.getItem('activeSection');
  
  if (savedSection) {
    // Show the saved section instead of the main/default one
    showSection(savedSection);
  } else {
    // Optional: If no section is saved, ensure your default/main section is active
    // showSection('home'); // Uncomment and replace 'home' with your actual main section ID if needed
  }
});

// 2. Click Handlers: Update section and save choice to localStorage
document.querySelectorAll('.nav-link[data-section], .hero a[data-section]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const section = this.getAttribute('data-section');
    if (!section) return;

    // Show the section
    showSection(section);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Save the current section to localStorage
    localStorage.setItem('activeSection', section);
  });
});

// Contact form fake submit
document.querySelector('.contact-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('contact-success').classList.remove('d-none');
  setTimeout(() => {
    document.getElementById('contact-success').classList.add('d-none');
    this.reset();
  }, 2500);
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Store JSON HERE rather than fetching from file
const products = [
  {
    "id": 1,
    "name": "Raju Gota Long 5 Pack",
    "Ingredients": "Acid Oil, Fatty Acids, Essential oils, Essence",
    "image": "/raju_long_pack.jpeg",
    "Pieces in Pack": 5,
    "Packs per Box": 10
  },
  {
    "id": 2,
    "name": "Raju Gota Green Single Pack",
    "Ingredients": "Acid Oil, Fatty Acids, Essential oils, Essence",
    "image": "/raju_single_green.jpeg",
    "Pieces in Pack": 1,
    "Packs per Box": 50
  },
  {
    "id": 3,
    "name": "Raju Gota Single Pack",
    "Ingredients": "Acid Oil, Fatty Acids, Essential oils, Essence",
    "image": "/raju_single.jpeg",
    "Pieces in Pack": 1,
    "Packs per Box": 60
  },
  {
    "id": 4,
    "name": "Raju Super Single Pack",
    "Ingredients": "Acid Oil, Fatty Acids, Essential oils, Essence",
    "image": "/raju_super_single.jpeg",
    "Pieces in Pack": 1,
    "Packs per Box": 60
  },
  {
    "id": 5,
    "name": "Raju Coconut 4 pack",
    "Ingredients": "Acid Oil, Fatty Acids, Coconut acid oils / Coconut Oil, Essence",
    "image": "/raju_coconut_four_pack.jpeg",
    "Pieces in Pack": 4,
    "Packs per Box": 10
  },
  {
    "id": 6,
    "name": "Raju Coconut Single Pack",
    "Ingredients": "Acid Oil, Fatty Acids, Coconut acid oils / Coconut Oil, Essence",
    "image": "/raju_coconut_single.jpeg",
    "Pieces in Pack": 1,
    "Packs per Box": "60 / 30"
  },
  {
    "id": 7,
    "name": "Baghicha 6 pack",
    "Ingredients": "Acid Oil, Fatty Acids, Essential oils, Essence",
    "image": "/baghicha_six_pack_front.jpeg",
    "Pieces in Pack": 6,
    "Packs per Box": 12
  },
  {
    "id": 8,
    "name": "Baghicha Long 5 pack",
    "Ingredients": "Acid Oil, Fatty Acids, Essential oils, Essence",
    "image": "/baghicha_long_pack.jpeg",
    "Pieces in Pack": 5,
    "Packs per Box": 10
  },
  {
    "id": 9,
    "name": "Baghicha Single pack",
    "Ingredients": "Acid Oil, Fatty Acids, Essential oils, Essence",
    "image": "/baghicha_single_pack.png",
    "Pieces in Pack": 1,
    "Packs per Box": 50
  },
  {
    "id": 10,
    "name": "Anil Single Pack",
    "Ingredients": "Acid Oil, Fatty Acids, Essential oils, Essence",
    "image": "/anil_single.jpeg",
    "Pieces in Pack": 1,
    "Packs per Box": 50
  }
];


const productContainer = document.querySelector('.product');

products.forEach(item => {

    const card = document.createElement('div');
    card.className = 'col-md-3 col-6 mb-3';

    card.innerHTML = `
        <div class="card h-100">

            <div class="product-image-wrap">
                <img
                    src="images${item.image}"
                    alt="${item.name}"
                    onerror="this.style.display='none'"
                >
            </div>

            <div class="card-body text-center">
                <h6 class="card-title mb-0">${item.name}</h6>
            </div>

        </div>
    `;

    card.addEventListener('click', () => openProductModal(item));

    productContainer.appendChild(card);
});

function openProductModal(product) {
// Show image as well.
    const modalImage = document.getElementById('modalProductImage');
    if (product.image) {
        modalImage.src = `images${product.image}`;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }

    document.getElementById('modalProductName').textContent =
        product.name || '';

    document.getElementById('modalProductIngredients').textContent =
        product.Ingredients || '';

    document.getElementById('modalProductPieces').textContent =
        product['Pieces in Pack'] || '';

    document.getElementById('modalProductPacks').textContent =
        product['Packs per Box'] || '';

    document.getElementById('customModal').style.display = 'block';
}

document.querySelector('.custom-modal-close').addEventListener('click', function () {
    document.getElementById('customModal').style.display = 'none';
});

window.addEventListener('click', function (e) {
    const modal = document.getElementById('customModal');

    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Open products section when "View All Products" button is clicked
document.querySelector('.prod-btn')?.addEventListener('click', function (e) {
    e.preventDefault();
    showSection('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    localStorage.setItem('activeSection', 'products');
});

document.querySelector('.cont-btn')?.addEventListener('click', function (e) {
    e.preventDefault();
    showSection('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    localStorage.setItem('activeSection', 'contact');
});

document.addEventListener('DOMContentLoaded', function () {
    result = products.map(item => `
        <div class="card mx-1 w-100" data-product-id="${item.id}">
            <div class="product-image-wrap cust-width">
                <img src="images${item.image}" alt="${item.name}" onerror="this.style.display='none'">
                <div class="scroll-item-name d-none">${item.name}</div>
            </div>  
        </div>
`).join('');

    document.querySelector('.scroll-items').innerHTML = result + result;
    
    // Add click listeners to these cards as well by getting name from hidden div inside card
    document.querySelectorAll('.scroll-items .card').forEach(card => {
        card.addEventListener('click', function () {
            const productName = this.querySelector('.scroll-item-name').textContent;
            const product = products.find(p => p.name === productName);
            if (product) {
                openProductModal(product);
                showSection('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                localStorage.setItem('activeSection', 'products');
            }
        });
    });

});
