/**
 * ЧистыйГород — Основной интерактивный скрипт
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveStatus();
  initMobileNav();
  initStickyHeader();
  initCalculator();
  initCatalog();
  initBeforeAfterSlider();
  initGallery();
  initReviews();
  initModals();
  initBookingForm();
});

/* ==========================================================================
   1. Live Status Check (07:00 - 22:00)
   ========================================================================== */
function initLiveStatus() {
  const statusElements = document.querySelectorAll('.live-status-text');
  const now = new Date();
  const moscowOffset = 3; // UTC+3
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const moscowTime = new Date(utc + (3600000 * moscowOffset));
  const hours = moscowTime.getHours();

  const isOpen = hours >= 7 && hours < 22;
  statusElements.forEach(el => {
    if (isOpen) {
      el.innerHTML = '<span class="status-dot"></span> Сейчас открыто до 22:00';
    } else {
      el.innerHTML = '<span class="status-dot" style="background:#ef4444;box-shadow:0 0 8px #ef4444;"></span> Сейчас закрыто (откроемся в 07:00)';
    }
  });
}

/* ==========================================================================
   2. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

/* ==========================================================================
   3. Sticky Header & Active Section Highlighting
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlight
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   4. Interactive Calculator
   ========================================================================== */
let currentCarClass = 'sedan';
const selectedServices = new Set(['wash-3phase']);

const calcServicesData = [
  { id: 'wash-3phase', title: 'Трехфазная детейлинг-мойка', prices: { sedan: 1800, crossover: 2200, suv: 2600 } },
  { id: 'wheels-deep', title: 'Глубокая очистка дисков + чернение', prices: { sedan: 800, crossover: 1000, suv: 1200 } },
  { id: 'engine-wash', title: 'Мойка двигателя + консервация', prices: { sedan: 3000, crossover: 3500, suv: 4000 } },
  { id: 'polishing-soft', title: 'Мягкая полировка (Глянец)', prices: { sedan: 10000, crossover: 12000, suv: 14000 } },
  { id: 'polishing-deep', title: 'Глубокая абразивная полировка', prices: { sedan: 18000, crossover: 21000, suv: 25000 } },
  { id: 'ceramic-9h', title: 'Керамическое покрытие 9H (2+1)', prices: { sedan: 22000, crossover: 26000, suv: 30000 } },
  { id: 'liquid-glass', title: 'Жидкое стекло (японский состав)', prices: { sedan: 9500, crossover: 11500, suv: 13500 } },
  { id: 'dry-cleaning', title: 'Глубокая химчистка салона', prices: { sedan: 10000, crossover: 12500, suv: 15000 } },
  { id: 'ozonation', title: 'Озонирование и дезинфекция', prices: { sedan: 1500, crossover: 1800, suv: 2000 } },
  { id: 'anti-rain', title: 'Антидождь на все стекла', prices: { sedan: 2500, crossover: 3000, suv: 3500 } }
];

function initCalculator() {
  const carTypeCards = document.querySelectorAll('.car-type-card');
  const servicesContainer = document.getElementById('calc-services-container');
  
  if (!servicesContainer) return;

  // Car class tabs
  carTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      carTypeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentCarClass = card.getAttribute('data-class');
      renderCalcServices();
      updateCalculatorSummary();
    });
  });

  renderCalcServices();
  updateCalculatorSummary();

  // Book with calculation button
  const bookCalcBtn = document.getElementById('book-calculated-btn');
  if (bookCalcBtn) {
    bookCalcBtn.addEventListener('click', () => {
      const selectedNames = [];
      calcServicesData.forEach(s => {
        if (selectedServices.has(s.id)) selectedNames.push(s.title);
      });
      openBookingModal(`Выбран класс: ${getCarClassName(currentCarClass)}. Услуги: ${selectedNames.join(', ')}`);
    });
  }
}

function getCarClassName(c) {
  if (c === 'sedan') return 'Седан / Хэтчбек';
  if (c === 'crossover') return 'Кроссовер';
  return 'Внедорожник / Минивэн';
}

function renderCalcServices() {
  const container = document.getElementById('calc-services-container');
  if (!container) return;

  container.innerHTML = calcServicesData.map(item => {
    const isSelected = selectedServices.has(item.id);
    const price = item.prices[currentCarClass].toLocaleString('ru-RU');
    return `
      <div class="calc-service-item ${isSelected ? 'selected' : ''}" data-id="${item.id}">
        <div class="custom-checkbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="calc-service-info">
          <div class="calc-service-title">${item.title}</div>
          <div class="calc-service-price">${price} ₽</div>
        </div>
      </div>
    `;
  }).join('');

  // Attach toggle listeners
  container.querySelectorAll('.calc-service-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      if (selectedServices.has(id)) {
        selectedServices.delete(id);
      } else {
        selectedServices.add(id);
      }
      el.classList.toggle('selected');
      updateCalculatorSummary();
    });
  });
}

function updateCalculatorSummary() {
  const selectedList = document.getElementById('selected-services-summary');
  const totalPriceEl = document.getElementById('calc-total-price');
  if (!selectedList || !totalPriceEl) return;

  let total = 0;
  let html = '';

  calcServicesData.forEach(item => {
    if (selectedServices.has(item.id)) {
      const price = item.prices[currentCarClass];
      total += price;
      html += `
        <div class="selected-row">
          <span class="selected-row-title">${item.title}</span>
          <span class="selected-row-price">${price.toLocaleString('ru-RU')} ₽</span>
        </div>
      `;
    }
  });

  if (total === 0) {
    selectedList.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem;padding:10px 0;">Выберите одну или несколько услуг слева</div>';
    totalPriceEl.textContent = '0 ₽';
  } else {
    selectedList.innerHTML = html;
    // Apply 10% online discount
    const discountedTotal = Math.round(total * 0.9);
    totalPriceEl.innerHTML = `
      <span style="text-decoration:line-through;color:var(--text-muted);font-size:1.1rem;margin-right:8px;">${total.toLocaleString('ru-RU')} ₽</span>
      <span>${discountedTotal.toLocaleString('ru-RU')} ₽</span>
    `;
  }
}

