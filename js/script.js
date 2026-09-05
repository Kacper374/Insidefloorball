// ============================================================
// Mobile navigation toggle
// ============================================================
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

// ============================================================
// Tips accordion
// ============================================================
document.querySelectorAll('.tip-header').forEach((header) => {
  header.addEventListener('click', () => {
    const tipItem = header.closest('.tip-item');
    const isOpen = tipItem.classList.toggle('open');
    header.setAttribute('aria-expanded', isOpen);
  });
});

// ============================================================
// Scrollspy: highlight the nav link for the section currently in view
// ============================================================
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

// ============================================================
// Image carousels on article pages (posts with several photos to swipe through)
// ============================================================
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

// ============================================================
// Shared helpers: path resolving, clipboard, toast notifications
// ============================================================

// The site has two folder "depths": the root (index.html, privacy-policy.html,
// 404.html) and news/ (article-1.html, article-2.html, article-3.html).
// Search results and share links are written as root-relative paths like
// "index.html#news" or "news/article-1.html" — this converts them to the
// correct relative link depending on which depth the current page lives at.
function resolveSiteHref(path) {
  const inNewsFolder = window.location.pathname.includes('/news/');
  if (!inNewsFolder) return path;
  if (path.startsWith('news/')) return path.slice('news/'.length);
  return '../' + path;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Strips accents/diacritics so searches like "halmalainen" still match
// "Hämäläinen", and Polish characters are easier to search too.
function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function copyLinkSilently(url) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).catch(() => {});
  }
}

let toastEl = null;
let toastTimeout = null;
function showToast(message) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ============================================================
// Site-wide search
// ============================================================

