/* ============================================
   SEBASTIAN OLIVER — Interactive Script
   ============================================ */

// ---- Footer art: scroll-driven reveal ----
// v4: dramatic movement, each line cascades from far below
(function() {
  const art = document.getElementById('footerArt');
  if (!art) return;

  const spans = Array.from(art.querySelectorAll('.footer-art-text span'));
  const overlay = art.querySelector('.footer-art-overlay');
  const total = spans.length + 1; // lines + SHIP overlay
  const targetOp = [0.05, 0.08, 0.14, 0.22, 0.32, 0.45, 0.65, 1];

  function update() {
    const rect = art.getBoundingClientRect();
    const vh = window.innerHeight;

    // progress 0..1 over a FULL viewport of scrolling
    // 0 = art top is at viewport bottom
    // 1 = art top is at viewport top
    const progress = 1 - (rect.top / vh);
    const p = Math.max(0, Math.min(1, progress));

    spans.forEach(function(span, i) {
      // each line occupies an overlapping slice of progress
      // earlier lines start earlier, later lines start later
      var lineP = (p - (i * 0.08)) / 0.3;
      lineP = Math.max(0, Math.min(1, lineP));

      // eased
      var ease = lineP * lineP * (3 - 2 * lineP); // smoothstep

      var moveY = 60 * (1 - ease);
      var op = targetOp[i] * ease;
      var scale = 0.92 + 0.08 * ease;

      span.style.transform = 'translateY(' + moveY + 'px) scale(' + scale + ')';
      span.style.opacity = op;

      // last line: solid color when revealed
      if (i === spans.length - 1 && ease > 0.5) {
        span.style.color = 'var(--text)';
        span.style.webkitTextStroke = '0';
      } else if (i === spans.length - 1) {
        span.style.color = '';
        span.style.webkitTextStroke = '';
      }
    });

    // SHIP overlay -- comes in after the last BUILD line
    var shipP = (p - (spans.length * 0.08)) / 0.3;
    shipP = Math.max(0, Math.min(1, shipP));
    var shipEase = shipP * shipP * (3 - 2 * shipP);
    overlay.style.transform = 'translateY(' + (50 * (1 - shipEase)) + 'px) scale(' + (0.9 + 0.1 * shipEase) + ')';
    overlay.style.opacity = shipEase;
  }

  window.addEventListener('scroll', update, { passive: true });
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
