'use strict';
const base = require('../package.json').build;
function required(env, key) {
  const value = (env[key] || '').trim();
  if (!value || /[<>\r\n]|placeholder|example/i.test(value)) throw new Error(`Set verified publisher value ${key}`);
  return value;
}
function releaseConfig(route, env = process.env) {
  const config = structuredClone(base);
  config.directories.output = `release/${route}`;
  config.publish = null;
  if (route === 'direct') {
    const thumbprint = required(env, 'CLARIO_SIGNING_THUMBPRINT').replace(/\s/g, '').toUpperCase();
    if (!/^[A-F0-9]{40}$/.test(thumbprint)) throw new Error('Signing thumbprint must contain 40 hexadecimal characters');
    const publisher = required(env, 'CLARIO_PUBLISHER_NAME');
    const timestamp = required(env, 'CLARIO_TIMESTAMP_URL');
    const url = new URL(timestamp);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid timestamp endpoint');
    config.forceCodeSigning = true;
    config.win = {...config.win, signAndEditExecutable: true, signExecutable: true,
      signExts: ['.exe', '.dll', '.node'],
      signtoolOptions: {certificateSha1: thumbprint, publisherName: publisher,
        signingHashAlgorithms: ['sha256'], rfc3161TimeStampServer: timestamp}};
  } else if (route === 'store') {
    const identityName = required(env, 'CLARIO_STORE_IDENTITY_NAME');
    if (!/^[A-Za-z0-9.-]{3,50}$/.test(identityName)) throw new Error('Invalid Partner Center identity name');
    const publisher = required(env, 'CLARIO_STORE_PUBLISHER');
    if (!publisher.startsWith('CN=')) throw new Error('Use exact Partner Center publisher CN');
    config.win = {...config.win, target: 'appx', signAndEditExecutable: true, signExecutable: false};
    config.appx = {identityName, publisher,
      publisherDisplayName: required(env, 'CLARIO_PUBLISHER_NAME'), displayName: 'Clario Studio',
      applicationId: 'ClarioStudio', languages: ['en-US'],
      capabilities: ['runFullTrust', 'internetClient', 'microphone', 'webcam']};
  } else throw new Error('Unknown release route');
  return config;
}
module.exports = {releaseConfig};
