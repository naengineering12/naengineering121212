/* Lightweight first-load performance layer. Keep the app UI unchanged. */
(function () {
  'use strict';

  function optimizeImageUrl(value) {
    if (typeof value !== 'string') return value;
    if (!value.includes('images.unsplash.com') && !value.includes('images.pexels.com')) return value;

    try {
      var url = new URL(value, window.location.href);
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('w', '900');
      url.searchParams.set('q', '58');
      return url.toString();
    } catch (_) {
      return value;
    }
  }

  var nativeSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  if (nativeSrc && nativeSrc.set && nativeSrc.get) {
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: nativeSrc.configurable,
      enumerable: nativeSrc.enumerable,
      get: nativeSrc.get,
      set: function (value) {
        nativeSrc.set.call(this, optimizeImageUrl(value));
      }
    });
  }

  var nativeSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    if (this instanceof HTMLImageElement && String(name).toLowerCase() === 'src') {
      value = optimizeImageUrl(value);
    }
    return nativeSetAttribute.call(this, name, value);
  };

  // Avoid downloading off-screen images before they are needed.
  function markLazy(root) {
    var images = (root || document).querySelectorAll
      ? (root || document).querySelectorAll('img')
      : [];
    for (var i = 0; i < images.length; i += 1) {
      var image = images[i];
      if (!image.hasAttribute('loading') && !image.closest('.site-header')) {
        image.setAttribute('loading', 'lazy');
      }
      if (!image.hasAttribute('decoding')) image.setAttribute('decoding', 'async');
    }
  }

  if ('MutationObserver' in window) {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i += 1) {
        for (var j = 0; j < mutations[i].addedNodes.length; j += 1) {
          var node = mutations[i].addedNodes[j];
          if (node.nodeType === 1) markLazy(node);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
