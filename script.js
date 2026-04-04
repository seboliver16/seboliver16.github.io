/* ============================================
   SEBASTIAN OLIVER — Interactive Script
   ============================================ */

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
    document.body.style.overflow = '';
    cmdInput.value = '';
    renderResults('');
  } else {
    palette.classList.add('active');
    document.body.style.overflow = 'hidden';
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

// Only scroll the results container if the item is outside the visible area
function scrollResultIntoView(el) {
  if (!el) return;
  const container = el.parentNode;
  const elTop = el.offsetTop - container.offsetTop;
  const elBottom = elTop + el.offsetHeight;
  if (elTop < container.scrollTop) {
    container.scrollTop = elTop;
  } else if (elBottom > container.scrollTop + container.clientHeight) {
    container.scrollTop = elBottom - container.clientHeight;
  }
}

// Global keyboard shortcuts (including palette navigation)
document.addEventListener('keydown', (e) => {
  // Cmd+K or Ctrl+K to toggle palette
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    togglePalette();
    return;
  }

  // All other palette keys only when active
  if (!palette.classList.contains('active')) return;

  if (e.key === 'Escape') {
    togglePalette();
    return;
  }

  const items = cmdResults.querySelectorAll('.cmd-result');
  const activeItem = cmdResults.querySelector('.cmd-result.active');
  let activeIndex = activeItem ? parseInt(activeItem.dataset.index) : -1;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    e.stopPropagation();
    items.forEach(i => i.classList.remove('active'));
    activeIndex = (activeIndex + 1) % items.length;
    items[activeIndex]?.classList.add('active');
    scrollResultIntoView(items[activeIndex]);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    e.stopPropagation();
    items.forEach(i => i.classList.remove('active'));
    activeIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
    items[activeIndex]?.classList.add('active');
    scrollResultIntoView(items[activeIndex]);
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

// Initial render
renderResults('');

// ---- Flowing s13r Sea ----
(function () {
  const sea = document.getElementById('sea');
  if (!sea) return;

  const chars = ['s', '1', '3', 'r', 's', 'r', '1', '3', 's', '3', 'r', '1'];
  const GAP = 28;
  const COLS = Math.floor(window.innerWidth / GAP);
  const ROWS = 50;

  for (let c = 0; c < COLS; c++) {
    const col = document.createElement('div');
    col.className = 'sea-col';
    col.style.left = (c * GAP) + 'px';

    // Random speed between 30s and 70s for variety
    const speed = 30 + Math.random() * 40;
    col.style.animationDuration = speed + 's';
    // Random start offset so columns aren't in sync
    col.style.animationDelay = -(Math.random() * speed) + 's';

    // Build column text — each char on its own line
    let text = '';
    for (let r = 0; r < ROWS; r++) {
      text += chars[Math.floor(Math.random() * chars.length)] + '\n';
    }
    // Double it for seamless loop
    col.textContent = text + text;

    sea.appendChild(col);
  }
})();
