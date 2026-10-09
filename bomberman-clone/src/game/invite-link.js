export function createRoomInvite(pageUrl, basePath, roomCode) {
  const url = new URL(basePath, pageUrl);
  url.searchParams.set('mode', 'online');
  url.searchParams.set('room', roomCode);
  const server = new URL(pageUrl).searchParams.get('server');
  if (server !== null) url.searchParams.set('server', server);
  const serverTest = new URL(pageUrl).searchParams.get('serverTest');
  if (serverTest !== null) url.searchParams.set('serverTest', serverTest);
  return url.href;
}
