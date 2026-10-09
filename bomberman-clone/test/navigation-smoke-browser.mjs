import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { requireBrowserBackend } from './browser-backend.mjs';

const backend = requireBrowserBackend();
const url = new URL(process.env.GAME_URL || 'http://127.0.0.1:5174/babylon-lite-bomberman-clone/');
url.searchParams.delete('mode');
url.searchParams.delete('room');
url.searchParams.set('mute', '1');
url.searchParams.set('server', backend);

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--enable-unsafe-webgpu'],
});
const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
const sockets = [];
const errors = [];

async function open(destination) {
  const page = await context.newPage();
  page.on('websocket', (socket) => sockets.push(socket.url()));
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(destination);
  await page.getByRole('button', { name: 'Mode: Online' }).waitFor();
  return page;
}

try {
  const host = await open(url.href);
  assert.equal(new URL(host.url()).searchParams.has('mode'), false, 'online is the default mode');
  await host.getByRole('heading', { name: 'Battle with friends' }).waitFor();
  await host.getByRole('button', { name: 'Create room', exact: true }).click();
  const room = host.getByRole('heading', { name: /^Room [A-Z0-9]{6}$/ });
  await room.waitFor();
  const code = (await room.innerText()).replace(/^Room /, '');
  await host.getByRole('button', { name: 'Copy room link', exact: true }).click();
  const invite = new URL(await host.evaluate(() => navigator.clipboard.readText()));
  assert.equal(invite.searchParams.get('room'), code);
  assert.equal(invite.searchParams.get('mode'), 'online');
  assert.equal(invite.searchParams.get('server'), backend);

  const guest = await open(invite.href);
  await guest.getByRole('heading', { name: `Room ${code}` }).waitFor();
  const backendHost = new URL(backend).host;
  const viteHost = url.host;
  assert.ok(
    sockets.filter((socket) => new URL(socket).host === backendHost).length >= 2,
    'both browsers connect to the test backend',
  );
  for (const socket of sockets)
    assert.ok(
      [backendHost, viteHost].includes(new URL(socket).host),
      `unexpected WebSocket destination: ${socket}`,
    );
  assert.deepEqual(errors, []);
  console.log('PASS: default online entry and room invitation use the isolated test backend.');
} finally {
  await context.close();
  await browser.close();
}
