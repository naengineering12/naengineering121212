(function () {
  'use strict';

  var mobile = window.matchMedia('(max-width: 800px), (pointer: coarse)').matches;
  var width = mobile ? 560 : 900;
  var scheduled = false;

  function optimize(image) {
    if (!image || image.tagName !== 'IMG') return;
    var raw = image.getAttribute('src') || '';
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
      } else {
        image.loading = image.closest('.hero, .hero-bg') ? 'eager' : 'lazy';
        image.decoding = 'async';
        return;
      }

      var optimized = url.toString();
      if (optimized !== raw) image.setAttribute('src', optimized);
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

  function idleScan() {
    scheduled = false;
    scan(document);
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(idleScan, {timeout: 900});
  } else {
    setTimeout(idleScan, 80);
  }

  var observer = new MutationObserver(function (mutations) {
    var hasNewNodes = false;
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          hasNewNodes = true;
          scan(node);
        }
      });
    });
    if (hasNewNodes && !scheduled) {
      scheduled = true;
      if ('requestIdleCallback' in window) requestIdleCallback(idleScan, {timeout: 700});
      else setTimeout(idleScan, 50);
    }
  });

  observer.observe(document.documentElement, {childList: true, subtree: true});

  window.addEventListener('resize', function () {
    var nextMobile = window.matchMedia('(max-width: 800px), (pointer: coarse)').matches;
    if (nextMobile !== mobile) {
      mobile = nextMobile;
      width = mobile ? 560 : 900;
      if (!scheduled) {
        scheduled = true;
        if ('requestIdleCallback' in window) requestIdleCallback(idleScan, {timeout: 500});
        else setTimeout(idleScan, 50);
      }
    }
  }, {passive: true});
})();
