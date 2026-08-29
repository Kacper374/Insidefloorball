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
