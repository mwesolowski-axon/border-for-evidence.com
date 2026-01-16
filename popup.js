// popup.js — native action popup; live-apply + persist on change.

const hostLbl    = document.getElementById('hostLbl');
const noBorder   = document.getElementById('noBorder');
const color      = document.getElementById('color');
const hex        = document.getElementById('hex');
const widthInput = document.getElementById('width');

const solidSwatches = Array.from(document.querySelectorAll('#swatches .sw'));
const multiSwatches = Array.from(document.querySelectorAll('#multiSwatches .sw'));

const stripeSwatches        = Array.from(document.querySelectorAll('.stripe-swatch'));
const customStripeControls  = document.getElementById('customStripeControls');
const swCustom              = document.getElementById('swCustom');
const mcColor               = document.getElementById('mcColor');
const mcHex                 = document.getElementById('mcHex');
const mcSwatches            = Array.from(document.querySelectorAll('#mcSwatches .sw'));

const modeBorder = document.getElementById('modeBorder');
const modeBanner = document.getElementById('modeBanner');

const opacityInput = document.getElementById('opacity');
const opacityRange = document.getElementById('opacityRange');

let activeHost = null;
let activeStripe = 1;
let stripeColor1 = '#c62828';
let stripeColor2 = '#1e88e5';

function normalizeColor(val) { return val ? val.trim().toLowerCase() : ''; }

function updateStripeUI() {
  // Update stripe swatch backgrounds
  const s1 = document.getElementById('stripe1');
  const s2 = document.getElementById('stripe2');
  if (s1) s1.style.background = stripeColor1;
  if (s2) s2.style.background = stripeColor2;

  // Update custom swatch preview
  if (swCustom) {
    swCustom.style.background =
      `repeating-linear-gradient(45deg, ${stripeColor1} 0 10px, ${stripeColor2} 10px 20px)`;
  }

  // Update the picker to match active stripe
  const current = activeStripe === 1 ? stripeColor1 : stripeColor2;
  mcColor.value = current;
  mcHex.value   = current;
}

function populateUI(settings) {
  noBorder.checked = !!settings.disabled;
  widthInput.value = settings.width ?? 8;
  color.value      = settings.color || '#c62828';
  hex.value        = settings.color || '#c62828';

  // Opacity (0–1) -> UI percent
  const op = typeof settings.opacity === 'number' ? settings.opacity : 1;
  const opPct = Math.round(op * 100);
  if (opacityInput) opacityInput.value = opPct;
  if (opacityRange) opacityRange.value = opPct;
  
  // Mode (border vs banner)
  if (settings.mode === 'banner') {
    modeBanner.checked = true;
    modeBorder.checked = false;
  } else {
    modeBorder.checked = true;
    modeBanner.checked = false;
  }
  // Solid swatches selection (for solid style)
  solidSwatches.forEach(s => {
    const c = s.dataset.color;
    s.classList.toggle(
      'selected',
      settings.style === 'solid' && normalizeColor(c) === normalizeColor(settings.color)
    );
  });

  // Multi-color swatches selection (caution/custom)
  multiSwatches.forEach(s => {
    const styleType = s.dataset.style;
    s.classList.toggle('selected', settings.style === styleType);
  });

  // Stripe colors (for custom)
  stripeColor1 = settings.stripeColor1 || '#c62828';
  stripeColor2 = settings.stripeColor2 || '#1e88e5';
  activeStripe = 1;
  stripeSwatches.forEach(sw => {
    sw.classList.toggle('selected', sw.dataset.stripe === String(activeStripe));
  });
  updateStripeUI();

  // Show/hide custom stripe controls
  customStripeControls.style.display = settings.style === 'custom' ? 'block' : 'none';
}

function buildSettingsFromUI() {
  // Determine style based on selected multi swatch
  let style = 'solid';
  const selectedMulti = document.querySelector('#multiSwatches .sw.selected');
  if (selectedMulti) {
    const st = selectedMulti.dataset.style;
    if (st === 'caution') style = 'caution';
    else if (st === 'custom') style = 'custom';
  }

  // Mode (border vs banner)
  const mode = (modeBanner && modeBanner.checked) ? 'banner' : 'border';

  // Opacity percent -> 0–1
  let opPct = 100;
  if (opacityInput) {
    const parsed = parseInt(opacityInput.value || '100', 10);
    opPct = isNaN(parsed) ? 100 : parsed;
  }
  opPct = Math.max(0, Math.min(100, opPct));
  const opacity = opPct / 100;

  return {
    width: Math.max(0, Math.min(50, parseInt(widthInput.value || '8', 10) || 8)),
    color: hex.value || color.value,
    disabled: !!noBorder.checked,
    style,
    stripeColor1,
    stripeColor2,
    mode,
    opacity
  };
}