// Every searchable piece of content on the site lives here: homepage
// sections, calendar entries, tips, partners, and the full text of every
// news article. To add a new article to search later, just add one more
// object below with its title, tag, url and content.
const SEARCH_INDEX = [
  {
    title: 'About — What is inside.?',
    tag: 'About',
    url: 'index.html#about',
    content: "inside. is a floorball media brand built for fans who want more than just scores — daily news, match highlights, tournament calendars and educational content, reaching a fast-growing floorball community across Instagram, TikTok, YouTube and Facebook. 17.5K Instagram followers, 3.8K Facebook followers, 4.9K TikTok followers, 2.79K YouTube subscribers, 914+ videos published.",
  },
  {
    title: 'Northern Conference quarterfinals wrap up as Champions Cup kicks off',
    tag: 'Champions Cup',
    url: 'news/article-1.html',
    content: "The first round of the 2026/27 Champions Cup quarterfinals was packed with action. Kohonen's 30-metre stunner: the biggest highlight of the whole week belongs to Gabriel Kohonen. With just one second left in the first period, he fired a sweeper from his own half and found the net. Nokian stun IBF Falun: Nokian eliminated IBF Falun after a loss in the opening game on home ice in Falun, and a draw in the rematch at Nokian Arena wasn't enough to turn the tie around. Karjalainen's hero performance: goalkeeper Aki Karjalainen stopped 36 of 42 shots from Falun and was named MVP of the second game with an 89.47% save rate. A controversial goal for Storvreta: Hampus Nydenfeldt's equalising goal is arguably the biggest lowlight of the week, with replays suggesting he was standing inside the goal area. Hämäläinen's perfect entrance: Thorengruppen's new signing Suvi Hämäläinen scored three goals across two games against Eräviikingit. FBC Kalmarsund's demolition job: FBC Kalmarsund scored 24 goals across two games against Koovee, winning 12–0 in both matches.",
  },
  {
    title: 'Nokian KrP eliminate IBF Falun from the 2026/27 Champions Cup',
    tag: 'Champions Cup',
    url: 'news/article-2.html',
    content: "The reigning Finnish champions advanced to the Northern Conference semi-finals after a 2–2 draw in the second leg in Nokia, following a 5–4 win in the first leg in Falun. Valtteri Viitakoski and Adam Zubek were on target as Nokian held off a late Falun push to progress on the Champions Cup's three-points-for-a-win system. Nokian KrP now await the winner of the tie's Northern Conference counterpart as the road to the final continues to take shape.",
  },
  {
    title: 'New rules you need to know before the season starts',
    tag: 'Rules',
    url: 'news/article-3.html',
    content: "The IFF's 2026 Rules of the Game took effect on 1 July, with the headline changes built around goalkeeper safety. Field players must now make a genuine effort to avoid crashing into the goalkeeper, can no longer cut through the goal area, and are barred from blocking a keeper's view by trailing them around the crease. The changes are designed to reduce dangerous collisions in and around the crease while keeping the pace of the modern game intact.",
  },
  {
    title: 'SSL Recap 2025/26 — Round 1',
    tag: 'SSL',
    url: 'index.html#highlights',
    content: 'Highlights video recapping the opening round of the SSL season, 4 minutes 12 seconds.',
  },
  {
    title: 'WFC 2024 — Best Goals',
    tag: 'WFC',
    url: 'index.html#highlights',
    content: 'Highlights video with the best goals from the World Floorball Championship 2024, 6 minutes 30 seconds.',
  },
  {
    title: 'Czech Extraliga — Opening Weekend',
    tag: 'Extraliga',
    url: 'index.html#highlights',
    content: 'Highlights video from the opening weekend of the Czech Extraliga season, 3 minutes 45 seconds.',
  },
  {
    title: 'U19 WFC — Final Highlights',
    tag: 'U19 WFC',
    url: 'index.html#highlights',
    content: 'Highlights video from the final of the U19 World Floorball Championship, 5 minutes 2 seconds.',
  },
  {
    title: 'Czech Open 2026',
    tag: 'Calendar · Sep 06',
    url: 'index.html#calendar',
    content: 'Season-opening international tournament in the Czech Republic.',
  },
  {
    title: 'Extraliga — Round 3',
    tag: 'Calendar · Sep 19',
    url: 'index.html#calendar',
    content: 'Czech top-flight action continues across all twelve clubs.',
  },
  {
    title: 'U19 World Floorball Championship',
    tag: 'Calendar · Oct 10',
    url: 'index.html#calendar',
    content: 'The next generation competes on the international stage.',
  },
  {
    title: 'WFC 2026 Draw',
    tag: 'Calendar · Dec 02',
    url: 'index.html#calendar',
    content: "Group stage draw for next year's World Floorball Championship.",
  },
  {
    title: 'Master the low grip for quick release',
    tag: 'Tips',
    url: 'index.html#tips',
    content: 'A lower grip on the stick gives you a faster, more compact shot — harder for goalkeepers to read and react to in time.',
  },
  {
    title: 'Communicate constantly on the floor',
    tag: 'Tips',
    url: 'index.html#tips',
    content: 'Calling for the ball, flagging switches and marking runs out loud keeps the whole line in sync during fast play.',
  },
  {
    title: 'Line changes can win games',
    tag: 'Tips',
    url: 'index.html#tips',
    content: 'Smart substitution timing keeps legs fresh and lets you exploit a tired opposing line late in each period.',
  },
  {
    title: 'Read the game, not just the ball',
    tag: 'Tips',
    url: 'index.html#tips',
    content: 'Watching player positioning and space instead of only the ball helps you anticipate plays a full step earlier.',
  },
  {
    title: 'Recovery matters as much as training',
    tag: 'Tips',
    url: 'index.html#tips',
    content: "Sleep, stretching and rest days aren't optional extras — they're what let your training actually translate into form.",
  },
  {
    title: 'Partners — floorballshop.com',
    tag: 'Main Partner',
    url: 'index.html#partners',
    content: 'floorballshop.com, main partner of inside. floorball.',
  },
  {
    title: 'Partners — Český florbal',
    tag: 'Federation Partner',
    url: 'index.html#partners',
    content: 'Český florbal, the Czech floorball federation, federation partner of inside. floorball.',
  },
  {
    title: 'Contact inside. floorball',
    tag: 'Contact',
    url: 'index.html#contact',
    content: 'Get in touch with inside. floorball by email or through Instagram, Facebook, YouTube and TikTok.',
  },
  {
    title: 'Privacy Policy',
    tag: 'Legal',
    url: 'privacy-policy.html',
    content: 'Privacy policy covering data protection, GDPR, the Formspree contact form, Google Fonts and GitHub Pages hosting logs.',
  },
];

