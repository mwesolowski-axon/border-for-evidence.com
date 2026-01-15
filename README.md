# Border for Evidence.com

Border for Evidence.com is a small browser extension that lets you visually highlight the Evidence.com interface with configurable borders or a top banner-style border.  
You can quickly apply consistent colors, a caution pattern, and custom stripes, and you can control the opacity of the overlay so it doesn’t overwhelm the UI.

Currently supported browsers:

- Google Chrome (and other Chromium-based browsers)
- Microsoft Edge (Chromium)

---

## Features

- Add a visible **border** around key Evidence.com views, or switch to a **banner** mode that draws a border only along the top edge of the screen.
- Quick color swatches:
  - Red, Blue, Yellow, Purple, Orange, Green
  - Black/Yellow “caution” pattern
  - Custom stripes (two-color diagonal pattern)
- Adjustable **opacity** so you can make the border/banner more or less prominent.

---

## Installation – Chrome (from Chrome Web Store)

1. Open the Chrome Web Store URL https://chromewebstore.google.com/ and search for the extension **"Border for Evidence.com"**.
2. Click **Add to Chrome**.
3. Review and confirm the permissions:

   > Note: The Chrome Web Store warns that this extension can “read and change your data on all evidence.com sites” because the extension injects a content script into `https://*.evidence.com/*` pages in order to draw the border or top banner. Technically, any script running in that context could read or change the page, so Chrome uses that generic warning.  
   > In this implementation, the script only:
   > - Adds a fixed overlay border (all four sides) or a top-edge banner element, and  
   > - Stores per‑host visual settings (width, style, colors, mode, opacity) in extension storage.  
   >
   > It does **not** collect or transmit page content, evidence, or credentials anywhere.

4. After installation, pin the extension:
   - Click the puzzle‑piece icon in the toolbar.
   - Find **“Border for Evidence.com”** and click the pin icon.

---

## Installation – Microsoft Edge (using the Chrome Web Store listing)

You can install it in Edge directly from the Chrome Web Store:

1. Open Edge and go to the same Chrome Web Store link.
2. The first time you do this, Edge will show a banner:  
   “Allow extensions from other stores” – click **Allow**.
3. On the extension’s page, click **Add to Chrome**.
4. Edge will show its own dialog; click **Add extension**.
5. Pin the extension:
   - Click the puzzle‑piece icon in the Edge toolbar.
   - Find **“Border for Evidence.com”** and click the pin icon.

---

## Using Border for Evidence.com

Open any Evidence.com page (e.g., `https://swsstams.evidence.com/...`).  
Click the extension’s icon (Axon logo) in the browser toolbar to open the popup.

### At the top

- You’ll see the current host (e.g., `swsstams.evidence.com`) so you know which environment you’re configuring.

## All settings apply to this hostname only.

---

### No border

**“No border for this site”**:

- Check this if you want to disable the overlay entirely (no border and no top banner) for the current host.

---

### Mode: Border vs Banner

You can choose how the overlay is drawn:

- **Border mode**  
  Draws a visible border around the main Evidence.com view on **all four sides** of the screen.

- **Banner mode**  
  Draws a **single border only along the top edge** of the screen, spanning the width of the view.  
  The left, right, and bottom edges are **not** drawn in this mode, making it a lighter, banner-style indicator that still clearly marks the environment.

Switching between these modes updates how the highlight appears on the page while preserving your other settings (color, style, width, opacity).

---

### Solid color

**Color (for solid style):**

- Use the color picker to choose any color.
- Or type a hex/RGB value (e.g., `#c62828`, `#ffeb3b`, `rgb(255,0,0)`).

**Preset solid swatches** below let you quickly pick common colors.  
This style creates a single solid color for the border (all four sides) or top banner, depending on the selected mode.

---

### Multi‑Color

#### Caution

- Click the **caution** chip to get a yellow/black diagonal “caution tape” style overlay.
- In border mode, this appears along all four edges; in banner mode, it appears only along the top edge.

#### Custom

- Click the **custom** chip to enable a two‑color diagonal stripe overlay.
- A **Color A / Color B** section appears:
  - Click **Color A** or **Color B** to choose which stripe you’re editing.
  - For the active stripe:
    - Click one of the preset swatches for a quick color, or
    - Use the color picker, or
    - Type a hex/RGB value.

The small preview chips and the overlay update immediately as you change colors (applied to all four sides in border mode, or just the top in banner mode).

---

### Border width

**Border width (px):**

- Enter a value between **0 and 50**.
- The border width changes live as you type.

Behavior:

- In **border mode**, this controls the thickness of the border on all four sides.
- In **banner mode**, this controls the thickness of the **top** border only.

---

### Opacity

**Opacity (%):**

- Adjust how transparent or opaque the overlay appears.
- You can:
  - Use a slider, and/or
  - Type a numeric value (0–100).

Behavior:

- **0%** – fully transparent (effectively invisible).  
- **100%** – fully opaque (maximum visibility).  
- Any value in between gives a semi‑transparent overlay so you can still see the Evidence.com UI underneath.

Opacity applies to the chosen mode:

- In **border mode**, it affects the four-edge border.
- In **banner mode**, it affects the single top-edge banner.

---

### Persistence and scope

All settings are saved **per hostname**:

- For example, `swsstams.evidence.com` and `inttraining.evidence.com` can each have their own:
  - Width
  - Style (solid / caution / custom stripes)
  - Colors
  - Mode (border or top-only banner)
  - Opacity

Settings automatically re‑apply whenever you load a page on that host.

If your browser profile syncs extension data (e.g., Chrome Sync), these visual preferences may follow you to other devices using the same profile.
