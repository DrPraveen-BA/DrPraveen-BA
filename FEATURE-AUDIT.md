# Clario 0.3.0 feature audit

Audit date: 13 October 2026. Status terms: **tested** means named automated evidence exists; **source** means implemented but end-user/platform behavior is unverified; **configured** means an operator must provision an external service or key; **gap** means not implemented. No claim of complete competitor parity is made.

## Capture and desktop

| Requirement / peer capability | Status | Evidence / boundary |
|---|---|---|
| Screen, window, tab screenshots | Browser source + native source | Browser chooses surfaces; native shell exposes screens/windows; platform UAT pending |
| Native rectangular region | Source, geometry tested | Frozen screen overlay; DIP-to-pixel mapping tests; one selected display per capture |
| Native freeform region | Source | Draw boundary, PNG alpha mask; sharp processing; physical overlay UAT pending |
| Delayed screenshot | Source | Browser/native 0/3/5/10 seconds; permission timing differs by mode |
| Global shortcuts | Source | Ctrl+Shift+2 region, +3 screen, +4 freeform; registration-failure notice |
| Tray capture / single instance | Source | Tray menu, open/quit, second-instance focus |
| Native screen/window chooser | Source | Explicit source thumbnails and no silent renderer selection |
| Website full-page capture | Extension source | Explicit active-tab debugger capture, detach in finally; engine limits enforced |
| Cross-application scrolling / panoramic capture | Gap | Manual screenshots can be stitched; arbitrary app auto-scroll not implemented |
| Manual vertical stitching | Core tested + UI source | 2–12 images, explicit overlap, output limits; no automatic seam finding |
| Multiple monitor/DPI precision | Geometry tested; platform gap | Selected monitor scale mapping; spanning monitors and unusual DPI UAT pending |
| Capture presets / scheduled workflows | Gap | Delay and fixed shortcuts only; no arbitrary workflow engine |
| Native pin-to-screen / magnifier / ruler / protractor | Gap | Not part of current tools |

## Markup, editing, documents

| Requirement | Status | Evidence / boundary |
|---|---|---|
| Colored highlights, rectangle/ellipse borders/fills, line/arrow/pen | Source + handler/pixel tests | Border-only or filled shapes, color, opacity, stroke |
| Text, numbered steps, selection/move/resize | Source | Editable multiline text; handle resize; step sizing fixed |
| Erase/unselect/delete/duplicate/front | Handler tested + source | Eraser removes annotations, not screenshot pixels |
| Undo/redo across crop | Handler and pixel tested | Image/geometry/annotations restored; bounded history |
| Crop, rotate, resize, image frame | Source | Flattens current annotations; undo restores editability |
| Blur / opaque redaction | Pixel tested + source | Export compositing tested; original stays in editable project |
| OCR / copy text | Real OCR tested + UI source | Offline English engine; clean sample tested; complex/Telugu text unvalidated |
| Search OCR words and mark borders | Source | Word matching only; OCR may be wrong |
| Candidate email/compact-phone redaction | Pattern tested + source | Heuristic candidates; misses split/misrecognized sensitive text; human review required |
| Editable source screenshot text / smart UI move | Gap | OCR text can be copied; original raster text is not reconstructed |
| Simplification | Source | Manual solid-color selected-region replacement, not automatic AI simplification |
| Background removal | Core tested + source | Edge-connected flat-color flood fill; 8 MP limit; not general segmentation |
| Presentation template | Source | One frame template; no complete stamp/theme marketplace |
| Batch image conversion | Source | Up to 12 PNG/JPG/WebP inputs; multiple-download browser policy applies |
| Screen color picker / QR reading | Browser-dependent source | EyeDropper/BarcodeDetector feature checks; no guarantee across browsers |
| PNG/JPG/WebP export, clipboard, print | Source + export pixel tests | Native PNG clipboard; clean flattened exports; print UI unverified |
| PDF/TIFF/HEIF/PSD exports | Gap | No adapters for these formats |
| Project save/open and local history | Validation tested + source | JSON embedded image + marks; eight browser-local projects; storage UAT pending |
| Persistent video library / searchable tagged catalog | Gap | Video needs explicit export; image projects only |
| Keyboard accessibility | Source | Tools/labels; bracket selection cycle, arrow-key nudge, focusable canvas; full screen-reader audit pending |

## Video

| Requirement | Status | Evidence / boundary |
|---|---|---|
| Screen/window recording | Source + mocked lifecycle tests | Native explicit source + browser recorder; actual platform recording unverified |
| Pause/resume/stop/preview/download | Lifecycle tested + source | Browser Stop sharing and failures clean tracks |
| Microphone/screen audio mixing | Source | OS/browser/source dependent; microphone permission failure tested |
| Webcam overlay | Source; denial cleanup tested | Canvas screen+camera compositor; actual camera recording UAT pending |
| Audio noise suppression | Source | Browser capture constraints; not a separate AI audio repair pipeline |
| Capture image from video | Source | Current frame to editor |
| Trim beginning/end | Real FFmpeg tested + UI source | Local transcode; requires desktop converter |
| MP4 / GIF export | Real FFmpeg tested | H.264/AAC MP4; palette GIF max 30 seconds; codecs/binary distribution review pending |
| Manual caption sidecar | Source | SRT text export; no speech recognition or subtitle burn-in |
| Cut arbitrary middle sections / combine clips / timeline | Gap | Start/end trimming only |
| Cursor emphasis / click rings / background blur | Gap | Cursor included where capture supports it; no compositor effects |
| Live streaming / autonomous recording | Gap | Not included |