// Send settings to the active tab; optionally persist (content script handles save)
function sendSettingsToActiveTab(settings, { save } = { save: true }) {
  if (!activeHost) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs.length) return;
    const tab = tabs[0];

    chrome.tabs.sendMessage(
      tab.id,
      {
        action: save ? 'applySettings' : 'applySettingsLive',
        settings,
        host: activeHost
      },
      () => {
        // ignore errors if content script not present
      }
    );
  });
}

// live = true  => apply only (no persist)
// live = false => apply + persist
function applyAndSave({ live = false } = {}) {
  if (!activeHost) return;
  const settings = buildSettingsFromUI();
  sendSettingsToActiveTab(settings, { save: !live });
}

function loadForHost(host) {
  if (!host) return;
  chrome.storage.sync.get([host], (res) => {
    const s = res[host] || {};
    const merged = {
      width: 8,
      color: '#c62828',
      disabled: false,
      style: 'solid',
      stripeColor1: '#c62828',
      stripeColor2: '#1e88e5',
      mode: 'border',
      opacity: 1,
      ...s
    };
    populateUI(merged);
    // Usually not necessary to auto-apply; content script already applies on page load.
    // applyAndSave({ live: false });
  });
}

// --- wiring events for live updates ---

// Toggle border on/off: infrequent, commit immediately
noBorder.addEventListener('change', () => applyAndSave({ live: false }));

// Mode (border vs banner): commit immediately
if (modeBorder) {
  modeBorder.addEventListener('change', () => applyAndSave({ live: false }));
}
if (modeBanner) {
  modeBanner.addEventListener('change', () => applyAndSave({ live: false }));
}

// WIDTH: live while changing, commit on blur/Enter or popup close
widthInput.addEventListener('input', () => applyAndSave({ live: true }));

widthInput.addEventListener('blur', () => {
  applyAndSave({ live: false });
});

widthInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    applyAndSave({ live: false });
  }
});

// OPACITY number: live on input, commit on blur/Enter
if (opacityInput && opacityRange) {
  opacityInput.addEventListener('input', () => {
    let val = parseInt(opacityInput.value || '100', 10);
    if (isNaN(val)) val = 100;
    val = Math.max(0, Math.min(100, val));
    opacityRange.value = String(val);
    applyAndSave({ live: true });
  });

  opacityInput.addEventListener('blur', () => {
    let val = parseInt(opacityInput.value || '100', 10);
    if (isNaN(val)) val = 100;
    val = Math.max(0, Math.min(100, val));
    opacityInput.value = String(val);
    opacityRange.value = String(val);
    applyAndSave({ live: false });
  });

  opacityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      let val = parseInt(opacityInput.value || '100', 10);
      if (isNaN(val)) val = 100;
      val = Math.max(0, Math.min(100, val));
      opacityInput.value = String(val);
      opacityRange.value = String(val);
      applyAndSave({ live: false });
    }
  });

  // OPACITY slider: live while dragging, commit on change
  opacityRange.addEventListener('input', () => {
    const val = parseInt(opacityRange.value || '100', 10);
    opacityInput.value = String(val);
    applyAndSave({ live: true });
  });

  opacityRange.addEventListener('change', () => {
    const val = parseInt(opacityRange.value || '100', 10);
    opacityInput.value = String(val);
    applyAndSave({ live: false });
  });
}

// COLOR picker (solid): commit immediately
color.addEventListener('input', () => {
  hex.value = color.value;
  solidSwatches.forEach(x => x.classList.remove('selected'));
  applyAndSave({ live: false });
});

// HEX input (solid): normalize, then commit
hex.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const val = hex.value.trim();
  const normalized =
    val.startsWith('#') || val.toLowerCase().startsWith('rgb')
      ? val
      : (/^[0-9a-f]{3,6}$/i.test(val) ? '#' + val : null);

  if (!normalized) {
    hex.value = color.value;
    return;
  }

  hex.value = normalized;
  if (normalized.startsWith('#')) color.value = normalized;
  solidSwatches.forEach(x => x.classList.remove('selected'));
  applyAndSave({ live: false });
});

hex.addEventListener('blur', () => {
  const val = hex.value.trim();
  if (!val) { hex.value = color.value; return; }

  const normalized =
    val.startsWith('#') || val.toLowerCase().startsWith('rgb')
      ? val
      : (/^[0-9a-f]{3,6}$/i.test(val) ? '#' + val : null);

  if (!normalized) {
    hex.value = color.value;
    return;
  }

  hex.value = normalized;
  if (normalized.startsWith('#')) color.value = normalized;
  solidSwatches.forEach(x => x.classList.remove('selected'));
  applyAndSave({ live: false });
});

