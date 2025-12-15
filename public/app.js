const grid = document.getElementById('hotel-grid');
const template = document.getElementById('hotel-card-template');
const form = document.getElementById('filter-form');
const resetBtn = document.getElementById('reset');
const resultsCount = document.getElementById('results-count');
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');
const phoneInput = document.getElementById('phone');
let iti;

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

function setContactMessage(type, message) {
  if (!contactMessage) return;
  contactMessage.textContent = message;
  contactMessage.dataset.type = type;
}

async function submitContact(event) {
  event.preventDefault();
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());
  const name = (payload.name || '').trim();
  const email = (payload.email || '').trim();
  const company = (payload.company || '').trim();
  const phone = iti ? iti.getNumber() : (payload.phone || '').trim();

  if (!name) {
    setContactMessage('error', 'Merci d’indiquer votre nom.');
    return;
  }

  if (!email && !phone) {
    setContactMessage('error', 'Renseignez au moins un email ou un téléphone.');
    return;
  }

  if (!company) {
    setContactMessage('error', 'Merci de renseigner votre entreprise.');
    return;
  }

  payload.name = name;
  payload.email = email || null;
  payload.phone = phone || null;
  payload.company = company;
  payload.message = (payload.message || '').trim();

  if (submitBtn) submitBtn.disabled = true;
  setContactMessage('info', 'Envoi en cours...');

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erreur lors de l\'envoi');
    }

    contactForm.reset();
    setContactMessage('success', 'Merci ! Votre demande a été envoyée.');
  } catch (err) {
    setContactMessage('error', err.message || 'Impossible d\'envoyer le formulaire');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
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

if (contactForm) {
  if (phoneInput && window.intlTelInput) {
    iti = window.intlTelInput(phoneInput, {
      preferredCountries: ['ca', 'fr', 'be', 'uk'],
      initialCountry: 'ca',
      separateDialCode: false,
      autoPlaceholder: 'polite',
      nationalMode: false
    });
  }

  contactForm.addEventListener('submit', (event) => {
    if (iti && phoneInput.value.trim() && !iti.isValidNumber()) {
      event.preventDefault();
      setContactMessage('error', 'Numéro de téléphone invalide pour ce pays.');
      return;
    }
    submitContact(event);
  });
}