## Commercial and operational

| Requirement | Status | Evidence / boundary |
|---|---|---|
| Windows app package / installer | Windows CI passed | Windows installer built; packaged startup/OCR/converter smoke passed; unsigned beta only |
| Native startup/OCR/converter smoke test | Windows CI passed | Packaged application loaded editor/bridge modules, recognized OCR sample, and ran converter |
| Windows code signing / SmartScreen reputation | Gap / seller provisioning | Unsigned evaluation artifacts; certificate/reputation not created |
| Signed update manifest / verified download | Signature tests + source/configured | Pinned public key, HTTPS, expiry/hash checks; user download approval; no live feed |
| Signed offline Pro license | Signature tests + source/configured | Ed25519 and expiry; public key causes advanced native features to require valid license |
| Checkout / paid webhook / license claim | Local HTTP + crypto tested; configured | Stripe-hosted checkout, raw-body signatures, amount/currency binding and idempotency |
| Refund/chargeback revocation / device limits / account recovery | Gap | Offline token issuance cannot claim these controls |
| Optional share links | Local HTTP tested; configured | Upload bearer auth, media validation, size/quota, expiry/deletion, range playback |
| Share-service credentials | Source | Encrypted OS safeStorage; fails if unavailable |
| Team accounts / SSO / comments / live collaboration / integrations | Gap | Single-instance bearer-link service only |
| Published merchant/store/support operations | Gap | Seller identity, prices, eligibility, taxes, support and refunds not provisioned |
| Privacy/terms | Draft checklists only | Not published policies; require seller details and review |
| Third-party/codec distribution | Gap | Notices started; FFmpeg GPL corresponding-source obligations need completion |
| Production dependency audit | Passed locally | Zero known vulnerabilities after sharp 0.35.5 upgrade; audit is not a security certification |
| Full device/performance/accessibility/privacy UAT | Gap | No physical Windows device or browser automation available in this environment |

## Automated evidence for this change

38 Node tests pass: existing crop/arrow/erase/history/export/import regressions; capture and recording cleanup; native region math; conversion limits; background removal and stitch geometry; license/update signature rejection; share auth/type/range/expiry/revocation/quota; webhook authenticity; checkout/paid webhook/claim lifecycle and duplicate events.

Real integration smoke: local English OCR recognized CLARIO 12345; FFmpeg generated a source clip and trimmed/transcoded valid MP4 and GIF. Existing native canvas pixel QA passes for opaque redaction, clean export, vertical arrows, crop undo dimensions/content. JavaScript syntax checks cover all app, desktop, extension, server, and test files. npm audit --omit=dev reports zero known production vulnerabilities at audit time. Updating electron-builder to 26.15.3 removed the observed high/critical build-tool findings; full npm audit still reports eight moderate development-tool findings rooted in sprintf-js 1.1.3. The registry currently reports that same vulnerable version as its latest stable release. This is an unresolved build-tool review item, not a claim of a clean full dependency tree.

Windows CI completed successfully and produced an unsigned beta installer. Actual device behavior must be reviewed separately. The physical display/overlay/window chooser, microphone/webcam, extension permissions, persistent storage, desktop shortcuts, installer/uninstaller, encrypted credential storage, and update/service provisioning have not passed end-user UAT here.

## Release blockers in order

1. Produce and inspect a Windows installer/startup smoke result; run Windows 10/11 physical-device UAT (DPI, multiple monitors, cancellation, audio/camera, file paths, installer/uninstall, sleep/reconnect).
2. Complete signing and third-party binary/license/source distribution, protect signing keys, and validate update feeds. Unsigned beta artifacts are not final commercial releases.
3. Provision/test merchant credentials and HTTPS service; define prices, support/refund/recovery/device policies and final published privacy/terms. Local server tests do not equal live payments/hosting.
4. Implement or explicitly exclude the remaining gaps above from the advertised paid feature set. Do not claim every Snagit/ShareX/PicPick/Snipping Tool feature is included.

## Official research sources

- https://www.techsmith.com/snagit/features/
- https://support.microsoft.com/en-au/windows/apps/use-snipping-tool-to-capture-screenshots
- https://getsharex.com/
- https://picpick.app/en/readme/?lang=en
- https://www.electronjs.org/docs/latest/api/desktop-capturer
- https://www.electronjs.org/docs/latest/api/global-shortcut
- https://www.electronjs.org/docs/latest/tutorial/security
- https://github.com/naptha/tesseract.js/blob/master/docs/local-installation.md
- https://developer.chrome.com/docs/extensions/reference/api/debugger
- https://chromedevtools.github.io/devtools-protocol/tot/Page/
- https://docs.stripe.com/webhooks/signature
