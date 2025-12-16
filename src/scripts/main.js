/**
 * MAIN JAVASCRIPT
 * Luxury Typography Design Website
 * Handles navigation, scroll effects, animations, and interactions
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit how often a function can run
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, offset = 100) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0
  );
}

// ========================================
// MOBILE NAVIGATION
// ========================================

function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const header = document.querySelector('.header');
  
  if (!menuToggle || !navMenu) return;

  // Toggle menu function
  function toggleMenu() {
    const isActive = menuToggle.classList.contains('active');
    
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (!isActive) {
      document.body.style.overflow = 'hidden';
      // Add padding to prevent layout shift
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  // Close menu function
  function closeMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  // Menu toggle click
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking on a nav link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !menuToggle.contains(e.target) && 
        !navMenu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close menu on resize if window gets larger
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMenu();
      }
    }, 250);
  });
}

// ========================================
// HEADER SCROLL BEHAVIOR
// ========================================

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 100;

  const handleScroll = debounce(() => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > 10) {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    } else {
      header.style.boxShadow = 'none';
    }

    // Hide header on scroll down, show on scroll up (only after scrollThreshold)
    if (currentScroll > scrollThreshold) {
      if (currentScroll > lastScroll && !header.classList.contains('hidden')) {
        header.classList.add('hidden');
      } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
        header.classList.remove('hidden');
      }
    }

    lastScroll = currentScroll;
  }, 10);

  window.addEventListener('scroll', handleScroll);
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optionally unobserve after revealing
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just '#' or empty
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// CONTACT FORM HANDLING
// ========================================

function initContactForm() {
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    try {
      // In a real application, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.style.color = 'var(--color-accent)';
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
      }
      
      // Reset form
      form.reset();
      
    } catch (error) {
      // Show error message
      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.style.color = '#d32f2f';
        formStatus.textContent = 'Oops! Something went wrong. Please try again.';
      }
    } finally {
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
      // Hide status message after 5 seconds
      if (formStatus) {
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }
    }
  });
}

// ========================================
// PARALLAX EFFECTS
// ========================================

function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
  
  if (parallaxElements.length === 0) return;

  const handleScroll = debounce(() => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(element => {
      const speed = element.classList.contains('parallax-slow') ? 0.5 :
                   element.classList.contains('parallax-medium') ? 0.3 :
                   0.1;
      
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }, 10);

  window.addEventListener('scroll', handleScroll);
}

// ========================================
// LOADING ANIMATION
// ========================================

function initLoadingAnimation() {
  // Add loaded class to body when page is fully loaded
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger any animations that should start on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = '1';
    }
  });
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

/**
 * Remove will-change property after animations complete
 */
function optimizeAnimations() {
  const animatedElements = document.querySelectorAll('[class*="fade"], [class*="slide"], [class*="scroll-reveal"]');
  
  animatedElements.forEach(element => {
    element.addEventListener('animationend', () => {
      element.classList.add('animation-complete');
    });
    
    element.addEventListener('transitionend', () => {
      element.classList.add('animation-complete');
    });
  });
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

function initAccessibility() {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.body.classList.add('reduce-motion');
  }

  // Add focus-visible support for better keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // Skip to main content link
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.querySelector('main') || document.querySelector('.hero');
      if (main) {
        main.focus();
        main.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// ========================================
// CURSOR EFFECTS (OPTIONAL LUXURY FEATURE)
// ========================================

function initCursorEffects() {
  // Only enable on desktop devices
  if (window.innerWidth < 768) return;

  const interactiveElements = document.querySelectorAll('a, button, .card, .btn');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transition = 'transform 0.3s ease';
    });
  });
}

// ========================================
// INITIALIZE ALL FEATURES
// ========================================

function init() {
  // Ensure menu is closed on page load (critical for mobile navigation)
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  
  // Core functionality
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
  initSmoothScroll();
  initContactForm();
  
  // Enhanced features
  initParallax();
  initLoadingAnimation();
  optimizeAnimations();
  initAccessibility();
  initCursorEffects();
  
  console.log('✨ Luxury Typography website initialized');
}

// ========================================
// START APPLICATION
// ========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    document.body.classList.add('paused');
  } else {
    // Resume animations when page is visible
    document.body.classList.remove('paused');
  }
});

// Export functions for potential use in other scripts
window.LuxuryType = {
  initMobileNav,
  initScrollReveal,
  initSmoothScroll,
  isInViewport,
  debounce
};
