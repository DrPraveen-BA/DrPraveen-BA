# Clario commercial distribution

Status: release preparation only. The existing 0.3.0 beta is unsigned. No verified signing certificate, Store account, certified listing, or established download reputation has been obtained. Do not advertise this beta as signed or warning-free.

## Two release routes

| Route | Prepared here | Required external completion |
|---|---|---|
| Microsoft Store packaged app | `npm run dist:store`; AppX package in the MSIX packaging family with exact Partner Center identity; manual workflow | Enroll and verify the legal publisher, reserve Clario, copy package identity, complete listing/privacy/pricing, Windows App Certification Kit and real-device testing, submit for certification and approve publication. Microsoft signs certified packaged Store distribution. |
| Direct Windows installer | `npm run dist:commercial`; SHA-256 Authenticode and RFC3161 timestamp; mandatory signing; post-build trust/publisher/hash report | Obtain trusted CA-issued code-signing certificate with token/HSM, configure a dedicated signing runner, verify signed output on a clean Windows device, approve hosting/release. Reputation still develops after distribution. |

Use the packaged Store route above, not an EXE/MSI Store listing: EXE/MSI submissions require the publisher's own trusted signatures. The generated `.appx` is a submission candidate, not a publicly trusted sideload installer. Certification and installation must still be tested, especially recording, webcam/microphone access, global shortcuts, tray behavior, and external payments. Assess current Store commerce policies before submitting the existing Stripe flow; configure Store-compliant purchasing where required. Final legal notices, support contacts and privacy policy must replace the drafts.

## Publisher setup (owner action)

1. Choose the legal individual/company identity and country. Enroll at https://partner.microsoft.com/dashboard with the owner's account and complete Microsoft's identity verification. Reserve the product and obtain the exact package Identity Name and Publisher CN from Partner Center. Do not invent these values.
2. For direct distribution, purchase a publicly trusted OV code-signing certificate from a CA supporting your jurisdiction and hardware/cloud-HSM key custody. Verify legal identity with the CA. EV is not an instant SmartScreen bypass. Azure Artifact Signing currently has restricted jurisdiction eligibility; an India-based publisher should check eligibility rather than assume it is available.
3. Configure dedicated Windows signing host with certificate in the Windows certificate store and CA token/HSM middleware. Never put private keys, PINs, credentials or passwords into this repository or chat. Cloud providers without a certificate-store integration require a provider-specific signing hook before this profile can be used.
4. Configure protected GitHub environments **commercial-signing** and **commercial-store**, with required owner review and branch restrictions. Workflow YAML referencing an environment does not establish those protections. Only manually run trusted, reviewed source; never expose the signing host to arbitrary pull requests. Secure and clean this persistent runner according to the CA's guidance.

Non-secret environment variables:

| Environment | Variable | Value |
|---|---|---|
| commercial-signing | CLARIO_SIGNING_THUMBPRINT | Issued certificate SHA-1 thumbprint (identifier only; file signatures use SHA-256) |
| commercial-signing | CLARIO_SIGNING_SUBJECT | Exact full certificate subject returned by Windows |
| commercial-signing | CLARIO_PUBLISHER_NAME | Legal certificate publisher display name |
| commercial-signing | CLARIO_TIMESTAMP_URL | CA-approved RFC3161 endpoint |
| commercial-store | CLARIO_STORE_IDENTITY_NAME | Exact Partner Center package identity name |
| commercial-store | CLARIO_STORE_PUBLISHER | Exact Partner Center publisher CN |
| commercial-store | CLARIO_PUBLISHER_NAME | Verified Store publisher display name |

## Release gates

Commercial workflow is manual and publishes nowhere. Direct candidates upload only after Windows reports valid trusted signatures, timestamps on every packaged EXE/DLL/native module, and the pinned publisher on installer and main app. Verification can fail for an unsigned vendor binary; sign it through the verified provider and check redistribution rights instead of weakening the gate. Signature report records SHA-256 file hashes and public certificate metadata. Changing certificates requires a reviewed pin update. A builder setting alone is not evidence of a valid commercial signature.

Before publication: rerun existing packaged startup/OCR/FFmpeg smoke checks on the final signed artifact, install/uninstall on a clean Windows VM, verify SmartScreen and Defender behavior without disabling protections, run WACK for Store candidate, test purchase/license/update behavior, and review notices/privacy/support and third-party licensing. None of those final signed/Store acceptance checks has been performed yet.

Use the same verified publisher identity and a stable HTTPS download page for direct releases; publish version/hash and support details. Do not create fake downloads or promise reputation thresholds. SmartScreen considers publisher and file reputation, and new signed builds may still warn. Store delivery avoids the browser-download SmartScreen path, but certification does not replace product testing. There is no guaranteed time or download count for direct reputation establishment.

Official references:
- https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options
- https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation
- https://learn.microsoft.com/en-us/windows/apps/publish/partner-center/open-a-developer-account
