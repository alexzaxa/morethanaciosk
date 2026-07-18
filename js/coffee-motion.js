(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');
  const body = document.body;
  if (!body) return;

  const random = (min, max) => Math.random() * (max - min) + min;
  const realBase = 'assets/images/real-2026/';

  const realImages = {
    waterfrontSunset01: { file: 'waterfront-sunset-01.svg', width: 1000, height: 1500 },
    cocktails01: { file: 'cocktails-waterfront-01.svg', width: 1500, height: 1000 },
    cocktails02: { file: 'cocktails-waterfront-02.svg', width: 1500, height: 1000 },
    cocktails03: { file: 'cocktails-waterfront-03.svg', width: 1500, height: 1000 },
    storefrontFront: { file: 'storefront-front.svg', width: 1500, height: 1000 },
    storefrontWide01: { file: 'storefront-wide-01.svg', width: 1500, height: 1000 },
    storefrontWide02: { file: 'storefront-wide-02.svg', width: 1500, height: 1000 },
    seaside01: { file: 'seaside-seating-01.svg', width: 1500, height: 1000 },
    seaside02: { file: 'seaside-seating-02.svg', width: 1500, height: 1000 },
    storefrontKiosk01: { file: 'storefront-kiosk-01.svg', width: 1500, height: 1000 },
    storefrontKiosk02: { file: 'storefront-kiosk-02.svg', width: 1500, height: 1000 },
    waterfrontSunset02: { file: 'waterfront-sunset-02.svg', width: 1000, height: 1500 },
    waterfrontSunset03: { file: 'waterfront-sunset-03.svg', width: 1000, height: 1500 },
    waterfrontSunset04: { file: 'waterfront-sunset-04.svg', width: 1000, height: 1500 },
    waterfrontSunset05: { file: 'waterfront-sunset-05.svg', width: 1000, height: 1500 },
    guavaBanana: { file: 'coffee-guava-banana.svg', width: 960, height: 1200 },
    gitesi314: { file: 'coffee-gitesi-314.svg', width: 960, height: 1200 },
    darkSparrow: { file: 'coffee-dark-sparrow.svg', width: 960, height: 1200 },
    decaf: { file: 'coffee-decaffeinated.svg', width: 960, height: 1200 }
  };

  const realSrc = (image) => `${realBase}${image.file}`;

  function setImage(selector, image, alt, root = document) {
    const element = root.querySelector(selector);
    if (!element) return null;
    element.src = realSrc(image);
    element.alt = alt;
    element.width = image.width;
    element.height = image.height;
    element.removeAttribute('srcset');
    return element;
  }

  function installRealPhotoStyles() {
    if (document.getElementById('real-photo-overrides')) return;
    const style = document.createElement('style');
    style.id = 'real-photo-overrides';
    style.textContent = `
      .coffee-cup-showcase.real-coffee-packs {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
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
        width: 100%;
        height: clamp(210px, 23vw, 315px);
        padding: 8px;
        border-radius: 18px;
        background: #fff;
        object-fit: contain;
        object-position: center;
        filter: drop-shadow(0 12px 18px rgba(12, 9, 7, .16));
      }
      .real-coffee-packs .coffee-cup-card strong {
        margin-top: 10px;
        text-align: center;
      }
      .real-coffee-packs .coffee-cup-card > span:not(.coffee-cup-badge) {
        min-height: 2.8em;
        text-align: center;
      }
      .kiosk-category-card.category-product {
        background: linear-gradient(145deg, #f8f3ea, #fff);
      }
      .kiosk-category-card.category-product img {
        padding: clamp(18px, 3vw, 38px);
        object-fit: contain;
        object-position: center;
      }
      .kiosk-category-card.category-product::after {
        background: linear-gradient(180deg, rgba(21,20,18,.02), rgba(21,20,18,.72));
      }
      .page-hero-image.product-pack-hero {
        padding: clamp(12px, 2.4vw, 28px);
        background: #fff;
        object-fit: contain;
        object-position: center;
      }
      .hero-collage .hero-photo img,
      .story-card > img,
      .kiosk-category-card > img,
      .page-hero-image,
      .official-menu-hero-image {
        image-rendering: auto;
      }
      .photo-mosaic .mosaic-photo img {
        background: #e9e4dc;
      }
      @media (max-width: 980px) {
        .coffee-cup-showcase.real-coffee-packs {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 620px) {
        .coffee-cup-showcase.real-coffee-packs {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .real-coffee-packs .coffee-cup-card {
          padding-inline: 8px;
        }
        .real-coffee-packs .coffee-cup-card img {
          height: 190px;
          padding: 4px;
          border-radius: 14px;
        }
        .real-coffee-packs .coffee-cup-card strong {
          font-size: .92rem;
        }
        .real-coffee-packs .coffee-cup-card > span:not(.coffee-cup-badge) {
          min-height: 2.5em;
          font-size: .72rem;
          line-height: 1.35;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function hydrateCoffeePackages() {
    const showcase = document.querySelector('.coffee-cup-showcase');
    if (!showcase) return;
    const products = [
      {
        image: realImages.guavaBanana,
        name: 'Guava Banana',
        description: 'Σκούρα σοκολάτα · κόκκινα φρούτα',
        alt: 'Συσκευασία καφέ Hand Pickers Guava Banana'
      },
      {
        image: realImages.gitesi314,
        name: 'Gitesi #314',
        description: 'Βερίκοκο · ιβίσκος · καραμέλα',
        alt: 'Συσκευασία καφέ Hand Pickers Gitesi 314'
      },
      {
        image: realImages.darkSparrow,
        name: 'Dark Sparrow',
        description: 'Espresso blend · 100% Arabica',
        alt: 'Συσκευασία καφέ Hand Pickers Dark Sparrow',
        featured: true
      },
      {
        image: realImages.decaf,
        name: 'Decaffeinated',
        description: 'Χωρίς καφεΐνη · πλούσια γεύση',
        alt: 'Συσκευασία καφέ Hand Pickers Decaffeinated'
      }
    ];

    showcase.classList.add('real-coffee-packs');
    showcase.innerHTML = products.map((product) => `
      <article class="coffee-cup-card${product.featured ? ' coffee-cup-card-featured' : ''}">
        ${product.featured ? '<span class="coffee-cup-badge">Αγαπημένο</span>' : ''}
        <img alt="${product.alt}" height="${product.image.height}" loading="lazy" src="${realSrc(product.image)}" width="${product.image.width}"/>
        <strong>${product.name}</strong>
        <span>${product.description}</span>
      </article>
    `).join('');
  }

  function hydrateHomeGallery() {
    const mosaic = document.querySelector('.photo-mosaic.kiosk-mosaic');
    if (!mosaic) return;

    const gallery = [
      [realImages.storefrontWide01, 'mosaic-wide', 'Η πρόσοψη του More Than a Kiosk στην πλατεία Χαλκουτσίου', 'Η πρόσοψη του More Than a Kiosk στο Χαλκούτσι'],
      [realImages.cocktails01, 'mosaic-wide', 'Δύο δροσερά cocktails δίπλα στη θάλασσα', 'Cocktails στο παραθαλάσσιο τραπέζι του More Than a Kiosk'],
      [realImages.waterfrontSunset01, 'mosaic-tall', 'Ηλιοβασίλεμα και θέα από το παραθαλάσσιο καθιστικό', 'Ηλιοβασίλεμα στο Χαλκούτσι από το More Than a Kiosk'],
      [realImages.storefrontFront, '', 'Η είσοδος, ο καφές και η παιδική γωνιά του καταστήματος', 'Η πρόσοψη και η παιδική γωνιά του More Than a Kiosk'],
      [realImages.seaside01, 'mosaic-wide', 'Το εξωτερικό καθιστικό δίπλα στο νερό', 'Το παραθαλάσσιο καθιστικό του More Than a Kiosk'],
      [realImages.waterfrontSunset02, 'mosaic-tall', 'Βραδινή ατμόσφαιρα στην άκρη της θάλασσας', 'Παραθαλάσσια ατμόσφαιρα στο ηλιοβασίλεμα'],
      [realImages.cocktails02, '', 'Cocktails με θέα το λιμανάκι', 'Δύο cocktails με φόντο τη θάλασσα'],
      [realImages.storefrontKiosk01, 'mosaic-wide', 'Η μεγάλη ποικιλία προϊόντων στο More Than a Kiosk', 'Η βιτρίνα και τα προϊόντα του More Than a Kiosk'],
      [realImages.seaside02, '', 'Τραπέζια και θέα προς το λιμάνι', 'Εξωτερικά τραπέζια με θέα στη θάλασσα'],
      [realImages.waterfrontSunset03, 'mosaic-tall', 'Χρώματα του δειλινού στο Χαλκούτσι', 'Ηλιοβασίλεμα και θάλασσα στο Χαλκούτσι'],
      [realImages.cocktails03, 'mosaic-wide', 'Καλοκαιρινά cocktails μπροστά στη θάλασσα', 'Cocktails δίπλα στη θάλασσα στο Χαλκούτσι'],
      [realImages.storefrontWide02, 'mosaic-wide', 'Το κατάστημα στην καρδιά της παραλιακής πλατείας', 'Ευρεία άποψη του More Than a Kiosk'],
      [realImages.storefrontKiosk02, '', 'Η βιτρίνα του περιπτέρου και του coffee bar', 'Το More Than a Kiosk και η βιτρίνα του'],
      [realImages.waterfrontSunset04, 'mosaic-tall', 'Ήρεμο απόγευμα δίπλα στο νερό', 'Απογευματινή θέα από το παραθαλάσσιο σημείο'],
      [realImages.waterfrontSunset05, 'mosaic-tall', 'Η παραλία του Χαλκουτσίου την ώρα του ηλιοβασιλέματος', 'Ηλιοβασίλεμα στην παραλία Χαλκουτσίου']
    ];

    mosaic.innerHTML = gallery.map(([image, className, caption, alt]) => `
      <button class="mosaic-photo ${className}" data-caption="${caption}" data-lightbox="${realSrc(image)}" type="button">
        <img alt="${alt}" height="${image.height}" loading="lazy" src="${realSrc(image)}" width="${image.width}"/>
      </button>
    `).join('');
  }

  function hydrateHomePhotos() {
    if (body.dataset.page !== 'home') return;

    setImage('.hero-photo-main img', realImages.storefrontWide01, 'Η πρόσοψη του More Than a Kiosk στο Χαλκούτσι');
    setImage('.hero-photo-top img', realImages.cocktails01, 'Δύο cocktails με θέα στη θάλασσα στο Χαλκούτσι');
    setImage('.hero-photo-bottom img', realImages.waterfrontSunset01, 'Ηλιοβασίλεμα στο παραθαλάσσιο More Than a Kiosk');
    setImage('.story-card > img', realImages.seaside01, 'Το πραγματικό παραθαλάσσιο καθιστικό του More Than a Kiosk');

    const categoryCards = [...document.querySelectorAll('.kiosk-category-card')];
    if (categoryCards[0]) {
      categoryCards[0].classList.add('category-product');
      setImage('img', realImages.darkSparrow, 'Καφές Hand Pickers Dark Sparrow', categoryCards[0]);
    }
    if (categoryCards[1]) setImage('img', realImages.cocktails02, 'Cocktails δίπλα στη θάλασσα', categoryCards[1]);
    if (categoryCards[2]) setImage('img', realImages.cocktails03, 'Signature cocktail στο Χαλκούτσι', categoryCards[2]);
    if (categoryCards[3]) setImage('img', realImages.storefrontFront, 'Η μεγάλη ποικιλία του More Than a Kiosk', categoryCards[3]);

    hydrateCoffeePackages();
    hydrateHomeGallery();
  }

  function hydratePagePhotos() {
    const page = body.dataset.page;

    if (page === 'coffee') {
      const hero = setImage('.page-hero-image', realImages.darkSparrow, 'Καφές Hand Pickers Dark Sparrow στο More Than Coffee');
      hero?.classList.add('product-pack-hero');
    } else if (page === 'cocktails') {
      setImage('.page-hero-image', realImages.cocktails02, 'Cocktails δίπλα στη θάλασσα στο More Than Coffee and Cocktail');
    } else if (page === 'kiosk') {
      setImage('.page-hero-image', realImages.storefrontKiosk01, 'Η πρόσοψη και η μεγάλη ποικιλία του More Than a Kiosk');
    } else if (page === 'menu') {
      setImage('.official-menu-hero-image', realImages.cocktails01, 'Ο καφές και τα cocktails του More Than a Kiosk δίπλα στη θάλασσα');
    } else if (page === 'contact') {
      setImage('.contact-visual > img', realImages.storefrontFront, 'Η πρόσοψη του More Than a Kiosk στο Χαλκούτσι');
    } else if (page === 'directions') {
      setImage('.page-hero-image', realImages.storefrontWide02, 'Το More Than a Kiosk στην Ποσειδώνος 13 στο Χαλκούτσι');
    }
  }

  function installRealPhotos() {
    installRealPhotoStyles();
    hydrateHomePhotos();
    hydratePagePhotos();
  }

  function addAosAttributes() {
    const groups = [...document.querySelectorAll('.catalog-group')];
    groups.forEach((element, index) => {
      if (!element.dataset.aos) element.dataset.aos = 'fade-up';
      element.dataset.aosDuration = String(560 + (index % 3) * 70);
      element.dataset.aosDelay = String(Math.min((index % 3) * 65, 130));
    });

    const selectors = [
      '.quick-card', '.story-card', '.story-copy', '.kiosk-category-card',
      '.mosaic-photo', '.info-card', '.map-card', '.offer-card',
      '.contact-visual', '.bottle-pricing', '.official-menu-note'
    ];

    document.querySelectorAll(selectors.join(',')).forEach((element, index) => {
      if (!element.dataset.aos) element.dataset.aos = index % 2 ? 'fade-up' : 'zoom-in-up';
      element.dataset.aosDuration = element.dataset.aosDuration || '720';
      element.dataset.aosDelay = element.dataset.aosDelay || String(Math.min((index % 4) * 55, 165));
    });
  }

  function initAos() {
    if (reducedMotion.matches || !window.AOS) return;
    document.documentElement.classList.add('aos-ready');
    window.AOS.init({
      once: true,
      mirror: false,
      offset: 54,
      duration: 720,
      easing: 'ease-out-cubic',
      anchorPlacement: 'top-bottom'
    });
  }

  function createCoffeeBeanField() {
    if (body.dataset.page !== 'menu' || reducedMotion.matches) return;

    const field = document.createElement('div');
    field.className = 'coffee-bean-field';
    field.setAttribute('aria-hidden', 'true');
    const count = mobile.matches ? 8 : 15;

    for (let index = 0; index < count; index += 1) {
      const bean = document.createElement('span');
      bean.className = 'coffee-bean';
      bean.style.setProperty('--bean-left', `${random(1, 98).toFixed(2)}%`);
      bean.style.setProperty('--bean-size', `${random(11, mobile.matches ? 19 : 24).toFixed(1)}px`);
      bean.style.setProperty('--bean-opacity', random(.055, .14).toFixed(3));
      bean.style.setProperty('--bean-rotate', `${random(-80, 80).toFixed(0)}deg`);
      bean.style.setProperty('--bean-duration', `${random(9, 16).toFixed(2)}s`);
      bean.style.setProperty('--bean-delay', `${random(-15, 0).toFixed(2)}s`);
      bean.style.setProperty('--bean-drift', `${random(-80, 80).toFixed(0)}px`);
      field.appendChild(bean);
    }

    body.appendChild(field);

    if (!window.anime) {
      field.classList.add('is-css-fallback');
      return;
    }

    field.querySelectorAll('.coffee-bean').forEach((bean, index) => {
      const startY = random(-140, -30);
      const endY = window.innerHeight + random(80, 260);
      window.anime({
        targets: bean,
        translateY: [startY, endY],
        translateX: [random(-28, 28), random(-100, 100)],
        rotate: [random(-120, 120), random(380, 760)],
        duration: random(9000, 17000),
        delay: index * 240 + random(0, 2200),
        easing: 'linear',
        loop: true
      });
    });
  }

  function addCoffeeSteam() {
    if (body.dataset.page !== 'menu') return;
    const coffeeHeader = document.querySelector('#coffee .catalog-panel-head');
    if (!coffeeHeader || coffeeHeader.querySelector('.coffee-steam')) return;
    const steam = document.createElement('div');
    steam.className = 'coffee-steam';
    steam.setAttribute('aria-hidden', 'true');
    steam.innerHTML = '<span></span><span></span><span></span>';
    coffeeHeader.appendChild(steam);
  }

  function animateMenuItems() {
    if (body.dataset.page !== 'menu' || reducedMotion.matches || !window.anime || !('IntersectionObserver' in window)) return;
    body.classList.add('motion-enhanced');
    const groups = [...document.querySelectorAll('.catalog-group')];
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const items = [...entry.target.querySelectorAll('.menu-price-list > li')];
        items.forEach((item) => item.classList.add('motion-stagger-item'));
        window.anime({
          targets: items,
          opacity: [0, 1],
          translateX: [-13, 0],
          delay: window.anime.stagger(34),
          duration: 460,
          easing: 'easeOutQuad'
        });
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    groups.forEach((group) => observer.observe(group));
  }

  function animateBrandMoments() {
    if (reducedMotion.matches || !window.anime) return;
    const logoTargets = document.querySelectorAll('.hero-logo-badge, .official-menu-brand-lockup');
    if (logoTargets.length) {
      window.anime({
        targets: logoTargets,
        opacity: [0, 1],
        scale: [.72, 1],
        rotate: [-8, 0],
        duration: 1050,
        delay: 320,
        easing: 'easeOutElastic(1, .72)'
      });
    }

    const badge = document.querySelector('.hero-logo-badge');
    if (badge) {
      window.anime({
        targets: badge,
        translateY: [-4, 5],
        rotate: [-1.5, 1.5],
        direction: 'alternate',
        duration: 3100,
        easing: 'easeInOutSine',
        loop: true
      });
    }
  }

  function addPointerTilt() {
    if (reducedMotion.matches || mobile.matches || !window.anime) return;
    document.querySelectorAll('.catalog-group, .kiosk-category-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        window.anime.remove(card);
        window.anime({
          targets: card,
          rotateY: x * 2.2,
          rotateX: y * -2.2,
          translateY: -2,
          duration: 260,
          easing: 'easeOutQuad'
        });
      });
      card.addEventListener('pointerleave', () => {
        window.anime.remove(card);
        window.anime({
          targets: card,
          rotateY: 0,
          rotateX: 0,
          translateY: 0,
          duration: 420,
          easing: 'easeOutElastic(1, .75)'
        });
      });
    });
  }

  function init() {
    addAosAttributes();
    addCoffeeSteam();
    initAos();
    createCoffeeBeanField();
    animateMenuItems();
    animateBrandMoments();
    addPointerTilt();
  }

  // Run before DOMContentLoaded so app.js binds the rebuilt gallery buttons.
  installRealPhotos();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();