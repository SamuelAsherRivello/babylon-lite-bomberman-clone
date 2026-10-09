export const PUBLIC_MULTIPLAYER_SERVER = 'https://rmc-colyseus-multiplayer-server.vercel.app';
export const LOCAL_MULTIPLAYER_SERVER = 'http://127.0.0.1:2567';
export const LOCAL_TEST_MULTIPLAYER_SERVER = 'http://127.0.0.1:2568';

export function parseServerUrl(value) {
  try {
    const url = new URL(value);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      return null;
    return url.href.replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function resolveMultiplayerServer(search, configuredUrl, legacyUrl, isDev, testUrl) {
  const params = new URLSearchParams(search);
  const override = params.get('server');
  const testFlag = params.get('serverTest');
  if (testFlag !== null && !['true', 'false'].includes(testFlag))
    return { url: null, error: 'Invalid serverTest value. Use true or false.' };
  const isTest = testFlag === 'true';
  if (isTest && override !== null && !['VITE_LOCAL', 'VERCEL_ONLINE'].includes(override))
    return { url: null, error: 'serverTest=true requires server=VITE_LOCAL or VERCEL_ONLINE.' };
  if (isTest && (override === 'VITE_LOCAL' || (override === null && isDev)))
    return { url: LOCAL_TEST_MULTIPLAYER_SERVER };
  if (isTest) {
    const url = parseServerUrl(testUrl || '');
    return url
      ? { url }
      : { url: null, error: 'Vercel test server is not configured for this build.' };
  }
  if (override === 'VITE_LOCAL') return { url: LOCAL_MULTIPLAYER_SERVER };
  if (override === 'VERCEL_ONLINE') return { url: PUBLIC_MULTIPLAYER_SERVER };
  const source = override !== null ? override : configuredUrl || legacyUrl;
  if (override === null && !source)
    return { url: isDev ? LOCAL_MULTIPLAYER_SERVER : PUBLIC_MULTIPLAYER_SERVER };
  const url = parseServerUrl(source);
  return url
    ? { url }
    : { url: null, error: 'Invalid multiplayer server URL. Use a full http:// or https:// URL.' };
}
