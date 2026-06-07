/* ============================================
   App Router & Page Management
   ============================================ */

(function () {
  'use strict';

  const app = document.getElementById('app');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // ---- Routes ----
  const routes = {
    '/': { render: renderHomePage, title: 'Home — N-Queens Visualizer' },
    '/visualizer': { render: renderVisualizerPage, title: 'Visualizer — N-Queens Visualizer', init: initVisualizerEvents },
    '/algorithm': { render: renderAlgorithmPage, title: 'Algorithm — N-Queens Visualizer' },
    '/complexity': { render: renderComplexityPage, title: 'Complexity — N-Queens Visualizer' },
  };

  // ---- Get current path from hash ----
  function getPath() {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  }

  // ---- Navigate to route ----
  function navigate() {
    const path = getPath();
    const route = routes[path] || routes['/'];

    // Stop visualizer if leaving the page
    if (typeof vizState !== 'undefined' && vizState.isRunning) {
      vizState.isStopped = true;
      vizState.isRunning = false;
    }

    // Render page
    app.innerHTML = route.render();
    document.title = route.title;

    // Run page initializer if exists
    if (route.init) {
      setTimeout(() => route.init(), 50);
    }

    // Update active nav link
    updateActiveLink(path);

    // Close mobile menu
    closeMobileMenu();

    // Scroll to top
    window.scrollTo(0, 0);
  }

  // ---- Update active nav link ----
  function updateActiveLink(path) {
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', linkPath === path);
    });
  }

  // ---- Mobile menu ----
  function closeMobileMenu() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ---- Navbar scroll effect ----
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  // ---- Listen for hash changes ----
  window.addEventListener('hashchange', navigate);

  // ---- Initial load ----
  if (!window.location.hash) {
    window.location.hash = '#/';
  }
  navigate();
})();
