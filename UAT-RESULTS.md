# Clario test acceptance evidence — 14 October 2026

Status: automated acceptance checks passed locally; physical Windows user acceptance is not complete. No zero-defect or full commercial-readiness claim is made.

## Defects fixed in this revision
- Native source dialog now resets its return value before reopening. Escape cannot reuse an earlier selected screen and start a capture after cancellation.
- Video import is blocked while recording, both before opening the file picker and when a file-selection event arrives. The active recorder is retained, and rejected/oversized file selections are cleared so a subsequent import works.

## Verified locally
- 44 Node tests passed, including actual editor crop/undo/redo and arrow handlers, selection erase, clean export, project validation, media stream cleanup and permission failure, recording pause/stop, native DPI geometry, service/license/update checks, and three new actual advanced-UI handler regressions in a simulated DOM.
- JavaScript syntax checks passed.
- Real English OCR and FFmpeg MP4/GIF trim/transcode passed.
- Native canvas pixel checks passed: opaque redaction, export without selection handles, crop undo dimensions/content and vertical-arrow rendering.

Simulated DOM and canvas checks are automated acceptance evidence, not browser visual QA or end-user UAT. Windows CI rebuild/startup checks must pass for the new revision before its installer is handed over. The preceding Windows build passed its packaging/startup/signature-policy mock checks; that does not validate this revision's installer until rebuilt.

## Physical Windows acceptance still pending

| Scenario | Required evidence |
|---|---|
| Install, launch, uninstall | Clean Windows 10/11 x64 device, shortcuts and successful uninstall |
| Capture region/window/freeform | Correct pixels and Escape cancellation on real desktop |
| Multiple monitors/scaling | 100/125/150/200% scaling, monitors with differing scaling and negative coordinates |
| Shortcuts/tray | Global capture, conflicts, close/reopen, unsaved quit confirmation |
| Recording/audio/camera | Screen/window, microphone/webcam allow/deny, pause/resume, stop sharing, preview/export |
| Visual editor/export | Fonts, layout, keyboard accessibility, exported image inspection |
| OS trust | Unsigned beta still may show SmartScreen; no signing or Store certification completed |

No physical Windows desktop, monitors, microphone or webcam is accessible in this session. These rows cannot truthfully be marked passed. Local screenshot/annotation/OCR/video testing does not need commerce, sharing servers or update feeds. Those external services remain unconfigured, and competitor-parity gaps remain documented in FEATURE-AUDIT.md.
