# Optional Clario share and commerce service

This service is source-ready and locally tested; it has not been deployed, connected to a merchant account, or configured in customer builds. Sharing is optional and requires an explicit upload action. It does not provide team accounts, SSO, comments, encrypted-at-rest object storage, distributed quotas, or multi-instance transactions. Run one instance with a persistent directory behind an HTTPS reverse proxy; do not market it as an enterprise hosting service.

Developer/operator setup:
- Set UPLOAD_TOKEN to a randomly generated secret of at least 32 characters.
- Set PUBLIC_BASE_URL to the HTTPS origin (no path), DATA_DIR to a private persistent directory, HOST/PORT for the reverse proxy deployment. HOST defaults to 127.0.0.1.
- Run node server/share.cjs. No public deployment has been performed.
- Configure endpoint/token in Clario Desktop → More tools → Configure private share service. Desktop credentials are encrypted using OS safeStorage where available; setup fails if secure storage is unavailable.

POST /shares takes a supported binary image/video with bearer upload authentication. It checks signatures/type, limits each upload to 100 MB, enforces a 1 GB default storage quota, and returns the share URL, expiry, and private deletion token. Bearer links grant access to anyone who has them for seven days. GET /media/:id supports byte ranges; DELETE /shares/:id accepts either the private deletion token or upload credential. Keep deletion tokens private. Expired media is unavailable immediately; hourly cleanup deletes expired files, and uploads also trigger cleanup. Quota and retention need operational monitoring and backups. Per-IP in-memory rate limits apply; clustered deployments need shared rate-limit/storage controls.

## Free and Pro checkout preview

- Open `/purchase` and choose a billing country. The server quotes India at ₹1,499 and other markets at US$39. Set `CLARIO_LAUNCH_END_UTC` to an explicit future UTC timestamp to offer ₹999 and US$29 until that time. No launch discount is active by default.
- Use a separate Stripe sandbox with a restricted test key in `CLARIO_STRIPE_TEST_KEY` and its webhook signing secret in `STRIPE_WEBHOOK_SECRET`. Use a distinct Ed25519 test key pair with `CLARIO_LICENSE_PRIVATE_KEY_FILE` on the service and `CLARIO_LICENSE_PUBLIC_KEY_FILE` when packaging the desktop test build. Keep private keys and payment secrets out of source, logs, and chat.
- Subscribe `/stripe/webhook` to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. The service rejects live credentials and events. Only a signed paid event matching the stored session, claim, amount, currency and billing country issues a license. Sandbox country or amount mismatches need operator investigation; a live implementation must provide a resolution and refund path.
- The buyer claims the signed license from the initiating browser and activates it under More tools → License status / activation. Test licenses grant permanent desktop use and record a separate 12-month update window. Legacy expiring licenses still expire. Update eligibility for later releases is not enforced yet.
- A desktop build with a configured public key enables Free/Pro gating. Free has three successful local OCR runs per local profile. An active license unlocks the desktop Pro tools. Builds without a public key remain evaluation builds and do not demonstrate the paywall.
- Tests use mocked Stripe responses and signed event fixtures; provider sandbox end-to-end verification is pending. No charges or receipts have been sent.

## Before taking payments

India Razorpay UPI/card checkout and international Paddle checkout are planned, not wired or verified. Keep production checkout closed until the seller has approved accounts, final tax/receipt handling, customer license recovery, refund and dispute procedures, deployment with durable order storage, and tested settlement. Confirm the merchant's actual checkout methods and price behavior before enabling each country. Direct and Store builds need signed release verification, and checkout, activation, and reinstall must be verified on the final build.
