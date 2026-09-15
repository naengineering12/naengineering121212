(function () {
  'use strict';

  var mobile = window.matchMedia('(max-width: 800px), (pointer: coarse)').matches;
  var width = mobile ? 560 : 900;

  function optimize(image) {
    if (!image || image.tagName !== 'IMG') return;
    var raw = image.currentSrc || image.getAttribute('src');
    if (!raw || raw.indexOf('data:') === 0 || raw.indexOf('/logo.png') !== -1) return;

    try {
      var url = new URL(raw, window.location.href);
      var host = url.hostname;

      if (host.indexOf('images.unsplash.com') !== -1) {
        url.searchParams.set('auto', 'format');
        url.searchParams.set('fit', 'crop');
        url.searchParams.set('w', String(width));
        url.searchParams.set('q', mobile ? '52' : '62');
        url.searchParams.set('fm', 'webp');
      } else if (host.indexOf('images.pexels.com') !== -1) {
        url.searchParams.set('auto', 'compress');
        url.searchParams.set('cs', 'tinysrgb');
        url.searchParams.set('w', String(width));
        url.searchParams.set('fm', 'webp');
        url.searchParams.set('q', mobile ? '52' : '62');
      }

      var optimized = url.toString();
      if (optimized !== raw && image.getAttribute('src') !== optimized) {
        image.setAttribute('src', optimized);
      }

      image.loading = image.closest('.hero, .hero-bg') ? 'eager' : 'lazy';
      image.decoding = 'async';
      if (!image.closest('.hero, .hero-bg')) image.setAttribute('fetchpriority', 'low');
    } catch (e) {}
  }

  function scan(root) {
    if (!root) return;
    if (root.nodeType === 1 && root.tagName === 'IMG') optimize(root);
    if (root.querySelectorAll) root.querySelectorAll('img').forEach(optimize);
  }

  scan(document);

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(scan);
      if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') optimize(mutation.target);
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'srcset']
  });

  window.addEventListener('resize', function () {
    var nextMobile = window.matchMedia('(max-width: 800px), (pointer: coarse)').matches;
    if (nextMobile !== mobile) {
      mobile = nextMobile;
      width = mobile ? 560 : 900;
      scan(document);
    }
  }, { passive: true });
})();
