const {test} = require('node:test');
const assert = require('node:assert/strict');
const {releaseConfig} = require('../desktop/release-config.cjs');
const direct = {CLARIO_SIGNING_THUMBPRINT: 'A'.repeat(40), CLARIO_PUBLISHER_NAME: 'Test Publisher', CLARIO_TIMESTAMP_URL: 'https://timestamp.digicert.com'};
test('commercial direct build requires identity and cannot fall back to unsigned', () => {
 assert.throws(() => releaseConfig('direct', {}));
 const config = releaseConfig('direct', direct);
 assert.equal(config.forceCodeSigning, true);
 assert.equal(config.win.signExecutable, true);
 assert.equal(config.win.signAndEditExecutable, true);
 assert.deepEqual(config.win.signtoolOptions.signingHashAlgorithms, ['sha256']);
 assert.equal(config.publish, null);
});
test('reject malformed certificate pins, placeholder identity and unsafe timestamp URL', () => {
 for (const patch of [{CLARIO_SIGNING_THUMBPRINT:'123'}, {CLARIO_PUBLISHER_NAME:'<publisher>'}, {CLARIO_TIMESTAMP_URL:'file:///tmp/a'}, {CLARIO_TIMESTAMP_URL:'https://user:secret@host.test'}]) assert.throws(() => releaseConfig('direct', {...direct,...patch}));
});
test('Store packaging requires assigned identity, preserves exact CN and does not publish', () => {
 assert.throws(() => releaseConfig('store', {}));
 const env = {CLARIO_STORE_IDENTITY_NAME:'12345.Clario', CLARIO_STORE_PUBLISHER:'CN=12345678-1234-1234-1234-123456789abc', CLARIO_PUBLISHER_NAME:'Test Publisher'};
 const config = releaseConfig('store', env);
 assert.equal(config.win.target,'appx');
 assert.equal(config.appx.publisher,env.CLARIO_STORE_PUBLISHER);
 assert.equal(config.win.signExecutable,false);
 assert.equal(config.publish,null);
 assert.throws(() => releaseConfig('store', {...env,CLARIO_STORE_PUBLISHER:'Unknown'}));
 assert.throws(() => releaseConfig('other',env));
});
