# Border for Evidence.com

Border for Evidence.com is a small browser extension that lets you visually highlight the Evidence.com interface with configurable borders.  
You can quickly apply consistent border colors and a caution pattern using convenient swatches directly in the page UI.

Currently supported browsers:

- Google Chrome (and other Chromium-based browsers)
- Mozilla Firefox
- Microsoft Edge (Chromium)

---

## Features

- Add a visible border around key Evidence.com views.
- Quick color swatches:
  - Red, Blue, Yellow, Purple, Orange, Green
  - Black/Yellow “caution” pattern

---

## Installation – Chrome

You can install the extension in Chrome either as an unpacked extension (developer/testing) or via a packaged `.crx` if provided.

### Option 1: Unpacked (for development / testing)

1. Open Chrome.
2. Navigate to: `chrome://extensions/`
3. In the top-right, enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the folder containing:
   - `manifest.json`
   - `content-script.js` (and any other extension files)
6. Confirm the extension appears in the list and is **Enabled**.

### Option 2: Packaged `.crx` (if provided)

1. Obtain the `border-for-evidence-com.crx` file from your team.
2. Open `chrome://extensions/`.
3. Drag and drop the `.crx` file into the page.
4. Review and accept the permission prompt.

---

## Installation – Firefox

For Firefox, you can use **temporary loading** for testing or install a signed `.xpi`/`.zip` build.

### Option 1: Temporary add-on (development / testing)

1. Open Firefox.
2. Navigate to: `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on…**.
4. In the file picker, select `manifest.json` (or any file within the extension folder).
5. Firefox will load the extension **until the browser is restarted**.

### Option 2: Signed `.xpi` / `.zip` 

1. Obtain the signed `border-for-evidence-com.xpi` (or `.zip`) file from your team or build pipeline.
2. Drag and drop the file onto a Firefox window  
   **or** open `about:addons`, click the gear icon, and choose **Install Add-on From File…**.
3. Accept the installation prompt.

> In some organizations, Firefox can be centrally managed and extensions distributed via policies; check with your IT admin if needed.

---

## Installation – Microsoft Edge (Chromium)

Edge supports Chrome-style extensions.

### Option 1: Unpacked (for development / testing)

1. Open Edge.
2. Navigate to: `edge://extensions/`
3. Enable **Developer mode** (toggle in the left menu or top-right).
4. Click **Load unpacked**.
5. Select the folder containing:
   - `manifest.json`
   - `content-script.js` (and any other extension files)
6. Confirm the extension is **On** in the list.

### Option 2: From a `.crx` or Edge Add-ons Store

If you have a packaged version:

1. Open `edge://extensions/`.
2. Drag and drop the `.crx` file into the page and accept the prompt  
   **or** install from the Microsoft Edge Add-ons store if your team publishes it there.

---

## Using Border for Evidence.com

Once installed:

1. Navigate to an Evidence.com page (for example, `https://<tenant>.evidence.com/axon/evidence-search`).
2. Ensure the extension is active for the site:
   - In some browsers you may need to allow the extension to run on the Evidence.com domain (click the extension icon → **Allow on this site** or similar).
3. Open the extension settings
   - A settings gear icon overlayed onto the Evidence.com page UI.
4. Use the **Color picker** and **color swatches**:
   - Click a color swatch (red, blue, yellow, purple, orange, green) to set the border.
   - Click the **black/yellow** swatch to use the caution pattern.
   - The currently active swatch is visually highlighted.
5. The border around the targeted Evidence.com area should update immediately.

Popup and in-page settings integration
- A browser-action popup (popup.html + popup.js) was added. The popup intentionally reuses the same in-page settings UI — there is no duplicated settings logic.
- When you click "Open in-page settings" in the popup, the popup sends a message to the content script on the active tab:
  - The content script responds to messages with { action: 'openSettings' } and calls the same renderSettings() path used by the in-page UI.
- The in-page settings panel now closes when the user clicks anywhere outside the panel (click-outside behavior).
- No new host_permissions or extension permissions were added. The extension still limits host access to the existing "https://*.evidence.com/*" host permission and uses the same storage permission ("storage").
- Implementation notes:
  - renderSettings() is exposed internally by the content script and invoked by the message listener (chrome.runtime.onMessage).
  - The popup uses chrome.tabs.sendMessage to request the open; if the active tab is not a matching host, the content script will not be present and popup shows a short inline feedback message.
  - Storage and UI state behavior remain unchanged (settings are stored per-host via chrome.storage.sync or localStorage fallback).