# Border for Evidence.com

Border for Evidence.com is a small browser extension that lets you visually highlight the Evidence.com interface with configurable borders.  
You can quickly apply consistent border colors and a caution pattern using convenient swatches directly in the page UI.

Currently supported browsers:

- Google Chrome (and other Chromium-based browsers)
- Microsoft Edge (Chromium)

---

## Features

- Add a visible border around key Evidence.com views.
- Quick color swatches:
  - Red, Blue, Yellow, Purple, Orange, Green
  - Black/Yellow “caution” pattern
  - Custom stripes

---

## Installation – Chrome (from Chrome Web Store)
1. Open the Chrome Web Store URL https://chromewebstore.google.com/ and search for the extension "Border for Evidence.com" :
2. Click Add to Chrome.
3. Review and confirm the permissions:

Note: The Chrome Web Store warns that this extension can “read and change your data on all evidence.com sites” because the extension injects a content script into https://*.evidence.com/* pages in order to draw the border. Technically, any script running in that context could read or change the page, so Chrome uses that generic warning.
In my implementation, the script only:
 - Adds a fixed overlay border element, and
- Stores per‑host visual settings (width, style, colors) in extension storage.

It does not collect or transmit page content, evidence, or credentials anywhere.

4. After installation, pin the extension:
 - Click the puzzle‑piece icon in the toolbar.
 - Find “Border for Evidence.com” and click the pin icon.

## Installation – Microsoft Edge (using the Chrome Web Store listing)

You can install it in Edge directly from the Chrome Web Store:
1. Open Edge and go to the same Chrome Web Store link.
2. The first time you do this, Edge will show a banner:
“Allow extensions from other stores” – click Allow.
3. On the extension’s page, click Add to Chrome.
4. Edge will show its own dialog; click Add extension.
5. Pin the extension:
Click the puzzle‑piece icon in the Edge toolbar.
Find “Border for Evidence.com” and click the pin icon.

## Using Border for Evidence.com
Open any Evidence.com page (e.g., https://swsstams.evidence.com/...).
Click the extension’s icon (Axon logo) in the browser toolbar to open the popup.

### At the top
- You’ll see the current host (e.g., swsstams.evidence.com) so you know which environment you’re configuring.

## All settings apply to this hostname only.
### No border
- “No border for this site”:

Check this if you want to disable the border entirely for the current host.

### Solid color
 - Color (for solid style):

Use the color picker to choose any color.
Or type a hex/RGB value (e.g., #c62828, #ffeb3b, rgb(255,0,0)).

### Preset solid swatches below let you quickly pick common colors.
This style creates a single solid border color.

#### Multi‑Color
##### Caution
Click the caution chip to get a yellow/black diagonal “caution tape” border.

##### Custom
Click the custom chip to enable a two‑color diagonal stripe border.
 - A “Color A / Color B” section appears:
 - Click Color A or Color B to choose which stripe you’re editing.
  - For the active stripe:
  - Click one of the preset swatches for a quick color, or
  - Use the color picker, or
  - Type a hex/RGB value.
 The small preview chips and the border update immediately as you change colors.

#### Border width
Border width (px):
 - Enter a value between 0 and 50.
The border width changes live as you type.

#### Persistence and scope
All settings are saved per hostname:
 - For example, swsstams.evidence.com and inttraining.evidence.com can each have their own width, style, and colors.

Settings automatically re‑apply whenever you load a page on that host.
 - If your browser profile syncs extension data (e.g., Chrome Sync), these visual preferences may follow you to other devices using the same profile.
