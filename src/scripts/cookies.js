/**
 * COOKIE CONSENT BANNER
 * Handles cookie consent functionality for GDPR/CCPA compliance
 */

(function() {
  'use strict';

  // Cookie consent functions
  function initCookieConsent() {
    // Check if user has already made a choice
    const cookieConsent = getCookie('cookie-consent');
    
    if (!cookieConsent) {
      // Show banner if no consent given
      showCookieBanner();
    }
  }

  function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      // Show banner with animation
      setTimeout(() => {
        banner.classList.add('show');
        banner.setAttribute('aria-hidden', 'false');
      }, 1000); // Show after 1 second
    }
  }

  function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('show');
      banner.setAttribute('aria-hidden', 'true');
    }
  }

  function acceptCookies() {
    // Set cookie for 1 year
    setCookie('cookie-consent', 'accepted', 365);
    hideCookieBanner();
    
    // Optional: Enable analytics or other tracking here
    console.log('Cookies accepted');
  }

  function declineCookies() {
    // Set cookie for 1 year
    setCookie('cookie-consent', 'declined', 365);
    hideCookieBanner();
    
    // Optional: Disable analytics or other tracking here
    console.log('Cookies declined');
  }

  // Cookie utility functions
  function setCookie(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
  }

  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
  } else {
    initCookieConsent();
  }

  // Attach event listeners
  document.addEventListener('DOMContentLoaded', function() {
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', acceptCookies);
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', declineCookies);
    }
  });

})();
