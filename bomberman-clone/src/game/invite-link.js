export function createRoomInvite(pageUrl, basePath, roomCode) {
  const url = new URL(basePath, pageUrl);
  url.searchParams.set('mode', 'online');
  url.searchParams.set('room', roomCode);
  return url.href;
}
