'use strict';
const {build, Platform, Arch} = require('electron-builder');
const {releaseConfig} = require('../desktop/release-config.cjs');
async function main() {
  const route = process.argv[2];
  const config = releaseConfig(route);
  if (process.platform !== 'win32') throw new Error('Commercial Windows packaging requires Windows');
  // Signing key remains in the Windows certificate store backed by the CA token/HSM.
  await build({targets: Platform.WINDOWS.createTarget(route === 'store' ? 'appx' : 'nsis', Arch.x64), config, publish: 'never'});
}
if (require.main === module) main().catch(error => {console.error(error.message); process.exitCode = 1;});
