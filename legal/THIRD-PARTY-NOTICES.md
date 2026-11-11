# Third-party distribution review

Dependencies are pinned in package-lock.json. Electron is MIT; Tesseract.js and sharp are Apache-2.0; ffmpeg-static is GPL-3.0-or-later. Chromium, FFmpeg codecs, Tesseract language data, sharp/libvips, and their bundled libraries have additional notices and distribution requirements. Preserve upstream license files in packaged dependencies.

Before any commercial release, assemble the complete third-party notice/license bundle and satisfy the exact FFmpeg binary's corresponding-source obligations; do not assume that a source URL alone is sufficient. Evaluate codec licensing and distribution requirements for target markets. This review is incomplete and blocks claiming a final commercial release.

Upstream projects: https://github.com/electron/electron ; https://github.com/naptha/tesseract.js ; https://github.com/lovell/sharp ; https://github.com/eugeneware/ffmpeg-static ; https://ffmpeg.org/legal.html