// Solid swatches: click = select + commit (solid style)
solidSwatches.forEach(s => {
  s.addEventListener('click', () => {
    solidSwatches.forEach(x => x.classList.remove('selected'));
    multiSwatches.forEach(x => x.classList.remove('selected'));
    s.classList.add('selected');

    const c = s.dataset.color;
    color.value = c;
    hex.value   = c;

    customStripeControls.style.display = 'none';

    applyAndSave({ live: false });
  });
});

// Multi-color swatches (caution/custom): click = select + commit
multiSwatches.forEach(s => {
  s.addEventListener('click', () => {
    solidSwatches.forEach(x => x.classList.remove('selected'));
    multiSwatches.forEach(x => x.classList.remove('selected'));
    s.classList.add('selected');

    const styleType = s.dataset.style;
    if (styleType === 'custom') {
      customStripeControls.style.display = 'block';
    } else {
      customStripeControls.style.display = 'none';
    }

    // Immediately apply the new style with current stripe colors
    applyAndSave({ live: false });
  });
});

// Stripe swatches: choose which stripe to edit
stripeSwatches.forEach(sw => {
  sw.addEventListener('click', () => {
    const stripe = parseInt(sw.dataset.stripe, 10);
    activeStripe = stripe;
    stripeSwatches.forEach(x => x.classList.remove('selected'));
    sw.classList.add('selected');

    const current = activeStripe === 1 ? stripeColor1 : stripeColor2;
    mcColor.value = current;
    mcHex.value   = current;
  });
});

// Multi-color default swatches: set active stripe color quickly
mcSwatches.forEach(sw => {
  sw.addEventListener('click', () => {
    const c = sw.dataset.color;
    if (!c) return;

    if (activeStripe === 1) {
      stripeColor1 = c;
    } else {
      stripeColor2 = c;
    }

    mcColor.value = c;
    mcHex.value   = c;
    updateStripeUI();
    applyAndSave({ live: false });
  });
});

// Multi-color picker: commit immediately for active stripe
mcColor.addEventListener('input', () => {
  const val = mcColor.value;
  if (activeStripe === 1) {
    stripeColor1 = val;
  } else {
    stripeColor2 = val;
  }
  mcHex.value = val;
  updateStripeUI();
  applyAndSave({ live: false });
});

// Multi-color hex: normalize, then commit for active stripe
mcHex.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const val = mcHex.value.trim();
  const normalized =
    val.startsWith('#') || val.toLowerCase().startsWith('rgb')
      ? val
      : (/^[0-9a-f]{3,6}$/i.test(val) ? '#' + val : null);

  const current = activeStripe === 1 ? stripeColor1 : stripeColor2;

  if (!normalized) {
    mcHex.value = current;
    return;
  }

  mcHex.value   = normalized;
  mcColor.value = normalized;

  if (activeStripe === 1) {
    stripeColor1 = normalized;
  } else {
    stripeColor2 = normalized;
  }

  updateStripeUI();
  applyAndSave({ live: false });
});

mcHex.addEventListener('blur', () => {
  const val = mcHex.value.trim();
  const current = activeStripe === 1 ? stripeColor1 : stripeColor2;

  if (!val) {
    mcHex.value = current;
    return;
  }

  const normalized =
    val.startsWith('#') || val.toLowerCase().startsWith('rgb')
      ? val
      : (/^[0-9a-f]{3,6}$/i.test(val) ? '#' + val : null);

  if (!normalized) {
    mcHex.value = current;
    return;
  }

  mcHex.value   = normalized;
  mcColor.value = normalized;

  if (activeStripe === 1) {
    stripeColor1 = normalized;
  } else {
    stripeColor2 = normalized;
  }

  updateStripeUI();
  applyAndSave({ live: false });
});

function showExtensionVersion() {
  const manifest = chrome.runtime.getManifest();
  if (!manifest || !manifest.version) return;

  const versionEl = document.getElementById('extension-version');
  if (versionEl) {
    versionEl.textContent = `Version: ${manifest.version}`;
  }
}

// FINAL COMMIT when the popup closes (icon toggled, page clicked, etc.)
window.addEventListener('unload', () => {
  applyAndSave({ live: false });
});

// On open: detect active tab + host, load settings
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs || !tabs.length) return;
  const tab = tabs[0];
  try {
    const url = new URL(tab.url);
    activeHost = url.hostname;
    hostLbl.textContent = activeHost;
    loadForHost(activeHost);
  } catch (e) {
    hostLbl.textContent = 'Unsupported page';
  }
  showExtensionVersion();
});