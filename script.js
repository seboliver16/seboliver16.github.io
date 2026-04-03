/* ============================================
   SEBASTIAN OLIVER — Interactive Script
   ============================================ */

// ---- Footer art: scroll-driven accordion ----
// rAF-batched to work on Firefox + Chrome + Safari
(function() {
  var art = document.getElementById('footerArt');
  if (!art) return;
  var spans = [].slice.call(art.querySelectorAll('.footer-art-text span'));
  var ship = art.querySelector('.footer-art-overlay');
  var ops = [0.05, 0.08, 0.14, 0.22, 0.32, 0.45, 0.65, 1];
  var ticking = false;

  function update() {
    ticking = false;
    var rect = art.getBoundingClientRect();
    var vh = window.innerHeight;

    // p goes 0→1 as the art scrolls from viewport bottom to 30% up
    var p = (vh - rect.top) / (vh * 0.7);
    p = p < 0 ? 0 : p > 1 ? 1 : p;

    // Smoothstep
    var sp = p * p * (3 - 2 * p);

    for (var i = 0; i < spans.length; i++) {
      // Each line gets a staggered slice: starts later, ends later
      var start = i * 0.09;
      var lp = (sp - start) / 0.35;
      lp = lp < 0 ? 0 : lp > 1 ? 1 : lp;

      // scaleY: 0 → 1 (accordion expand from top)
      // opacity: 0 → target
      spans[i].style.transform = 'scaleY(' + lp + ')';
      spans[i].style.opacity = ops[i] * lp;

      // Last line: solid text when mostly open
      if (i === spans.length - 1) {
        spans[i].style.color = lp > 0.5 ? 'var(--text)' : '';
        spans[i].style.webkitTextStroke = lp > 0.5 ? '0' : '';
      }
      if (i === spans.length - 2) {
        spans[i].style.webkitTextStrokeWidth = lp > 0.5 ? '1.5px' : '';
      }
    }

    // SHIP: comes after last BUILD line
    var sStart = spans.length * 0.09;
    var sP = (sp - sStart) / 0.35;
    sP = sP < 0 ? 0 : sP > 1 ? 1 : sP;
    ship.style.opacity = sP;
    ship.style.transform = 'translateY(' + (8 * (1 - sP)) + 'px)';
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();

// ---- Expandable entries ----
document.querySelectorAll('[data-expandable]').forEach(entry => {
  const row = entry.querySelector('.entry-row');
  row.addEventListener('click', () => {
    const wasExpanded = entry.classList.contains('expanded');

    // Close all others in this section
    entry.closest('.entries').querySelectorAll('.entry.expanded').forEach(e => {
      e.classList.remove('expanded');
    });

    // Toggle clicked
    if (!wasExpanded) {
      entry.classList.add('expanded');
    }
  });
});

// ---- Live timestamp ----
function updateTimestamp() {
  const el = document.getElementById('statusTime');
  if (!el) return;
  const now = new Date();
  const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  el.textContent = `last updated · ${now.toLocaleTimeString('en-US', opts)} local`;
}
updateTimestamp();
setInterval(updateTimestamp, 1000);

// ---- Footer clock ----
function updateClock() {
  const el = document.getElementById('footerClock');
  if (!el) return;
  const now = new Date();
  const opts = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
  el.textContent = now.toLocaleDateString('en-US', opts);
}
updateClock();
setInterval(updateClock, 10000);

// ---- Footer year ----
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ---- Command Palette ----
const palette = document.getElementById('cmdPalette');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');

const sections = [
  { name: 'Bio', section: '.two-col', hint: 'About me' },
  { name: 'Ventures', section: '[data-section="startups"]', hint: 'Vahalla, Julie AI, RoomMe' },
  { name: 'Experience', section: '[data-section="experience"]', hint: 'Ramp, Amazon, Deloitte' },
  { name: 'Content', section: '[data-section="content"]', hint: 'YouTube, TikTok, Instagram' },
  { name: 'Connect', section: '[data-section="connect"]', hint: 'Get in touch' },
  { name: 'Vahalla', section: null, hint: 'Interview prep platform', url: 'https://vahalla.dev' },
  { name: 'Julie AI', section: null, hint: 'Expert discovery agent', url: 'https://julieai.dev' },
  { name: 'RoomMe', section: null, hint: 'Roommate matching app', url: 'https://roomme.app' },
  { name: 'LinkedIn', section: null, hint: 'seb-oliver', url: 'https://www.linkedin.com/in/seb-oliver/' },
  { name: 'GitHub', section: null, hint: 'seboliver16', url: 'https://github.com/seboliver16' },
  { name: 'X / Twitter', section: null, hint: '@startupseb_', url: 'https://x.com/startupseb_' },
  { name: 'YouTube', section: null, hint: '@StartUpSeb', url: 'https://www.youtube.com/@StartUpSeb' },
  { name: 'TikTok', section: null, hint: '@startupsebb', url: 'https://www.tiktok.com/@startupsebb' },
  { name: 'Instagram', section: null, hint: '@startupseb', url: 'https://www.instagram.com/startupseb/' },
  { name: 'Email', section: null, hint: 'Send email', url: 'mailto:seb.oliver.recruiting@gmail.com' },
];

function togglePalette() {
  const isActive = palette.classList.contains('active');
  if (isActive) {
    palette.classList.remove('active');
    cmdInput.value = '';
    renderResults('');
  } else {
    palette.classList.add('active');
    cmdInput.focus();
    renderResults('');
  }
}

function renderResults(query) {
  const q = query.toLowerCase().trim();
  const filtered = q
    ? sections.filter(s => s.name.toLowerCase().includes(q) || s.hint.toLowerCase().includes(q))
    : sections;

  cmdResults.innerHTML = filtered.map((s, i) => `
    <div class="cmd-result${i === 0 ? ' active' : ''}" data-index="${i}" data-name="${s.name}">
      <span>${s.name}</span>
      <span class="cmd-result-hint">${s.hint}</span>
    </div>
  `).join('');

  // Click handlers
  cmdResults.querySelectorAll('.cmd-result').forEach(el => {
    el.addEventListener('click', () => {
      const name = el.dataset.name;
      const item = sections.find(s => s.name === name);
      navigateTo(item);
    });
  });
}

function navigateTo(item) {
  if (item.url) {
    window.open(item.url, '_blank');
  } else if (item.section) {
    const target = document.querySelector(item.section);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Flash highlight
      target.style.transition = 'background 0.3s';
      target.style.background = 'var(--accent-glow)';
      target.style.borderRadius = '8px';
      setTimeout(() => {
        target.style.background = '';
        target.style.borderRadius = '';
      }, 800);
    }
  }
  togglePalette();
}

cmdInput.addEventListener('input', (e) => {
  renderResults(e.target.value);
});

// Keyboard nav in palette
cmdInput.addEventListener('keydown', (e) => {
  const items = cmdResults.querySelectorAll('.cmd-result');
  const activeItem = cmdResults.querySelector('.cmd-result.active');
  let activeIndex = activeItem ? parseInt(activeItem.dataset.index) : -1;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    items.forEach(i => i.classList.remove('active'));
    activeIndex = (activeIndex + 1) % items.length;
    items[activeIndex]?.classList.add('active');
    items[activeIndex]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    items.forEach(i => i.classList.remove('active'));
    activeIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
    items[activeIndex]?.classList.add('active');
    items[activeIndex]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const active = cmdResults.querySelector('.cmd-result.active');
    if (active) {
      const name = active.dataset.name;
      const item = sections.find(s => s.name === name);
      navigateTo(item);
    }
  }
});

// Global keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Cmd+K or Ctrl+K to toggle palette
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    togglePalette();
  }
  // Escape to close
  if (e.key === 'Escape' && palette.classList.contains('active')) {
    togglePalette();
  }
});

// Initial render
renderResults('');
