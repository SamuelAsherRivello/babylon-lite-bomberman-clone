import { chromium, expect } from '@playwright/test';
import { MultiplayerClient } from '@rmc/multiplayer-client';
import assert from 'node:assert/strict';
import { requireBrowserBackend } from './browser-backend.mjs';
const backend = requireBrowserBackend();
const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-unsafe-webgpu'],
  }),
  clients = [];
const url = new URL(process.env.GAME_URL || 'http://127.0.0.1:5173/babylon-lite-bomberman-clone/');
url.searchParams.set('mode', 'online');
url.searchParams.set('mute', '1');
url.searchParams.set('server', backend);
async function until(fn) {
  const end = Date.now() + 15000;
  while (!fn()) {
    if (Date.now() > end) throw Error('CPU seat admission');
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}
try {
  const a = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await a.goto(url.href);
  await a.getByRole('button', { name: 'Create room', exact: true }).click();
  const heading = a.getByRole('heading', { name: /^Room [A-Z0-9]{6}$/ });
  await heading.waitFor();
  const code = (await heading.innerText()).slice(5);
  assert.equal(
    (await a.locator('.overlay li').allTextContents()).filter((t) => t.startsWith('CPU')).length,
    3,
  );
  await a.getByLabel('CPU difficulty').selectOption('HARD');
  await expect(a.getByLabel('CPU difficulty')).toHaveValue('HARD');
  await a.getByLabel('Map size').selectOption('HIGH');
  await expect(a.getByLabel('Map size')).toHaveValue('HIGH');
  await a.getByRole('button', { name: 'Creeping Death: Off' }).click();
  await expect(a.getByRole('button', { name: 'Creeping Death: On' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await a.getByRole('button', { name: 'Ready up', exact: true }).click();
  await a.getByText(/s · ALIVE/).waitFor();
  assert.equal((await a.locator('.scoreboard').innerText()).match(/CPU/g).length, 3);
  for (let n = 2; n <= 4; n++) {
    const c = new MultiplayerClient(backend, 'bomberman', { code });
    clients.push(c);
    void c.connect();
    await until(
      () =>
        c.state.status === 'connected' &&
        c.state.gameState?.people.filter((p) => !p.cpu).length === n,
    );
    const g = c.state.gameState;
    assert.equal(g.people.filter((p) => p.cpu).length, 4 - n);
    assert.equal(g.players.length, 4);
    assert.equal(g.width, 23);
    assert.equal(g.height, 17);
    assert.equal(g.options.cpu, 'HARD');
    assert.ok(g.plantEnabled && g.plants.length >= 1);
  }
  console.log(
    'PASS solo start with three CPUs, all four human/CPU mixes, live takeover, HIGH map and authoritative HARD/Plant settings.',
  );
} finally {
  clients.forEach((c) => c.disconnect());
  await browser.close();
}
