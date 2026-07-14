(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const products = window.PRODUCTS || [];
  const categories = window.CATALOG_CATEGORIES || [];
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const catalogAudit = window.CATALOG_DATA_AUDIT || { releaseBlocked: false, issues: [] };
  let filters = products.length ? new window.CatalogFilters(products) : null;
  let visibleLimit = 12;
  let lastFocused = null;
  const selectedProducts = new Map();

  const pageLoadStartedAt = performance.now();
  const arrivedFromPageTransition = (() => {
    try {
      const active = sessionStorage.getItem('more-than-kiosk-page-transition') === '1';
      sessionStorage.removeItem('more-than-kiosk-page-transition');
      return active;
    } catch {
      return false;
    }
  })();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileNavMedia = window.matchMedia('(max-width: 760px)');
  const coarsePointerMedia = window.matchMedia('(pointer: coarse)');
  let pageLoadFinished = false;
  let pageReadyApplied = false;
  let pageNavigationPending = false;
  let bottomNavObserver = null;
  let revealObserver = null;
  let heroMotionFrame = 0;
  let searchTimer = 0;

  function markPageReady() {
    if (pageLoadFinished) return;
    pageLoadFinished = true;
    if (window.__moreThanKioskLoaderFailSafe) window.clearTimeout(window.__moreThanKioskLoaderFailSafe);
    document.documentElement.classList.remove('js-fallback');
    const minimumDisplayTime = prefersReducedMotion.matches || arrivedFromPageTransition ? 0 : 380;
    const delay = Math.max(0, minimumDisplayTime - (performance.now() - pageLoadStartedAt));
    window.setTimeout(() => {
      const loader = $('[data-page-loader]');
      document.body.classList.remove('page-loading', 'page-leaving');
      document.body.classList.add('page-ready');
      loader?.setAttribute('aria-hidden', 'true');
      pageReadyApplied = true;
      syncBottomNavClearance();
    }, delay);
  }

  function setupPageLoading() {
    if (document.readyState === 'complete') markPageReady();
    else window.addEventListener('load', markPageReady, { once: true });

    // Never leave visitors behind a loader if a third-party resource stalls.
    window.setTimeout(markPageReady, 1800);
    window.addEventListener('pageshow', (event) => {
      pageNavigationPending = false;
      document.body.classList.remove('page-leaving');
      if (event.persisted || pageReadyApplied) {
        pageLoadFinished = true;
        pageReadyApplied = true;
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-ready');
        $('[data-page-loader]')?.setAttribute('aria-hidden', 'true');
      }
      syncBottomNavClearance();
    });
  }

  function isInternalNavigation(link, url) {
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (!['http:', 'https:', 'file:'].includes(url.protocol)) return false;
    if (url.protocol === 'file:') return window.location.protocol === 'file:';
    return url.origin === window.location.origin;
  }

  function setupPageTransitions() {
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || pageNavigationPending) return;

      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref.startsWith('javascript:')) return;

      const url = new URL(link.href, window.location.href);
      if (!isInternalNavigation(link, url)) return;

      const sameDocument = url.pathname === window.location.pathname && url.search === window.location.search;
      if (sameDocument && (url.hash || url.href === window.location.href)) return;

      event.preventDefault();
      pageNavigationPending = true;
      const loader = $('[data-page-loader]');
      const label = $('.page-loader-label', loader || document);
      if (label) label.textContent = 'Μετάβαση στη σελίδα';
      loader?.setAttribute('aria-hidden', 'false');
      document.body.classList.remove('page-loading', 'page-ready');
      document.body.classList.add('page-leaving');

      const navigate = () => {
        try { sessionStorage.setItem('more-than-kiosk-page-transition', '1'); } catch {}
        window.location.href = url.href;
      };
      if (prefersReducedMotion.matches) navigate();
      else window.setTimeout(navigate, 260);
    });
  }

  function syncBottomNavClearance() {
    const root = document.documentElement;
    const nav = $('.mobile-bottom-nav');
    if (!nav || !mobileNavMedia.matches || getComputedStyle(nav).display === 'none') {
      root.style.setProperty('--mobile-bottom-nav-clearance', '0px');
      return;
    }

    const rect = nav.getBoundingClientRect();
    const viewportHeight = window.innerHeight || root.clientHeight;
    const bottomOffset = Math.max(0, viewportHeight - rect.bottom);
    const contentGap = Number.parseFloat(getComputedStyle(root).getPropertyValue('--mobile-nav-content-gap')) || 0;
    const clearance = Math.ceil(rect.height + bottomOffset + contentGap);
    root.style.setProperty('--mobile-bottom-nav-clearance', `${clearance}px`);
  }

  function setupBottomNavClearance() {
    syncBottomNavClearance();
    const nav = $('.mobile-bottom-nav');
    if ('ResizeObserver' in window && nav) {
      bottomNavObserver = new ResizeObserver(syncBottomNavClearance);
      bottomNavObserver.observe(nav);
    }
    window.addEventListener('resize', syncBottomNavClearance, { passive: true });
    window.addEventListener('orientationchange', syncBottomNavClearance, { passive: true });
    window.visualViewport?.addEventListener('resize', syncBottomNavClearance, { passive: true });
    mobileNavMedia.addEventListener?.('change', syncBottomNavClearance);
    document.fonts?.ready.then(syncBottomNavClearance).catch(() => {});
  }

  function motionIsLimited() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return Boolean(prefersReducedMotion.matches || connection?.saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
  }

  function inferRevealKind(element) {
    if (element.classList.contains('product-card')) return 'card';
    if (element.classList.contains('gallery-item')) return 'scale';
    if (element.classList.contains('story-card') || element.classList.contains('info-card')) return 'left';
    if (element.classList.contains('map-card')) return 'right';
    if (element.matches('.story-grid > .reveal:not(.story-card)')) return 'right';
    return element.dataset.revealKind || 'up';
  }

  function prepareRevealElement(element, order = 0) {
    if (!element.dataset.revealKind) element.dataset.revealKind = inferRevealKind(element);
    const step = mobileNavMedia.matches ? 46 : 68;
    const cap = mobileNavMedia.matches ? 276 : 408;
    element.style.setProperty('--reveal-delay', `${Math.min(order * step, cap)}ms`);
  }

  function prepareStaticMotionTargets() {
    const selectors = [
      '.quick-card',
      '.section-head',
      '.story-point',
      '.catalog-summary',
      '.map-footer',
      '.footer-grid > *'
    ];
    $$(selectors.join(',')).forEach((element) => element.classList.add('reveal'));

    const groups = [
      '.quick-grid',
      '.story-points',
      '.featured-grid',
      '.product-grid',
      '.gallery-grid',
      '.info-grid',
      '.footer-grid'
    ];
    groups.forEach((selector) => {
      $$(selector).forEach((group) => {
        $$('.reveal', group).forEach((element, index) => prepareRevealElement(element, index));
      });
    });
  }

  function setupHeroMotion() {
    const hero = $('.hero');
    if (!hero || motionIsLimited()) return;
    const media = $('.hero-media', hero);
    if (!media) return;

    const update = () => {
      heroMotionFrame = 0;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      const distance = mobileNavMedia.matches ? 18 : 34;
      media.style.setProperty('--hero-shift', `${Math.round(progress * distance)}px`);
    };
    const requestUpdate = () => {
      if (!heroMotionFrame) heroMotionFrame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
  }

  function setupMotionSystem() {
    const root = document.documentElement;
    root.classList.add('motion-ready');
    root.classList.toggle('coarse-pointer', coarsePointerMedia.matches);
    root.classList.toggle('motion-lite', motionIsLimited());
    coarsePointerMedia.addEventListener?.('change', (event) => root.classList.toggle('coarse-pointer', event.matches));
    prepareStaticMotionTargets();
    setupHeroMotion();
  }

  function bindMobileSheetGesture(root) {
    const dialog = $('.product-dialog', root);
    const handle = $('[data-sheet-handle]', root);
    if (!dialog || !handle || !coarsePointerMedia.matches || !mobileNavMedia.matches) return;

    let pointerId = null;
    let startY = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocity = 0;

    const reset = () => {
      pointerId = null;
      root.classList.remove('dragging');
      dialog.style.removeProperty('--sheet-drag');
      $('.dialog-backdrop', root)?.style.removeProperty('opacity');
    };

    handle.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch' || !root.classList.contains('open') || dialog.scrollTop > 0) return;
      pointerId = event.pointerId;
      startY = lastY = event.clientY;
      lastTime = performance.now();
      velocity = 0;
      handle.setPointerCapture?.(pointerId);
      root.classList.add('dragging');
    });

    handle.addEventListener('pointermove', (event) => {
      if (event.pointerId !== pointerId) return;
      const now = performance.now();
      const delta = Math.max(0, event.clientY - startY);
      const elapsed = Math.max(1, now - lastTime);
      velocity = (event.clientY - lastY) / elapsed;
      lastY = event.clientY;
      lastTime = now;
      dialog.style.setProperty('--sheet-drag', `${delta}px`);
      const backdrop = $('.dialog-backdrop', root);
      if (backdrop) backdrop.style.opacity = String(Math.max(0, 1 - delta / 420));
    });

    const finish = (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = Math.max(0, event.clientY - startY);
      handle.releasePointerCapture?.(pointerId);
      if (delta > Math.min(130, dialog.offsetHeight * .2) || velocity > .7) {
        reset();
        closeDialog(root);
        return;
      }
      root.classList.add('sheet-snapback');
      dialog.style.setProperty('--sheet-drag', '0px');
      $('.dialog-backdrop', root)?.style.removeProperty('opacity');
      window.setTimeout(() => {
        root.classList.remove('sheet-snapback');
        reset();
      }, 280);
    };

    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', reset);
  }

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function appendIcon(parent, name, className = '') {
    const holder = createElement('span', `svg-icon ${className}`.trim());
    holder.setAttribute('aria-hidden', 'true');
    holder.innerHTML = window.MTAK_ICONS[name] || '';
    parent.append(holder);
    return holder;
  }

  function formatPrice(value) {
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value);
  }

  function createReleaseBlocker() {
    const blocker = createElement('section', 'release-blocker');
    blocker.setAttribute('role', 'alert');
    blocker.append(createElement('h3', '', 'Ο κατάλογος δεν είναι διαθέσιμος για δημοσίευση'));
    blocker.append(createElement('p', '', 'Υπάρχουν μη επιβεβαιωμένα στοιχεία προϊόντων ή αλλεργιογόνων. Απαιτείται έγκριση του ιδιοκτήτη πριν ενεργοποιηθεί το production mode.'));
    return blocker;
  }

  function applyCatalogReleaseGate() {
    if (!catalogAudit.releaseBlocked) return false;
    document.body.dataset.catalogBlocked = 'true';
    console.error('Catalog production release blocked:', catalogAudit.issues);
    const featured = $('#featuredGrid');
    const grid = $('#productGrid');
    if (featured) featured.replaceChildren(createReleaseBlocker());
    if (grid) grid.replaceChildren(createReleaseBlocker());
    const count = $('#resultCount');
    if (count) count.textContent = 'Κατάλογος μη διαθέσιμος';
    $$('.catalog-toolbar input, .catalog-toolbar select, .catalog-toolbar button').forEach((control) => {
      control.disabled = true;
    });
    $('#loadMoreBtn')?.setAttribute('hidden', '');
    return true;
  }

  function safeImage(image, fallback = 'assets/images/brand/more-than-kiosk-logo.webp') {
    image.addEventListener('error', () => {
      if (!image.dataset.fallbackApplied) {
        image.dataset.fallbackApplied = 'true';
        image.src = fallback;
      }
    }, { once: true });
  }

  function focusables(root) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root)
      .filter((element) => !element.hidden && element.getClientRects().length > 0);
  }

  function setBackgroundInert(activeDialog, inert) {
    const activeHost = activeDialog.closest('body > *') || activeDialog;
    [...document.body.children].forEach((child) => {
      if (child === activeHost || child.tagName === 'SCRIPT') return;
      if (inert) child.setAttribute('inert', '');
      else child.removeAttribute('inert');
    });
  }

  function openDialog(root, opener) {
    if (!root) return;
    if (root._closeTimer) window.clearTimeout(root._closeTimer);
    root.classList.remove('closing', 'sheet-snapback', 'dragging');
    $('.product-dialog', root)?.style.removeProperty('--sheet-drag');
    $('.dialog-backdrop', root)?.style.removeProperty('opacity');
    lastFocused = opener || document.activeElement;
    root.classList.add('open');
    root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setBackgroundInert(root, true);
    const dialog = $('[role="dialog"]', root);
    requestAnimationFrame(() => (focusables(dialog)[0] || dialog).focus());
  }

  function closeDialog(root) {
    if (!root || !root.classList.contains('open')) return;
    root.classList.add('closing');
    root.classList.remove('open', 'dragging', 'sheet-snapback');
    $('.product-dialog', root)?.style.removeProperty('--sheet-drag');
    $('.dialog-backdrop', root)?.style.removeProperty('opacity');
    const delay = prefersReducedMotion.matches ? 0 : (mobileNavMedia.matches ? 360 : 280);
    root._closeTimer = window.setTimeout(() => {
      root.classList.remove('closing');
      root.setAttribute('aria-hidden', 'true');
      setBackgroundInert(root, false);
      document.body.classList.remove('no-scroll');
      if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
      lastFocused = null;
    }, delay);
  }

  function trapDialog(event, root) {
    if (!root?.classList.contains('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog(root);
      return;
    }
    if (event.key !== 'Tab') return;
    const dialog = $('[role="dialog"]', root);
    const items = focusables(dialog);
    if (!items.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function createProductCard(product) {
    const article = createElement('article', 'product-card reveal');
    const button = createElement('button', 'product-card-button');
    button.type = 'button';
    button.dataset.productId = product.id;
    button.setAttribute('aria-label', `Προβολή λεπτομερειών: ${product.name}`);

    const media = createElement('span', 'product-card-media');
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    image.width = 1200;
    image.height = 900;
    safeImage(image);
    media.append(image);
    if (product.badge) media.append(createElement('span', 'product-badge', product.badge));

    const body = createElement('span', 'product-card-body');
    const category = categoryMap.get(product.category)?.label || product.category;
    body.append(createElement('span', 'product-category', category));
    body.append(createElement('span', 'product-name', product.name));
    body.append(createElement('span', 'product-description', product.description));

    const footer = createElement('span', 'product-card-footer');
    footer.append(createElement('strong', 'product-price', formatPrice(product.price)));
    const detail = createElement('span', 'product-detail-link', 'Λεπτομέρειες');
    appendIcon(detail, 'arrow');
    footer.append(detail);
    body.append(footer);

    button.append(media, body);
    const currentQuantity = selectedProducts.get(product.id) || 0;
    const selectButton = createElement('button', 'product-select-button', currentQuantity ? `Προσθήκη (${currentQuantity})` : 'Προσθήκη');
    selectButton.type = 'button';
    selectButton.dataset.productId = product.id;
    selectButton.setAttribute('aria-pressed', String(selectedProducts.has(product.id)));
    selectButton.setAttribute('aria-label', `Επιλογή προϊόντος: ${product.name}`);
    selectButton.addEventListener('click', () => {
      selectedProducts.set(product.id, (selectedProducts.get(product.id) || 0) + 1);
      syncProductSelectionButtons();
      updateSelectionSummary();
      const summary = $('#selectionSummary');
      summary?.classList.remove('selection-changed');
      window.requestAnimationFrame(() => summary?.classList.add('selection-changed'));
    });
    article.append(button, selectButton);
    button.addEventListener('click', () => openProduct(product, button));
    return article;
  }

  function updateSelectionSummary() {
    const selectionSummary = $('#selectionSummary');
    if (!selectionSummary || !filters) return;
    const chosen = [...selectedProducts.entries()].map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity })).filter((item) => item.product);
    selectionSummary.classList.toggle('is-empty', !chosen.length);
    const totalQuantity = chosen.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = chosen.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    selectionSummary.dataset.orderPayload = JSON.stringify(chosen.map(({ product, quantity }) => ({ id: product.id, name: product.name, quantity, unitPrice: product.price })));
    $('#selectionTitle').textContent = chosen.length ? `${totalQuantity} ${totalQuantity === 1 ? 'τεμάχιο' : 'τεμάχια'} · ${formatPrice(totalPrice)}` : 'Δεν έχεις επιλέξει προϊόν';
    const list = $('#selectionList');
    list.replaceChildren(...chosen.map(({ product, quantity }) => {
      const item = createElement('li', 'selection-item');
      const label = createElement('span', '', product.name);
      label.append(createElement('strong', '', formatPrice(product.price * quantity)));
      const controls = createElement('div', 'quantity-controls');
      const decrease = createElement('button', '', '−');
      decrease.type = 'button';
      decrease.setAttribute('aria-label', `Μείωση ποσότητας: ${product.name}`);
      const quantityLabel = createElement('strong', '', String(quantity));
      quantityLabel.setAttribute('aria-label', `Ποσότητα ${quantity}`);
      const increase = createElement('button', '', '+');
      increase.type = 'button';
      increase.setAttribute('aria-label', `Αύξηση ποσότητας: ${product.name}`);
      decrease.addEventListener('click', () => {
        if (quantity <= 1) selectedProducts.delete(product.id);
        else selectedProducts.set(product.id, quantity - 1);
        syncProductSelectionButtons();
        updateSelectionSummary();
      });
      increase.addEventListener('click', () => {
        selectedProducts.set(product.id, quantity + 1);
        syncProductSelectionButtons();
        updateSelectionSummary();
      });
      controls.append(decrease, quantityLabel, increase);
      item.append(label, controls);
      return item;
    }));
    const clear = $('#selectionClear');
    if (clear) clear.hidden = !chosen.length;
  }

  function syncProductSelectionButtons() {
    $$('.product-select-button').forEach((button) => {
      const quantity = selectedProducts.get(button.dataset.productId) || 0;
      button.setAttribute('aria-pressed', String(quantity > 0));
      button.textContent = quantity ? `Προσθήκη (${quantity})` : 'Προσθήκη';
    });
  }

  function revealElements(root = document) {
    const elements = $$('.reveal:not(.visible)', root);
    elements.forEach((element, index) => prepareRevealElement(element, index));
    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('visible'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    }
    elements.forEach((element) => revealObserver.observe(element));
  }

  function renderFeatured() {
    const grid = $('#featuredGrid');
    if (!grid || !products.length) return;
    const featuredIds = ['freddo-espresso', 'cappuccino', 'avocado-toast', 'classic-burger', 'ice-cream-cup', 'aperol-spritz'];
    const featured = featuredIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
    grid.replaceChildren(...featured.map(createProductCard));
    revealElements(grid);
  }

  function renderCategories() {
    const strip = $('#categoryStrip');
    if (!strip || !filters) return;
    strip.replaceChildren();
    categories.forEach((category) => {
      const button = createElement('button', 'category-button');
      button.type = 'button';
      button.dataset.category = category.id;
      button.setAttribute('aria-pressed', String(filters.state.category === category.id));
      appendIcon(button, category.icon);
      button.append(createElement('span', '', category.label));
      button.addEventListener('click', () => {
        filters.set('category', category.id);
        visibleLimit = 12;
        $$('.category-button', strip).forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        button.classList.remove('selection-pop');
        requestAnimationFrame(() => button.classList.add('selection-pop'));
        window.setTimeout(() => button.classList.remove('selection-pop'), 420);
        button.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
        renderCatalog();
      });
      strip.append(button);
    });
  }

  function renderCatalog() {
    const grid = $('#productGrid');
    if (!grid || !filters) return;
    const result = filters.result();
    const visible = result.slice(0, visibleLimit);
    updateSelectionSummary();
    grid.replaceChildren(...visible.map(createProductCard));
    const count = $('#resultCount');
    if (count) count.textContent = `${result.length} ${result.length === 1 ? 'προϊόν' : 'προϊόντα'}`;
    const loadMore = $('#loadMoreBtn');
    if (loadMore) {
      loadMore.hidden = visible.length >= result.length;
      loadMore.textContent = `Προβολή περισσότερων (${result.length - visible.length})`;
    }
    if (!result.length) {
      const empty = createElement('div', 'empty-state');
      appendIcon(empty, 'search');
      empty.append(createElement('h3', '', 'Δεν βρέθηκαν προϊόντα'));
      empty.append(createElement('p', '', 'Δοκίμασε διαφορετική αναζήτηση ή καθάρισε τα φίλτρα.'));
      grid.append(empty);
    }
    revealElements(grid);
  }

  function bindFilters() {
    const search = $('#productSearch');
    const sort = $('#sortProducts');
    const vegetarian = $('#vegetarianFilter');
    const vegan = $('#veganFilter');
    const popular = $('#popularFilter');
    const panel = $('.filter-panel');
    const toggle = $('#filterToggle');
    const filterCount = $('#filterCount');
    const toolsToggle = $('#catalogToolsToggle');
    const toolsClose = $('#catalogToolsClose');
    const toolsBackdrop = $('#catalogToolsBackdrop');
    const catalogToolbar = $('#catalogToolbar');
    const catalogSection = $('.catalog-section');
    if (catalogSection && 'IntersectionObserver' in window) {
      const catalogVisibility = new IntersectionObserver(([entry]) => {
        document.body.classList.toggle('catalog-in-view', entry.isIntersecting);
      }, { threshold: 0, rootMargin: '-12% 0px -12% 0px' });
      catalogVisibility.observe(catalogSection);
    } else if (catalogSection) document.body.classList.add('catalog-in-view');
    $('#selectionClear')?.addEventListener('click', () => {
      selectedProducts.clear();
      $$('.product-select-button').forEach((item) => { item.setAttribute('aria-pressed', 'false'); item.textContent = 'Προσθήκη'; });
      updateSelectionSummary();
    });
    const setToolsOpen = (open) => {
      document.body.classList.toggle('catalog-tools-open', open);
      toolsToggle?.setAttribute('aria-expanded', String(open));
      if (toolsBackdrop) toolsBackdrop.hidden = !open;
      if (open) window.requestAnimationFrame(() => $('#productSearch')?.focus());
      else toolsToggle?.focus();
    };
    toolsToggle?.addEventListener('click', () => setToolsOpen(!document.body.classList.contains('catalog-tools-open')));
    toolsClose?.addEventListener('click', () => setToolsOpen(false));
    toolsBackdrop?.addEventListener('click', () => setToolsOpen(false));
    catalogToolbar?.addEventListener('keydown', (event) => { if (event.key === 'Escape') setToolsOpen(false); });
    const updateFilterSummary = () => {
      const count = Number(sort?.value !== 'featured') + Number(vegetarian?.checked) + Number(vegan?.checked) + Number(popular?.checked);
      if (filterCount) {
        filterCount.textContent = String(count);
        filterCount.hidden = count === 0;
      }
    };
    toggle?.addEventListener('click', () => {
      const open = !panel?.classList.contains('filters-open');
      panel?.classList.toggle('filters-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    search?.addEventListener('input', () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        filters.set('search', search.value);
        visibleLimit = 12;
        renderCatalog();
      }, mobileNavMedia.matches ? 90 : 55);
    });
    sort?.addEventListener('change', () => { filters.set('sort', sort.value); updateFilterSummary(); renderCatalog(); });
    vegetarian?.addEventListener('change', () => { filters.set('vegetarian', vegetarian.checked); updateFilterSummary(); renderCatalog(); });
    vegan?.addEventListener('change', () => { filters.set('vegan', vegan.checked); updateFilterSummary(); renderCatalog(); });
    popular?.addEventListener('change', () => { filters.set('popular', popular.checked); updateFilterSummary(); renderCatalog(); });
    $('#clearFilters')?.addEventListener('click', () => {
      filters.clear();
      visibleLimit = 12;
      if (search) search.value = '';
      if (sort) sort.value = 'featured';
      [vegetarian, vegan, popular].forEach((input) => { if (input) input.checked = false; });
      updateFilterSummary();
      $$('.category-button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.category === 'all')));
      renderCatalog();
    });
    $('#loadMoreBtn')?.addEventListener('click', () => { visibleLimit += 12; renderCatalog(); });
    updateFilterSummary();
  }

  function fillList(list, values) {
    list.replaceChildren(...(values?.length ? values : ['Δεν έχουν καταχωριστεί']).map((value) => createElement('li', '', value)));
  }

  function openProduct(product, opener) {
    const modal = $('#productModal');
    if (!modal) return;
    const image = $('#modalImage');
    image.src = product.image;
    image.alt = product.name;
    delete image.dataset.fallbackApplied;
    safeImage(image);
    $('#modalCategory').textContent = categoryMap.get(product.category)?.label || product.category;
    $('#modalName').textContent = product.name;
    $('#modalPrice').textContent = formatPrice(product.price);
    $('#modalDescription').textContent = product.fullDescription || product.description;
    fillList($('#modalIngredients'), product.ingredients);
    fillList($('#modalAllergens'), product.allergens);
    openDialog(modal, opener);
  }

  function bindProductModal() {
    const modal = $('#productModal');
    if (!modal) return;
    $$('[data-close-product]', modal).forEach((button) => button.addEventListener('click', () => closeDialog(modal)));
    modal.addEventListener('keydown', (event) => trapDialog(event, modal));
    bindMobileSheetGesture(modal);
  }

  function bindMobileMenu() {
    const menu = $('#mobileMenu');
    const opener = $('[data-open-menu]');
    if (!menu || !opener) return;
    const open = () => {
      opener.setAttribute('aria-expanded', 'true');
      openDialog(menu, opener);
    };
    const close = () => {
      opener.setAttribute('aria-expanded', 'false');
      closeDialog(menu);
    };
    opener.addEventListener('click', open);
    $$('[data-close-menu]', menu).forEach((button) => button.addEventListener('click', close));
    $$('.mobile-menu-links a', menu).forEach((link) => link.addEventListener('click', close));
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') opener.setAttribute('aria-expanded', 'false');
      trapDialog(event, menu);
    });
  }

  function bindGallery() {
    const lightbox = $('#galleryLightbox');
    if (!lightbox) return;
    $$('[data-lightbox]').forEach((button) => {
      button.addEventListener('click', () => {
        const image = $('#lightboxImage');
        image.src = button.dataset.lightbox;
        image.alt = button.dataset.caption || '';
        $('#lightboxCaption').textContent = button.dataset.caption || '';
        openDialog(lightbox, button);
      });
    });
    $$('[data-close-lightbox]', lightbox).forEach((button) => button.addEventListener('click', () => closeDialog(lightbox)));
    lightbox.addEventListener('keydown', (event) => trapDialog(event, lightbox));
  }

  function bindMapConsent() {
    const host = $('[data-map-host]');
    const button = $('[data-load-map]', host || document);
    if (!host || !button) return;

    button.addEventListener('click', () => {
      if (host.classList.contains('is-loaded')) return;
      button.disabled = true;
      button.textContent = 'Φόρτωση…';

      const iframe = document.createElement('iframe');
      iframe.title = 'Χάρτης για το More Than a Kiosk';
      iframe.loading = 'eager';
      iframe.referrerPolicy = 'no-referrer';
      iframe.allowFullscreen = true;
      iframe.src = host.dataset.mapSrc;
      iframe.addEventListener('load', () => host.setAttribute('aria-busy', 'false'), { once: true });

      host.setAttribute('aria-busy', 'true');
      host.classList.add('is-loaded');
      host.replaceChildren(iframe);
    });
  }

  function bindPageUtilities() {
    const feedback = $('[data-action-feedback]');
    $('[data-copy-address]')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('Ποσειδώνος 13, Χαλκούτσι, Αττική');
        if (feedback) feedback.textContent = 'Η διεύθυνση αντιγράφηκε.';
      } catch { if (feedback) feedback.textContent = 'Δεν ήταν δυνατή η αντιγραφή. Κράτησε πατημένη τη διεύθυνση για αντιγραφή.'; }
    });
    $('[data-share-location]')?.addEventListener('click', async () => {
      const data = { title: 'More Than a Kiosk', text: 'Ποσειδώνος 13, Χαλκούτσι', url: 'https://maps.app.goo.gl/wuxAspR66vvUeKUTA' };
      try {
        if (navigator.share) await navigator.share(data);
        else { await navigator.clipboard.writeText(data.url); if (feedback) feedback.textContent = 'Ο σύνδεσμος τοποθεσίας αντιγράφηκε.'; }
      } catch (error) { if (error?.name !== 'AbortError' && feedback) feedback.textContent = 'Η κοινοποίηση δεν ολοκληρώθηκε.'; }
    });
  }

  function hydrateInlineIcons() {
    $$('[data-inline-icon]').forEach((element) => {
      const name = element.dataset.inlineIcon;
      element.innerHTML = window.MTAK_ICONS[name] || '';
      element.setAttribute('aria-hidden', 'true');
    });
  }

  function bindHeader() {
    const header = $('.site-header');
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
  }

  setupPageLoading();
  setupPageTransitions();

  document.addEventListener('DOMContentLoaded', () => {
    hydrateInlineIcons();
    setupMotionSystem();
    setupBottomNavClearance();
    bindHeader();
    bindMobileMenu();
    bindProductModal();
    bindGallery();
    bindMapConsent();
    bindPageUtilities();

    const catalogBlocked = applyCatalogReleaseGate();
    if (!catalogBlocked) {
      renderFeatured();
      if ($('#productGrid')) {
        renderCategories();
        bindFilters();
        renderCatalog();
      }
    }
    revealElements();
    window.__MTAK_APP_INITIALIZED = true;
  });
})();
