# Optional Clario share and commerce service

This service is source-ready and locally tested; it has not been deployed, connected to a merchant account, or configured in customer builds. Sharing is optional and requires an explicit upload action. It does not provide team accounts, SSO, comments, encrypted-at-rest object storage, distributed quotas, or multi-instance transactions. Run one instance with a persistent directory behind an HTTPS reverse proxy; do not market it as an enterprise hosting service.

Developer/operator setup:
- Set UPLOAD_TOKEN to a randomly generated secret of at least 32 characters.
- Set PUBLIC_BASE_URL to the HTTPS origin (no path), DATA_DIR to a private persistent directory, HOST/PORT for the reverse proxy deployment. HOST defaults to 127.0.0.1.
- Run node server/share.cjs. No public deployment has been performed.
- Configure endpoint/token in Clario Desktop → More tools → Configure private share service. Desktop credentials are encrypted using OS safeStorage where available; setup fails if secure storage is unavailable.

POST /shares takes a supported binary image/video with bearer upload authentication. It checks signatures/type, limits each upload to 100 MB, enforces a 1 GB default storage quota, and returns the share URL, expiry, and private deletion token. Bearer links grant access to anyone who has them for seven days. GET /media/:id supports byte ranges; DELETE /shares/:id accepts either the private deletion token or upload credential. Keep deletion tokens private. Expired media is unavailable immediately; hourly cleanup deletes expired files, and uploads also trigger cleanup. Quota and retention need operational monitoring and backups. Per-IP in-memory rate limits apply; clustered deployments need shared rate-limit/storage controls.

## Merchant setup — not enabled automatically

Use scripts/license-issuer.cjs generate PRIVATE_DIRECTORY to generate Ed25519 signing keys. Never commit or distribute the private key. Supply the public key to the desktop packaging step with CLARIO_LICENSE_PUBLIC_KEY_FILE. A configured public key causes OCR, desktop conversion, and configured sharing to require a valid Pro license. Unconfigured builds are evaluation builds with these features available; they are not a commercial licensing configuration.

Set STRIPE_SECRET_KEY, STRIPE_PRICE_ID, STRIPE_WEBHOOK_SECRET, and CLARIO_LICENSE_PRIVATE_KEY_FILE on the service only. Set up an approved merchant account and product/price outside this repo. Stripe eligibility, taxes, pricing, payout setup, refunds, and seller identity remain the operator's responsibility; no real transactions have been attempted.

/purchase starts Stripe-hosted checkout. The browser stores a random private claim token locally. The server only creates the configured price; it binds expected amount/currency, session ID, and claim hash to the order. Webhooks verify the raw-body HMAC and timestamp; confirmed paid events issue a one-year signed Pro license. Event processing and order issuance are idempotent. The return page retrieves the license using the private claim and never issues a license based solely on a success URL. Claim requests have to use the browser that initiated checkout.

Webhook URL: /stripe/webhook; subscribe to checkout.session.completed and checkout.session.async_payment_succeeded. The seller must configure success/cancel origins and test Stripe's actual webhook delivery before going live. No outbound emails are sent. Customer portal, account-based purchase recovery, renewals/subscriptions, refunds/chargeback license revocation, taxation, receipts beyond the payment provider, and multi-device activation limits remain release gaps.
