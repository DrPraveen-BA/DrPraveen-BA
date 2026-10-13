# Clario Studio — start here

Download the ZIP from the codex/clario-windows-launcher branch and extract the ENTIRE folder to a permanent location, such as Documents/Clario. Double-click Launch-Clario.cmd. Optional: run Install-Clario-Shortcut.cmd once for a desktop shortcut. Do not run from inside the ZIP preview. Keep the folder in place after installing a shortcut.

Clario runs locally in Edge or Chrome. Normal launch uses a batch file, with no PowerShell, Node.js, Python, account, server, or administrator privileges required. Optional shortcut creation uses Windows PowerShell. On a managed computer, policies can block launch scripts. Open index.html directly in Edge or Chrome if needed. Do not disable organizational security policies.

## Capture → clarify → save

1. Click Capture screenshot, choose a screen, window, or browser tab in the browser's permission dialog. The browser determines available sources. Use Region to capture first, then drag the part to keep and Apply crop. Optional delay starts after permission. Alternatively paste with Ctrl+V, drag an image into the workspace, or Open image / project. Try a sample capture for a guided first test.
2. Highlight text visually; draw rectangles/ellipses (border-only or filled), arrows, lines, or pen strokes; add text and numbered steps. Select to move or resize using the lower-right handle. Eraser removes annotations, not the underlying screenshot. Delete, duplicate, reorder, or edit selected text. Escape unselects. Undo and redo work across crop and image transformations.
3. Export PNG, JPG, or WebP; Copy image where clipboard access is permitted. Save an editable .clario.json project to retain annotations. Browser-local projects keep the last eight documents where IndexedDB is available; storage can be cleared or denied by browser settings. Export a file for a dependable backup.

Text highlighting is manual visual markup, not OCR text recognition. Redact paints opaque black over a region in exported images. Blur is only a visual effect; it is not secure redaction. Editable project files and local projects retain the original image, even under redaction.

Crop, rotate, resize, and image-border operations flatten annotations into the resulting image. Undo restores the previous editable state. The editor keeps up to 30 history entries with an approximately 32 MB serialized history budget; very large captures may have fewer undo steps.

## Video snippets

Click Record video, choose a source, then Stop & preview. Optional screen audio depends on the selected source, OS, and browser. Microphone access needs separate permission. If both sources supply audio, they are mixed. Pause/resume and browser Stop sharing finalize safely. Recordings stop after five wall-clock minutes or approximately 100 MB of buffered data. Preview and download before closing. Capture current frame sends a video frame to the image editor.

Downloads use the browser-supported WebM or MP4 recording format. GIF conversion, trimming, video region overlays, captions, and webcam overlays are not part of this edition.

## Shortcuts

Ctrl+Z undo; Ctrl+Y / Ctrl+Shift+Z redo; Ctrl+S save project; Ctrl+D duplicate; Delete remove selection; Esc unselect. V select, H highlight, R rectangle, O ellipse, A arrow, L line, D pen, T text, N step, E eraser, C crop. These shortcuts work only when Clario is focused and not while typing in a field.

## Limits and troubleshooting

- Recommended: current desktop Chrome or Edge. Screen capture and clipboard depend on browser permissions and secure contexts; if unavailable locally, use Win+Shift+S and paste or import a saved image.
- Maximum imported file: 32 MB; image: 8192 pixels per side and 32 megapixels. Maximum imported annotations: 2000. Large files can exhaust memory; use a smaller capture when needed.
- If launching fails, ensure all files were extracted; use the visible error. Browser app-mode launch and desktop shortcut behavior still need Windows-device testing.
- If the app window is blank, open index.html directly. Prefer plain folder names without URL-special characters such as #.
- Remove the optional desktop shortcut by deleting Clario.lnk. Moving the app folder requires recreating the shortcut. No registry settings are changed.
- Images and projects remain on the device. No cloud upload, public link, payment flow, telemetry, or account service is included.

This is a browser-first development build. See PRODUCT-READINESS.md for the peer feature audit and remaining work before a paid launch.
