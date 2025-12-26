import './style.css'
// --- Advanced Animations (Motion One) ---
import { animate, stagger, inView, timeline } from "motion"
import { initJupiter } from "./jupiter.js";

// Initialize 3D Scene
// Initialize 3D Scene
document.addEventListener('DOMContentLoaded', () => {
  initJupiter();
});

// --- Theme Toggle Logic ---
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check local storage or system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
} else if (prefersDark) {
  html.setAttribute('data-theme', 'data');
}

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'data' ? 'business' : 'data';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// --- Sticky Navbar ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- KPI Counters Animation ---
const counters = document.querySelectorAll('.kpi-value');
const speed = 200; // The lower the slower

const animateCounters = () => {
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const inc = target / speed * 2; // adjust speed

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

// Trigger counters when Hero is in view
const heroSection = document.getElementById('hero');
// Check if hero exists before observing (in case of other pages)
if (heroSection) {
  const options = { threshold: 0.5 };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, options);
  observer.observe(heroSection);
}

// --- Experience Track Toggle ---
const trackBtns = document.querySelectorAll('.track-btn');
const tracks = document.querySelectorAll('.experience-track');

trackBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from buttons
    trackBtns.forEach(b => b.classList.remove('active'));
    // Add to clicked
    btn.classList.add('active');

    // Switch Content
    const targetTrack = btn.getAttribute('data-track');
    tracks.forEach(track => {
      if (track.id === `track-${targetTrack}`) {
        track.classList.add('active');
      } else {
        track.classList.remove('active');
      }
    });
  });
});

// --- Animation Logic (Motion One) ---

// 1. Hero Entries (Staggered)
// Only run if elements exist
if (document.querySelector('.hero-title')) {
  timeline([
    [".badge", { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 }],
    [".hero-title", { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, at: "-0.4" }],
    [".hero-sub", { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, at: "-0.5" }],
    [".hero-cta", { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, at: "-0.4" }],
    // Sync: Delay the sphere slightly to let Three.js init, then slow fade in
    [".data-sphere", { opacity: [0, 1], scale: [0.9, 1] }, { duration: 1.5, at: "-0.2" }]
  ]);
}

// 2. Tag Cloud Entry (Pop in)
if (document.querySelector('.floating-card')) {
  animate(
    ".floating-card",
    { opacity: [0, 1], scale: [0.5, 1] },
    { delay: stagger(0.1, { start: 1.5 }), duration: 0.5, easing: "spring()" }
  );
}

// 3. KPI Cards (Spring Pop-in when in view)
if (document.querySelector('.kpi-grid')) {
  inView(".kpi-grid", ({ target }) => {
    animate(
      target.querySelectorAll(".kpi-card"),
      { opacity: [0, 1], scale: [0.8, 1] },
      { delay: stagger(0.1), duration: 0.6, easing: "spring(1, 80, 10, 0)" }
    );
  });
}

// 4. Section Scroll Reveal (Fade Up)
const scrollElements = document.querySelectorAll(".section-header, .about-card, .skill-card, .project-card, .cert-item");
if (scrollElements.length > 0) {
  scrollElements.forEach(el => {
    el.style.opacity = "0"; // Initial state
  });

  inView(scrollElements, ({ target }) => {
    animate(
      target,
      { opacity: [0, 1], y: [50, 0] },
      { duration: 0.6, easing: "ease-out" }
    );
  });
}
