import { PUBLIC_MULTIPLAYER_SERVER, parseServerUrl } from '../src/game/server-url.js';

export function requireBrowserBackend(env = process.env) {
  const backend = parseServerUrl(env.BACKEND_URL || '');
  if (!backend)
    throw new Error('Set BACKEND_URL to the separate test server before browser tests.');
  const target = new URL(backend);
  const localPlay =
    ['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname) && target.port === '2567';
  if (
    (target.hostname === new URL(PUBLIC_MULTIPLAYER_SERVER).hostname || localPlay) &&
    env.ALLOW_LIVE_TEST !== '1'
  )
    throw new Error('The live or local play server requires ALLOW_LIVE_TEST=1 for browser tests.');
  return backend;
}
