// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked (mobile)
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Tips accordion
document.querySelectorAll('.tip-header').forEach((header) => {
  header.addEventListener('click', () => {
    const tipItem = header.closest('.tip-item');
    const isOpen = tipItem.classList.toggle('open');
    header.setAttribute('aria-expanded', isOpen);
  });
});

// Scrollspy: highlight the nav link for the section currently in view
const sections = document.querySelectorAll('main section[id]');

// Build a lookup so we can quickly find "the link for #news", etc.
const navLinkMap = {};
navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
  const id = link.getAttribute('href').slice(1);
  navLinkMap[id] = link;
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = navLinkMap[entry.target.id];
      if (!link || !entry.isIntersecting) return;

      // Clear the old active link, then mark the new one
      Object.values(navLinkMap).forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  },
  {
    // Counts a section as "active" once it crosses the middle of the screen
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  }
);

sections.forEach((section) => sectionObserver.observe(section));