// Pre-compute a normalized, searchable blob for each entry once up front.
SEARCH_INDEX.forEach((entry) => {
  entry._searchBlob = normalizeText(`${entry.title} ${entry.tag} ${entry.content}`);
  entry._titleBlob = normalizeText(entry.title);
});

function getSearchSnippet(entry, normalizedQuery) {
  const normContent = normalizeText(entry.content);
  const idx = normContent.indexOf(normalizedQuery);
  if (idx === -1) {
    return entry.content.length > 120 ? entry.content.slice(0, 120) + '…' : entry.content;
  }
  const start = Math.max(0, idx - 40);
  const end = Math.min(entry.content.length, idx + normalizedQuery.length + 70);
  let snippet = entry.content.slice(start, end).trim();
  if (start > 0) snippet = '…' + snippet;
  if (end < entry.content.length) snippet = snippet + '…';
  return snippet;
}

function buildSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.id = 'searchOverlay';
  overlay.innerHTML = `
    <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search the site">
      <div class="search-modal-header">
        <svg class="search-modal-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" class="search-input" id="searchInput" placeholder="Search news, tips, events…" autocomplete="off" />
        <button type="button" class="search-close" id="searchClose" aria-label="Close search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="search-results" id="searchResults">
        <p class="search-hint">Start typing to search the whole site.</p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function initSiteSearch() {
  const navSearchBtns = document.querySelectorAll('[data-search-trigger]');
  if (navSearchBtns.length === 0) return;

  const overlay = buildSearchOverlay();
  const input = overlay.querySelector('#searchInput');
  const results = overlay.querySelector('#searchResults');
  const closeBtn = overlay.querySelector('#searchClose');

  function openSearch() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    input.value = '';
    results.innerHTML = '<p class="search-hint">Start typing to search the whole site.</p>';
    setTimeout(() => input.focus(), 50);
  }

  function closeSearch() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderResults(rawQuery) {
    const trimmed = rawQuery.trim();
    if (trimmed.length < 2) {
      results.innerHTML = '<p class="search-hint">Start typing to search the whole site.</p>';
      return;
    }

    const query = normalizeText(trimmed);
    const matches = SEARCH_INDEX.filter((entry) => entry._searchBlob.includes(query));

    matches.sort((a, b) => {
      const aTitle = a._titleBlob.includes(query) ? 0 : 1;
      const bTitle = b._titleBlob.includes(query) ? 0 : 1;
      return aTitle - bTitle;
    });

    const top = matches.slice(0, 8);

    if (top.length === 0) {
      results.innerHTML = `<p class="search-hint">No results for "${escapeHtml(trimmed)}".</p>`;
      return;
    }

    results.innerHTML = top
      .map((entry) => {
        const href = resolveSiteHref(entry.url);
        const snippet = getSearchSnippet(entry, query);
        return `
          <a class="search-result-item" href="${href}">
            <span class="search-result-tag">${escapeHtml(entry.tag)}</span>
            <span class="search-result-title">${escapeHtml(entry.title)}</span>
            <span class="search-result-snippet">${escapeHtml(snippet)}</span>
          </a>
        `;
      })
      .join('');
  }

  navSearchBtns.forEach((btn) => btn.addEventListener('click', openSearch));
  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
  });
  input.addEventListener('input', (e) => renderResults(e.target.value));
}

initSiteSearch();

// ============================================================
// Article share: copy link + expanded "share via" panel
// ============================================================

// Reusable icon paths (kept as strings so they can be dropped into both the
// share panel grid and, if needed, anywhere else on the site).
const SHARE_ICONS = {
  whatsapp:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.47 14.38c-.29-.15-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.15-.19.29-.75.93-.92 1.12-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49h-.56c-.19 0-.51.07-.78.36-.26.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.19 3.03.15.19 2.06 3.15 5 4.41.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z"/><path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.08L2 22l5.06-1.33A9.96 9.96 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2zm0 18.15c-1.63 0-3.15-.44-4.46-1.21l-.32-.19-3.3.87.88-3.22-.21-.33A8.14 8.14 0 0 1 3.85 12c0-4.5 3.67-8.15 8.17-8.15 4.5 0 8.15 3.65 8.15 8.15 0 4.5-3.66 8.15-8.15 8.15z"/></svg>',
  messenger:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.48 2 2 6.15 2 11.25c0 2.9 1.44 5.49 3.7 7.19V22l3.38-1.86c.9.25 1.87.38 2.92.38 5.52 0 10-4.15 10-9.27S17.52 2 12 2zm1 12.46l-2.55-2.72-4.98 2.72 5.48-5.82 2.62 2.72 4.9-2.72L13 14.46z"/></svg>',
  telegram:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M9.99 15.42l-.38 5.32c.54 0 .78-.23 1.06-.5l2.55-2.42 5.29 3.85c.97.53 1.66.25 1.92-.9L23.93 3.6c.32-1.47-.53-2.04-1.47-1.68L1.11 10.02c-1.44.56-1.42 1.36-.25 1.72l5.6 1.75L19.9 5.6c.6-.38 1.15-.17.7.24L9.99 15.42z"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z"/></svg>',
  x:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.7 22H2.4l7.7-8.8L1.5 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 4H5.5l12.2 16z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.06 2.1.26 2.8.55.8.3 1.4.7 2 1.3.6.6 1 1.2 1.3 2 .3.7.5 1.6.5 2.8.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 2.1-.5 2.8-.3.8-.7 1.4-1.3 2-.6.6-1.2 1-2 1.3-.7.3-1.6.5-2.8.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2.1-.3-2.8-.5-.8-.3-1.4-.7-2-1.3-.6-.6-1-1.2-1.3-2-.3-.7-.5-1.6-.5-2.8C2.1 15.6 2.1 15.2 2.1 12s0-3.6.1-4.8c.1-1.2.3-2.1.5-2.8.3-.8.7-1.4 1.3-2 .6-.6 1.2-1 2-1.3.7-.3 1.6-.5 2.8-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1 .05-1.6.2-2 .35-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.15.4-.3 1-.35 2C2.9 8.5 2.9 8.9 2.9 12s0 3.5.07 4.7c.05 1 .2 1.6.35 2 .2.5.4.8.8 1.2.4.4.7.6 1.2.8.4.15 1 .3 2 .35 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1-.05 1.6-.2 2-.35.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.15-.4.3-1 .35-2 .07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.05-1-.2-1.6-.35-2-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.15-1-.3-2-.35C15.5 4 15.1 4 12 4zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zm5.9-2a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0z"/></svg>',
  tiktok:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
  email:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6L12 13 2 6"/></svg>',
};

// The set of apps shown in the "Share via" panel (used as a fallback on
// devices/browsers that don't support the native share sheet). To add
// another app later, add one more object here with its own icon + action.
const SHARE_TARGETS = [
  {
    name: 'WhatsApp',
    icon: SHARE_ICONS.whatsapp,
    action: (url, title) => {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    },
  },
  {
    name: 'Messenger',
    icon: SHARE_ICONS.messenger,
    action: (url) => {
      copyLinkSilently(url);
      window.open(`fb-messenger://share/?link=${encodeURIComponent(url)}`, '_blank');
      showToast("Link copied — paste it in Messenger.");
    },
  },
  {
    name: 'Telegram',
    icon: SHARE_ICONS.telegram,
    action: (url, title) => {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    },
  },
  {
    name: 'Facebook',
    icon: SHARE_ICONS.facebook,
    action: (url) => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    },
  },
  {
    name: 'X',
    icon: SHARE_ICONS.x,
    action: (url, title) => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    },
  },
  {
    name: 'Instagram',
    icon: SHARE_ICONS.instagram,
    action: (url) => {
      copyLinkSilently(url);
      window.open('https://www.instagram.com/direct/inbox/', '_blank');
      showToast('Link copied — paste it in an Instagram DM.');
    },
  },
  {
    name: 'TikTok',
    icon: SHARE_ICONS.tiktok,
    action: (url) => {
      copyLinkSilently(url);
      window.open('https://www.tiktok.com/messages', '_blank');
      showToast('Link copied — paste it in TikTok.');
    },
  },
  {
    name: 'Email',
    icon: SHARE_ICONS.email,
    action: (url, title) => {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
    },
  },
];

