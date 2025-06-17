// Select all slide elements
const slides = document.querySelectorAll('.slide');

// Select navigation buttons
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

// Keep track of the current active slide index
let current = 0;

/**
 * Show the slide at the given index
 * @param {number} index - Index of the slide to show
 */
function showSlide(index) {
  slides.forEach((slide, i) => {
    // Add 'active' class to the current slide, remove from others
    slide.classList.toggle('active', i === index);
  });
}

/**
 * Show the next slide, cycling back to the first if at the end
 */
function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

/**
 * Show the previous slide, cycling to the last if at the beginning
 */
function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

// Only add event listeners if buttons and slides exist
if (slides.length && prevBtn && nextBtn) {
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Automatically advance slides every 5 seconds
  setInterval(nextSlide, 5000);

  // Initialize by showing the first slide
  showSlide(current);
}
document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const search = document.getElementById('searchInput').value.toLowerCase();
  const medium = document.getElementById('mediumFilter').value;
  const style = document.getElementById('styleFilter').value;
  const size = document.getElementById('sizeFilter').value;
  const cost = document.getElementById('costFilter').value;
  const sort = document.getElementById('sortFilter').value;

  let paintings = Array.from(document.querySelectorAll('.painting-card'));

  paintings.forEach(card => {
    let match = true;
    if (search && !card.dataset.name.toLowerCase().includes(search)) match = false;
    if (medium && card.dataset.medium !== medium) match = false;
    if (style && card.dataset.style !== style) match = false;
    if (size && card.dataset.size !== size) match = false;
    if (cost) {
      const [min, max] = cost.split('-').map(Number);
      const price = Number(card.dataset.cost);
      if (price < min || price > max) match = false;
    }
    card.style.display = match ? '' : 'none';
  });

  // Sorting
  if (sort !== 'default') {
    paintings.sort((a, b) => {
      if (sort === 'name') {
        return a.dataset.name.localeCompare(b.dataset.name);
      }
      if (sort === 'costLowHigh') {
        return Number(a.dataset.cost) - Number(b.dataset.cost);
      }
      if (sort === 'costHighLow') {
        return Number(b.dataset.cost) - Number(a.dataset.cost);
      }
      return 0;
    });
    const container = document.querySelector('.paintings-container');
    paintings.forEach(card => container.appendChild(card));
  }
});
function renderGallery() {
  const container = document.querySelector('.paintings-container');
  container.innerHTML = '';
  const paintings = JSON.parse(localStorage.getItem('paintings') || '[]');
  paintings.forEach((p, idx) => {
    const id = p.id || idx + 1000; // Avoid conflict with static IDs
    const subtitle = `${p.medium} • 2025`;
    const card = document.createElement('a');
    card.href = `buy.html?id=${id}`;
    card.className = 'painting-card-link';
    card.innerHTML = `
      <div class="painting-card" data-id="${id}">
        <img src="${p.image}" alt="${p.name}">
        <div class="painting-card-body">
          <h3>${p.name}</h3>
          <p class="painting-subtitle">${subtitle}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
renderGallery();