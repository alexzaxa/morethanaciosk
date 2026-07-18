(() => {
  'use strict';

  const IMAGES = Object.freeze({
    hotChocolate: 'assets/images/real-2026/beverages-hot-chocolate.webp',
    guavaBanana: 'assets/images/real-2026/coffee-guava-banana-studio.webp',
    gitesi314: 'assets/images/real-2026/coffee-gitesi-314-studio.webp',
    darkSparrow: 'assets/images/real-2026/coffee-dark-sparrow-studio.webp',
    decaf: 'assets/images/real-2026/coffee-decaf-studio.webp',
    cocktailTopdown: 'assets/images/real-2026/cocktail-topdown-menu.webp',
    cocktailHandheld: 'assets/images/real-2026/cocktail-handheld-menu.webp'
  });

  const random = (min, max) => Math.random() * (max - min) + min;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');

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

      body[data-page="menu"] .official-menu-hero-image {
        object-fit: cover !important;
        object-position: center 48% !important;
      }

      body[data-page="menu"] #cocktails .catalog-panel-head img {
        object-fit: cover !important;
        object-position: center 48% !important;
      }

      .menu-ambient-field {
        position: fixed;
        inset: 0;
        z-index: 92;
        overflow: hidden;
        pointer-events: none;
        contain: strict;
      }

      .menu-ambient-item {
        position: absolute;
        top: -100px;
        left: var(--ambient-left, 50%);
        opacity: var(--ambient-opacity, .11);
        transform: rotate(var(--ambient-rotate, 0deg));
        will-change: transform;
      }

      .menu-ambient-item--bean {
        width: calc(var(--ambient-size, 18px) * .72);
        height: var(--ambient-size, 18px);
        border-radius: 58% 42% 58% 42%;
        background:
          radial-gradient(circle at 30% 24%, rgba(255,255,255,.34), transparent 18%),
          linear-gradient(145deg, #9a6845, #3d271c 72%);
        box-shadow: 0 5px 10px rgba(34, 23, 17, .18);
      }

      .menu-ambient-item--bean::after {
        content: "";
        position: absolute;
        top: 8%;
        bottom: 8%;
        left: 49%;
        width: 1px;
        border-radius: 999px;
        background: rgba(255, 222, 185, .52);
        transform: rotate(17deg);
      }

      .menu-ambient-item--highball {
        width: calc(var(--ambient-size, 24px) * .72);
        height: calc(var(--ambient-size, 24px) * 1.15);
        border: 1px solid rgba(255,255,255,.76);
        border-radius: 4px 4px 8px 8px;
        background:
          radial-gradient(circle at 30% 25%, rgba(255,255,255,.66) 0 9%, transparent 10%),
          radial-gradient(circle at 68% 38%, rgba(255,255,255,.52) 0 8%, transparent 9%),
          linear-gradient(to top, rgba(238,101,47,.82) 0 66%, rgba(255,222,158,.64) 67% 100%);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.18), 0 7px 14px rgba(36,22,16,.14);
      }

      .menu-ambient-item--highball::before {
        content: "";
        position: absolute;
        right: -2px;
        top: -45%;
        width: 2px;
        height: 62%;
        border-radius: 999px;
        background: rgba(30,25,22,.78);
        transform: rotate(10deg);
        transform-origin: bottom;
      }

      .menu-ambient-item--highball::after {
        content: "";
        position: absolute;
        right: -5px;
        top: -5px;
        width: 11px;
        height: 6px;
        border-radius: 50%;
        background: linear-gradient(90deg, #f4a332, #ffdf70);
        transform: rotate(-18deg);
      }

      .menu-ambient-item--martini {
        width: calc(var(--ambient-size, 30px) * 1.05);
        height: calc(var(--ambient-size, 30px) * 1.15);
      }

      .menu-ambient-item--martini::before {
        content: "";
        position: absolute;
        inset: 0 0 38% 0;
        clip-path: polygon(0 0, 100% 0, 50% 100%);
        background:
          radial-gradient(circle at 65% 26%, #9ed367 0 8%, transparent 9%),
          linear-gradient(180deg, rgba(255,255,255,.72), rgba(245,145,83,.72));
        border-top: 1px solid rgba(255,255,255,.86);
        filter: drop-shadow(0 5px 9px rgba(36,22,16,.12));
      }

      .menu-ambient-item--martini::after {
        content: "";
        position: absolute;
        left: calc(50% - 1px);
        top: 59%;
        width: 2px;
        height: 35%;
        background: rgba(255,255,255,.82);
        box-shadow: -9px 11px 0 0 rgba(255,255,255,.72), 9px 11px 0 0 rgba(255,255,255,.72);
      }

      .menu-ambient-item--bottle {
        width: calc(var(--ambient-size, 25px) * .58);
        height: calc(var(--ambient-size, 25px) * 1.5);
        border: 1px solid rgba(255,255,255,.5);
        border-radius: 5px 5px 8px 8px;
        background: linear-gradient(145deg, var(--bottle-light, #d3aa64), var(--bottle-dark, #5d321e));
        box-shadow: inset 3px 0 5px rgba(255,255,255,.18), 0 8px 16px rgba(29,21,18,.17);
      }

      .menu-ambient-item--bottle::before {
        content: "";
        position: absolute;
        left: 28%;
        right: 28%;
        bottom: 100%;
        height: 30%;
        border-radius: 3px 3px 0 0;
        background: var(--bottle-neck, #292724);
        box-shadow: inset 1px 0 2px rgba(255,255,255,.18);
      }

      .menu-ambient-item--bottle b {
        position: absolute;
        left: 8%;
        right: 8%;
        top: 39%;
        padding: 2px 1px;
        overflow: hidden;
        border-radius: 2px;
        background: rgba(249,244,229,.86);
        color: #211f1d;
        font: 800 4px/1 Arial, sans-serif;
        letter-spacing: -.02em;
        text-align: center;
        text-overflow: clip;
        white-space: nowrap;
      }

      .menu-ambient-field.is-css-fallback .menu-ambient-item {
        animation: mixedMenuFall var(--ambient-duration, 12s) linear var(--ambient-delay, 0s) infinite;
      }

      @keyframes mixedMenuFall {
        from { transform: translate3d(0, -14vh, 0) rotate(0deg); }
        to { transform: translate3d(var(--ambient-drift, 24px), 118vh, 0) rotate(540deg); }
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

        body[data-page="menu"] .official-menu-hero-image {
          object-position: 54% 50% !important;
        }

        body[data-page="menu"] #cocktails .catalog-panel-head img {
          object-position: center 46% !important;
        }

        .menu-ambient-item {
          opacity: min(var(--ambient-opacity, .08), .085);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .menu-ambient-field { display: none !important; }
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
      '.official-menu-hero-image',
      IMAGES.cocktailHandheld,
      'Ροζ cocktail με lime μπροστά στη θάλασσα στο Χαλκούτσι'
    );

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
      IMAGES.cocktailTopdown,
      'Ροζ cocktail με lime και πάγο φωτογραφημένο από πάνω'
    );

    setImage(
      '#refreshments .catalog-panel-head img',
      'assets/images/real-2026/storefront-kiosk-01.svg',
      'Αναψυκτικά, μπύρες και προϊόντα στο More Than a Kiosk'
    );
  };

  const buildAmbientItem = (blueprint) => {
    const item = document.createElement('span');
    item.className = `menu-ambient-item menu-ambient-item--${blueprint.kind}`;
    item.style.setProperty('--ambient-left', `${random(1, 98).toFixed(2)}%`);
    item.style.setProperty('--ambient-size', `${random(blueprint.minSize, blueprint.maxSize).toFixed(1)}px`);
    item.style.setProperty('--ambient-opacity', random(blueprint.minOpacity, blueprint.maxOpacity).toFixed(3));
    item.style.setProperty('--ambient-rotate', `${random(-100, 100).toFixed(0)}deg`);
    item.style.setProperty('--ambient-duration', `${random(10, 18).toFixed(2)}s`);
    item.style.setProperty('--ambient-delay', `${random(-17, 0).toFixed(2)}s`);
    item.style.setProperty('--ambient-drift', `${random(-90, 90).toFixed(0)}px`);

    if (blueprint.brand) {
      item.style.setProperty('--bottle-light', blueprint.light);
      item.style.setProperty('--bottle-dark', blueprint.dark);
      item.style.setProperty('--bottle-neck', blueprint.neck || blueprint.dark);
      item.innerHTML = `<b>${blueprint.brand}</b>`;
    }

    return item;
  };

  const fixMenuAmbient = () => {
    if (document.body?.dataset.page !== 'menu') return;

    document.querySelectorAll('.coffee-bean-field').forEach((field) => field.remove());
    if (reducedMotion.matches || document.querySelector('.menu-ambient-field')) return;

    const blueprints = [
      { kind: 'bean', minSize: 12, maxSize: 22, minOpacity: .045, maxOpacity: .11 },
      { kind: 'highball', minSize: 22, maxSize: 34, minOpacity: .055, maxOpacity: .12 },
      { kind: 'martini', minSize: 26, maxSize: 39, minOpacity: .05, maxOpacity: .11 },
      { kind: 'bottle', brand: 'APEROL', light: '#ee7a24', dark: '#a3291f', neck: '#243347', minSize: 24, maxSize: 36, minOpacity: .06, maxOpacity: .13 },
      { kind: 'bottle', brand: 'ABSOLUT', light: '#cce9ee', dark: '#5aa3b5', neck: '#c5dce8', minSize: 24, maxSize: 35, minOpacity: .055, maxOpacity: .12 },
      { kind: 'bottle', brand: 'BACARDI', light: '#e9e4d3', dark: '#8d7d63', neck: '#151515', minSize: 24, maxSize: 35, minOpacity: .055, maxOpacity: .12 },
      { kind: 'bottle', brand: 'TANQUERAY', light: '#60a174', dark: '#185838', neck: '#a83b31', minSize: 24, maxSize: 35, minOpacity: .055, maxOpacity: .12 },
      { kind: 'bottle', brand: 'JACK D.', light: '#8e6844', dark: '#2b1b13', neck: '#17120f', minSize: 24, maxSize: 35, minOpacity: .055, maxOpacity: .12 }
    ];

    const field = document.createElement('div');
    field.className = 'menu-ambient-field';
    field.setAttribute('aria-hidden', 'true');

    const count = mobile.matches ? 9 : 18;
    for (let index = 0; index < count; index += 1) {
      const blueprint = blueprints[index % blueprints.length];
      field.appendChild(buildAmbientItem(blueprint));
    }

    document.body.appendChild(field);

    if (!window.anime) {
      field.classList.add('is-css-fallback');
      return;
    }

    field.querySelectorAll('.menu-ambient-item').forEach((item, index) => {
      window.anime({
        targets: item,
        translateY: [random(-160, -40), window.innerHeight + random(100, 280)],
        translateX: [random(-32, 32), random(-110, 110)],
        rotate: [random(-130, 130), random(380, 760)],
        duration: random(10000, 18500),
        delay: index * 210 + random(0, 2300),
        easing: 'linear',
        loop: true
      });
    });
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
    fixMenuAmbient();
    fixCoffeeLandingHero();
    fixHomeGalleryDuplicates();
  };

  const schedule = () => {
    window.setTimeout(applyFixes, 80);
    window.setTimeout(applyFixes, 450);
    window.setTimeout(applyFixes, 1100);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
})();