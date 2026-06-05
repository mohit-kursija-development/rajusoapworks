// Section navigation logic
document.querySelectorAll('.nav-link[data-section], .hero a[data-section]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const section = this.getAttribute('data-section');
    if (!section) return;
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(sec => {
      sec.classList.remove('active');
    });
    // Show selected section
    const activeSection = document.getElementById(section);
    if (activeSection) {
      activeSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Update nav active state
    document.querySelectorAll('.nav-link[data-section]').forEach(nav => {
      nav.classList.toggle('active', nav.getAttribute('data-section') === section);
    });
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
    "image": "/baghicha_single_pack.jpeg",
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
    card.className = 'col-6 mb-3';

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

function openProductModal(product){
    const modalEl = document.getElementById('productModal');

    document.getElementById('modalProductName').textContent = product.name;

    document.getElementById('modalProductImage').src = `images${product.image}`;

    let html = '';

    Object.entries(product).forEach(([key,value]) => {

        if(key === 'id' || key === 'image') return;

        html += `
            <tr>
                <th>${key}</th>
                <td>${value}</td>
            </tr>
        `;
    });

    document.getElementById('modalProductDetails').innerHTML = html;

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
    // document.getElementById('modalProductDetails').innerHTML = html;

    // const modal = new bootstrap.Modal(
    //     document.getElementById('productModal')
    // );

    // modal.show();
}