/**
 * Rural Research Group - Academic Website
 * Main JavaScript File
 * 
 * Handles:
 * - Mobile navigation toggle
 * - Smooth scrolling
 * - Scroll animations
 * - Active navigation state
 */

'use strict';

/**
 * DOM Elements
 */
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const navLinks = document.querySelectorAll('.nav__link');

/**
 * Mobile Navigation Toggle
 * Opens and closes the mobile menu with hamburger animation
 */
function initMobileNav() {
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('nav__menu--open');
    
    navMenu.classList.toggle('nav__menu--open');
    navToggle.classList.toggle('nav__toggle--active');
    
    // Update ARIA attributes
    navToggle.setAttribute('aria-expanded', !isOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav__menu--open');
      navToggle.classList.remove('nav__toggle--active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--open')) {
      navMenu.classList.remove('nav__menu--open');
      navToggle.classList.remove('nav__toggle--active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navMenu.classList.contains('nav__menu--open')) {
      navMenu.classList.remove('nav__menu--open');
      navToggle.classList.remove('nav__toggle--active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Smooth Scrolling
 * Enables smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or empty
      if (!href || href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Scroll Animations
 * Animates elements as they enter the viewport
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (!animatedElements.length) return;

  // Use Intersection Observer for better performance
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on data attribute
        const delay = entry.target.dataset.animateDelay || 0;
        
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, delay * 100);
        
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Active Navigation State
 * Highlights the current page in the navigation
 */
function initActiveNavState() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });
}

/**
 * Scroll to Top on Page Load
 * Ensures page starts at the top
 */
function scrollToTopOnLoad() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
}

/**
 * Navbar Shadow on Scroll
 * Adds shadow to navbar when scrolled
 */
function initNavShadow() {
  const nav = document.querySelector('.nav');
  
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 10) {
      nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

/**
 * Handle Project Card Clicks
 * Makes the entire card clickable
 */
function initProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    const link = card.querySelector('.project-card__link');
    
    if (link) {
      card.style.cursor = 'pointer';
      
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking the actual link
        if (e.target === link || link.contains(e.target)) return;
        
        // Navigate to the link
        window.location.href = link.href;
      });
    }
  });
}

/**
 * Initialize All Functions
 */
function init() {
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initActiveNavState();
  initNavShadow();
  initProjectCards();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

