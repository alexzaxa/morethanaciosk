(() => {
  'use strict';

  const IMAGES = Object.freeze({
    hotChocolate: 'assets/images/real-2026/beverages-hot-chocolate.webp',
    guavaBanana: 'assets/images/real-2026/coffee-guava-banana-studio.webp',
    gitesi314: 'assets/images/real-2026/coffee-gitesi-314-studio.webp',
    darkSparrow: 'assets/images/real-2026/coffee-dark-sparrow-studio.webp',
    decaf: 'assets/images/real-2026/coffee-decaf-studio.webp'
  });

  const setImage = (selector, src, alt, root = document) => {
    const image = root.querySelector(selector);
    if (!image) return null;
    image.src = src;
    image.alt = alt;
    image.removeAttribute('srcset');
    return image;
  };

  const installStyles = () => {
    if (document.getElementById('photo-fix-styles')) return;

    const style = document.createElement('style');
    style.id = 'photo-fix-styles';
    style.textContent = `
      .coffee-cup-showcase.real-coffee-packs {
        display: grid !important;
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 14px !important;
        align-items: stretch;
      }

      .real-coffee-packs .coffee-cup-card {
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      }

      .real-coffee-packs .coffee-cup-card img {
        width: 100% !important;
        height: clamp(220px, 24vw, 330px) !important;
        padding: 8px !important;
        border-radius: 18px;
        background: #f8f5ee;
        object-fit: contain !important;
        object-position: center !important;
        filter: drop-shadow(0 12px 18px rgba(12, 9, 7, .16));
      }

      .real-coffee-packs .coffee-cup-card strong,
      .real-coffee-packs .coffee-cup-card > span:not(.coffee-cup-badge) {
        text-align: center;
      }

      .catalog-panel-head--beverages img {
        object-fit: cover !important;
        object-position: 70% 55% !important;
      }

      body[data-page="coffee"] .page-hero-image {
        padding: 0 !important;
        background: transparent !important;
        object-fit: cover !important;
        object-position: center 58% !important;
      }

      @media (max-width: 980px) {
        .coffee-cup-showcase.real-coffee-packs {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }

      @media (max-width: 620px) {
        .coffee-cup-showcase.real-coffee-packs {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 10px !important;
        }

        .real-coffee-packs .coffee-cup-card {
          padding-inline: 6px;
        }

        .real-coffee-packs .coffee-cup-card img {
          height: 190px !important;
          padding: 4px !important;
          border-radius: 14px;
        }

        .real-coffee-packs .coffee-cup-card strong {
          font-size: .9rem;
        }

        .real-coffee-packs .coffee-cup-card > span:not(.coffee-cup-badge) {
          min-height: 2.5em;
          font-size: .7rem;
          line-height: 1.35;
        }

        .catalog-panel-head--beverages img {
          object-position: 74% 54% !important;
        }
      }
    `;

    document.head.appendChild(style);
  };

  const fixCoffeePackages = () => {
    if (document.body?.dataset.page !== 'home') return;

    const showcase = document.querySelector('.coffee-cup-showcase');
    if (!showcase) return;

    const products = [
      [IMAGES.guavaBanana, 'Guava Banana', 'Σκούρα σοκολάτα · κόκκινα φρούτα', 'Συσκευασία καφέ Hand Pickers Guava Banana'],
      [IMAGES.gitesi314, 'Gitesi #314', 'Βερίκοκο · ιβίσκος · καραμέλα', 'Συσκευασία καφέ Hand Pickers Gitesi 314'],
      [IMAGES.darkSparrow, 'Dark Sparrow', 'Espresso blend · 100% Arabica', 'Συσκευασία καφέ Hand Pickers Dark Sparrow'],
      [IMAGES.decaf, 'Decaffeinated', 'Χωρίς καφεΐνη · πλούσια γεύση', 'Συσκευασία καφέ Hand Pickers Decaffeinated']
    ];

    showcase.classList.add('real-coffee-packs');
    showcase.innerHTML = products.map(([src, name, description, alt], index) => `
      <article class="coffee-cup-card${index === 2 ? ' coffee-cup-card-featured' : ''}">
        ${index === 2 ? '<span class="coffee-cup-badge">Αγαπημένο</span>' : ''}
        <img alt="${alt}" height="1000" loading="lazy" src="${src}" width="800"/>
        <strong>${name}</strong>
        <span>${description}</span>
      </article>
    `).join('');
  };

  const fixMenuPhotography = () => {
    if (document.body?.dataset.page !== 'menu') return;

    setImage(
      '#coffee .catalog-panel-head img',
      'assets/images/menu-stock/coffee-menu.webp',
      'Καφές espresso και freddo από τις 06:00'
    );

    setImage(
      '#beverages .catalog-panel-head img',
      IMAGES.hotChocolate,
      'Ζεστή σοκολάτα με σαντιγί και ρόφημα τσαγιού'
    );

    setImage(
      '#cocktails .catalog-panel-head img',
      'assets/images/real-2026/cocktails-waterfront-01.svg',
      'Cocktails δίπλα στη θάλασσα στο Χαλκούτσι'
    );

    setImage(
      '#refreshments .catalog-panel-head img',
      'assets/images/real-2026/storefront-kiosk-01.svg',
      'Αναψυκτικά, μπύρες και προϊόντα στο More Than a Kiosk'
    );
  };

  const fixCoffeeLandingHero = () => {
    if (document.body?.dataset.page !== 'coffee') return;

    const hero = setImage(
      '.page-hero-image',
      'assets/images/menu-stock/coffee-menu.webp',
      'Καφές espresso και freddo στο More Than Coffee'
    );

    hero?.classList.remove('product-pack-hero');
  };

  const fixHomeGalleryDuplicates = () => {
    if (document.body?.dataset.page !== 'home') return;

    const mosaic = document.querySelector('.photo-mosaic.kiosk-mosaic');
    if (!mosaic) return;

    const photos = [
      [
        'assets/images/real-2026/storefront-front.svg',
        'mosaic-wide',
        'Η πραγματική πρόσοψη του More Than a Kiosk',
        'Η πρόσοψη του More Than a Kiosk στο Χαλκούτσι'
      ],
      [
        'assets/images/real-2026/storefront-kiosk-01.svg',
        '',
        'Η βιτρίνα και η μεγάλη ποικιλία του καταστήματος',
        'Η βιτρίνα και τα προϊόντα του More Than a Kiosk'
      ],
      [
        'assets/images/real-2026/seaside-seating-02.svg',
        'mosaic-wide',
        'Το παραθαλάσσιο καθιστικό δίπλα στο λιμανάκι',
        'Καθιστικό του More Than a Kiosk με θέα στη θάλασσα'
      ],
      [
        'assets/images/real-2026/waterfront-sunset-02.svg',
        'mosaic-tall',
        'Το ηλιοβασίλεμα από το More Than a Kiosk',
        'Ηλιοβασίλεμα στο Χαλκούτσι δίπλα στη θάλασσα'
      ],
      [
        'assets/images/real-2026/cocktails-waterfront-03.svg',
        'mosaic-wide',
        'Cocktails με θέα το νερό',
        'Cocktails στο παραθαλάσσιο τραπέζι'
      ],
      [
        IMAGES.hotChocolate,
        '',
        'Ζεστή σοκολάτα και τσάι',
        'Ζεστή σοκολάτα σε ζεστή ατμόσφαιρα καφέ'
      ]
    ];

    mosaic.innerHTML = photos.map(([src, className, caption, alt]) => `
      <button class="mosaic-photo ${className}" data-caption="${caption}" data-lightbox="${src}" type="button">
        <img alt="${alt}" loading="lazy" src="${src}"/>
      </button>
    `).join('');
  };

  const applyFixes = () => {
    installStyles();
    fixCoffeePackages();
    fixMenuPhotography();
    fixCoffeeLandingHero();
    fixHomeGalleryDuplicates();
  };

  const schedule = () => {
    window.setTimeout(applyFixes, 80);
    window.setTimeout(applyFixes, 450);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
})();
