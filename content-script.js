const DEFAULT_SETTINGS = {
  width: 6,
  color: '#c62828',
  disabled: false,
  style: 'caution', // 'solid', 'caution', or 'custom'
  stripeColor1: '#c62828', // for custom multi-color
  stripeColor2: '#1e88e5',  // for custom multi-color
  mode: 'border',           // 'border' (all edges) or 'banner' (top only)
  opacity: 1                // 0–1, 1 = fully opaque
};

function getHostKey() { return location.hostname; }

function applyBorderOverlay(settings) {
  let frame = document.getElementById('env-border-overlay');
  if (settings.disabled) {
    if (frame) frame.remove();
    return;
  }

  if (!frame) {
    frame = document.createElement('div');
    frame.id = 'env-border-overlay';
    frame.innerHTML = `
      <div class="env-border-edge env-border-top"></div>
      <div class="env-border-edge env-border-right"></div>
      <div class="env-border-edge env-border-bottom"></div>
      <div class="env-border-edge env-border-left"></div>
    `;
    document.documentElement.appendChild(frame);
  }

  const { width, color, style, mode } = settings;
  const rawOpacity = typeof settings.opacity === 'number' ? settings.opacity : 1;
  const opacity = Math.max(0, Math.min(1, rawOpacity));

  const styleEl = document.getElementById('env-border-overlay-style') || (() => {
    const s = document.createElement('style');
    s.id = 'env-border-overlay-style';
    document.head.appendChild(s);
    return s;
  })();

  styleEl.textContent = `
    #env-border-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 2147483646; }
    .env-border-edge { position: absolute; pointer-events: none; }
    .env-border-top { top: 0; left: 0; right: 0; height: ${width}px; }
    .env-border-bottom { bottom: 0; left: 0; right: 0; height: ${width}px; }
    .env-border-left { top: 0; bottom: 0; left: 0; width: ${width}px; }
    .env-border-right { top: 0; bottom: 0; right: 0; width: ${width}px; }
  `;

  const edges = frame.querySelectorAll('.env-border-edge');
  const topEdge    = frame.querySelector('.env-border-top');
  const rightEdge  = frame.querySelector('.env-border-right');
  const bottomEdge = frame.querySelector('.env-border-bottom');
  const leftEdge   = frame.querySelector('.env-border-left');

  // Color / pattern
  if (style === 'caution') {
    edges.forEach(e => {
      e.style.background =
        'repeating-linear-gradient(45deg, #ffeb3b 0 10px, #000 10px 20px)';
    });
  } else if (style === 'custom') {
    const c1 = settings.stripeColor1 || '#c62828';
    const c2 = settings.stripeColor2 || '#1e88e5';
    const bg = `repeating-linear-gradient(45deg, ${c1} 0 10px, ${c2} 10px 20px)`;
    edges.forEach(e => {
      e.style.background = bg;
    });
  } else {
    // solid
    edges.forEach(e => {
      e.style.background = color;
    });
  }

   // Apply opacity to edges
  edges.forEach(e => {
    e.style.opacity = String(opacity);
  });
  
  // Mode: full border vs banner (top-only)
  if (mode === 'banner') {
    if (topEdge)    topEdge.style.display = 'block';
    if (rightEdge)  rightEdge.style.display = 'none';
    if (bottomEdge) bottomEdge.style.display = 'none';
    if (leftEdge)   leftEdge.style.display = 'none';
  } else {
    // default: border (all edges)
    if (topEdge)    topEdge.style.display = 'block';
    if (rightEdge)  rightEdge.style.display = 'block';
    if (bottomEdge) bottomEdge.style.display = 'block';
    if (leftEdge)   leftEdge.style.display = 'block';
  }
}

function loadSettings(host, cb) {
  try {
    chrome.storage.sync.get([host], (res) =>
      cb({ ...DEFAULT_SETTINGS, ...(res[host] || {}) })
    );
  } catch (e) {
    const raw = localStorage.getItem('env_border_' + host);
    const parsed = raw ? JSON.parse(raw) : {};
    cb({ ...DEFAULT_SETTINGS, ...parsed });
  }
}

function saveSettings(host, settings) {
  try {
    const data = {};
    data[host] = settings;
    chrome.storage.sync.set(data);
  } catch (e) {
    localStorage.setItem('env_border_' + host, JSON.stringify(settings));
  }
}

// Apply stored settings on load
(function init() {
  const host = getHostKey();
  loadSettings(host, (settings) => {
    applyBorderOverlay(settings);
  });
})();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.action) return;

  // Live apply (no save) and commit apply (with save)
  if ((msg.action === 'applySettings' || msg.action === 'applySettingsLive') &&
      msg.settings && msg.host) {
    try {
      const s = { ...DEFAULT_SETTINGS, ...msg.settings };
      applyBorderOverlay(s);

      if (msg.action === 'applySettings') {
        // only persist for commit action
        saveSettings(msg.host, s);
      }

      sendResponse({ ok: true });
    } catch (err) {
      sendResponse({ ok: false, error: String(err) });
    }
    return true;
  } else if (msg.action === 'openSettings') {
    // legacy support: open in-page UI not used anymore
    sendResponse({ ok: false, error: 'In-page UI removed; use popup.' });
    return true;
  }

  // indicate async response possible
  return true;
});