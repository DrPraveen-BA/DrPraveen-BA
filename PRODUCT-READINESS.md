# Clario Studio: peer audit and commercial readiness

Research date: 13 October 2026. This document describes capabilities implemented in source, not a certification of Windows/browser release readiness. Clario is not yet a complete Snagit replacement or ready to sell as feature-equivalent.

## Peer findings

Official sources consulted:
- Microsoft Snipping Tool: https://support.microsoft.com/en-au/windows/apps/use-snipping-tool-to-capture-screenshots
- TechSmith Snagit features: https://www.techsmith.com/snagit/features/
- TechSmith scrolling capture: https://support.techsmith.com/hc/en-us/articles/41686829112205-Does-Snagit-Support-Scrolling-Capture
- TechSmith blur and redaction: https://www.techsmith.com/learn/tutorials/snagit/blur/
- ShareX feature listing: https://getsharex.com/
- ShareX local Windows OCR: https://getsharex.com/docs/ocr.html
- PicPick feature/help index: https://picpick.app/en/readme/?lang=en
- Screen capture platform behavior: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
- Media recording API: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder

Snipping Tool provides a familiar minimal capture and markup workflow, region/freeform/window/screen modes, recording, shapes, and text actions. Snagit expands into scrolling capture, rich annotation, effects, OCR, recording, GIF output, and organized sharing/file workflows; offerings vary by platform/plan. ShareX emphasizes global shortcuts, workflows, OCR, GIFs, and configurable upload destinations. PicPick includes capture modes, editing, configurable hotkeys, and design utilities such as rulers and color picking. Feature sets evolve; verify current platform and plan coverage before publishing comparisons.

## Coverage in this build

| Capability | Clario status | Practical detail |
|---|---|---|
| Screen / window / tab screenshot | Implemented, device verification pending | Browser source chooser; sources cannot be silently forced |
| Rectangular region screenshot | Implemented after capture | Capture source, then select/crop locally |
| Delayed capture | Implemented | 0/3/5/10 sec after permission |
| Upload / paste / drag-drop | Implemented | PNG, JPG, WebP; 32 MB import limit |
| Visual text highlight | Implemented | Manual translucent rectangular overlay |
| Shapes / colors / borders | Implemented | Rectangle, ellipse, line, arrow; border-only or filled; color, weight, opacity |
| Freehand drawing / text / numbered steps | Implemented | Multiline text and editable text; manual numbered steps |
| Select / move / resize / unselect | Implemented | Pointer selection and lower-right handle; Esc cancels selection |
| Erase / delete / duplicate / reorder | Implemented | Removes annotation layers, not source pixels |
| Undo / redo | Implemented and handler-tested | Dimensions and annotation state included; bounded memory history |
| Crop / resize / rotate / image border | Implemented | Flattens marks; undo restores editability |
| Blur / opaque redaction | Implemented | Only flattened export hides source; editable projects retain original |
| PNG / JPG / WebP export | Implemented | Selection/crop overlays omitted; JPG receives white background |
| Copy image | Implemented, browser-dependent | PNG ClipboardItem; actionable fallback |
| Editable project save/open | Implemented and validation-tested | Embedded image + vector annotations in JSON |
| Local recent projects | Implemented, storage-dependent | Last eight documents; no cloud sync |
| Video snippets | Implemented, device verification pending | Browser MediaRecorder, max 5 wall-clock minutes / approx. 100 MB |
| Pause / resume / stop / preview / download | Implemented, mocked media tests pass | Actual recording format depends on browser |
| Screen audio / microphone | Implemented, device verification pending | Permission and source-dependent; audio mixing when both available |
| Image from recorded video frame | Implemented | Current playback frame to image editor |
| Windows launcher / desktop shortcut | Source implemented, Windows verification pending | Portable folder; no native installer |
| Native screen overlay / global hotkeys / tray | Missing | Requires a native desktop shell |
| Freeform native region / window controls / multi-monitor precision | Missing | Native capture integration and physical-device testing |
| Scrolling / panoramic capture | Missing | Browser extension or native capture + stitching |
| OCR / editable screenshot text / automatic sensitive-data detection | Missing | Local OCR engine, language packs, accuracy evaluation |
| GIF conversion / guaranteed MP4 / trim / captions | Missing | Media conversion and video editing pipeline |
| Webcam overlays / cursor effects / noise cleanup | Missing | Recording compositor and audio processing |
| Background removal / smart move / simplify / templates | Missing | Image models or deterministic editor features; no AI placeholders |
| Cloud share links / collaboration / third-party destinations | Missing | Storage, auth, consent, access controls, retention |
| Capture workflow automation / bulk exports / QR / ruler / screen picker | Missing | Additional desktop/extension tools |
| Native installer / updates / signing / licensing / payments | Missing | Commercial distribution and account/licensing system |

## Validation performed

- JavaScript syntax checks for app.js, editor-core.js, media.js.
- 25 dependency-free Node tests: real editor handlers for crop undo/redo, eight arrow cases, annotation eraser, clean export composition; history, clipping, geometry and project validation; mocked capture/recording lifecycle, permission failure cleanup, pause/resume, browser Stop sharing, and time limit.
- Native canvas pixel QA using the available @napi-rs/canvas runtime: opaque redaction, clean export, crop undo geometry/content, and vertical-arrow rendering. This verifies image composition, not browser/Windows rendering.

No browser automation capability was available. Desktop layout, pointer/touch usability, real screen permissions, real audio/video files, local IndexedDB persistence, Windows launcher/shortcut execution, and physical-device behavior remain unverified. Do not advertise these as release-tested.

## Work needed for a sellable competitor

1. Run Windows 10/11 device UAT in current Edge/Chrome: standard/user/OneDrive folders, spaces/non-ASCII paths, managed policies, source chooser cancel, all monitor combinations, different DPI/zoom, audio permissions, long recordings, export reopen and crash recovery. Fix every release-blocking defect.
2. Build a signed native Windows shell (for example Electron or Tauri plus native capture integration) for global hotkeys, tray, region overlays and reliable screen/window capture. Produce installer/uninstaller, update channel and diagnostics. Native recording needs explicit start/stop and device handling.
3. Add local OCR (including language packs), scrolling capture/stitching, GIF and MP4 conversion, trim, and accessible keyboard editing. Validate on messy inputs and large displays; avoid parity claims until verified.
4. Add commercial foundations: licensing/payment integration, refund/support workflow, privacy policy and local retention controls. Public share links require separate auth/storage/authorization work; do not upload users' screenshots by default.
5. Ship a limited paid beta only after these checks, with an honest published capability table. Position around fast, private visual communication rather than claiming every competitor feature.

The generated logo is an original concept, not trademark clearance. Check name/logo availability before commercial branding.