/* ==========================================================================
   5. Catalog & Filter Tabs
   ========================================================================== */
function initCatalog() {
  const grid = document.getElementById('catalog-grid');
  const tabs = document.querySelectorAll('.catalog-tab');
  if (!grid || typeof detailingServices === 'undefined') return;

  let currentCategory = 'all';

  function render(category) {
    const filtered = category === 'all' 
      ? detailingServices 
      : detailingServices.filter(s => s.category === category);

    grid.innerHTML = filtered.map(service => {
      const priceFrom = service.prices.sedan.toLocaleString('ru-RU');
      return `
        <div class="service-card">
          <div class="service-card-top">
            ${service.popular ? '<div class="service-popular-badge">Популярно</div>' : ''}
            <div class="service-card-meta">
              <span>⏱ ${service.time}</span>
            </div>
            <h3>${service.title}</h3>
            <p>${service.shortDesc}</p>
            <ul class="service-card-features">
              ${service.features.slice(0, 4).map(f => `
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="service-card-bottom">
            <div class="service-price-block">
              <span class="service-price-label">Стоимость от</span>
              <span class="service-price-val">${priceFrom} ₽</span>
            </div>
            <button class="btn btn-outline-gold btn-sm service-book-btn" data-title="${service.title}">
              Записаться
            </button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.service-book-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openBookingModal(`Услуга: ${btn.getAttribute('data-title')}`);
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      render(currentCategory);
    });
  });

  render('all');
}

/* ==========================================================================
   6. Before / After Interactive Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const slider = document.querySelector('.ba-slider');
  const beforeImg = document.querySelector('.ba-before');
  const handle = document.querySelector('.ba-handle');

  if (!slider || !beforeImg || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = slider.getBoundingClientRect();
    let pos = ((x - rect.left) / rect.width) * 100;
    if (pos < 5) pos = 5;
    if (pos > 95) pos = 95;

    beforeImg.style.width = `${pos}%`;
    handle.style.left = `${pos}%`;
  }

  function onMove(e) {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
  }

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', onMove);

  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', onMove, { passive: true });
}

/* ==========================================================================
   7. Gallery & Lightbox
   ========================================================================== */
function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');

  if (!galleryGrid || typeof studioGallery === 'undefined') return;

  galleryGrid.innerHTML = studioGallery.map(photo => `
    <div class="gallery-item" data-full="${photo.src}">
      <img src="${photo.src}" alt="${photo.title}" loading="lazy">
      <div class="gallery-overlay">
        <h4>${photo.title}</h4>
        <p>${photo.subtitle}</p>
      </div>
    </div>
  `).join('');

  galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      if (lightbox && lightboxImg) {
        lightboxImg.src = fullSrc;
        lightbox.classList.add('active');
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }
}

/* ==========================================================================
   8. Authentic Reviews
   ========================================================================== */
function initReviews() {
  const reviewsContainer = document.getElementById('reviews-container');
  if (!reviewsContainer || typeof authenticReviews === 'undefined') return;

  reviewsContainer.innerHTML = authenticReviews.map(r => `
    <div class="review-card">
      <div class="review-card-top">
        <div class="review-header">
          <img src="${r.avatar}" alt="${r.author}" class="review-avatar" onerror="this.src='https://avatars.mds.yandex.net/get-yapic/27503/0d-7/islands-middle'">
          <div class="review-author">
            <h4>${r.author}</h4>
            <span>${r.car}</span>
          </div>
        </div>
        <div class="review-stars">★★★★★</div>
        <div class="review-text">«${r.text}»</div>
      </div>
      <div class="review-date">Яндекс Отзывы • ${r.date}</div>
    </div>
  `).join('');
}

/* ==========================================================================
   9. Modals & Booking Handling
   ========================================================================== */
function initModals() {
  const modalBackdrop = document.getElementById('booking-modal');
  const closeBtns = document.querySelectorAll('.modal-close, .modal-backdrop-close');
  const triggerBtns = document.querySelectorAll('.open-booking-modal');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceParam = btn.getAttribute('data-service') || '';
      openBookingModal(serviceParam);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeAllModals();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function openBookingModal(prefilledNote = '') {
  const modal = document.getElementById('booking-modal');
  const notesField = document.getElementById('modal-booking-notes');
  if (!modal) return;

  if (notesField && prefilledNote) {
    notesField.value = prefilledNote;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

/* ==========================================================================
   10. Form Submission (Simulated Instant Confirmation)
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('online-booking-form');
  const successModal = document.getElementById('success-modal');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const car = form.querySelector('[name="car"]').value;
    const date = form.querySelector('[name="date"]').value;
    const notes = form.querySelector('[name="notes"]').value;

    // Store in localStorage for simulated lead saving
    const booking = {
      name, phone, car, date, notes,
      timestamp: new Date().toISOString()
    };
    const saved = JSON.parse(localStorage.getItem('detailing_leads') || '[]');
    saved.push(booking);
    localStorage.setItem('detailing_leads', JSON.stringify(saved));

    closeAllModals();

    if (successModal) {
      document.getElementById('success-name-display').textContent = name;
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      alert(`Спасибо, ${name}! Ваша заявка принята. Администратор свяжется с вами по номеру ${phone}.`);
    }

    form.reset();
  });
}
