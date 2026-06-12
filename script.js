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


// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Store JSON HERE rather than fetching from file
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

  document.getElementById('modalProductPieces').textContent =
    product['Packet Contains'] || '';

  document.getElementById('modalProductPacks').textContent =
    product['Box Of'] || '';

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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("callbackForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const popupText = document.getElementById("popupText");
    const popupMessage = document.getElementById("popupMessage");
    const successMessage = document.getElementById("contact-success");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    let error = "";

    if (!nameRegex.test(name)) {
      error = "Please enter a valid name.";
    } else if (!emailRegex.test(email)) {
      error = "Please enter a valid email address.";
    } else if (!phoneRegex.test(phone)) {
      error = "Please enter a valid 10-digit mobile number.";
    } else if (message.length < 5) {
      error = "Message should contain at least 5 characters.";
    }

    if (error) {
      popupText.textContent = error;
      popupMessage.style.display = "block";
      return;
    }

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/9005f8cf26dc911de4546f409a6a5587",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
            _subject: "New Website Enquiry"
          })
        }
      );

      const result = await response.json();

      if (result.success === "true" || result.success === true) {
        successMessage.classList.remove("d-none");
        form.reset();

        setTimeout(() => {
          successMessage.classList.add("d-none");
        }, 5000);
      } else {
        popupText.textContent =
          "Unable to submit form. Please try again.";
        popupMessage.style.display = "block";
      }
    } catch (err) {
      popupText.textContent =
        "Network error. Please try again later.";
      popupMessage.style.display = "block";
      console.error(err);
    }
  });
});

function closePopup() {
  document.getElementById("popupMessage").style.display = "none";
}

// Close Popup Function
function closePopup() {
  const popupMessage = document.getElementById("popupMessage");
  if (popupMessage) {
    popupMessage.style.display = "none";
  }
}
window.closePopup = closePopup;