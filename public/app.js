const grid = document.getElementById('hotel-grid');
const template = document.getElementById('hotel-card-template');
const form = document.getElementById('filter-form');
const resetBtn = document.getElementById('reset');
const resultsCount = document.getElementById('results-count');

const imageMap = {
  'lakeview.jpg':
    'https://images.unsplash.com/photo-1501117716987-c8e1ecb210af?auto=format&fit=crop&w=900&q=80',
  'kingwest.jpg':
    'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=900&q=80',
  'yorkville.jpg':
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
  'distillery.jpg':
    'https://images.unsplash.com/photo-1528903922155-9c5e563bb9ad?auto=format&fit=crop&w=900&q=80',
  'financial.jpg':
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'
};

async function fetchHotels(params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`/api/hotels?${query.toString()}`);
  if (!response.ok) {
    throw new Error('Impossible de récupérer les hôtels');
  }
  return response.json();
}

function formatPrice(price) {
  return `${price} $CAD / nuit`;
}

function renderHotelCard(hotel) {
  const node = template.content.cloneNode(true);
  const card = node.querySelector('.hotel');
  const image = node.querySelector('.hotel__image');
  const title = node.querySelector('h3');
  const badge = node.querySelector('.badge');
  const desc = node.querySelector('.hotel__description');
  const meta = node.querySelectorAll('.pill');
  const amenities = node.querySelector('.hotel__amenities');
  const cta = node.querySelector('a');

  image.style.backgroundImage = `linear-gradient(135deg, rgba(124,197,255,0.25), rgba(140,240,208,0.18)), url(${imageMap[hotel.image]})`;
  title.textContent = hotel.name;
  badge.textContent = `${hotel.neighborhood}`;
  desc.textContent = hotel.description;

  meta[0].textContent = hotel.neighborhood;
  meta[1].textContent = `Note ${hotel.rating.toFixed(1)}`;
  meta[2].textContent = formatPrice(hotel.price);

  hotel.amenities.forEach((item) => {
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = item;
    amenities.appendChild(pill);
  });

  const mapQuery = encodeURIComponent(`${hotel.neighborhood}, Toronto`);
  cta.href = `https://www.google.com/maps/search/${mapQuery}`;

  grid.appendChild(node);
  return card;
}

function updateCount(count) {
  resultsCount.textContent = `${count} hôtel${count > 1 ? 's' : ''}`;
}

async function refreshHotels(event) {
  if (event) event.preventDefault();
  grid.innerHTML = '';

  const formData = new FormData(form);
  const params = {};
  for (const [key, value] of formData.entries()) {
    if (value) params[key] = value;
  }

  const hotels = await fetchHotels(params);
  hotels.forEach(renderHotelCard);
  updateCount(hotels.length);
}

form.addEventListener('submit', refreshHotels);
resetBtn.addEventListener('click', () => {
  form.reset();
  refreshHotels();
});

refreshHotels();
