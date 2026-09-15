(function () {
  'use strict';

  // Client-side hardening: reduce noisy automated abuse without affecting normal visitors.
  var suspicious = /(?:wp-admin|wp-login|xmlrpc\.php|\.env(?:\.|$)|phpmyadmin|cgi-bin|vendor\/phpunit|actuator\/|\.git\/)/i;
  var path = window.location.pathname || '';
  if (suspicious.test(path)) {
    try { history.replaceState(null, '', '/'); } catch (e) {}
  }

  // Stop accidental embedding of the site in hostile frames.
  try {
    if (window.top !== window.self) window.top.location = window.self.location;
  } catch (e) {}
})();
