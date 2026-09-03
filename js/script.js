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

// Image carousels on article pages (posts with several photos to swipe through)
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-carousel-track]');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  const dotsWrap = carousel.querySelector('[data-carousel-dots]');

  // Only one photo: nothing to slide between, so hide the controls
  if (slides.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (dotsWrap) dotsWrap.style.display = 'none';
    return;
  }

  // Build one dot per photo; clicking a dot jumps straight to that photo
  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to image ${i + 1} of ${slides.length}`);
    dot.addEventListener('click', () => {
      track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
    return dot;
  });
  dots[0].classList.add('active');

  const setActiveDot = () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  // Swiping (touch) updates the dots too, via the track's native scroll
  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(setActiveDot);
  });

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
  });
});

// Article share buttons: copy link + prefilled WhatsApp/X share links.
// Uses window.location so it always points at wherever the page is
// actually hosted — no hardcoded domain to update later.
document.querySelectorAll('[data-share]').forEach((shareWidget) => {
  const pageUrl = window.location.href;
  const pageTitle = document.title;

  const copyBtn = shareWidget.querySelector('[data-share-copy]');
  const whatsappLink = shareWidget.querySelector('[data-share-whatsapp]');
  const xLink = shareWidget.querySelector('[data-share-x]');

  if (whatsappLink) {
    whatsappLink.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + ' ' + pageUrl)}`;
  }

  if (xLink) {
    xLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
  }

  if (copyBtn) {
    const label = copyBtn.querySelector('.share-btn-label');
    const originalLabel = label.textContent;

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pageUrl);
        label.textContent = 'Copied!';
        copyBtn.classList.add('share-btn--copied');
      } catch (err) {
        console.error('Copy failed', err);
      }

      setTimeout(() => {
        label.textContent = originalLabel;
        copyBtn.classList.remove('share-btn--copied');
      }, 1800);
    });
  }
});