function buildSharePanel() {
  const overlay = document.createElement('div');
  overlay.className = 'share-panel-overlay';
  overlay.id = 'sharePanelOverlay';
  overlay.innerHTML = `
    <div class="share-panel" role="dialog" aria-modal="true" aria-label="Share this article">
      <div class="share-panel-header">
        <span>Share via</span>
        <button type="button" class="share-panel-close" id="sharePanelClose" aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="share-panel-grid" id="sharePanelGrid"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function initArticleShare() {
  const shareWidgets = document.querySelectorAll('[data-share]');
  if (shareWidgets.length === 0) return;

  let sharePanelOverlay = null;
  let sharePanelGrid = null;
  let currentUrl = '';
  let currentTitle = '';

  function ensureSharePanel() {
    if (sharePanelOverlay) return;
    sharePanelOverlay = buildSharePanel();
    sharePanelGrid = sharePanelOverlay.querySelector('#sharePanelGrid');

    sharePanelGrid.innerHTML = SHARE_TARGETS.map((target, i) => `
      <button type="button" class="share-panel-item" data-target-index="${i}">
        <span class="share-panel-icon">${target.icon}</span>
        <span>${escapeHtml(target.name)}</span>
      </button>
    `).join('');

    sharePanelGrid.querySelectorAll('.share-panel-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = SHARE_TARGETS[Number(btn.dataset.targetIndex)];
        target.action(currentUrl, currentTitle);
        closeSharePanel();
      });
    });

    sharePanelOverlay.querySelector('#sharePanelClose').addEventListener('click', closeSharePanel);
    sharePanelOverlay.addEventListener('click', (e) => {
      if (e.target === sharePanelOverlay) closeSharePanel();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sharePanelOverlay.classList.contains('open')) closeSharePanel();
    });
  }

  function openSharePanel(url, title) {
    // On phones/tablets that support it, hand off straight to the native
    // share sheet — this is the same "tap the apps you want to send to"
    // experience as sharing from Instagram, WhatsApp, etc.
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
      return;
    }
    ensureSharePanel();
    currentUrl = url;
    currentTitle = title;
    sharePanelOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSharePanel() {
    if (!sharePanelOverlay) return;
    sharePanelOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  shareWidgets.forEach((shareWidget) => {
    const pageUrl = window.location.href;
    const pageTitle = document.title;

    const copyBtn = shareWidget.querySelector('[data-share-copy]');
    const moreBtn = shareWidget.querySelector('[data-share-more]');

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

    if (moreBtn) {
      moreBtn.addEventListener('click', () => openSharePanel(pageUrl, pageTitle));
    }
  });
}

initArticleShare();
