# Clario privacy notice — draft for review before publication

This draft describes the current code. It is not a published policy. The seller must identify the legal entity, support/privacy contact, applicable rights process, retention schedule, and jurisdictions before use.

By default, images, editable projects, and OCR stay on the device. English OCR language data is included in prepared desktop builds; the developer packaging step obtains language data when missing. Browser-local projects retain source images until cleared. Editable projects can contain the original unredacted image; only flattened exports hide redacted source pixels.

Screen capture, camera, and microphone require an explicit user action and applicable OS/browser permissions. Video buffers are processed locally and temporary desktop conversion files are deleted after processing. Closing a preview or app can lose an unsaved recording.

Optional sharing sends the flattened media to the configured server only after confirmation. Bearer links are accessible to anyone possessing the link until expiration/revocation. Default server expiry is seven days with hourly physical cleanup. The server needs access controls for its private storage directory, HTTPS, backups, monitoring, and an appropriate retention policy. It is not end-to-end encrypted.

Optional merchant checkout redirects to Stripe when configured. A private purchase claim is stored locally in the purchasing browser; payment webhook records and signed licenses are stored on the seller's server. No actual merchant account is configured in the development build, and no outbound customer messages are sent by this code.

Optional update checks contact the configured HTTPS feed only when requested. Update metadata signatures and installer hashes are checked; downloaded installers are not automatically executed. The seller must additionally sign Windows releases and protect signing keys.

No advertising, analytics, tracking pixels, or automatic screenshot uploads are included in this source.
